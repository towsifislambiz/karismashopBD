import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../services/firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  doc,
  getDoc,
  deleteDoc,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';

const OrderContext = createContext();

const INITIAL_DEMO_ORDERS = [
  {
    id: 'KS-849102',
    orderTrackingId: 'KS-849102',
    customerName: 'নুসরাত জাহান',
    phone: '01712345678',
    address: 'বাড়ি ১৪, রোড ৭, ধানমন্ডি, ঢাকা',
    deliveryZone: 'inside_dhaka',
    deliveryFee: 80,
    paymentMethod: 'bkash',
    bkashSender: '01712345678',
    paymentStatus: 'received',
    status: 'Confirmed',
    coinsEarned: 50,
    coinsRedeemed: 0,
    totalAmount: 2530,
    items: [
      {
        product: {
          id: 'ks-tp-01',
          name: 'Al-Chishty Embroidered Monochrome Festive Three-Piece',
          nameBn: 'আল-চিস্তি এক্সক্লুসিভ ব্ল্যাক & হোয়াইট এমব্রয়ডারি থ্রি-পিস',
          price: 2450,
          image: '/assets/products/threepiece_black_white.png'
        },
        quantity: 1,
        selectedColor: 'Midnight Black',
        selectedSize: 'M (38)'
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'KS-910245',
    orderTrackingId: 'KS-910245',
    customerName: 'তানজিলা তাসনিম',
    phone: '01898765432',
    address: 'হোল্ডিং ৪৫, আগ্রাবাদ এক্সেস রোড, চট্টগ্রাম',
    deliveryZone: 'outside_dhaka',
    deliveryFee: 150,
    paymentMethod: 'cod',
    paymentStatus: 'cod',
    status: 'Pending',
    coinsEarned: 35,
    coinsRedeemed: 0,
    totalAmount: 2000,
    items: [
      {
        product: {
          id: 'ks-bg-01',
          name: 'Karishma Sculpted Floral-Charm Luxury Signature Tote Bag',
          nameBn: 'কারিশমা স্কাল্পটেড ফ্লোরাল-চার্ম লাক্সারি সিগনেচার টোট ব্যাগ',
          price: 1850,
          image: '/assets/products/bag_tote_floral_white.png'
        },
        quantity: 1,
        selectedColor: 'Pearl White',
        selectedSize: 'Medium Tote (13\" × 10\" × 5\")'
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  }
];

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('karishma_orders');
      return saved ? JSON.parse(saved) : INITIAL_DEMO_ORDERS;
    } catch {
      return INITIAL_DEMO_ORDERS;
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('karishma_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn('Failed saving orders locally:', e);
    }
  }, [orders]);

  // Firestore sync for orders
  useEffect(() => {
    try {
      const ordersRef = collection(db, 'karishma_orders');
      const unsubscribe = onSnapshot(ordersRef, (snapshot) => {
        const list = [];
        snapshot.forEach((d) => {
          const data = d.data();
          list.push({
            id: d.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString())
          });
        });
        if (list.length > 0) {
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setOrders(list);
        }
      }, (err) => {
        console.warn('Orders firestore listener fallback to local:', err.message);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Orders listener setup error:', e);
    }
  }, []);

  // Place Order
  const placeOrder = async (orderData) => {
    setLoading(true);
    const orderId = `KS-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder = {
      ...orderData,
      id: orderId,
      orderTrackingId: orderId,
      status: 'Pending',
      paymentStatus: (orderData.paymentMethod === 'bkash' || orderData.paymentMethod === 'nagad') ? (orderData.paymentStatus || 'pending') : 'cod',
      createdAt: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);

    try {
      const docRef = await addDoc(collection(db, 'karishma_orders'), {
        ...newOrder,
        createdAt: serverTimestamp()
      });
      if (docRef?.id) {
        newOrder.id = docRef.id;
        setOrders(prev => prev.map(o => o.orderTrackingId === orderId ? { ...o, id: docRef.id } : o));
      }
    } catch (err) {
      console.warn('Order saved to local storage:', err);
    } finally {
      setLoading(false);
    }

    return newOrder;
  };

  // Update Status with automatic Coin Reversal
  const updateOrderStatus = async (orderId, newStatus) => {
    const target = orders.find(o => o.id === orderId || o.orderTrackingId === orderId);
    let coinsReversed = target?.coinsReversed || false;

    let targetUserId = target?.userId;
    if (!targetUserId && target?.phone) {
      try {
        const localProfileStr = localStorage.getItem('karishma_customer_profile');
        if (localProfileStr) {
          const lp = JSON.parse(localProfileStr);
          const lpPhone = (lp.phoneNumber || '').replace(/[^0-9]/g, '').slice(-10);
          const ordPhone = (target.phone || '').replace(/[^0-9]/g, '').slice(-10);
          if (lpPhone && ordPhone && lpPhone === ordPhone) {
            targetUserId = lp.uid;
          }
        }
      } catch {}
    }

    // Cancellation: deduct earned coins, refund redeemed coins
    if (target && newStatus === 'Cancelled' && target.status !== 'Cancelled' && !coinsReversed) {
      const earned = Number(target.coinsEarned) || 0;
      const redeemed = Number(target.coinsRedeemed) || 0;
      const netCoinChange = redeemed - earned;

      if (netCoinChange !== 0) {
        try {
          const localProfileStr = localStorage.getItem('karishma_customer_profile');
          if (localProfileStr) {
            const localProfile = JSON.parse(localProfileStr);
            localProfile.coins = Math.max(0, (Number(localProfile.coins) || 0) + netCoinChange);
            localStorage.setItem('karishma_customer_profile', JSON.stringify(localProfile));
            window.dispatchEvent(new Event('karishma_profile_updated'));
          }
          if (targetUserId && targetUserId !== 'guest') {
            const userRef = doc(db, 'users', targetUserId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              const currentCoins = Number(userSnap.data()?.coins) || 0;
              await updateDoc(userRef, { coins: Math.max(0, currentCoins + netCoinChange) });
            }
          }
        } catch (err) {
          console.warn('Coin adjustment error:', err);
        }
      }
      coinsReversed = true;
    } else if (target && target.status === 'Cancelled' && newStatus !== 'Cancelled' && coinsReversed) {
      // Re-activating: restore earned coins
      const earned = Number(target.coinsEarned) || 0;
      const redeemed = Number(target.coinsRedeemed) || 0;
      const netCoinChange = earned - redeemed;

      if (netCoinChange !== 0) {
        try {
          const localProfileStr = localStorage.getItem('karishma_customer_profile');
          if (localProfileStr) {
            const localProfile = JSON.parse(localProfileStr);
            localProfile.coins = Math.max(0, (Number(localProfile.coins) || 0) + netCoinChange);
            localStorage.setItem('karishma_customer_profile', JSON.stringify(localProfile));
            window.dispatchEvent(new Event('karishma_profile_updated'));
          }
          if (targetUserId && targetUserId !== 'guest') {
            const userRef = doc(db, 'users', targetUserId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              const currentCoins = Number(userSnap.data()?.coins) || 0;
              await updateDoc(userRef, { coins: Math.max(0, currentCoins + netCoinChange) });
            }
          }
        } catch {}
      }
      coinsReversed = false;
    }

    setOrders(prev => prev.map(o => (o.id === orderId || o.orderTrackingId === orderId) ? { ...o, status: newStatus, coinsReversed } : o));

    try {
      const docId = target?.id || orderId;
      if (docId) {
        await updateDoc(doc(db, 'karishma_orders', docId), { status: newStatus, coinsReversed });
      }
    } catch (e) {
      console.warn('Status update local only:', e);
    }
  };

  // Update bKash Payment Status (received, not_received, pending)
  const updatePaymentStatus = async (orderId, newPaymentStatus) => {
    setOrders(prev => prev.map(o => (o.id === orderId || o.orderTrackingId === orderId) ? { ...o, paymentStatus: newPaymentStatus } : o));
    try {
      const target = orders.find(o => o.id === orderId || o.orderTrackingId === orderId);
      const docId = target?.id || orderId;
      if (docId) {
        await updateDoc(doc(db, 'karishma_orders', docId), { paymentStatus: newPaymentStatus });
      }
    } catch (e) {
      console.warn('Payment status update local only:', e);
    }
  };

  // Delete Order
  const deleteOrder = async (orderId) => {
    setOrders(prev => prev.filter(o => o.id !== orderId && o.orderTrackingId !== orderId));
    try {
      const target = orders.find(o => o.id === orderId || o.orderTrackingId === orderId);
      const docId = target?.id || orderId;
      if (docId) {
        await deleteDoc(doc(db, 'karishma_orders', docId));
      }
    } catch (e) {
      console.warn('Delete order local only:', e);
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        placeOrder,
        updateOrderStatus,
        updatePaymentStatus,
        deleteOrder
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
