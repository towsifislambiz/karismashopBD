import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  ShoppingBag,
  Coins,
  Heart,
  Settings,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  ChevronRight,
  LogOut,
  Edit3,
  Copy,
  ExternalLink,
  ShieldCheck,
  Phone,
  MapPin,
  Mail,
  X,
  AlertTriangle,
  MessageSquare
} from 'lucide-react';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { useOrders } from '../context/OrderContext';
import { useCart } from '../context/CartContext';
import { useStoreSettings } from '../context/StoreSettingsContext';
import { useLanguage } from '../context/LanguageContext';

export default function CustomerAccountPage() {
  const {
    currentUser,
    userData,
    userCoins,
    logout,
    openAuthModal,
    updateUserProfile,
    revertOrderCoins
  } = useCustomerAuth();

  const { orders, updateOrderStatus } = useOrders();
  const { wishlist } = useCart();
  const { settings, coinSettings } = useStoreSettings();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'profile' | 'wishlist'
  const [activeOrderTab, setActiveOrderTab] = useState('all');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    displayName: userData?.displayName || currentUser?.displayName || '',
    phoneNumber: userData?.phoneNumber || currentUser?.phoneNumber || '',
    address: userData?.address || ''
  });
  const [copiedTrackingId, setCopiedTrackingId] = useState('');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  // Filter orders that belong to this customer
  const customerOrders = useMemo(() => {
    if (!currentUser && !userData) {
      return orders.slice(0, 3); // demo view
    }
    return orders.filter(o => {
      const matchUid = Boolean(o.userId && currentUser && o.userId === currentUser.uid);
      const userPhone = (currentUser?.phoneNumber || userData?.phoneNumber || '').replace(/[^0-9]/g, '').slice(-10);
      const orderPhone = (o.phone || '').replace(/[^0-9]/g, '').slice(-10);
      const matchPhone = Boolean(userPhone && orderPhone && userPhone === orderPhone);
      const orderEmail = (o.customerEmail || o.email || '').toLowerCase();
      const userEmail = (currentUser?.email || userData?.email || '').toLowerCase();
      const matchEmail = Boolean(userEmail && orderEmail && userEmail === orderEmail);
      return matchUid || matchPhone || matchEmail;
    });
  }, [orders, currentUser, userData]);

  const displayedOrders = useMemo(() => {
    if (activeOrderTab === 'all') return customerOrders;
    return customerOrders.filter(o => o.status === activeOrderTab);
  }, [customerOrders, activeOrderTab]);

  const handleCopyTrackingId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedTrackingId(id);
    setTimeout(() => setCopiedTrackingId(''), 2000);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileSuccessMsg('');
    try {
      await updateUserProfile({
        displayName: profileForm.displayName.trim(),
        phoneNumber: profileForm.phoneNumber.trim(),
        address: profileForm.address.trim()
      });
      setProfileSuccessMsg('প্রোফাইল সফলভাবে আপডেট করা হয়েছে!');
      setTimeout(() => {
        setProfileSuccessMsg('');
        setIsEditProfileOpen(false);
      }, 1500);
    } catch (err) {
      alert('Error updating profile: ' + err.message);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return { text: 'অপেক্ষমাণ', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30' };
      case 'Confirmed':
        return { text: 'কনফার্মড', color: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' };
      case 'Shipped':
        return { text: 'ডেলিভারির পথে', color: 'bg-purple-500/15 text-purple-400 border-purple-500/30' };
      case 'Delivered':
        return { text: 'ডেলিভার্ড সম্পন্ন', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' };
      case 'Cancelled':
        return { text: 'বাতিলকৃত', color: 'bg-rose-500/15 text-rose-400 border-rose-500/30' };
      default:
        return { text: status, color: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 text-slate-100">
      {/* 1. Account Hero Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-surface via-brand-card to-brand-noir border border-brand-gold/40 shadow-luxury flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
          <div className="size-16 sm:size-20 rounded-2xl bg-gradient-to-tr from-brand-gold to-brand-goldDark text-brand-noir font-serif font-black text-2xl sm:text-3xl flex items-center justify-center border-2 border-brand-gold/60 shadow-gold-glow">
            {userData?.displayName ? userData.displayName.slice(0, 1).toUpperCase() : <User className="size-8" />}
          </div>
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-white">
              {userData?.displayName || currentUser?.displayName || (lang === 'bn' ? 'সম্মানিত বুটিক গ্রাহক' : 'Boutique Customer')}
            </h1>
            <p className="text-xs text-slate-400">
              {currentUser?.email || userData?.phoneNumber || 'Karishma Shop BD Registered Member'}
            </p>
            {userData?.address && (
              <p className="text-[11px] text-slate-400 flex items-center gap-1 justify-center md:justify-start">
                <MapPin className="size-3 text-brand-gold" />
                <span>{userData.address}</span>
              </p>
            )}
          </div>
        </div>

        {/* Right: Coin Wallet Card */}
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-brand-noir/80 border border-brand-gold/40 text-center min-w-36 shadow-gold-soft">
            <div className="flex items-center justify-center gap-1.5 text-brand-gold text-xs font-bold uppercase mb-0.5">
              <Coins className="size-4" />
              <span>কারিশমা কয়েন</span>
            </div>
            <span className="font-mono text-2xl sm:text-3xl font-black text-amber-300">
              {userCoins}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              = ৳{userCoins} শপিং ডিসকাউন্ট
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => setIsEditProfileOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-brand-surface hover:bg-brand-card border border-brand-border text-xs font-bold text-slate-200 hover:text-brand-gold transition flex items-center gap-1.5"
            >
              <Edit3 className="size-3.5" />
              <span>সম্পাদনা</span>
            </button>

            {currentUser ? (
              <button
                onClick={logout}
                className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-bold text-rose-400 transition flex items-center gap-1.5"
              >
                <LogOut className="size-3.5" />
                <span>লগআউট</span>
              </button>
            ) : (
              <button
                onClick={openAuthModal}
                className="px-3.5 py-2 rounded-xl bg-brand-gold text-brand-noir text-xs font-bold transition"
              >
                লগইন করুন
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Order History Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-border pb-3">
          <div className="flex items-center gap-2">
            <ShoppingBag className="size-5 text-brand-gold" />
            <h2 className="font-serif text-lg sm:text-xl font-bold text-white">
              {lang === 'bn' ? 'আমার অর্ডারসমূহ' : 'My Orders'} ({customerOrders.length})
            </h2>
          </div>

          {/* Filter Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
            {['all', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setActiveOrderTab(st)}
                className={`px-3 py-1 rounded-xl transition ${
                  activeOrderTab === st
                    ? 'bg-brand-gold text-brand-noir'
                    : 'bg-brand-surface text-slate-400 hover:text-white'
                }`}
              >
                {st === 'all' ? 'সকল অর্ডার' : getStatusBadge(st).text}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {displayedOrders.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-brand-surface border border-brand-border space-y-3">
            <Package className="size-10 text-slate-500 mx-auto" />
            <p className="font-bold text-slate-300">এই বিভাগে কোনো অর্ডার পাওয়া যায়নি!</p>
            <Link to="/shop" className="inline-block px-5 py-2 rounded-xl bg-brand-gold text-brand-noir font-bold text-xs">
              শপিং করুন →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedOrders.map((order) => {
              const statusInfo = getStatusBadge(order.status);
              const trackingId = order.orderTrackingId || order.id;

              return (
                <div
                  key={order.id}
                  className="p-5 rounded-3xl bg-brand-surface border border-brand-border hover:border-brand-gold/40 transition shadow-luxury space-y-4"
                >
                  {/* Top Bar: Tracking ID & Status */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-brand-border/60">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-bold">ট্র্যাকিং আইডি:</span>
                      <span className="font-mono font-bold text-sm text-brand-gold">
                        #{trackingId}
                      </span>
                      <button
                        onClick={() => handleCopyTrackingId(trackingId)}
                        className="p-1 text-slate-400 hover:text-white"
                        title="Copy"
                      >
                        <Copy className="size-3.5" />
                      </button>
                      {copiedTrackingId === trackingId && (
                        <span className="text-[10px] text-emerald-400 font-bold">কপি হয়েছে!</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border ${statusInfo.color}`}>
                        {statusInfo.text}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {new Date(order.createdAt).toLocaleDateString('bn-BD')}
                      </span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-2">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <img
                          src={item.product?.image || item.product?.images?.[0] || '/assets/brand/logo.png'}
                          alt=""
                          className="size-12 rounded-xl object-contain bg-brand-noir p-1 border border-brand-border shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white truncate">
                            {item.product?.nameBn || item.product?.name}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {item.selectedColor ? `${item.selectedColor} • ` : ''}পরিমাণ: {item.quantity} টি
                          </p>
                        </div>
                        <span className="text-xs font-bold font-mono text-brand-gold">
                          ৳{(item.product?.price || 0) * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* bKash Payment Status Banner */}
                  {order.paymentMethod === 'bkash' && (
                    <div className="pt-2">
                      {order.paymentStatus === 'not_received' ? (
                        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-950/80 via-brand-noir to-rose-950/60 border border-rose-500/80 space-y-2.5">
                          <div className="flex items-start gap-2.5">
                            <AlertTriangle className="size-5 text-rose-400 shrink-0 mt-0.5 animate-bounce" />
                            <div>
                              <span className="text-xs font-bold text-rose-300 block">
                                বিকাশ পেমেন্ট পাওয়া যায়নি (Payment Not Received)
                              </span>
                              <p className="text-[11px] text-slate-200 mt-0.5">
                                আপনার বিকাশ নম্বর (<strong className="font-mono text-white">{order.bkashSender || 'N/A'}</strong>) থেকে টাকা পাঠানোর কোনো রেকর্ড আমাদের সাথে মেলেনি। অর্ডার ভেরিফাই করতে নিচের বাটনে ক্লিক করে যোগাযোগ করুন।
                              </p>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-rose-500/30 flex justify-end">
                            <a
                              href={`https://wa.me/${(() => {
                                const raw = String(settings?.whatsappNumber || '01749765271').replace(/[^0-9]/g, '');
                                return raw.startsWith('880') ? raw : raw.startsWith('0') ? '88' + raw : '880' + raw;
                              })()}?text=${encodeURIComponent(
                                `আসসালামু আলাইকুম Karishma Shop BD, আমার অর্ডার #${trackingId}-এ বিকাশ পেমেন্ট করেছিলাম, কিন্তু স্ট্যাটাসে 'Payment Not Received' দেখাচ্ছে।\n\nঅর্ডার আইডি: #${trackingId}\nপ্রেরক বিকাশ নম্বর: ${order.bkashSender || 'N/A'}\nমোট টাকা: ৳${order.totalAmount || ''}\n\nদয়া করে একটু ভেরিফাই করে কনফার্ম করবেন? ধন্যবাদ!`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition"
                            >
                              <MessageSquare className="size-3.5 fill-white" />
                              <span>Get Support (হোয়াটসঅ্যাপে হেল্প নিন)</span>
                            </a>
                          </div>
                        </div>
                      ) : order.paymentStatus === 'received' ? (
                        <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between text-xs text-emerald-300">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="size-4 text-emerald-400" />
                            <span>বিকাশ পেমেন্ট সফলভাবে ভেরিফাইড হয়েছে (নম্বর: {order.bkashSender})</span>
                          </span>
                          <span className="text-[10px] font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full">
                            ✓ Payment Received
                          </span>
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-between text-xs text-amber-300">
                          <span className="flex items-center gap-1.5">
                            <Clock className="size-4 text-amber-400" />
                            <span>বিকাশ পেমেন্ট যাচাইকরণ প্রক্রিয়াধীন (নম্বর: {order.bkashSender})</span>
                          </span>
                          <span className="text-[10px] font-bold bg-amber-500/20 px-2 py-0.5 rounded-full">
                            ⏳ Verifying
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Order Footer & Actions */}
                  <div className="pt-3 border-t border-brand-border flex items-center justify-between gap-3 flex-wrap text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      {order.status === 'Cancelled' ? (
                        <span className="px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-300 border border-rose-500/30 font-bold text-[11px]">
                          ✕ অর্ডার বাতিল (কয়েন সমন্বয়কৃত)
                        </span>
                      ) : (
                        order.coinsEarned > 0 && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold text-[11px] flex items-center gap-1">
                            <span>🪙</span>
                            <span>+{order.coinsEarned} কয়েন ক্যাশব্যাক</span>
                          </span>
                        )
                      )}

                      {/* Cancel Order Button for Pending Orders */}
                      {order.status === 'Pending' && (
                        <button
                          type="button"
                          onClick={async () => {
                            const conf = window.confirm(
                              `আপনি কি নিশ্চিত যে #${trackingId} অর্ডারটি বাতিল করতে চান?\n\nঅর্ডার বাতিল করলে অর্জিত কয়েন সমন্বয় করা হবে।`
                            );
                            if (conf) {
                              await updateOrderStatus(order.id || order.orderTrackingId, 'Cancelled');
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-[11px] font-bold transition"
                        >
                          অর্ডার বাতিল করুন
                        </button>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block">মোট প্রদেয়:</span>
                      <span className="text-base font-black text-white font-mono">
                        ৳{order.totalAmount}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-brand-surface border border-brand-gold/40 rounded-3xl p-6 shadow-2xl text-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border">
              <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <Edit3 className="size-5 text-brand-gold" />
                <span>প্রোফাইল তথ্য সম্পাদনা</span>
              </h3>
              <button onClick={() => setIsEditProfileOpen(false)} className="text-slate-400 hover:text-white">
                <X className="size-5" />
              </button>
            </div>

            {profileSuccessMsg && (
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs">
                {profileSuccessMsg}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">আপনার নাম</label>
                <input
                  type="text"
                  value={profileForm.displayName}
                  onChange={(e) => setProfileForm(p => ({ ...p, displayName: e.target.value }))}
                  className="w-full bg-brand-card border border-brand-border focus:border-brand-gold rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">মোবাইল নম্বর</label>
                <input
                  type="tel"
                  value={profileForm.phoneNumber}
                  onChange={(e) => setProfileForm(p => ({ ...p, phoneNumber: e.target.value }))}
                  className="w-full bg-brand-card border border-brand-border focus:border-brand-gold rounded-xl px-3 py-2 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">ডেলিভারি ঠিকানা</label>
                <textarea
                  value={profileForm.address}
                  onChange={(e) => setProfileForm(p => ({ ...p, address: e.target.value }))}
                  rows="3"
                  className="w-full bg-brand-card border border-brand-border focus:border-brand-gold rounded-xl px-3 py-2 text-white resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-brand-gold text-brand-noir font-bold text-xs shadow-gold-glow"
              >
                সংরক্ষণ করুন
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
