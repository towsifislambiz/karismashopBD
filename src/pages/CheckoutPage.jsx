import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Copy,
  AlertCircle,
  Tag,
  ArrowLeft,
  ShoppingBag,
  Zap,
  Lock,
  Phone,
  User,
  MapPin
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useStoreSettings } from '../context/StoreSettingsContext';
import { useOrders } from '../context/OrderContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';

export default function CheckoutPage() {
  const { lang, t } = useLanguage();
  const { cartItems, subtotal, isFreeDeliveryCart, clearCart, appliedCoupon, applyCoupon, removeCoupon, couponDiscount } = useCart();
  const { settings } = useStoreSettings();
  const { placeOrder, loading } = useOrders();
  const { currentUser, userData } = useCustomerAuth();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState(currentUser?.displayName || userData?.displayName || '');
  const [phone, setPhone] = useState(currentUser?.phoneNumber || userData?.phoneNumber || '');
  const [address, setAddress] = useState(userData?.address || '');
  const [deliveryZone, setDeliveryZone] = useState('inside_dhaka');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [bkashSender, setBkashSender] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedBkash, setCopiedBkash] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto py-24 text-center px-4 space-y-4">
        <div className="size-20 rounded-full bg-white border border-brand-gold/30 shadow-luxury-white mx-auto flex items-center justify-center text-brand-goldDark">
          <ShoppingBag className="size-9" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-slate-900">
          {lang === 'bn' ? 'আপনার ব্যাগ খালি!' : 'Your Cart is Empty!'}
        </h2>
        <p className="text-xs text-slate-500">
          {lang === 'bn' ? 'অর্ডার সম্পন্ন করতে আগে কিছু বুটিক পোশাক বা ব্যাগ যোগ করুন।' : 'Add some boutique items to cart first.'}
        </p>
        <Link to="/shop" className="btn-gold-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black shadow-md mt-2">
          <span>{lang === 'bn' ? 'শপে পণ্য দেখুন' : 'Explore Shop'}</span>
          <ArrowLeft className="size-4 rotate-180" />
        </Link>
      </div>
    );
  }

  const deliveryFee = deliveryZone === 'inside_dhaka'
    ? (settings?.deliveryFeeInside || 80)
    : (settings?.deliveryFeeOutside || 150);

  const effectiveDeliveryFee = isFreeDeliveryCart ? 0 : deliveryFee;
  const grandTotal = Math.max(0, subtotal + effectiveDeliveryFee - couponDiscount);

  const handleCopyBkash = () => {
    const num = settings?.bkashNumber || '01819305805';
    navigator.clipboard.writeText(num);
    setCopiedBkash(true);
    setTimeout(() => setCopiedBkash(false), 2000);
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponMsg('');
    const res = applyCoupon(couponInput);
    setCouponMsg(res.message);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim()) {
      setErrorMsg(lang === 'bn' ? 'অনুগ্রহ করে আপনার নাম লিখুন।' : 'Please enter your name.');
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 11 || !cleanPhone.startsWith('01')) {
      setErrorMsg(lang === 'bn' ? 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 018XXXXXXXX)।' : 'Please provide a valid 11-digit mobile number.');
      return;
    }

    if (!address.trim() || address.trim().length < 5) {
      setErrorMsg(lang === 'bn' ? 'অনুগ্রহ করে সম্পূর্ণ ডেলিভারি ঠিকানা লিখুন।' : 'Please enter a detailed delivery address.');
      return;
    }

    if (paymentMethod === 'bkash') {
      const cleanSender = bkashSender.replace(/[^0-9]/g, '');
      if (cleanSender.length < 11) {
        setErrorMsg(lang === 'bn' ? 'যে বিকাশ নম্বর থেকে টাকা পাঠিয়েছেন সেটি সঠিকভাবে লিখুন।' : 'Please enter your 11-digit sender bKash number.');
        return;
      }
    }

    const orderData = {
      customerName: customerName.trim(),
      phone: cleanPhone,
      address: address.trim(),
      userId: currentUser?.uid || userData?.uid || 'guest',
      email: currentUser?.email || userData?.email || '',
      deliveryZone,
      deliveryFee: effectiveDeliveryFee,
      isFreeDelivery: isFreeDeliveryCart,
      paymentMethod,
      bkashSender: paymentMethod === 'bkash' ? bkashSender.trim() : null,
      couponUsed: appliedCoupon?.code || null,
      couponDiscount,
      items: cartItems.map(item => ({
        product: {
          id: item.product.id,
          name: item.product.name,
          nameBn: item.product.nameBn,
          price: item.product.price,
          image: item.product.image || item.product.images?.[0]
        },
        quantity: item.quantity,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize
      })),
      totalAmount: grandTotal
    };

    try {
      const placed = await placeOrder(orderData);

      clearCart();

      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {}

      navigate(`/order-success/${placed.orderTrackingId || placed.id}`);
    } catch (err) {
      setErrorMsg(lang === 'bn' ? 'অর্ডার করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।' : 'Order placement failed. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <Link to="/shop" className="text-xs text-brand-goldDark hover:underline flex items-center gap-1 mb-1 font-bold">
            <ArrowLeft className="size-3.5" />
            <span>{lang === 'bn' ? 'শপে ফিরে যান' : 'Continue Shopping'}</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            {lang === 'bn' ? 'অর্ডার ও চেকআউট' : 'Complete Checkout'}
          </h1>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
          <Lock className="size-3.5 text-emerald-600" />
          <span>{lang === 'bn' ? 'SSL এনক্রিপ্টেড ও ১০০% নিরাপদ' : '100% Secure Checkout'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Customer Form & Payment (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-luxury-white space-y-5">
          <h3 className="font-serif text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <span className="size-7 rounded-lg bg-slate-900 text-brand-gold flex items-center justify-center text-xs font-bold font-mono">
              ১
            </span>
            <span>{lang === 'bn' ? 'গ্রাহক ও ডেলিভারি তথ্য' : 'Customer & Delivery Info'}</span>
          </h3>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Customer Name */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {t('customerName')} *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 size-4 text-slate-400" />
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={lang === 'bn' ? 'আপনার পূর্ণ নাম লিখুন' : 'Full Name'}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-gold rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {t('phoneNumber')} *
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 size-4 text-slate-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="018XXXXXXXX"
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-gold rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none font-mono"
                  required
                />
              </div>
            </div>

            {/* Full Address */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {t('deliveryAddress')} *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 size-4 text-slate-400" />
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={lang === 'bn' ? 'বাসা/রোড নম্বর, এলাকা, থানা এবং জেলার নাম বিস্তারিত লিখুন' : 'Full address, Area, Thana, District'}
                  rows="2"
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-gold rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none resize-none"
                  required
                />
              </div>
            </div>

            {/* Delivery Zone */}
            <div className="space-y-1.5 pt-1">
              <label className="block font-bold text-slate-700">
                {t('deliveryZone')}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                    deliveryZone === 'inside_dhaka'
                      ? 'border-brand-gold bg-amber-50/80 text-slate-900 font-bold ring-1 ring-brand-gold/40'
                      : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="checkout-zone"
                    checked={deliveryZone === 'inside_dhaka'}
                    onChange={() => setDeliveryZone('inside_dhaka')}
                    className="accent-brand-goldDark"
                  />
                  <span>{lang === 'bn' ? 'ঢাকার ভেতরে (৳৮০)' : 'Inside Dhaka (৳80)'}</span>
                </label>

                <label
                  className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                    deliveryZone === 'outside_dhaka'
                      ? 'border-brand-gold bg-amber-50/80 text-slate-900 font-bold ring-1 ring-brand-gold/40'
                      : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="checkout-zone"
                    checked={deliveryZone === 'outside_dhaka'}
                    onChange={() => setDeliveryZone('outside_dhaka')}
                    className="accent-brand-goldDark"
                  />
                  <span>{lang === 'bn' ? 'ঢাকার বাইরে (৳১৫০)' : 'Outside Dhaka (৳150)'}</span>
                </label>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-1.5 pt-2">
              <label className="block font-bold text-slate-700">
                {t('paymentMethod')}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                    paymentMethod === 'cod'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-600/30'
                      : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="checkout-payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="accent-emerald-600"
                  />
                  <span>ক্যাশ অন ডেলিভারি</span>
                </label>

                <label
                  className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                    paymentMethod === 'bkash'
                      ? 'border-pink-500 bg-gradient-to-r from-pink-50 to-orange-50 text-pink-900 font-bold ring-1 ring-pink-500/30'
                      : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="checkout-payment"
                    checked={paymentMethod === 'bkash'}
                    onChange={() => setPaymentMethod('bkash')}
                    className="accent-pink-600"
                  />
                  <span>বিকাশ / নগদ সেন্ড মানি</span>
                </label>
              </div>
            </div>

            {/* bKash & Nagad instructions if selected */}
            {paymentMethod === 'bkash' && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50 via-rose-50 to-orange-50 border border-pink-200 space-y-2.5">
                <p className="text-pink-950 leading-relaxed font-medium">
                  {lang === 'bn'
                    ? 'নিচের বিকাশ বা নগদ পার্সোনাল নম্বরে মোট প্রদেয় টাকা "Send Money" করে প্রেরক নম্বরটি নিচে লিখুন:'
                    : 'Send money to the bKash or Nagad personal number below and enter your sender number:'}
                </p>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-pink-200 shadow-sm">
                  <div className="flex flex-col">
                    <span className="font-mono font-bold text-pink-700 text-sm">
                      {settings?.bkashNumber || '01819305805'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold">
                      বিকাশ / নগদ (Personal)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyBkash}
                    className="px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-700 text-white font-bold text-[11px] flex items-center gap-1 transition shadow-xs active:scale-95"
                  >
                    <Copy className="size-3" />
                    <span>{copiedBkash ? 'কপি হয়েছে' : 'নম্বর কপি'}</span>
                  </button>
                </div>
                <input
                  type="tel"
                  value={bkashSender}
                  onChange={(e) => setBkashSender(e.target.value)}
                  placeholder={lang === 'bn' ? 'যে বিকাশ বা নগদ নম্বর থেকে টাকা পাঠিয়েছেন (01XXXXXXXXX)' : 'Sender bKash / Nagad number'}
                  className="w-full bg-white border border-pink-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 font-mono focus:outline-none"
                />
              </div>
            )}
          </form>
        </div>

        {/* Right Column: Order Summary (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-luxury-white space-y-5">
          <h3 className="font-serif text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
            <span>{lang === 'bn' ? 'অর্ডারের বিবরণ' : 'Order Summary'}</span>
            <span className="text-xs font-bold text-slate-500 font-sans">
              ({cartItems.length} {lang === 'bn' ? 'টি পণ্য' : 'items'})
            </span>
          </h3>

          {/* Cart Items List */}
          <div className="max-h-72 overflow-y-auto space-y-3 pr-1 divide-y divide-slate-100">
            {cartItems.map((item) => (
              <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
                <img
                  src={item.product?.image || item.product?.images?.[0] || '/assets/brand/logo.png'}
                  alt=""
                  className="size-14 rounded-xl object-contain bg-[#F8F9FA] p-1 border border-slate-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {lang === 'bn' ? item.product?.nameBn : item.product?.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {item.selectedColor ? `${item.selectedColor} • ` : ''}
                    {item.selectedSize ? `${item.selectedSize} • ` : ''}
                    পরিমাণ: {item.quantity}টি
                  </p>
                </div>
                <span className="font-mono text-xs font-bold text-slate-900 shrink-0">
                  ৳{(item.product?.price || 0) * item.quantity}
                </span>
              </div>
            ))}
          </div>

          {/* Coupon Code Input */}
          <div className="pt-2 border-t border-slate-100">
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                  <Tag className="size-3.5" />
                  <span>কুপন '{appliedCoupon.code}' প্রয়োগ হয়েছে (-৳{couponDiscount})</span>
                </span>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-rose-600 font-bold hover:underline text-[11px]"
                >
                  মুছুন
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-2.5 size-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="কুপন কোড (যেমন: EID2026)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-brand-gold uppercase font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl bg-slate-900 text-brand-gold text-xs font-bold hover:bg-slate-800"
                >
                  প্রয়োগ
                </button>
              </form>
            )}
            {couponMsg && (
              <p className="text-[11px] text-brand-goldDark font-bold mt-1">{couponMsg}</p>
            )}
          </div>

          {/* Financial Calculation */}
          <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
            <div className="flex justify-between">
              <span>{t('subtotal')}:</span>
              <span className="font-mono font-bold text-slate-900">৳{subtotal}</span>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>কুপন ছাড়:</span>
                <span className="font-mono">-৳{couponDiscount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>{t('deliveryFee')}:</span>
              <span className="font-mono font-bold text-slate-800">
                {isFreeDeliveryCart ? (
                  <span className="text-emerald-700 font-bold">সম্পূর্ণ ফ্রি!</span>
                ) : (
                  `৳${effectiveDeliveryFee}`
                )}
              </span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
              <span>{lang === 'bn' ? 'সর্বমোট প্রদেয়:' : 'Grand Total:'}</span>
              <span className="font-mono text-2xl font-black text-brand-goldDark">
                ৳{grandTotal}
              </span>
            </div>
          </div>

          {/* Place Order CTA Button */}
          <button
            type="submit"
            form="checkout-form"
            disabled={loading}
            className="btn-gold-primary w-full py-4 rounded-2xl text-sm font-black flex items-center justify-center gap-2 shadow-lg"
          >
            <Zap className="size-4 fill-brand-noir" />
            <span>
              {loading
                ? (lang === 'bn' ? 'অর্ডার তৈরি হচ্ছে...' : 'Placing Order...')
                : (lang === 'bn' ? `অর্ডার নিশ্চিত করুন • ৳${grandTotal}` : `Confirm Order • ৳${grandTotal}`)}
            </span>
          </button>

          {/* Security & Guarantees */}
          <div className="space-y-1.5 pt-1 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <Truck className="size-3.5 text-brand-goldDark" />
              <span>সারা দেশে দ্রুততম সময়ে হোম ডেলিভারি</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-3.5 text-emerald-600" />
              <span>পণ্য হাতে পেয়ে চেক করে মূল্য পরিশোধের সুযোগ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
