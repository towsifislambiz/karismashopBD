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
  Sparkles,
  ShieldCheck
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
  const previewImage = colorObj?.image || product.image || product.images?.[0] || '/assets/brand/logo.png';

  const handleCopyBkash = () => {
    const num = settings?.bkashNumber || '01819305805';
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
      userId: currentUser?.uid || 'guest',
      email: currentUser?.email || '',
      deliveryZone,
      deliveryFee: effectiveDeliveryFee,
      isFreeDelivery,
      paymentMethod,
      bkashSender: paymentMethod === 'bkash' ? bkashSender.trim() : null,
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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white border border-brand-gold/40 rounded-3xl p-5 sm:p-7 shadow-2xl text-slate-900 my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="size-9 rounded-xl bg-gradient-to-tr from-brand-gold to-brand-goldDark text-brand-noir flex items-center justify-center font-bold shadow-sm">
            <Zap className="size-5 fill-brand-noir" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-serif font-bold text-slate-900">
              {lang === 'bn' ? 'সরাসরি দ্রুত অর্ডার (১-ক্লিক)' : 'Fast 1-Click Order'}
            </h2>
            <p className="text-[11px] text-brand-goldDark font-semibold">
              {lang === 'bn' ? 'কোনো রেজিস্ট্রেশন ছাড়াই দ্রুত ক্যাশ অন ডেলিভারিতে অর্ডার করুন' : 'Order instantly with Cash on Delivery'}
            </p>
          </div>
        </div>

        {/* Product Mini Preview */}
        <div className="flex items-center gap-3.5 p-3 mt-3 rounded-2xl bg-slate-50 border border-slate-200">
          <img
            src={previewImage}
            alt={product.name}
            className="size-16 rounded-xl object-contain bg-white p-1 border border-slate-200"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
              {lang === 'bn' ? product.nameBn : product.name}
            </h4>
            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-600">
              <span className="font-mono text-brand-goldDark font-black text-sm">৳{product.price}</span>
              <span>•</span>
              <span className="text-slate-700 font-semibold">{selectedColor}</span>
              {selectedSize && <span>• {selectedSize}</span>}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Color & Size Selectors if multiple */}
          {product.colors && product.colors.length > 1 && (
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">কালার নির্বাচন করুন:</label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedColor(c.name)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                      selectedColor === c.name
                        ? 'border-brand-gold bg-amber-50 text-slate-900 ring-1 ring-brand-gold/40'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400'
                    }`}
                  >
                    <span className="size-3 rounded-full border border-black/30" style={{ backgroundColor: c.hex }} />
                    <span>{lang === 'bn' ? c.nameBn : c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Name & Phone Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {t('customerName')} *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 size-4 text-slate-400" />
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={lang === 'bn' ? 'আপনার নাম লিখুন' : 'Full Name'}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-gold rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {t('phoneNumber')} *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 size-4 text-slate-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="018XXXXXXXX"
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-gold rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none font-mono"
                  required
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              {t('deliveryAddress')} *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 size-4 text-slate-400" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={lang === 'bn' ? 'বাসা/রোড, থানা, জেলা' : 'Detailed delivery address'}
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-gold rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Delivery Zone Selection */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <label
              className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                deliveryZone === 'inside_dhaka'
                  ? 'border-brand-gold bg-amber-50/80 text-slate-900 font-bold'
                  : 'border-slate-200 bg-white text-slate-600'
              }`}
            >
              <input
                type="radio"
                name="oneclick-zone"
                checked={deliveryZone === 'inside_dhaka'}
                onChange={() => setDeliveryZone('inside_dhaka')}
                className="accent-brand-goldDark"
              />
              <span>{lang === 'bn' ? 'ঢাকার ভেতরে (৳৮০)' : 'Inside Dhaka (৳80)'}</span>
            </label>

            <label
              className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                deliveryZone === 'outside_dhaka'
                  ? 'border-brand-gold bg-amber-50/80 text-slate-900 font-bold'
                  : 'border-slate-200 bg-white text-slate-600'
              }`}
            >
              <input
                type="radio"
                name="oneclick-zone"
                checked={deliveryZone === 'outside_dhaka'}
                onChange={() => setDeliveryZone('outside_dhaka')}
                className="accent-brand-goldDark"
              />
              <span>{lang === 'bn' ? 'ঢাকার বাইরে (৳১৫০)' : 'Outside Dhaka (৳150)'}</span>
            </label>
          </div>

          {/* Payment Method */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <label
              className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                paymentMethod === 'cod'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                  : 'border-slate-200 bg-white text-slate-600'
              }`}
            >
              <input
                type="radio"
                name="oneclick-payment"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
                className="accent-emerald-600"
              />
              <span>ক্যাশ অন ডেলিভারি</span>
            </label>

            <label
              className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                paymentMethod === 'bkash'
                  ? 'border-pink-500 bg-gradient-to-r from-pink-50 to-orange-50 text-pink-900 font-bold'
                  : 'border-slate-200 bg-white text-slate-600'
              }`}
            >
              <input
                type="radio"
                name="oneclick-payment"
                checked={paymentMethod === 'bkash'}
                onChange={() => setPaymentMethod('bkash')}
                className="accent-pink-600"
              />
              <span>বিকাশ / নগদ সেন্ড মানি</span>
            </label>
          </div>

          {/* bKash & Nagad instructions if selected */}
          {paymentMethod === 'bkash' && (
            <div className="p-3 rounded-xl bg-gradient-to-r from-pink-50 via-rose-50 to-orange-50 border border-pink-200 space-y-2 text-[11px]">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-mono font-bold text-pink-700 text-xs">
                    {settings?.bkashNumber || '01819305805'}
                  </span>
                  <span className="text-[9px] text-slate-500 font-bold">
                    বিকাশ / নগদ (Personal)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyBkash}
                  className="px-2.5 py-1 rounded bg-pink-600 hover:bg-pink-700 text-white font-bold text-[10px] flex items-center gap-1 shadow-xs active:scale-95"
                >
                  <Copy className="size-3" />
                  <span>{copiedBkash ? 'কপি হয়েছে' : 'নম্বর কপি'}</span>
                </button>
              </div>
              <input
                type="tel"
                value={bkashSender}
                onChange={(e) => setBkashSender(e.target.value)}
                placeholder="যে বিকাশ বা নগদ নম্বর থেকে টাকা পাঠিয়েছেন লিখুন"
                className="w-full bg-white border border-pink-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-mono focus:outline-none"
              />
            </div>
          )}

          {/* Order Total Row */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-600 block">মোট প্রদেয় (ডেলিভারি চার্জ সহ):</span>
              <span className="text-[11px] text-slate-500">
                {isFreeDelivery ? '🎉 ফ্রি ডেলিভারি অফার কার্যকর' : `পণ্য: ৳${subtotal} + ডেলিভারি: ৳${effectiveDeliveryFee}`}
              </span>
            </div>
            <span className="font-mono text-xl font-black text-brand-goldDark">
              ৳{grandTotal}
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-gold-primary w-full py-3.5 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-md"
          >
            <Zap className="size-4 fill-brand-noir" />
            <span>
              {loading
                ? (lang === 'bn' ? 'অর্ডার প্রসেস হচ্ছে...' : 'Processing...')
                : (lang === 'bn' ? `অর্ডার নিশ্চিত করুন (৳${grandTotal})` : `Confirm Order (৳${grandTotal})`)}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
