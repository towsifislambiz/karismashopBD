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
  const currentImage = activeColor?.image || product.images?.[0] || '/assets/brand/logo.png';
  const isFav = isInWishlist(product.id);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      className="group flex flex-col rounded-3xl bg-brand-surface border border-brand-border hover:border-brand-gold/60 transition-all duration-500 hover:-translate-y-1.5 shadow-luxury hover:shadow-gold-soft overflow-hidden"
    >
      {/* 1. Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-brand-noir flex items-center justify-center">
        <Link to={`/product/${product.id}`} className="size-full flex items-center justify-center p-2.5 overflow-hidden">
          <img
            src={currentImage}
            alt={product.name}
            className="size-full object-contain transition-transform duration-700 ease-out group-hover:scale-110 select-none"
            loading="lazy"
          />
        </Link>

        {/* Subtle luxury vignette & overlay on hover */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-noir/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Top Badges: Discount & Status */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {discountPercent > 0 && (
            <span className="bg-rose-600 text-white text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-md shadow uppercase tracking-wider">
              -{discountPercent}%
            </span>
          )}
          {product.badge && (
            <span className="bg-brand-surface/90 border border-brand-gold/40 text-brand-gold text-[10px] font-bold px-2 py-0.5 rounded-md shadow backdrop-blur-sm">
              {lang === 'bn' ? product.badge : product.badgeEn}
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          className={`absolute top-2.5 right-2.5 size-8 rounded-full flex items-center justify-center transition shadow-md z-10 ${
            isFav
              ? 'bg-rose-500 text-white'
              : 'bg-brand-noir/80 text-slate-300 hover:text-rose-400 hover:bg-brand-noir'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`size-4 ${isFav ? 'fill-white' : ''}`} />
        </button>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-center justify-center gap-2">
          <Link
            to={`/product/${product.id}`}
            className="w-full py-2 rounded-xl bg-brand-noir/90 backdrop-blur-md border border-brand-gold/40 text-brand-gold text-xs font-bold hover:bg-brand-gold hover:text-brand-noir transition flex items-center justify-center gap-1.5 shadow-lg"
          >
            <Eye className="size-3.5" />
            <span>{t('quickView')}</span>
          </Link>
        </div>
      </div>

      {/* 2. Product Information */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Category Tag */}
          <span className="text-[10px] font-bold text-amber-400/80 uppercase tracking-wider block">
            {lang === 'bn' ? product.categoryBn : product.category}
          </span>

          {/* Title */}
          <Link to={`/product/${product.id}`}>
            <h3 className="font-serif text-sm sm:text-base font-bold text-slate-100 hover:text-brand-gold transition line-clamp-2 leading-snug">
              {lang === 'bn' ? product.nameBn : product.name}
            </h3>
          </Link>

          {/* Price */}
          <div className="flex items-baseline gap-2 pt-1">
            <span className="font-mono text-base sm:text-lg font-black text-brand-gold">
              ৳{product.price}
            </span>
            {product.originalPrice && (
              <span className="font-mono text-xs text-slate-500 line-through">
                ৳{product.originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* Color Swatches */}
        {product.colors && product.colors.length > 1 && (
          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-[10px] text-slate-400 font-semibold mr-1">
              {lang === 'bn' ? 'কালার:' : 'Colors:'}
            </span>
            {product.colors.map((color, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveColorIdx(idx)}
                style={{ backgroundColor: color.hex }}
                className={`size-4 rounded-full border transition-all ${
                  activeColorIdx === idx
                    ? 'border-brand-gold scale-125 ring-2 ring-brand-gold/30'
                    : 'border-slate-700 hover:scale-110'
                }`}
                title={lang === 'bn' ? color.nameBn : color.name}
              />
            ))}
          </div>
        )}

        {/* 3. Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-brand-border/60">
          {/* 1-Click Fast Buy Button */}
          <button
            type="button"
            onClick={() => onOneClickOrder && onOneClickOrder(product, activeColor?.name)}
            className="w-full py-2 px-1.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-goldDark text-brand-noir font-black text-[11px] sm:text-xs shadow-gold-glow hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-1"
          >
            <Zap className="size-3.5 fill-brand-noir" />
            <span className="truncate">{t('orderNow')}</span>
          </button>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={() => addToCart(product, 1, activeColor?.name)}
            className="w-full py-2 px-1.5 rounded-xl bg-brand-card hover:bg-brand-surface border border-brand-border hover:border-brand-gold/40 text-slate-200 text-[11px] sm:text-xs font-bold transition flex items-center justify-center gap-1 active:scale-95"
          >
            <ShoppingBag className="size-3.5" />
            <span className="truncate">{t('addToCart')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
