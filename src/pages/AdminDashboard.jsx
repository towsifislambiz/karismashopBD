import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Crown,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Package,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X,
  Search,
  Download,
  Trash2,
  MessageSquare,
  Settings,
  Plus,
  Edit,
  Save,
  ShieldCheck,
  Phone,
  RefreshCw
} from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { useProducts } from '../context/ProductContext';
import { useStoreSettings } from '../context/StoreSettingsContext';
import { useLanguage } from '../context/LanguageContext';
import { generateMonthlyReportPDF } from '../utils/pdfGenerator';

export default function AdminDashboard() {
  const { lang, t } = useLanguage();
  const { orders, updateOrderStatus, updatePaymentStatus, deleteOrder } = useOrders();
  const { products, addProduct, updateProduct, deleteProduct, resetToDefault } = useProducts();
  const { settings, updateSettings } = useStoreSettings();

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('karishma_admin_auth') === 'true';
  });
  const [adminPin, setAdminPin] = useState('');
  const [pinError, setPinError] = useState('');

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products' | 'settings'
  const [orderFilter, setOrderFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Settings form state
  const [settingsForm, setSettingsForm] = useState({
    hotline: settings?.hotline || '01819305805',
    whatsappNumber: settings?.whatsappNumber || '01819305805',
    bkashNumber: settings?.bkashNumber || '01819305805',
    deliveryFeeInside: settings?.deliveryFeeInside || 80,
    deliveryFeeOutside: settings?.deliveryFeeOutside || 150,
    freeDeliveryThreshold: settings?.freeDeliveryThreshold || 3500,
    announcementText: settings?.announcementText || '✨ প্রিমিয়াম বুটিক কালেকশন | ৩,৫০০ টাকার অর্ডারে সারা দেশে ডেলিভারি সম্পূর্ণ ফ্রি!',
    address: settings?.address || 'AlHajj Fajal Member Mansion (1st floor), Shikalbaha, Karnafully - 4371, Chittagong',
    email: settings?.email || 'karishmashop786@gmail.com'
  });
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [catalogSuccess, setCatalogSuccess] = useState('');

  // Admin Pin Auth
  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (adminPin === '1234' || adminPin === 'admin' || adminPin === '2026') {
      setIsAdminAuthenticated(true);
      localStorage.setItem('karishma_admin_auth', 'true');
      setPinError('');
    } else {
      setPinError('ভুল পিন কোড! সঠিক পিন: 1234');
    }
  };

  const handleLogoutAdmin = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('karishma_admin_auth');
  };

  // Calculations
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  }, [orders]);

  const pendingCount = useMemo(() => orders.filter(o => o.status === 'Pending').length, [orders]);
  const deliveredCount = useMemo(() => orders.filter(o => o.status === 'Delivered').length, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchFilter = orderFilter === 'all' || o.status === orderFilter;
      const q = searchQuery.toLowerCase();
      const matchSearch = !q ||
        (o.customerName && o.customerName.toLowerCase().includes(q)) ||
        (o.phone && o.phone.includes(q)) ||
        (o.orderTrackingId && o.orderTrackingId.toLowerCase().includes(q));
      return matchFilter && matchSearch;
    });
  }, [orders, orderFilter, searchQuery]);

  // WhatsApp Messaging Helpers
  const handleSendConfirmationWA = (order) => {
    const raw = (order.phone || '').replace(/[^0-9]/g, '');
    const cleanPhone = raw.startsWith('880') ? raw : raw.startsWith('0') ? '88' + raw : '880' + raw;
    const msg = encodeURIComponent(
      `আসসালামু আলাইকুম ${order.customerName}! Karishma Shop BD থেকে আপনার অর্ডারটি কনফার্ম করা হয়েছে।\n\nঅর্ডার আইডি: #${order.orderTrackingId || order.id}\nমোট প্রদেয়: ৳${order.totalAmount}\nঠিকানা: ${order.address}\n\nআমরা দ্রুততম সময়ে পার্সেল পাঠিয়ে দিচ্ছি। ধন্যবাদ!`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  const handleSendPaymentMismatchWA = (order) => {
    const raw = (order.phone || '').replace(/[^0-9]/g, '');
    const cleanPhone = raw.startsWith('880') ? raw : raw.startsWith('0') ? '88' + raw : '880' + raw;
    const msg = encodeURIComponent(
      `আসসালামু আলাইকুম ${order.customerName}, Karishma Shop BD থেকে বলছি।\n\nআপনার অর্ডার #${order.orderTrackingId || order.id}-এর বিকাশ নম্বর (${order.bkashSender || 'N/A'}) থেকে টাকা পাঠানোর কোনো রেকর্ড আমাদের স্টেটমেন্টে মেলেনি।\n\nঅনুগ্রহ করে যে নম্বর থেকে টাকা পাঠিয়েছেন তার মেসেজের স্ক্রিনশট বা সঠিক বিবরণ পাঠালে আমরা দ্রুত অর্ডারটি ভেরিফাই করে কনফার্ম করে দেব। ধন্যবাদ!`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    await updateSettings({
      ...settingsForm,
      deliveryFeeInside: Number(settingsForm.deliveryFeeInside),
      deliveryFeeOutside: Number(settingsForm.deliveryFeeOutside),
      freeDeliveryThreshold: Number(settingsForm.freeDeliveryThreshold)
    });
    setSettingsSuccess('স্টোর সেটিংস সফলভাবে আপডেট হয়েছে!');
    setTimeout(() => setSettingsSuccess(''), 2500);
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-3xl bg-brand-surface border border-brand-gold/40 p-6 sm:p-8 text-center space-y-4 shadow-2xl">
          <div className="size-14 rounded-2xl bg-brand-card text-brand-gold flex items-center justify-center mx-auto border border-brand-gold/40 shadow-gold-soft">
            <Crown className="size-7" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-white">এডমিন প্যানেল প্রবেশ</h2>
            <p className="text-xs text-slate-400 mt-1">সুরক্ষিত পিন কোড দিন (ডিফল্ট: 1234)</p>
          </div>

          {pinError && (
            <p className="text-xs text-rose-400 font-bold bg-rose-500/10 p-2 rounded-lg">{pinError}</p>
          )}

          <form onSubmit={handlePinSubmit} className="space-y-3">
            <input
              type="password"
              value={adminPin}
              onChange={(e) => setAdminPin(e.target.value)}
              placeholder="পিন কোড লিখুন"
              className="w-full bg-brand-card border border-brand-border focus:border-brand-gold rounded-xl px-4 py-2.5 text-center text-sm text-white tracking-widest font-mono focus:outline-none"
              autoFocus
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-brand-gold text-brand-noir font-bold text-xs shadow-gold-glow hover:brightness-110 transition"
            >
              প্রবেশ করুন
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 text-slate-100">
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-brand-surface border border-brand-gold/30 shadow-luxury">
        <div className="flex items-center gap-3">
          <div className="size-12 rounded-2xl bg-gradient-to-tr from-brand-gold to-brand-goldDark text-brand-noir flex items-center justify-center font-bold">
            <Crown className="size-6 fill-brand-noir" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-white">
              Karishma Shop BD — অ্যাডমিন কন্ট্রোল
            </h1>
            <p className="text-xs text-slate-400">অর্ডার ম্যানেজমেন্ট, পেমেন্ট ভেরিফিকেশন ও স্টোর সেটিংস</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => generateMonthlyReportPDF(orders, settings)}
            className="px-4 py-2 rounded-xl bg-brand-card hover:bg-brand-surface border border-brand-gold/40 text-brand-gold text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <Download className="size-3.5" />
            <span>মাসিক রিপোর্ট (PDF)</span>
          </button>

          <button
            onClick={handleLogoutAdmin}
            className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold transition"
          >
            লগআউট
          </button>
        </div>
      </div>

      {/* Overview Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-xs">
        <div className="p-5 rounded-2xl bg-brand-surface border border-brand-border space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span>মোট রাজস্ব (Sales)</span>
            <DollarSign className="size-4 text-brand-gold" />
          </div>
          <p className="font-mono text-2xl font-black text-brand-gold">৳{totalRevenue.toLocaleString()}</p>
          <span className="text-[10px] text-emerald-400">সফল অর্ডারের মোট বিক্রয়</span>
        </div>

        <div className="p-5 rounded-2xl bg-brand-surface border border-brand-border space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span>মোট অর্ডার</span>
            <ShoppingBag className="size-4 text-cyan-400" />
          </div>
          <p className="font-mono text-2xl font-black text-white">{orders.length}</p>
          <span className="text-[10px] text-slate-400">লাইফটাইম অর্ডার রেকর্ড</span>
        </div>

        <div className="p-5 rounded-2xl bg-brand-surface border border-brand-border space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span>অপেক্ষমাণ (Pending)</span>
            <Clock className="size-4 text-amber-400" />
          </div>
          <p className="font-mono text-2xl font-black text-amber-300">{pendingCount}</p>
          <span className="text-[10px] text-amber-400">কনফার্মেশনের অপেক্ষায়</span>
        </div>

        <div className="p-5 rounded-2xl bg-brand-surface border border-brand-border space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span>ডেলিভার্ড সম্পন্ন</span>
            <CheckCircle2 className="size-4 text-emerald-400" />
          </div>
          <p className="font-mono text-2xl font-black text-emerald-400">{deliveredCount}</p>
          <span className="text-[10px] text-emerald-400">সফল ডেলিভারি সম্পন্ন</span>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex items-center gap-2 border-b border-brand-border pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl transition ${activeTab === 'orders' ? 'bg-brand-gold text-brand-noir' : 'bg-brand-surface text-slate-300 hover:text-white'}`}
        >
          অর্ডারসমূহ ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-xl transition ${activeTab === 'products' ? 'bg-brand-gold text-brand-noir' : 'bg-brand-surface text-slate-300 hover:text-white'}`}
        >
          পণ্য তালিকা ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl transition ${activeTab === 'settings' ? 'bg-brand-gold text-brand-noir' : 'bg-brand-surface text-slate-300 hover:text-white'}`}
        >
          স্টোর সেটিংস
        </button>
      </div>

      {/* Tab 1: Orders Management */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="নাম, ফোন বা আইডি দিয়ে খুঁজুন..."
                className="w-full bg-brand-surface border border-brand-border rounded-xl pl-9 pr-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-gold"
              />
              <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 w-full sm:w-auto scrollbar-none">
              {['all', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderFilter(st)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                    orderFilter === st
                      ? 'bg-brand-gold/20 text-brand-gold border border-brand-gold/40'
                      : 'bg-brand-surface text-slate-400 hover:text-white'
                  }`}
                >
                  {st === 'all' ? 'সব অর্ডার' : st}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-brand-surface border border-brand-border">
                <p className="text-sm font-bold text-slate-400">কোনো অর্ডার পাওয়া যায়নি!</p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const trackingId = order.orderTrackingId || order.id;

                return (
                  <div
                    key={order.id}
                    className="p-5 rounded-3xl bg-brand-surface border border-brand-border hover:border-brand-gold/40 transition space-y-4 text-xs"
                  >
                    {/* Top Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-brand-border">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-brand-gold">#{trackingId}</span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(order.createdAt).toLocaleDateString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {/* Status Selector & Actions */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Status Select */}
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id || order.orderTrackingId, e.target.value)}
                          className="bg-brand-card border border-brand-border text-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:border-brand-gold focus:outline-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>

                        {/* WhatsApp Confirm & Notify */}
                        <button
                          onClick={() => handleSendConfirmationWA(order)}
                          className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1 transition"
                          title="WhatsApp Confirmation"
                        >
                          <MessageSquare className="size-3.5 fill-white" />
                          <span>কনফার্ম & মেসেজ</span>
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm('অর্ডারটি মুছে ফেলতে চান?')) {
                              deleteOrder(order.id || order.orderTrackingId);
                            }
                          }}
                          className="p-1.5 rounded-xl bg-brand-card hover:bg-rose-600 text-slate-400 hover:text-white transition"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Customer & Items Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Customer Info */}
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">গ্রাহকের বিবরণ:</span>
                        <p className="font-bold text-white text-sm">{order.customerName}</p>
                        <a href={`tel:${order.phone}`} className="text-brand-gold font-mono hover:underline block mt-0.5">
                          📞 {order.phone}
                        </a>
                        <p className="text-slate-300 mt-1">{order.address}</p>
                        <span className="text-[10px] text-slate-500 block mt-1">
                          জোন: {order.deliveryZone === 'outside_dhaka' ? 'ঢাকার বাইরে (৳' + order.deliveryFee + ')' : 'ঢাকা সিটি (৳' + order.deliveryFee + ')'}
                        </span>
                      </div>

                      {/* Items Info */}
                      <div className="space-y-1.5">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">অর্ডারের আইটেম:</span>
                        {order.items?.map((it, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-brand-gold shrink-0" />
                            <span className="text-white font-bold truncate">
                              {it.product?.nameBn || it.product?.name}
                            </span>
                            <span className="text-slate-400 text-[11px] shrink-0">
                              ({it.selectedColor || ''} × {it.quantity})
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Payment Verification Box */}
                      <div className="p-3 rounded-2xl bg-brand-card border border-brand-border space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-[10px] uppercase font-bold">পেমেন্ট মেথড:</span>
                          <span className="font-bold text-white">
                            {order.paymentMethod === 'bkash' ? 'বিকাশ সম্পন্ন' : 'ক্যাশ অন ডেলিভারি'}
                          </span>
                        </div>

                        {order.paymentMethod === 'bkash' && (
                          <div className="space-y-1.5">
                            <p className="text-[11px] text-slate-300">
                              প্রেরক নম্বর: <strong className="font-mono text-pink-400">{order.bkashSender || 'N/A'}</strong>
                            </p>

                            <div className="flex items-center gap-1.5 pt-1">
                              <button
                                onClick={() => updatePaymentStatus(order.id || order.orderTrackingId, 'received')}
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition ${
                                  order.paymentStatus === 'received'
                                    ? 'bg-emerald-500 text-white shadow-sm'
                                    : 'bg-brand-surface text-slate-300 hover:text-white'
                                }`}
                              >
                                ✓ Received
                              </button>

                              <button
                                onClick={() => {
                                  updatePaymentStatus(order.id || order.orderTrackingId, 'not_received');
                                  handleSendPaymentMismatchWA(order);
                                }}
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition ${
                                  order.paymentStatus === 'not_received'
                                    ? 'bg-rose-500 text-white shadow-sm'
                                    : 'bg-brand-surface text-slate-300 hover:text-white'
                                }`}
                              >
                                ✕ Not Received
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="pt-2 border-t border-brand-border flex items-center justify-between">
                          <span className="text-slate-400">মোট প্রদেয়:</span>
                          <span className="font-mono text-base font-black text-brand-gold">৳{order.totalAmount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Products Catalog */}
      {activeTab === 'products' && (
        <div className="space-y-5">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-brand-surface p-4 rounded-2xl border border-brand-border">
            <div>
              <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                <ShoppingBag className="size-4 text-brand-gold" />
                <span>প্রোডাক্ট ক্যাটালগ ও ইনভেন্টরি ({products.length} টি প্রোডাক্ট)</span>
              </h3>
              <p className="text-[11px] text-slate-400">সকল আবায়া, থ্রি-পিস, গাউন ও ব্যাগের স্টক ও মূল্য নিয়ন্ত্রণ করুন</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  resetToDefault();
                  setCatalogSuccess('ক্যাটালগ সফলভাবে রিস্টোর হয়েছে!');
                  setTimeout(() => setCatalogSuccess(''), 2500);
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-brand-gold text-xs font-bold border border-brand-gold/40 flex items-center gap-1.5 transition active:scale-95"
                title="রিসেট করুন"
              >
                <RefreshCw className="size-3.5" />
                <span>ডিফল্ট ক্যাটালগ রিসেট</span>
              </button>
            </div>
          </div>

          {catalogSuccess && (
            <p className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs">{catalogSuccess}</p>
          )}

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => {
              const mainImg = p.image || p.images?.[0] || '/assets/brand/logo.png';
              return (
                <div key={p.id} className="p-3.5 rounded-2xl bg-brand-surface border border-brand-border hover:border-brand-gold/40 transition space-y-2 text-xs flex flex-col justify-between">
                  <div>
                    <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-brand-noir border border-brand-border/60 p-2 flex items-center justify-center">
                      <img src={mainImg} alt="" className="size-full object-contain" />
                      <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-brand-noir/80 text-brand-gold border border-brand-gold/30">
                        {p.category.toUpperCase()}
                      </span>
                    </div>

                    <h4 className="font-bold text-white truncate mt-2 text-xs" title={p.nameBn}>
                      {p.nameBn}
                    </h4>

                    <div className="flex items-center justify-between text-brand-gold font-mono font-bold mt-1">
                      <span className="text-sm">৳{p.price}</span>
                      <span className="text-[10px] text-slate-400">স্টক: {p.stockCount || 10}টি</span>
                    </div>

                    {p.colors && p.colors.length > 0 && (
                      <div className="flex items-center gap-1 pt-1.5 overflow-x-auto">
                        <span className="text-[10px] text-slate-400 font-semibold">ভ্যারিয়েন্ট:</span>
                        {p.colors.map((c, i) => (
                          <span
                            key={i}
                            className="size-3 rounded-full border border-black/40 shrink-0"
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-brand-border flex items-center justify-between gap-2">
                    <button
                      onClick={() => updateProduct(p.id, { inStock: !p.inStock })}
                      className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-bold transition ${
                        p.inStock !== false
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {p.inStock !== false ? '✓ ইন স্টক' : '✕ স্টক আউট'}
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`'${p.nameBn}' পণ্যটি মুছে ফেলতে চান?`)) {
                          deleteProduct(p.id);
                        }
                      }}
                      className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                      title="মুছুন"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Store Settings */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl bg-brand-surface border border-brand-gold/30 rounded-3xl p-6 sm:p-8 space-y-5 text-xs">
          <h3 className="font-serif text-lg font-bold text-white border-b border-brand-border pb-3 flex items-center gap-2">
            <Settings className="size-5 text-brand-gold" />
            <span>স্টোর কনফিগারেশন সেটিংস</span>
          </h3>

          {settingsSuccess && (
            <p className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold">{settingsSuccess}</p>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-300 mb-1">হটলাইন নম্বর</label>
                <input
                  type="text"
                  value={settingsForm.hotline}
                  onChange={(e) => setSettingsForm(s => ({ ...s, hotline: e.target.value }))}
                  className="w-full bg-brand-card border border-brand-border rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">হোয়াটসঅ্যাপ সাপোর্ট নম্বর</label>
                <input
                  type="text"
                  value={settingsForm.whatsappNumber}
                  onChange={(e) => setSettingsForm(s => ({ ...s, whatsappNumber: e.target.value }))}
                  className="w-full bg-brand-card border border-brand-border rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-300 mb-1">বিকাশ ও নগদ পার্সোনাল নম্বর (01819305805)</label>
                <input
                  type="text"
                  value={settingsForm.bkashNumber}
                  onChange={(e) => setSettingsForm(s => ({ ...s, bkashNumber: e.target.value }))}
                  className="w-full bg-brand-card border border-brand-border rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">সাপোর্ট ইমেইল</label>
                <input
                  type="email"
                  value={settingsForm.email}
                  onChange={(e) => setSettingsForm(s => ({ ...s, email: e.target.value }))}
                  className="w-full bg-brand-card border border-brand-border rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">শোরুম / অফিস ঠিকানা</label>
              <textarea
                value={settingsForm.address}
                onChange={(e) => setSettingsForm(s => ({ ...s, address: e.target.value }))}
                rows="2"
                className="w-full bg-brand-card border border-brand-border rounded-xl px-3 py-2 text-white resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-300 mb-1">ডেলিভারি চার্জ (ঢাকা সিটি)</label>
                <input
                  type="number"
                  value={settingsForm.deliveryFeeInside}
                  onChange={(e) => setSettingsForm(s => ({ ...s, deliveryFeeInside: e.target.value }))}
                  className="w-full bg-brand-card border border-brand-border rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">ডেলিভারি চার্জ (ঢাকার বাইরে)</label>
                <input
                  type="number"
                  value={settingsForm.deliveryFeeOutside}
                  onChange={(e) => setSettingsForm(s => ({ ...s, deliveryFeeOutside: e.target.value }))}
                  className="w-full bg-brand-card border border-brand-border rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">অ্যানাউন্সমেন্ট টেক্সট (টপ বার)</label>
              <input
                type="text"
                value={settingsForm.announcementText}
                onChange={(e) => setSettingsForm(s => ({ ...s, announcementText: e.target.value }))}
                className="w-full bg-brand-card border border-brand-border rounded-xl px-3 py-2 text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-brand-gold text-brand-noir font-bold text-xs shadow-gold-glow"
            >
              সেটিংস সংরক্ষণ করুন
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
