import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  RefreshCw,
  Heart,
  Share2,
  Sparkles,
  Ruler,
  Check,
  ChevronRight,
  MessageCircle,
  X
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useStoreSettings } from '../context/StoreSettingsContext';
import OneClickOrderModal from '../components/OneClickOrderModal';
import ProductCard from '../components/ProductCard';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { lang, t } = useLanguage();
  const { getProductById, products } = useProducts();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { settings } = useStoreSettings();

  const product = getProductById(id);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'Free Size');
  const [quantity, setQuantity] = useState(1);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('fabric'); // 'fabric' | 'delivery' | 'reviews'

  if (!product) {
    return (
      <div className="py-24 text-center space-y-4 text-slate-100">
        <h2 className="text-2xl font-serif font-bold">পণ্যটি খুঁজে পাওয়া যায়নি!</h2>
        <Link to="/shop" className="px-5 py-2.5 rounded-xl bg-brand-gold text-brand-noir font-bold text-xs inline-block">
          শপে ফিরে যান
        </Link>
      </div>
    );
  }

  const activeColor = product.colors?.[selectedColorIdx] || null;
  const currentImages = product.images || ['/assets/brand/logo.png'];
  const displayImage = activeColor?.image || currentImages[selectedImage] || currentImages[0];
  const isFav = isInWishlist(product.id);

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleColorSelect = (idx) => {
    setSelectedColorIdx(idx);
    if (product.colors?.[idx]?.image) {
      // Find matching index in images or fallback
      const foundIdx = currentImages.indexOf(product.colors[idx].image);
      if (foundIdx >= 0) setSelectedImage(foundIdx);
    }
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <Link to="/" className="hover:text-brand-gold">{t('home')}</Link>
        <ChevronRight className="size-3.5" />
        <Link to={`/shop?category=${product.category}`} className="hover:text-brand-gold capitalize">
          {lang === 'bn' ? product.categoryBn : product.category}
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-slate-200 truncate max-w-xs">{lang === 'bn' ? product.nameBn : product.name}</span>
      </nav>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Image Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main Large Image Container */}
          <div className="relative aspect-[3/4] w-full rounded-3xl bg-brand-surface border border-brand-gold/30 p-3 sm:p-4 shadow-luxury overflow-hidden flex items-center justify-center">
            <img
              src={displayImage}
              alt={product.name}
              className="size-full object-contain hover:scale-105 transition-transform duration-500"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              {discountPercent > 0 && (
                <span className="bg-rose-600 text-white font-black text-xs px-2.5 py-1 rounded-md shadow-md uppercase">
                  -{discountPercent}% {lang === 'bn' ? 'ছাড়' : 'OFF'}
                </span>
              )}
              {product.badge && (
                <span className="bg-brand-surface/90 border border-brand-gold/40 text-brand-gold font-bold text-xs px-2.5 py-1 rounded-md shadow-md backdrop-blur-sm">
                  {lang === 'bn' ? product.badge : product.badgeEn}
                </span>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 size-10 rounded-full flex items-center justify-center transition shadow-lg ${
                isFav
                  ? 'bg-rose-500 text-white'
                  : 'bg-brand-noir/80 text-slate-300 hover:text-rose-400 hover:bg-brand-noir'
              }`}
            >
              <Heart className={`size-5 ${isFav ? 'fill-white' : ''}`} />
            </button>
          </div>

          {/* Thumbnails Row */}
          {currentImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {currentImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedImage(idx);
                    // clear color match override if clicked manual thumbnail
                  }}
                  className={`size-16 sm:size-20 rounded-2xl p-1 bg-brand-surface border overflow-hidden shrink-0 transition ${
                    selectedImage === idx
                      ? 'border-brand-gold ring-2 ring-brand-gold/40 scale-105'
                      : 'border-brand-border opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="size-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Buy Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Header */}
          <div className="space-y-2 border-b border-brand-border pb-5">
            <span className="text-xs font-bold text-brand-gold uppercase tracking-wider block">
              {lang === 'bn' ? product.categoryBn : product.category}
            </span>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white leading-tight">
              {lang === 'bn' ? product.nameBn : product.name}
            </h1>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-3 text-xs pt-1">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-4 fill-amber-400" />
                ))}
              </div>
              <span className="font-bold text-slate-200">
                {product.rating} ({product.reviewsCount} {lang === 'bn' ? 'রিভিউ' : 'reviews'})
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Check className="size-3.5" />
                <span>{lang === 'bn' ? 'ইন স্টক (স্টকে প্রস্তুত)' : 'In Stock'}</span>
              </span>
            </div>

            {/* Price Showcase */}
            <div className="flex items-baseline gap-3 pt-3">
              <span className="font-mono text-3xl sm:text-4xl font-black text-brand-gold">
                ৳{product.price}
              </span>
              {product.originalPrice && (
                <span className="font-mono text-base text-slate-500 line-through">
                  ৳{product.originalPrice}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded-md">
                  {lang === 'bn' ? `আপনি পাচ্ছেন ৳${product.originalPrice - product.price} ছাড়!` : `Save ৳${product.originalPrice - product.price}!`}
                </span>
              )}
            </div>
          </div>

          {/* Color Variants Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-300">
                  {lang === 'bn' ? 'কালার বেছে নিন:' : 'Select Color:'}{' '}
                  <strong className="text-brand-gold font-normal">
                    {lang === 'bn' ? activeColor?.nameBn : activeColor?.name}
                  </strong>
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.colors.map((c, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleColorSelect(idx)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
                      selectedColorIdx === idx
                        ? 'border-brand-gold bg-brand-gold/15 text-brand-gold ring-1 ring-brand-gold/40'
                        : 'border-brand-border bg-brand-surface text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <span
                      className="size-3.5 rounded-full border border-black/40"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{lang === 'bn' ? c.nameBn : c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Variants Selection & Size Guide */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">
                  {lang === 'bn' ? 'সাইজ বেছে নিন:' : 'Select Size:'}{' '}
                  <strong className="text-brand-gold font-normal">{selectedSize}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setIsSizeChartOpen(true)}
                  className="text-brand-gold hover:underline flex items-center gap-1 font-bold"
                >
                  <Ruler className="size-3.5" />
                  <span>{t('sizeGuide')}</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                      selectedSize === s
                        ? 'border-brand-gold bg-brand-gold text-brand-noir shadow-gold-soft'
                        : 'border-brand-border bg-brand-surface text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-slate-300 block">
              {lang === 'bn' ? 'পরিমাণ:' : 'Quantity:'}
            </span>
            <div className="flex items-center border border-brand-border rounded-xl bg-brand-surface w-fit text-sm font-mono">
              <button
                type="button"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="px-3.5 py-2 text-slate-400 hover:text-brand-gold font-bold text-base"
              >
                -
              </button>
              <span className="px-4 font-bold text-white">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(q => q + 1)}
                className="px-3.5 py-2 text-slate-400 hover:text-brand-gold font-bold text-base"
              >
                +
              </button>
            </div>
          </div>

          {/* Primary Action Buttons: 1-Click Order & Add to Cart */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4">
            {/* 1-Click Fast Buy Button */}
            <button
              type="button"
              onClick={() => setIsOrderModalOpen(true)}
              className="py-4 px-6 rounded-2xl bg-gradient-to-r from-brand-gold via-brand-goldLight to-brand-goldDark text-brand-noir font-black text-sm tracking-wide shadow-gold-glow hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
            >
              <Zap className="size-5 fill-brand-noir" />
              <span>{lang === 'bn' ? 'সরাসরি অর্ডার করুন (১-ক্লিক)' : 'Buy Now (1-Click)'}</span>
            </button>

            {/* Add to Cart Button */}
            <button
              type="button"
              onClick={() => addToCart(product, quantity, activeColor?.name, selectedSize)}
              className="py-4 px-6 rounded-2xl bg-brand-surface border border-brand-gold/60 hover:border-brand-gold text-brand-gold font-bold text-sm tracking-wide hover:bg-brand-card active:scale-95 transition flex items-center justify-center gap-2"
            >
              <ShoppingBag className="size-5" />
              <span>{t('addToCart')}</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="p-4 rounded-2xl bg-brand-surface border border-brand-border grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Truck className="size-4 text-brand-gold shrink-0" />
              <span>{lang === 'bn' ? 'সারা দেশে হোম ডেলিভারি' : 'Nationwide COD'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="size-4 text-emerald-400 shrink-0" />
              <span>{lang === 'bn' ? '১০০% অরিজিনাল কোয়ালিটি' : 'Original Fabric'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <RefreshCw className="size-4 text-amber-400 shrink-0" />
              <span>{lang === 'bn' ? '৭ দিনের সহজ এক্সচেঞ্জ' : '7-Day Exchange'}</span>
            </div>
          </div>

          {/* Details Accordion / Tabs */}
          <div className="border border-brand-border rounded-2xl bg-brand-surface overflow-hidden">
            <div className="flex border-b border-brand-border text-xs font-bold divide-x divide-brand-border">
              <button
                type="button"
                onClick={() => setActiveTab('fabric')}
                className={`flex-1 py-3 text-center transition ${activeTab === 'fabric' ? 'bg-brand-gold/15 text-brand-gold border-b-2 border-brand-gold' : 'text-slate-400 hover:text-white'}`}
              >
                {t('fabricDetails')}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('delivery')}
                className={`flex-1 py-3 text-center transition ${activeTab === 'delivery' ? 'bg-brand-gold/15 text-brand-gold border-b-2 border-brand-gold' : 'text-slate-400 hover:text-white'}`}
              >
                {t('deliveryReturn')}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('reviews')}
                className={`flex-1 py-3 text-center transition ${activeTab === 'reviews' ? 'bg-brand-gold/15 text-brand-gold border-b-2 border-brand-gold' : 'text-slate-400 hover:text-white'}`}
              >
                {t('reviews')} ({product.reviewsCount})
              </button>
            </div>

            <div className="p-4 sm:p-5 text-xs text-slate-300 leading-relaxed space-y-3">
              {activeTab === 'fabric' && (
                <>
                  <p className="font-semibold text-white">
                    {lang === 'bn' ? product.descriptionBn : product.description}
                  </p>
                  <div className="pt-2 border-t border-brand-border/60 space-y-1">
                    <p><strong className="text-brand-gold">ফেব্রিক / উপাদান:</strong> {lang === 'bn' ? product.fabricBn : product.fabric}</p>
                    <p><strong className="text-brand-gold">ধরণের নাম:</strong> {product.category.toUpperCase()}</p>
                    <p><strong className="text-brand-gold">উপলব্ধ সাইজ:</strong> {product.sizes ? product.sizes.join(', ') : 'Free Size'}</p>
                  </div>
                </>
              )}

              {activeTab === 'delivery' && (
                <div className="space-y-2">
                  <p><strong>ডেলিভারি সময়:</strong> ঢাকা সিটির ভেতরে ১-২ দিন, ঢাকার বাইরে ২-৩ কার্যদিবসের মধ্যে ডেলিভারি সম্পন্ন হয়।</p>
                  <p><strong>ডেলিভারি চার্জ:</strong> ঢাকা সিটিতে ৳৮০, ঢাকার বাইরে ৳১৫০। ৩,৫০০ টাকার অর্ডারে সম্পূর্ণ ফ্রি ডেলিভারি!</p>
                  <p><strong>রিটার্ন ও এক্সচেঞ্জ:</strong> কোনো সাইজ সমস্যা হলে কিংবা ত্রুটিপূর্ণ থাকলে পণ্য পাওয়ার ৭ দিনের মধ্যে কল বা হোয়াটসঅ্যাপ করে সহজে এক্সচেঞ্জ করা যাবে।</p>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-brand-card/80 border border-brand-border space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">নুসরাত পারভীন</span>
                      <div className="flex text-amber-400"><Star className="size-3 fill-amber-400" /><Star className="size-3 fill-amber-400" /><Star className="size-3 fill-amber-400" /><Star className="size-3 fill-amber-400" /><Star className="size-3 fill-amber-400" /></div>
                    </div>
                    <p className="text-slate-300 text-[11px]">"কাপড়ের মান এবং ফিনিশিং অসাধারণ! ছবিতে যেমন দেখেছি হুবহু সেরকম পেয়েছি। ধন্যবাদ কারিশমা শপকে।"</p>
                  </div>
                  <div className="p-3 rounded-xl bg-brand-card/80 border border-brand-border space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">সাদিয়া রহমান</span>
                      <div className="flex text-amber-400"><Star className="size-3 fill-amber-400" /><Star className="size-3 fill-amber-400" /><Star className="size-3 fill-amber-400" /><Star className="size-3 fill-amber-400" /><Star className="size-3 fill-amber-400" /></div>
                    </div>
                    <p className="text-slate-300 text-[11px]">"ব্যাগটার লুকস আড়ংয়ের চেয়েও প্রিমিয়াম লেগেছে। চেইন ও ম্যাটেরিয়াল কোয়ালিটি খুব হেভি।"</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-8 border-t border-brand-border">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
              {t('relatedProducts')}
            </h3>
            <Link to={`/shop?category=${product.category}`} className="text-xs font-bold text-brand-gold hover:underline">
              {lang === 'bn' ? 'সব দেখুন →' : 'See all →'}
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onOneClickOrder={(prod, col) => {
                  setSelectedSize(prod.sizes?.[0] || 'Free Size');
                  setIsOrderModalOpen(true);
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Interactive Size Chart Modal */}
      {isSizeChartOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-brand-surface border border-brand-gold/40 rounded-3xl p-6 shadow-2xl text-slate-100 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border">
              <div className="flex items-center gap-2">
                <Ruler className="size-5 text-brand-gold" />
                <h3 className="font-serif text-lg font-bold text-white">
                  {lang === 'bn' ? 'কারিশমা শপ সাইজ গাইড' : 'Karishma Shop Size Guide'}
                </h3>
              </div>
              <button
                onClick={() => setIsSizeChartOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse border border-brand-border">
                <thead>
                  <tr className="bg-brand-card text-brand-gold font-bold">
                    <th className="p-2 border border-brand-border">সাইজ (Size)</th>
                    <th className="p-2 border border-brand-border">বুকের মাপ (Chest)</th>
                    <th className="p-2 border border-brand-border">ঝুল / লম্বা (Length)</th>
                    <th className="p-2 border border-brand-border">হাতা (Sleeve)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border text-slate-300">
                  <tr>
                    <td className="p-2 font-bold text-white">S (Small)</td>
                    <td className="p-2">৩৬ ইঞ্চি</td>
                    <td className="p-2">৪২ - ৪৪ ইঞ্চি</td>
                    <td className="p-2">২০ ইঞ্চি</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-white">M (Medium)</td>
                    <td className="p-2">৩৮ ইঞ্চি</td>
                    <td className="p-2">৪৪ - ৪৬ ইঞ্চি</td>
                    <td className="p-2">২১ ইঞ্চি</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-white">L (Large)</td>
                    <td className="p-2">৪০ ইঞ্চি</td>
                    <td className="p-2">৪৬ - ৪৮ ইঞ্চি</td>
                    <td className="p-2">২১.৫ ইঞ্চি</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-white">XL (X-Large)</td>
                    <td className="p-2">৪২ ইঞ্চি</td>
                    <td className="p-2">৪৮ - ৫০ ইঞ্চি</td>
                    <td className="p-2">২২ ইঞ্চি</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-white">XXL (Double XL)</td>
                    <td className="p-2">৪৪ ইঞ্চি</td>
                    <td className="p-2">৫০ ইঞ্চি</td>
                    <td className="p-2">২২.৫ ইঞ্চি</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-slate-400">
              * আপনার উচ্চতা বা বডি মেজারমেন্টে কোনো সংশয় থাকলে সরাসরি আমাদের হোয়াটসঅ্যাপে যোগাযোগ করে পরামর্শ নিতে পারেন।
            </p>

            <button
              onClick={() => setIsSizeChartOpen(false)}
              className="w-full py-2.5 rounded-xl bg-brand-gold text-brand-noir font-bold text-xs"
            >
              ঠিক আছে
            </button>
          </div>
        </div>
      )}

      {/* 1-Click Fast Order Modal */}
      <OneClickOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        product={product}
        initialColor={activeColor?.name}
      />
    </div>
  );
}
