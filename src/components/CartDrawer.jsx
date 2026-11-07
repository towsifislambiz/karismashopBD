import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  X,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Tag,
  MessageCircle,
  Plus,
  Minus,
  Check
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useStoreSettings } from '../context/StoreSettingsContext';

export default function CartDrawer() {
  const { lang, t } = useLanguage();
  const {
    cartItems,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    isFreeDeliveryCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    couponDiscount
  } = useCart();
  const { settings } = useStoreSettings();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const freeThreshold = settings?.freeDeliveryThreshold || 3500;
  const remainingForFree = Math.max(0, freeThreshold - subtotal);
  const freePercent = Math.min(100, Math.round((subtotal / freeThreshold) * 100));

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    if (!res.success) {
      setCouponError(res.message);
    }
  };

  // WhatsApp 1-Click Cart Order
  const handleWhatsAppOrder = () => {
    const rawWa = (settings?.whatsappNumber || '01819305805').replace(/[^0-9]/g, '');
    const waNumber = rawWa.startsWith('880') ? rawWa : rawWa.startsWith('0') ? '88' + rawWa : '880' + rawWa;
    
    let msgText = `আসসালামু আলাইকুম Karishma Shop BD! আমি ওয়েবসাইট কার্ট থেকে নিচের পণ্যগুলো অর্ডার করতে চাই:\n\n`;
    cartItems.forEach((item, idx) => {
      msgText += `${idx + 1}. ${item.product?.nameBn || item.product?.name} (কালার: ${item.selectedColor || 'N/A'}, পরিমাণ: ${item.quantity}টি) - ৳${(item.product?.price || 0) * item.quantity}\n`;
    });
    msgText += `\nমোট সাবটোটাল: ৳${subtotal}\nঅনুগ্রহ করে আমার অর্ডারটি কনফার্ম করুন। ধন্যবাদ!`;

    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msgText)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel (Pristine White with Gold & Noir Accents) */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white border-l border-brand-gold/30 shadow-2xl flex flex-col justify-between text-slate-900 animate-in slide-in-from-right duration-300">
          
          {/* 1. Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-[#FDFBF7]">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-xl bg-slate-900 text-brand-gold flex items-center justify-center shadow-sm">
                <ShoppingBag className="size-4 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-slate-900">
                  {lang === 'bn' ? 'শপিং ব্যাগ' : 'Shopping Bag'}
                </h3>
                <span className="text-[11px] text-slate-500 font-bold">
                  {cartItems.length} {lang === 'bn' ? 'টি আইটেম সিলেক্টেড' : 'items selected'}
                </span>
              </div>
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition"
              aria-label="Close cart"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* 2. Free Delivery Milestone Bar */}
          <div className="p-3.5 bg-gradient-to-r from-amber-50/80 via-white to-amber-50/60 border-b border-amber-100/80 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="flex items-center gap-1.5 text-slate-800">
                <Sparkles className="size-3.5 text-brand-goldDark" />
                <span>
                  {isFreeDeliveryCart
                    ? (lang === 'bn' ? '🎉 অভিনন্দন! আপনি ফ্রি ডেলিভারি পাচ্ছেন!' : '🎉 Congratulations! You unlocked Free Delivery!')
                    : (lang === 'bn'
                        ? `আর মাত্র ৳${remainingForFree} টাকার পণ্য যোগ করলে সারা দেশে ফ্রি ডেলিভারি!`
                        : `Add ৳${remainingForFree} more for Free Delivery!`)}
                </span>
              </span>
              <span className="font-mono text-brand-goldDark font-black">{freePercent}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-brand-gold to-brand-goldDark h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${freePercent}%` }}
              />
            </div>
          </div>

          {/* 3. Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 divide-y divide-slate-100">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                <div className="size-20 rounded-full bg-slate-50 border border-brand-gold/30 flex items-center justify-center text-brand-goldDark shadow-luxury-white">
                  <ShoppingBag className="size-9 stroke-[1.5]" />
                </div>
                <div className="space-y-1">
                  <p className="font-serif text-lg font-bold text-slate-900">
                    {t('emptyCart')}
                  </p>
                  <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                    {lang === 'bn'
                      ? 'আপনার ব্যাগে বর্তমানে কোনো পোশাক নেই। আমাদের নতুন থ্রি-পিস ও দুবাই কালেকশন এক্সপ্লোর করুন।'
                      : 'Explore our exquisite Three-Piece, Abaya and Handbag arrivals.'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/shop');
                  }}
                  className="btn-gold-primary px-6 py-2.5 rounded-xl text-xs font-black shadow-md"
                >
                  {t('exploreCollection')}
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="pt-3.5 first:pt-0 flex items-start gap-3.5">
                  <img
                    src={item.product?.image || item.product?.images?.[0] || '/assets/brand/logo.png'}
                    alt={item.product?.name}
                    className="size-18 rounded-2xl object-contain bg-[#F8F9FA] p-1.5 border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <Link
                        to={`/product/${item.product?.id}`}
                        onClick={closeCart}
                        className="text-xs sm:text-sm font-bold text-slate-900 hover:text-brand-goldDark line-clamp-1 transition"
                      >
                        {lang === 'bn' ? item.product?.nameBn : item.product?.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-rose-600 transition p-1"
                        title={lang === 'bn' ? 'মুছুন' : 'Remove'}
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>

                    {/* Variant tags */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] text-slate-500">
                      {item.selectedColor && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                          {item.selectedColor}
                        </span>
                      )}
                      {item.selectedSize && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                          {item.selectedSize}
                        </span>
                      )}
                    </div>

                    {/* Price & Quantity Controls */}
                    <div className="flex items-center justify-between mt-2.5">
                      <span className="font-mono text-sm font-black text-brand-goldDark">
                        ৳{(item.product?.price || 0) * item.quantity}
                      </span>

                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 text-xs font-mono">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 px-2 text-slate-600 hover:text-slate-900 font-bold"
                          aria-label="Decrease"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="px-2 font-bold text-slate-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 px-2 text-slate-600 hover:text-slate-900 font-bold"
                          aria-label="Increase"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 4. Footer Checkout & Order Section */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-[#FDFBF7] space-y-3.5">
              {/* Coupon Accordion */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                  <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                    <Check className="size-3.5" />
                    <span>কুপন কোড '{appliedCoupon.code}' যুক্ত হয়েছে (-৳{couponDiscount})</span>
                  </span>
                  <button
                    onClick={removeCoupon}
                    className="text-rose-600 font-bold hover:underline text-[11px]"
                  >
                    বাতিল
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-2.5 size-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder={lang === 'bn' ? 'কুপন কোড দিন (যেমন: EID2026)' : 'Coupon code'}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-gold font-mono uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-slate-900 text-brand-gold text-xs font-bold hover:bg-slate-800 transition"
                  >
                    {lang === 'bn' ? 'প্রয়োগ' : 'Apply'}
                  </button>
                </form>
              )}
              {couponError && (
                <p className="text-[11px] text-rose-600 font-bold">{couponError}</p>
              )}

              {/* Price Calculation */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                <div className="flex justify-between">
                  <span>{t('subtotal')}:</span>
                  <span className="font-mono font-bold text-slate-900">৳{subtotal}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>{lang === 'bn' ? 'কুপন ছাড়:' : 'Coupon Discount:'}</span>
                    <span className="font-mono">-৳{couponDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{t('deliveryFee')}:</span>
                  <span className="font-mono text-slate-700">
                    {isFreeDeliveryCart ? (
                      <strong className="text-emerald-700">{lang === 'bn' ? 'সম্পূর্ণ ফ্রি!' : 'Free'}</strong>
                    ) : (
                      lang === 'bn' ? 'চেকআউটে যুক্ত হবে' : 'Calculated at checkout'
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>{lang === 'bn' ? 'আনুমানিক মোট:' : 'Estimated Total:'}</span>
                  <span className="font-mono text-brand-goldDark text-lg">
                    ৳{Math.max(0, subtotal - couponDiscount)}
                  </span>
                </div>
              </div>

              {/* Dual Action Buttons */}
              <div className="space-y-2 pt-1">
                {/* 1. Fast Checkout Button (Liquid Gold) */}
                <button
                  onClick={handleCheckout}
                  className="btn-gold-primary w-full py-3.5 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2"
                >
                  <span>{t('checkout')}</span>
                  <ArrowRight className="size-4" />
                </button>

                {/* 2. WhatsApp Instant Order Button */}
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
                >
                  <MessageCircle className="size-4 fill-white" />
                  <span>{lang === 'bn' ? 'হোয়াটসঅ্যাপে সরাসরি অর্ডার করুন' : 'Order via WhatsApp'}</span>
                </button>
              </div>

              {/* Trust Tag */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-1">
                <ShieldCheck className="size-3.5 text-emerald-600" />
                <span>{lang === 'bn' ? '১০০% ক্যাশ অন ডেলিভারি ও নিরাপদ কেনাকাটা' : '100% Secure COD Available'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
