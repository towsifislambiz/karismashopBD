import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Trash2, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useStoreSettings } from '../context/StoreSettingsContext';

export default function CartDrawer() {
  const { lang, t } = useLanguage();
  const { cartItems, isCartOpen, closeCart, updateQuantity, removeFromCart, subtotal, isFreeDeliveryCart } = useCart();
  const { settings } = useStoreSettings();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const freeThreshold = settings?.freeDeliveryThreshold || 3500;
  const remainingForFree = Math.max(0, freeThreshold - subtotal);
  const freePercent = Math.min(100, Math.round((subtotal / freeThreshold) * 100));

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-brand-surface border-l border-brand-gold/30 shadow-2xl flex flex-col justify-between text-slate-100">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-brand-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="size-5 text-brand-gold" />
              <h3 className="font-serif text-lg font-bold text-white">
                {t('cart')} ({cartItems.length})
              </h3>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 rounded-full bg-brand-card hover:bg-rose-500/20 text-slate-400 hover:text-white transition"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Free Delivery Goal Bar */}
          <div className="p-3.5 bg-brand-card/90 border-b border-brand-border text-xs space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="flex items-center gap-1 text-brand-gold">
                <Sparkles className="size-3.5" />
                <span>
                  {isFreeDeliveryCart
                    ? (lang === 'bn' ? '🎉 আপনি ফ্রি ডেলিভারি পাচ্ছেন!' : '🎉 You unlocked Free Delivery!')
                    : (lang === 'bn'
                        ? `আর ৳${remainingForFree} টাকার পণ্য যোগ করলেই ফ্রি ডেলিভারি!`
                        : `Add ৳${remainingForFree} more for Free Delivery!`)}
                </span>
              </span>
              <span className="font-mono text-slate-400">{freePercent}%</span>
            </div>
            <div className="w-full bg-brand-noir h-2 rounded-full overflow-hidden border border-brand-border">
              <div
                className="bg-gradient-to-r from-brand-gold to-brand-goldDark h-full rounded-full transition-all duration-500"
                style={{ width: `${freePercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 divide-y divide-brand-border/60">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12">
                <div className="size-16 rounded-full bg-brand-card flex items-center justify-center text-slate-500 border border-brand-border">
                  <ShoppingBag className="size-8" />
                </div>
                <p className="font-serif text-base font-bold text-slate-300">
                  {t('emptyCart')}
                </p>
                <p className="text-xs text-slate-500 max-w-xs">
                  {lang === 'bn'
                    ? 'আমাদের নতুন থ্রি-পিস ও দুবাই কালেকশন থেকে পছন্দের পোশাক যোগ করুন।'
                    : 'Explore our exquisite Three-Piece, Abaya and Handbag arrivals.'}
                </p>
                <button
                  onClick={closeCart}
                  className="px-5 py-2 rounded-xl bg-brand-gold text-brand-noir text-xs font-bold hover:brightness-110 transition"
                >
                  {t('exploreCollection')}
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="pt-3.5 first:pt-0 flex items-start gap-3">
                  <img
                    src={item.product?.image || item.product?.images?.[0] || '/assets/brand/logo.png'}
                    alt={item.product?.name}
                    className="size-16 rounded-xl object-contain bg-brand-noir p-1 border border-brand-border shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-100 truncate">
                      {lang === 'bn' ? item.product?.nameBn : item.product?.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {item.selectedColor ? `${item.selectedColor} • ` : ''}
                      {item.selectedSize ? item.selectedSize : ''}
                    </p>
                    <p className="text-xs font-bold font-mono text-brand-gold mt-1">
                      ৳{item.product?.price}
                    </p>

                    {/* Quantity & Delete */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-brand-border rounded-lg bg-brand-noir text-xs font-mono">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-slate-400 hover:text-white"
                        >
                          -
                        </button>
                        <span className="px-2 font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-slate-400 hover:text-white"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition"
                        title="Remove"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-brand-border bg-brand-card/90 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400 font-bold">
                  {lang === 'bn' ? 'মোট মূল্য:' : 'Subtotal:'}
                </span>
                <span className="font-mono text-lg font-black text-white">
                  ৳{subtotal}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                className="btn-gold-primary w-full py-3.5 rounded-2xl text-sm font-black tracking-wide flex items-center justify-center gap-2"
              >
                <span>{t('checkout')}</span>
                <ArrowRight className="size-4" />
              </button>

              <button
                onClick={closeCart}
                className="w-full py-2 text-center text-xs text-slate-400 hover:text-slate-200 transition font-bold"
              >
                ← {t('continueShopping')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
