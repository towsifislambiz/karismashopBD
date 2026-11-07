import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Copy,
  AlertCircle,
  Tag,
  Coins,
  ArrowLeft,
  ShoppingBag
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
  const { settings, coinSettings } = useStoreSettings();
  const { placeOrder, loading } = useOrders();
  const { currentUser, userData, userCoins, redeemCoins, awardCoins } = useCustomerAuth();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState(currentUser?.displayName || userData?.displayName || '');
  const [phone, setPhone] = useState(currentUser?.phoneNumber || userData?.phoneNumber || '');
  const [address, setAddress] = useState(userData?.address || '');
  const [deliveryZone, setDeliveryZone] = useState('inside_dhaka');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [bkashSender, setBkashSender] = useState('');
  const [useCoins, setUseCoins] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedBkash, setCopiedBkash] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto py-24 text-center px-4 space-y-4 text-slate-100">
        <div className="size-16 rounded-full bg-brand-surface mx-auto flex items-center justify-center text-slate-500 border border-brand-border">
          <ShoppingBag className="size-8" />
        </div>
        <h2 className="text-xl font-serif font-bold text-white">আপনার কার্ট খালি!</h2>
        <p className="text-xs text-slate-400">অর্ডার সম্পন্ন করতে আগে কিছু পণ্য কার্টে যোগ করুন।</p>
        <Link to="/shop" className="inline-block px-6 py-2.5 rounded-xl bg-brand-gold text-brand-noir font-bold text-xs">
          শপে পণ্য দেখুন →
        </Link>
      </div>
    );
  }

  const deliveryFee = deliveryZone === 'inside_dhaka'
    ? (settings?.deliveryFeeInside || 80)
    : (settings?.deliveryFeeOutside || 150);

  const effectiveDeliveryFee = isFreeDeliveryCart ? 0 : deliveryFee;

  // Coin Calculations
  const maxCoinsUsable = Math.min(
    userCoins,
    Math.round(subtotal * ((coinSettings?.maxCoinRedeemPercent || 20) / 100))
  );
  const coinsDeduction = useCoins ? maxCoinsUsable : 0;

  const grandTotal = Math.max(0, subtotal + effectiveDeliveryFee - couponDiscount - coinsDeduction);
  const coinsToEarn = Math.round(grandTotal * ((coinSettings?.cashbackPercentage || 2) / 100));

  const handleCopyBkash = () => {
    const num = settings?.bkashNumber || '01749765271';
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
      setErrorMsg(lang === 'bn' ? 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)।' : 'Please provide a valid 11-digit mobile number.');
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
      coinsEarned: coinsToEarn,
      coinsRedeemed: coinsDeduction,
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

      // Deduct coins if used
      if (coinsDeduction > 0) {
        await redeemCoins(coinsDeduction);
      }

      // Award cashback coins
      if (currentUser && coinsToEarn > 0) {
        await awardCoins(coinsToEarn);
      }

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
      <div className="flex items-center justify-between border-b border-brand-border pb-4">
        <div>
          <Link to="/shop" className="text-xs text-brand-gold hover:underline flex items-center gap-1 mb-1 font-bold">
            <ArrowLeft className="size-3.5" />
            <span>{lang === 'bn' ? 'শপে ফিরে যান' : 'Continue Shopping'}</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            {lang === 'bn' ? 'অর্ডার চেকআউট' : 'Complete Checkout'}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Customer Form & Payment (7 cols) */}
        <div className="lg:col-span-7 bg-brand-surface border border-brand-gold/30 rounded-3xl p-5 sm:p-7 shadow-luxury space-y-5">
          <h3 className="font-serif text-lg font-bold text-white border-b border-brand-border pb-3 flex items-center gap-2">
            <span>১. গ্রাহক ও ডেলিভারি তথ্য</span>
          </h3>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Customer Name */}
            <div>
              <label className="block font-bold text-slate-300 mb-1">
                {t('customerName')} *
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder={t('namePlaceholder')}
                className="w-full bg-brand-card border border-brand-border focus:border-brand-gold rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
                required
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block font-bold text-slate-300 mb-1">
                {t('phoneNumber')} *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('phonePlaceholder')}
                className="w-full bg-brand-card border border-brand-border focus:border-brand-gold rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none font-mono"
                required
              />
            </div>

            {/* Full Address */}
            <div>
              <label className="block font-bold text-slate-300 mb-1">
                {t('deliveryAddress')} *
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t('addressPlaceholder')}
                rows="2"
                className="w-full bg-brand-card border border-brand-border focus:border-brand-gold rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none resize-none"
                required
              />
            </div>

            {/* Delivery Zone */}
            <div>
              <label className="block font-bold text-slate-300 mb-1">
                {t('deliveryZone')}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                    deliveryZone === 'inside_dhaka'
                      ? 'border-brand-gold bg-brand-gold/10 text-white font-bold'
                      : 'border-brand-border bg-brand-card text-slate-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="checkout-zone"
                    checked={deliveryZone === 'inside_dhaka'}
                    onChange={() => setDeliveryZone('inside_dhaka')}
                    className="accent-brand-gold"
                  />
                  <span>{t('insideDhaka')}</span>
                </label>

                <label
                  className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                    deliveryZone === 'outside_dhaka'
                      ? 'border-brand-gold bg-brand-gold/10 text-white font-bold'
                      : 'border-brand-border bg-brand-card text-slate-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="checkout-zone"
                    checked={deliveryZone === 'outside_dhaka'}
                    onChange={() => setDeliveryZone('outside_dhaka')}
                    className="accent-brand-gold"
                  />
                  <span>{t('outsideDhaka')}</span>
                </label>
              </div>
            </div>

            {/* Payment Method */}
            <div className="pt-2">
              <label className="block font-bold text-slate-300 mb-1">
                {t('paymentMethod')}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                    paymentMethod === 'cod'
                      ? 'border-emerald-500 bg-emerald-500/10 text-white font-bold'
                      : 'border-brand-border bg-brand-card text-slate-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="checkout-payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="accent-emerald-500"
                  />
                  <span>ক্যাশ অন ডেলিভারি</span>
                </label>

                <label
                  className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                    paymentMethod === 'bkash'
                      ? 'border-pink-500 bg-pink-500/10 text-white font-bold'
                      : 'border-brand-border bg-brand-card text-slate-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="checkout-payment"
                    checked={paymentMethod === 'bkash'}
                    onChange={() => setPaymentMethod('bkash')}
                    className="accent-pink-500"
                  />
                  <span>বিকাশ সেন্ড মানি</span>
                </label>
              </div>
            </div>

            {/* bKash instructions if selected */}
            {paymentMethod === 'bkash' && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-950/40 via-brand-card to-pink-950/20 border border-pink-500/40 space-y-2.5">
                <p className="text-slate-200 leading-relaxed">
                  {t('bkashInstructions')}
                </p>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-brand-noir border border-pink-500/40">
                  <span className="font-mono font-bold text-pink-400 text-sm">
                    {settings?.bkashNumber || '01749765271'} (Personal)
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyBkash}
                    className="px-3 py-1 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-bold text-[11px] flex items-center gap-1 transition"
                  >
                    <Copy className="size-3" />
                    <span>{copiedBkash ? t('copied') : t('copyNumber')}</span>
                  </button>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-pink-300 block mb-1">
                    {t('senderBkashNumber')} *
                  </label>
                  <input
                    type="tel"
                    value={bkashSender}
                    onChange={(e) => setBkashSender(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full bg-brand-noir border border-pink-500/40 focus:border-pink-400 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    required
                  />
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Right Column: Order Summary, Coupons & Coin Redemption (5 cols) */}
        <div className="lg:col-span-5 bg-brand-surface border border-brand-gold/30 rounded-3xl p-5 sm:p-7 shadow-luxury space-y-5">
          <h3 className="font-serif text-lg font-bold text-white border-b border-brand-border pb-3">
            ২. অর্ডারের বিবরণ ({cartItems.length})
          </h3>

          {/* Items Mini List */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-brand-border/60">
            {cartItems.map((item) => (
              <div key={item.id} className="pt-2 first:pt-0 flex items-center gap-3 text-xs">
                <img
                  src={item.product?.image || item.product?.images?.[0] || '/assets/brand/logo.png'}
                  alt=""
                  className="size-12 rounded-lg object-contain bg-brand-noir border border-brand-border"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-100 truncate">
                    {lang === 'bn' ? item.product?.nameBn : item.product?.name}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {item.selectedColor} • Qty: {item.quantity}
                  </p>
                </div>
                <span className="font-mono font-bold text-brand-gold">
                  ৳{(item.product?.price || 0) * item.quantity}
                </span>
              </div>
            ))}
          </div>

          {/* Coupon Code Box */}
          <div className="pt-3 border-t border-brand-border space-y-2">
            <form onSubmit={handleApplyCoupon} className="flex gap-2 text-xs">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="কুপন কোড (যেমন: KARISHMA100)"
                className="flex-1 bg-brand-card border border-brand-border focus:border-brand-gold rounded-xl px-3 py-2 text-white uppercase placeholder:normal-case focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-brand-surface border border-brand-gold/50 text-brand-gold font-bold rounded-xl hover:bg-brand-gold hover:text-brand-noir transition"
              >
                প্রয়োগ
              </button>
            </form>
            {couponMsg && (
              <p className="text-[11px] text-brand-gold">{couponMsg}</p>
            )}
            {appliedCoupon && (
              <div className="flex items-center justify-between text-xs bg-brand-gold/10 border border-brand-gold/30 px-3 py-1.5 rounded-xl text-brand-gold font-bold">
                <span>🏷️ কুপন ছাড় ({appliedCoupon.code})</span>
                <div className="flex items-center gap-2">
                  <span>-৳{appliedCoupon.discount}</span>
                  <button type="button" onClick={removeCoupon} className="text-slate-400 hover:text-white">✕</button>
                </div>
              </div>
            )}
          </div>

          {/* Coin Redemption Box */}
          {userCoins > 0 && (
            <div className="p-3 rounded-2xl bg-brand-card border border-brand-gold/30 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Coins className="size-4" />
                  <span>কারিশমা কয়েন ব্যালেন্স: {userCoins}</span>
                </span>
                <label className="flex items-center gap-1.5 cursor-pointer font-bold text-white">
                  <input
                    type="checkbox"
                    checked={useCoins}
                    onChange={(e) => setUseCoins(e.target.checked)}
                    className="accent-brand-gold"
                  />
                  <span>কয়েন ছাড় নিন</span>
                </label>
              </div>
              {useCoins && (
                <p className="text-[11px] text-slate-300">
                  সর্বোচ্চ {maxCoinsUsable} কয়েন ব্যবহার করে ৳{maxCoinsUsable} ছাড় পেয়েছেন!
                </p>
              )}
            </div>
          )}

          {/* Bill Breakdown */}
          <div className="pt-3 border-t border-brand-border space-y-1.5 text-xs text-slate-300">
            <div className="flex justify-between">
              <span>পণ্যের মোট মূল্য:</span>
              <span className="font-mono text-white">৳{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>ডেলিভারি চার্জ:</span>
              <span className="font-mono text-white">
                {isFreeDeliveryCart ? <strong className="text-emerald-400">ফ্রি</strong> : `৳${effectiveDeliveryFee}`}
              </span>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>কুপন ছাড়:</span>
                <span className="font-mono">-৳{couponDiscount}</span>
              </div>
            )}
            {coinsDeduction > 0 && (
              <div className="flex justify-between text-amber-400 font-bold">
                <span>কয়েন ডিসকাউন্ট:</span>
                <span className="font-mono">-৳{coinsDeduction}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-black text-brand-gold pt-2 border-t border-brand-border">
              <span>সর্বমোট প্রদেয়:</span>
              <span className="font-mono text-xl text-white">৳{grandTotal}</span>
            </div>

            {/* Cashback pill */}
            <div className="pt-2 text-center">
              <span className="text-[11px] text-amber-300 font-bold bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full inline-block">
                🪙 এই অর্ডারে আপনি পাচ্ছেন +{coinsToEarn} কয়েন ক্যাশব্যাক!
              </span>
            </div>
          </div>

          {/* Submit Trigger (Signature Liquid Gold) */}
          <button
            type="submit"
            form="checkout-form"
            disabled={loading}
            className="btn-gold-primary w-full py-4 rounded-2xl text-sm font-black tracking-wide flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>{t('processingOrder')}</span>
            ) : (
              <>
                <CheckCircle2 className="size-5 stroke-[2.5]" />
                <span>অর্ডার কনফার্ম করুন — ৳{grandTotal}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
