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
      msgText += `${idx + 1}. ${item.product?.nameBn || item.product?.name} (কালার: ${item.selectedColor || 'Standard'}, সাইজ: ${item.selectedSize || 'Free Size'}, পরিমাণ: ${item.quantity}টি) - ৳${(item.product?.price || 0) * item.quantity}\n`;
    });
    msgText += `\nমোট সাবটোটাল: ৳${subtotal}\nঅনুগ্রহ করে অর্ডারটি কনফার্ম করুন। ধন্যবাদ!`;

    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msgText)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 w-full sm:max-w-md md:max-w-lg flex">
        <div className="w-full h-full bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between text-slate-900">
          
          {/* 1. Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-slate-900 text-brand-gold flex items-center justify-center shadow-sm">
                <ShoppingBag className="size-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-slate-900">
                  {lang === 'bn' ? 'শপিং ব্যাগ' : 'Shopping Bag'}
                </h3>
                <span className="text-xs text-slate-500 font-semibold">
                  {cartItems.length} {lang === 'bn' ? 'টি পণ্য যুক্ত আছে' : 'items in cart'}
                </span>
              </div>
            </div>
            <button
              onClick={closeCart}
              className="size-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition"
              aria-label="Close cart"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* 2. Free Delivery Milestone Bar */}
          <div className="px-5 py-3.5 bg-gradient-to-r from-amber-50/90 via-[#FDFBF7] to-amber-50/70 border-b border-amber-100 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 text-slate-800">
                <Sparkles className="size-4 text-brand-goldDark" />
                <span>
                  {isFreeDeliveryCart
                    ? (lang === 'bn' ? '🎉 অভিনন্দন! আপনি ফ্রি ডেলিভারি পাচ্ছেন!' : '🎉 Congratulations! You unlocked Free Delivery!')
                    : (lang === 'bn'
                        ? `আর মাত্র ৳${remainingForFree} টাকার পণ্য যোগ করলে ফ্রি ডেলিভারি!`
                        : `Add ৳${remainingForFree} more for Free Delivery!`)}
                </span>
              </span>
              <span className="font-mono text-brand-goldDark font-black">{freePercent}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-brand-gold to-brand-goldDark h-full rounded-full transition-all duration-500 shadow-xs"
                style={{ width: `${freePercent}%` }}
              />
            </div>
          </div>

          {/* 3. Cart Items List - Styled EXACTLY like the user's reference screenshot */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
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
              cartItems.map((item) => {
                const variantLabel = item.selectedColor
                  ? (item.selectedSize ? `${item.selectedColor} • ${item.selectedSize}` : item.selectedColor)
                  : (item.selectedSize || 'Free Size');

                const itemImg = item.product?.image || item.product?.images?.[0] || '/assets/brand/logo.webp';

                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3.5 sm:gap-4 p-3 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 transition shadow-xs"
                  >
                    {/* Product Image (Rounded Squircle like reference) */}
                    <Link
                      to={`/product/${item.product?.id}`}
                      onClick={closeCart}
                      className="size-20 sm:size-24 rounded-2xl sm:rounded-3xl overflow-hidden bg-[#F8F9FA] border border-slate-100 shrink-0 flex items-center justify-center group"
                    >
                      <img
                        src={itemImg}
                        alt={item.product?.name}
                        className="size-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </Link>

                    {/* Middle Info */}
                    <div className="flex-1 min-w-0 pr-1">
                      {/* Product Title */}
                      <Link
                        to={`/product/${item.product?.id}`}
                        onClick={closeCart}
                        className="font-bold text-slate-900 hover:text-brand-goldDark text-sm sm:text-base leading-snug line-clamp-1 block transition"
                        title={item.product?.nameBn || item.product?.name}
                      >
                        {lang === 'bn' ? item.product?.nameBn : item.product?.name}
                      </Link>

                      {/* Variant Badge (Soft lavender/indigo pill matching reference) */}
                      <div className="mt-1">
                        <span className="inline-block bg-[#F0EEFF] text-[#5538EE] px-3 py-0.5 rounded-full text-xs font-bold">
                          {variantLabel}
                        </span>
                      </div>

                      {/* Price (Large bold deep font like reference) */}
                      <div className="font-mono text-lg sm:text-xl font-black text-[#1E1B4B] mt-1.5 leading-none">
                        ৳{item.product?.price}
                      </div>

                      {/* Quantity Stepper (Pill capsule container matching reference) */}
                      <div className="inline-flex items-center justify-between border border-slate-200 bg-white rounded-full px-2 sm:px-3 py-1 shadow-xs gap-3 sm:gap-4 mt-2.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-slate-500 hover:text-slate-900 font-bold p-0.5 text-base active:scale-90 transition"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="size-3.5 sm:size-4 stroke-[2.5]" />
                        </button>
                        <span className="font-bold font-mono text-slate-900 text-xs sm:text-sm min-w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-slate-500 hover:text-slate-900 font-bold p-0.5 text-base active:scale-90 transition"
                          aria-label="Increase quantity"
                        >
                          <Plus className="size-3.5 sm:size-4 stroke-[2.5]" />
                        </button>
                      </div>
                    </div>

                    {/* Top Right Trash Button (Circular soft button matching reference) */}
                    <div className="self-start pt-0.5">
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="size-9 rounded-full bg-[#F3F4F8] hover:bg-rose-50 text-slate-500 hover:text-rose-600 flex items-center justify-center transition shadow-xs active:scale-95"
                        title={lang === 'bn' ? 'আইটেম মুছুন' : 'Remove item'}
                        aria-label="Remove item"
                      >
                        <Trash2 className="size-4 stroke-[1.8]" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* 4. Footer Summary & Action Controls */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-[#FDFBF7] space-y-3.5">
              {/* Coupon Row */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                  <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                    <Check className="size-3.5" />
                    <span>কুপন '{appliedCoupon.code}' প্রয়োগ হয়েছে (-৳{couponDiscount})</span>
                  </span>
                  <button
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
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder={lang === 'bn' ? 'কুপন কোড (যেমন: EID2026)' : 'Coupon code'}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-gold font-mono uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-slate-900 text-brand-gold text-xs font-bold hover:bg-slate-800 transition"
                  >
                    {lang === 'bn' ? 'প্রয়োগ' : 'Apply'}
                  </button>
                </form>
              )}
              {couponError && (
                <p className="text-[11px] text-rose-600 font-bold">{couponError}</p>
              )}

              {/* Pricing Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
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
                  <span className="font-mono text-slate-700">
                    {isFreeDeliveryCart ? (
                      <strong className="text-emerald-700 font-bold">সম্পূর্ণ ফ্রি!</strong>
                    ) : (
                      lang === 'bn' ? 'চেকআউটে যুক্ত হবে' : 'Calculated at checkout'
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>{lang === 'bn' ? 'সর্বমোট মূল্য:' : 'Grand Total:'}</span>
                  <span className="font-mono text-brand-goldDark text-xl font-black">
                    ৳{Math.max(0, subtotal - couponDiscount)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                {/* 1. Fast Checkout Button (Liquid Gold) */}
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="btn-gold-primary w-full py-3.5 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-md"
                >
                  <span>{t('checkout')}</span>
                  <ArrowRight className="size-4" />
                </button>

                {/* 2. WhatsApp Instant Order Button */}
                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
                >
                  <MessageCircle className="size-4 fill-white" />
                  <span>{lang === 'bn' ? 'হোয়াটসঅ্যাপে সরাসরি অর্ডার করুন' : 'Order via WhatsApp'}</span>
                </button>
              </div>

              {/* Trust Footer */}
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
