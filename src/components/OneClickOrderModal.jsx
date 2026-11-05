import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Zap,
  Phone,
  User,
  MapPin,
  Truck,
  CheckCircle2,
  Copy,
  AlertCircle,
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';
import { useStoreSettings } from '../context/StoreSettingsContext';
import { useOrders } from '../context/OrderContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';

export default function OneClickOrderModal({ isOpen, onClose, product, initialColor = null }) {
  const { lang, t } = useLanguage();
  const { settings } = useStoreSettings();
  const { placeOrder, loading } = useOrders();
  const { currentUser, awardCoins } = useCustomerAuth();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(initialColor || product?.colors?.[0]?.name || 'Standard');
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'Free Size');

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryZone, setDeliveryZone] = useState('inside_dhaka');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [bkashSender, setBkashSender] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedBkash, setCopiedBkash] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedColor(initialColor || product.colors?.[0]?.name || 'Standard');
      setSelectedSize(product.sizes?.[0] || 'Free Size');
      setQuantity(1);
      setErrorMsg('');
    }
  }, [product, initialColor]);

  if (!isOpen || !product) return null;

  const deliveryFee = deliveryZone === 'inside_dhaka'
    ? (settings?.deliveryFeeInside || 80)
    : (settings?.deliveryFeeOutside || 150);

  const subtotal = (product.price || 0) * quantity;
  const isFreeDelivery = subtotal >= (settings?.freeDeliveryThreshold || 3500);
  const effectiveDeliveryFee = isFreeDelivery ? 0 : deliveryFee;
  const grandTotal = subtotal + effectiveDeliveryFee;

  // Selected color image
  const colorObj = product.colors?.find(c => c.name === selectedColor);
  const previewImage = colorObj?.image || product.images?.[0] || '/assets/brand/logo.png';

  const handleCopyBkash = () => {
    const num = settings?.bkashNumber || '01749765271';
    navigator.clipboard.writeText(num);
    setCopiedBkash(true);
    setTimeout(() => setCopiedBkash(false), 2000);
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

    const coinsToEarn = Math.round(grandTotal * ((settings?.coinSettings?.cashbackPercentage || 2) / 100));

    const orderData = {
      customerName: customerName.trim(),
      phone: cleanPhone,
      address: address.trim(),
      userId: currentUser?.uid || 'guest',
      email: currentUser?.email || '',
      deliveryZone,
      deliveryFee: effectiveDeliveryFee,
      isFreeDelivery,
      paymentMethod,
      bkashSender: paymentMethod === 'bkash' ? bkashSender.trim() : null,
      coinsEarned: coinsToEarn,
      coinsRedeemed: 0,
      items: [
        {
          product: {
            id: product.id,
            name: product.name,
            nameBn: product.nameBn,
            price: product.price,
            image: previewImage
          },
          quantity,
          selectedColor,
          selectedSize
        }
      ],
      totalAmount: grandTotal
    };

    try {
      const placed = await placeOrder(orderData);

      // Award cashback coins
      if (currentUser && coinsToEarn > 0) {
        await awardCoins(coinsToEarn);
      }

      // Celebratory Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}

      onClose();
      navigate(`/order-success/${placed.orderTrackingId || placed.id}`);
    } catch (err) {
      setErrorMsg(lang === 'bn' ? 'অর্ডার করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।' : 'Order placement failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-brand-surface border border-brand-gold/40 rounded-3xl p-5 sm:p-7 shadow-2xl text-slate-100 my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-brand-card hover:bg-rose-500/20 text-slate-400 hover:text-white transition"
        >
          <X className="size-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 pb-3 border-b border-brand-border">
          <div className="size-9 rounded-xl bg-gradient-to-tr from-brand-gold to-brand-goldDark text-brand-noir flex items-center justify-center font-bold">
            <Zap className="size-5 fill-brand-noir" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-serif font-bold text-white">
              {t('fastOrderTitle')}
            </h2>
            <p className="text-[11px] text-brand-gold">
              {t('fastOrderSubtitle')}
            </p>
          </div>
        </div>

        {/* Product Mini Preview */}
        <div className="flex items-center gap-3 p-3 mt-3 rounded-2xl bg-brand-card/80 border border-brand-border">
          <img
            src={previewImage}
            alt={product.name}
            className="size-16 rounded-xl object-contain bg-brand-noir p-1 border border-brand-border"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-white truncate">
              {lang === 'bn' ? product.nameBn : product.name}
            </h4>
            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-300">
              <span className="font-mono text-brand-gold font-bold text-sm">৳{product.price}</span>
              <span>•</span>
              <span className="text-slate-400">{selectedColor}</span>
              {selectedSize && <span>• {selectedSize}</span>}
            </div>

            {/* Quantity Pill */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] text-slate-400">{lang === 'bn' ? 'পরিমাণ:' : 'Qty:'}</span>
              <div className="flex items-center border border-brand-border rounded-lg bg-brand-noir text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-2 py-0.5 hover:text-brand-gold"
                >
                  -
                </button>
                <span className="px-2 font-bold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-2 py-0.5 hover:text-brand-gold"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Color & Size Variant Selectors if Available */}
        {product.colors && product.colors.length > 1 && (
          <div className="mt-3">
            <label className="text-[11px] font-bold text-slate-300 block mb-1">
              {lang === 'bn' ? 'পছন্দের কালার বেছে নিন:' : 'Choose Color:'}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {product.colors.map((c, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedColor(c.name)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                    selectedColor === c.name
                      ? 'border-brand-gold bg-brand-gold/15 text-brand-gold font-bold shadow-sm'
                      : 'border-brand-border bg-brand-card text-slate-300 hover:border-slate-600'
                  }`}
                >
                  {lang === 'bn' ? c.nameBn : c.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {product.sizes && product.sizes.length > 1 && (
          <div className="mt-2.5">
            <label className="text-[11px] font-bold text-slate-300 block mb-1">
              {lang === 'bn' ? 'সাইজ বেছে নিন:' : 'Choose Size:'}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {product.sizes.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedSize(s)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                    selectedSize === s
                      ? 'border-brand-gold bg-brand-gold/15 text-brand-gold font-bold shadow-sm'
                      : 'border-brand-border bg-brand-card text-slate-300 hover:border-slate-600'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Fast Order Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Name Input */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {t('customerName')} *
            </label>
            <div className="relative">
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder={t('namePlaceholder')}
                className="w-full bg-brand-card border border-brand-border focus:border-brand-gold rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
                required
              />
              <User className="absolute left-3 top-2.5 size-4 text-brand-gold/70" />
            </div>
          </div>

          {/* Mobile Number Input */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {t('phoneNumber')} *
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('phonePlaceholder')}
                className="w-full bg-brand-card border border-brand-border focus:border-brand-gold rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none font-mono"
                required
              />
              <Phone className="absolute left-3 top-2.5 size-4 text-brand-gold/70" />
            </div>
          </div>

          {/* Address Input */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {t('deliveryAddress')} *
            </label>
            <div className="relative">
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t('addressPlaceholder')}
                rows="2"
                className="w-full bg-brand-card border border-brand-border focus:border-brand-gold rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none resize-none"
                required
              />
              <MapPin className="absolute left-3 top-2.5 size-4 text-brand-gold/70" />
            </div>
          </div>

          {/* Delivery Zone Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {t('deliveryZone')}
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <label
                className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                  deliveryZone === 'inside_dhaka'
                    ? 'border-brand-gold bg-brand-gold/10 text-white font-bold'
                    : 'border-brand-border bg-brand-card text-slate-400'
                }`}
              >
                <input
                  type="radio"
                  name="zone"
                  checked={deliveryZone === 'inside_dhaka'}
                  onChange={() => setDeliveryZone('inside_dhaka')}
                  className="accent-brand-gold"
                />
                <span>{t('insideDhaka')}</span>
              </label>

              <label
                className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                  deliveryZone === 'outside_dhaka'
                    ? 'border-brand-gold bg-brand-gold/10 text-white font-bold'
                    : 'border-brand-border bg-brand-card text-slate-400'
                }`}
              >
                <input
                  type="radio"
                  name="zone"
                  checked={deliveryZone === 'outside_dhaka'}
                  onChange={() => setDeliveryZone('outside_dhaka')}
                  className="accent-brand-gold"
                />
                <span>{t('outsideDhaka')}</span>
              </label>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {t('paymentMethod')}
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <label
                className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                  paymentMethod === 'cod'
                    ? 'border-emerald-500 bg-emerald-500/10 text-white font-bold'
                    : 'border-brand-border bg-brand-card text-slate-400'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="accent-emerald-500"
                />
                <span>ক্যাশ অন ডেলিভারি</span>
              </label>

              <label
                className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                  paymentMethod === 'bkash'
                    ? 'border-pink-500 bg-pink-500/10 text-white font-bold'
                    : 'border-brand-border bg-brand-card text-slate-400'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'bkash'}
                  onChange={() => setPaymentMethod('bkash')}
                  className="accent-pink-500"
                />
                <span>বিকাশ সেন্ড মানি</span>
              </label>
            </div>
          </div>

          {/* bKash Payment Box if selected */}
          {paymentMethod === 'bkash' && (
            <div className="p-3 rounded-2xl bg-gradient-to-r from-pink-950/40 via-brand-card to-pink-950/20 border border-pink-500/40 space-y-2 text-xs">
              <p className="text-slate-200 text-[11px] leading-relaxed">
                {t('bkashInstructions')}
              </p>
              <div className="flex items-center justify-between p-2 rounded-xl bg-brand-noir border border-pink-500/30">
                <span className="font-mono font-bold text-pink-400 text-sm">
                  {settings?.bkashNumber || '01749765271'} (Personal)
                </span>
                <button
                  type="button"
                  onClick={handleCopyBkash}
                  className="px-2.5 py-1 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-bold text-[10px] flex items-center gap-1 transition"
                >
                  <Copy className="size-3" />
                  <span>{copiedBkash ? t('copied') : t('copyNumber')}</span>
                </button>
              </div>

              <div>
                <label className="text-[11px] font-bold text-pink-300 block mb-0.5">
                  {t('senderBkashNumber')} *
                </label>
                <input
                  type="tel"
                  value={bkashSender}
                  onChange={(e) => setBkashSender(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full bg-brand-noir border border-pink-500/40 focus:border-pink-400 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                  required
                />
              </div>
            </div>
          )}

          {/* Pricing Summary */}
          <div className="pt-2 border-t border-brand-border space-y-1 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>{lang === 'bn' ? 'পণ্যের মোট মূল্য:' : 'Product Subtotal:'}</span>
              <span className="font-mono text-slate-200">৳{subtotal}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>{t('deliveryFee')}:</span>
              <span className="font-mono text-slate-200">
                {isFreeDelivery ? <strong className="text-emerald-400">ফ্রি</strong> : `৳${effectiveDeliveryFee}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-black text-brand-gold pt-1 border-t border-brand-border/60">
              <span>{t('orderTotal')}:</span>
              <span className="font-mono text-base text-white">৳{grandTotal}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-brand-gold via-brand-goldLight to-brand-goldDark text-brand-noir font-black text-sm tracking-wide shadow-gold-glow hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>{t('processingOrder')}</span>
            ) : (
              <>
                <CheckCircle2 className="size-5 stroke-[2.5]" />
                <span>{t('confirmOrderBtn')} — ৳{grandTotal}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
