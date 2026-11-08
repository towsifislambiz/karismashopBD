import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Zap, Eye, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, onOneClickOrder }) {
  const { lang, t } = useLanguage();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const [activeColorIdx, setActiveColorIdx] = useState(0);

  const activeColor = product.colors?.[activeColorIdx] || null;
  const currentImage = activeColor?.image || product.images?.[0] || '/assets/brand/logo.webp';
  const isFav = isInWishlist(product.id);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      className="group flex flex-col rounded-3xl bg-white border border-brand-gold/30 hover:border-brand-gold transition-all duration-500 hover:-translate-y-1.5 shadow-luxury-white hover:shadow-luxury-white-hover overflow-hidden"
    >
      {/* 1. Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F8F9FA] flex items-center justify-center border-b border-slate-100">
        <Link to={`/product/${product.id}`} className="size-full flex items-center justify-center p-2.5 overflow-hidden">
          <img
            src={currentImage}
            alt={product.name}
            className="size-full object-contain transition-transform duration-700 ease-out group-hover:scale-110 select-none"
            loading="lazy"
            decoding="async"
          />
        </Link>

        {/* Subtle luxury vignette & overlay on hover */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Top Badges: Gold Foil Discount & Boutique Status */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {discountPercent > 0 && (
            <span className="badge-gold-foil text-[10px] font-black px-2.5 py-0.5 rounded-md shadow-md uppercase">
              -{discountPercent}%
            </span>
          )}
          {product.badge && (
            <span className="bg-white/95 border border-brand-gold/60 text-brand-goldDark text-[10px] font-bold px-2.5 py-0.5 rounded-md shadow-sm backdrop-blur-md">
              {lang === 'bn' ? product.badge : product.badgeEn}
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          className={`absolute top-2.5 right-2.5 size-8 rounded-full flex items-center justify-center transition-all shadow-sm z-10 ${
            isFav
              ? 'bg-brand-gold text-brand-noir shadow-gold-glow scale-110'
              : 'bg-white/90 border border-slate-200 text-slate-700 hover:text-brand-goldDark hover:border-brand-gold'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`size-4 ${isFav ? 'fill-brand-noir' : ''}`} />
        </button>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-center justify-center gap-2">
          <Link
            to={`/product/${product.id}`}
            className="btn-black-secondary w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg"
          >
            <Eye className="size-3.5 text-brand-gold" />
            <span>{t('quickView')}</span>
          </Link>
        </div>
      </div>

      {/* 2. Product Information (Crisp White Canvas) */}
      <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between space-y-2.5 sm:space-y-3 bg-white">
        <div className="space-y-1 sm:space-y-1.5">
          {/* Category Tag */}
          <span className="text-[10px] font-bold text-brand-goldDark uppercase tracking-wider block font-sans">
            {lang === 'bn' ? product.categoryBn : product.category}
          </span>

          {/* Title (Jet Black) */}
          <Link to={`/product/${product.id}`}>
            <h3 className="font-serif text-xs sm:text-base font-bold text-slate-900 hover:text-brand-goldDark transition line-clamp-2 leading-snug">
              {lang === 'bn' ? product.nameBn : product.name}
            </h3>
          </Link>

          {/* Price (Imperial Gold & Strikethrough) */}
          <div className="flex items-baseline gap-1.5 sm:gap-2 pt-0.5 sm:pt-1">
            <span className="font-mono text-sm sm:text-lg font-black text-brand-goldDark">
              ৳{product.price}
            </span>
            {product.originalPrice && (
              <span className="font-mono text-[10px] sm:text-xs text-slate-400 line-through">
                ৳{product.originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* Color Swatches */}
        {product.colors && product.colors.length > 1 && (
          <div className="flex items-center gap-1.5 pt-0.5">
            <span className="text-[10px] text-slate-500 font-semibold mr-0.5">
              {lang === 'bn' ? 'কালার:' : 'Colors:'}
            </span>
            {product.colors.map((color, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveColorIdx(idx)}
                style={{ backgroundColor: color.hex }}
                className={`size-3.5 sm:size-4 rounded-full border transition-all ${
                  activeColorIdx === idx
                    ? 'border-brand-gold scale-125 ring-2 ring-brand-gold/40'
                    : 'border-slate-300 hover:scale-110'
                }`}
                title={lang === 'bn' ? color.nameBn : color.name}
              />
            ))}
          </div>
        )}

        {/* 3. Action Buttons - White, Black & Gold Mix */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 pt-2 border-t border-slate-100">
          {/* 1-Click Fast Buy Button (Liquid Gold) */}
          <button
            type="button"
            onClick={() => onOneClickOrder && onOneClickOrder(product, activeColor?.name)}
            className="btn-gold-primary w-full py-2 sm:py-2.5 px-1 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black flex items-center justify-center gap-1 active:scale-95 shadow-sm"
          >
            <Zap className="size-3 sm:size-3.5 fill-brand-noir stroke-brand-noir shrink-0" />
            <span className="whitespace-nowrap tracking-tight">{t('orderNow')}</span>
          </button>

          {/* Add to Cart Button (Signature Jet Black with Gold Rim) */}
          <button
            type="button"
            onClick={() => addToCart(product, 1, activeColor?.name)}
            className="btn-black-secondary w-full py-2 sm:py-2.5 px-1 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1 active:scale-95 shadow-sm"
          >
            <ShoppingBag className="size-3 sm:size-3.5 text-brand-gold shrink-0" />
            <span className="whitespace-nowrap tracking-tight">{t('addToCart')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
