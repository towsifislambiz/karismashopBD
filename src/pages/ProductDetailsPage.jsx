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

  // Reset image and selections when product ID changes
  React.useEffect(() => {
    if (product) {
      setSelectedImage(0);
      setSelectedColorIdx(0);
      setSelectedSize(product.sizes?.[0] || 'Free Size');
      setQuantity(1);
    }
  }, [id, product?.id]);

  if (!product) {
    return (
      <div className="py-24 text-center space-y-4 text-slate-900">
        <h2 className="text-2xl font-serif font-bold">পণ্যটি খুঁজে পাওয়া যায়নি!</h2>
        <Link to="/shop" className="btn-gold-primary px-5 py-2.5 rounded-xl font-bold text-xs inline-block">
          শপে ফিরে যান
        </Link>
      </div>
    );
  }

  const currentImages = product.images || (product.image ? [product.image] : ['/assets/brand/logo.webp']);
  const displayImage = currentImages[selectedImage] || currentImages[0] || '/assets/brand/logo.webp';
  const activeColor = product.colors?.[selectedColorIdx] || product.colors?.[0] || null;
  const isFav = isInWishlist(product.id);

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // When clicking a color swatch, update color AND switch main image to that color
  const handleColorSelect = (idx) => {
    setSelectedColorIdx(idx);
    const colorImg = product.colors?.[idx]?.image;
    if (colorImg) {
      const foundIdx = currentImages.indexOf(colorImg);
      if (foundIdx >= 0) {
        setSelectedImage(foundIdx);
      }
    }
  };

  // When clicking a thumbnail, update main image AND match color swatch if applicable
  const handleThumbnailClick = (idx) => {
    setSelectedImage(idx);
    const clickedImg = currentImages[idx];
    if (clickedImg && product.colors) {
      const matchIdx = product.colors.findIndex(c => c.image === clickedImg);
      if (matchIdx >= 0) {
        setSelectedColorIdx(matchIdx);
      }
    }
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link to="/" className="hover:text-brand-goldDark">{t('home')}</Link>
        <ChevronRight className="size-3.5" />
        <Link to={`/shop?category=${product.category}`} className="hover:text-brand-goldDark capitalize">
          {lang === 'bn' ? product.categoryBn : product.category}
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-slate-900 font-bold truncate max-w-xs">{lang === 'bn' ? product.nameBn : product.name}</span>
      </nav>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Image Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main Large Image Container */}
          <div className="relative aspect-[3/4] w-full rounded-3xl bg-white border border-brand-gold/30 p-3 sm:p-4 shadow-luxury-white overflow-hidden flex items-center justify-center">
            <img
              src={displayImage}
              alt={product.name}
              className="size-full object-contain hover:scale-105 transition-transform duration-500"
              decoding="async"
              fetchPriority="high"
            />

            {/* Badges (Gold Foil) */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
              {discountPercent > 0 && (
                <span className="badge-gold-foil font-black text-xs px-2.5 py-1 rounded-md shadow-md uppercase">
                  -{discountPercent}% {lang === 'bn' ? 'ছাড়' : 'OFF'}
                </span>
              )}
              {product.badge && (
                <span className="bg-brand-surface/95 border border-brand-gold/50 text-brand-gold font-bold text-xs px-2.5 py-1 rounded-md shadow-md backdrop-blur-md">
                  {lang === 'bn' ? product.badge : product.badgeEn}
                </span>
              )}
            </div>

            {/* Wishlist Button (Gold & Noir) */}
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 size-10 rounded-full flex items-center justify-center transition-all shadow-lg z-10 ${
                isFav
                  ? 'bg-brand-gold text-brand-noir shadow-gold-glow scale-110'
                  : 'bg-brand-noir/80 border border-brand-gold/30 text-slate-300 hover:text-brand-gold hover:border-brand-gold'
              }`}
            >
              <Heart className={`size-5 ${isFav ? 'fill-brand-noir' : ''}`} />
            </button>
          </div>

          {/* Thumbnails Row */}
          {currentImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {currentImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleThumbnailClick(idx)}
                  className={`size-16 sm:size-20 rounded-2xl p-1 bg-[#F8F9FA] border overflow-hidden shrink-0 transition-all ${
                    selectedImage === idx
                      ? 'border-brand-gold ring-2 ring-brand-gold/60 scale-105 shadow-md'
                      : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-400'
                  }`}
                >
                  <img src={img} alt="" className="size-full object-contain" loading="lazy" decoding="async" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Buy Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Header */}
          <div className="space-y-2 border-b border-slate-200 pb-5">
            <span className="text-xs font-bold text-brand-goldDark uppercase tracking-wider block font-sans">
              {lang === 'bn' ? product.categoryBn : product.category}
            </span>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900 leading-tight">
              {lang === 'bn' ? product.nameBn : product.name}
            </h1>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-3 text-xs pt-1">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-4 fill-amber-500" />
                ))}
              </div>
              <span className="font-bold text-slate-800">
                {product.rating} ({product.reviewsCount} {lang === 'bn' ? 'রিভিউ' : 'reviews'})
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <Check className="size-3.5" />
                <span>{lang === 'bn' ? 'ইন স্টক (স্টকে প্রস্তুত)' : 'In Stock'}</span>
              </span>
            </div>

            {/* Price Showcase */}
            <div className="flex items-baseline gap-3 pt-3">
              <span className="font-mono text-3xl sm:text-4xl font-black text-brand-goldDark">
                ৳{product.price}
              </span>
              {product.originalPrice && (
                <span className="font-mono text-base text-slate-400 line-through">
                  ৳{product.originalPrice}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-xs font-bold text-brand-goldDark bg-brand-gold/15 border border-brand-gold/40 px-2.5 py-0.5 rounded-md">
                  {lang === 'bn' ? `আপনি পাচ্ছেন ৳${product.originalPrice - product.price} ছাড়!` : `Save ৳${product.originalPrice - product.price}!`}
                </span>
              )}
            </div>

            {/* Scarcity Stock Urgency */}
            <div className="flex items-center gap-2 pt-1 text-xs">
              <span className="inline-block size-2 rounded-full bg-rose-500 animate-ping" />
              <span className="text-rose-600 font-bold">
                {lang === 'bn'
                  ? `🔥 আর মাত্র ${product.stockCount || 7}টি পণ্য স্টকে অবশিষ্ট আছে!`
                  : `🔥 Only ${product.stockCount || 7} items left in stock!`}
              </span>
            </div>
          </div>

          {/* Color Variants Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700">
                  {lang === 'bn' ? 'কালার বেছে নিন:' : 'Select Color:'}{' '}
                  <strong className="text-brand-goldDark font-bold">
                    {lang === 'bn' ? (activeColor?.nameBn || activeColor?.name) : (activeColor?.name || activeColor?.nameBn)}
                  </strong>
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.colors.map((c, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleColorSelect(idx)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      selectedColorIdx === idx
                        ? 'border-brand-gold bg-amber-50 text-slate-900 ring-2 ring-brand-gold/40 shadow-sm'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-brand-gold'
                    }`}
                  >
                    <span
                      className="size-3.5 rounded-full border border-black/30 shadow-xs"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{lang === 'bn' ? (c.nameBn || c.name) : (c.name || c.nameBn)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Variants Selection & Size Guide */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">
                  {lang === 'bn' ? 'সাইজ বেছে নিন:' : 'Select Size:'}{' '}
                  <strong className="text-brand-goldDark font-bold">{selectedSize}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setIsSizeChartOpen(true)}
                  className="text-brand-goldDark hover:underline flex items-center gap-1 font-bold"
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
                        ? 'border-brand-gold bg-slate-900 text-brand-gold shadow-sm'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-brand-gold'
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
            <span className="text-xs font-bold text-slate-700 block">
              {lang === 'bn' ? 'পরিমাণ:' : 'Quantity:'}
            </span>
            <div className="flex items-center border border-slate-200 rounded-xl bg-white w-fit text-sm font-mono shadow-sm">
              <button
                type="button"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="px-3.5 py-2 text-slate-500 hover:text-brand-goldDark font-bold text-base"
              >
                -
              </button>
              <span className="px-4 font-bold text-slate-900">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(q => q + 1)}
                className="px-3.5 py-2 text-slate-500 hover:text-brand-goldDark font-bold text-base"
              >
                +
              </button>
            </div>
          </div>

          {/* Primary Action Buttons: 1-Click Order & Add to Cart */}
          <div className="space-y-3 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* 1-Click Fast Buy Button (Signature Liquid Gold) */}
              <button
                type="button"
                onClick={() => setIsOrderModalOpen(true)}
                className="btn-gold-primary py-4 px-6 rounded-2xl text-sm font-black tracking-wide flex items-center justify-center gap-2.5 shadow-md"
              >
                <Zap className="size-5 fill-brand-noir stroke-brand-noir" />
                <span>{lang === 'bn' ? 'সরাসরি অর্ডার করুন (১-ক্লিক)' : 'Buy Now (1-Click)'}</span>
              </button>

              {/* Add to Cart Button (Signature Jet Black with Gold Rim) */}
              <button
                type="button"
                onClick={() => addToCart(product, quantity, activeColor?.name, selectedSize)}
                className="btn-black-secondary py-4 px-6 rounded-2xl text-sm font-bold tracking-wide flex items-center justify-center gap-2.5 shadow-md"
              >
                <ShoppingBag className="size-5 text-brand-gold" />
                <span>{t('addToCart')}</span>
              </button>
            </div>

            {/* Direct WhatsApp Order Button */}
            <a
              href={`https://wa.me/88${(settings?.whatsappNumber || '01965643684').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`আসসালামু আলাইকুম KARISHMASHOPBD, আমি এই পণ্যটি সরাসরি অর্ডার করতে চাচ্ছি:\n\nপণ্য: ${product.nameBn || product.name}\nমূল্য: ৳${product.price}\nকালার: ${activeColor?.nameBn || activeColor?.name || 'Standard'}\nসাইজ: ${selectedSize}\nপরিমাণ: ${quantity} টি\n\nঅনুগ্রহ করে কনফার্ম করুন। ধন্যবাদ!`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
            >
              <MessageCircle className="size-4.5 fill-white" />
              <span>{lang === 'bn' ? 'হোয়াটসঅ্যাপে সরাসরি কথা বলুন ও অর্ডার করুন' : 'Order via WhatsApp directly'}</span>
            </a>
          </div>

          {/* Trust Guarantees (White Card) */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs shadow-sm">
            <div className="flex items-center gap-2 text-slate-700">
              <Truck className="size-4 text-brand-goldDark shrink-0" />
              <span>{lang === 'bn' ? 'সারা দেশে হোম ডেলিভারি' : 'Nationwide COD'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
              <span>{lang === 'bn' ? '১০০% অরিজিনাল কোয়ালিটি' : 'Original Fabric'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <RefreshCw className="size-4 text-amber-500 shrink-0" />
              <span>{lang === 'bn' ? '৭ দিনের সহজ এক্সচেঞ্জ' : '7-Day Exchange'}</span>
            </div>
          </div>

          {/* Details Accordion / Tabs (White & Gold) */}
          <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-sm">
            <div className="flex border-b border-slate-200 text-xs font-bold divide-x divide-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab('fabric')}
                className={`flex-1 py-3 text-center transition ${activeTab === 'fabric' ? 'bg-slate-50 text-brand-goldDark border-b-2 border-brand-gold font-black' : 'text-slate-500 hover:text-slate-900'}`}
              >
                {t('fabricDetails')}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('delivery')}
                className={`flex-1 py-3 text-center transition ${activeTab === 'delivery' ? 'bg-slate-50 text-brand-goldDark border-b-2 border-brand-gold font-black' : 'text-slate-500 hover:text-slate-900'}`}
              >
                {t('deliveryReturn')}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('reviews')}
                className={`flex-1 py-3 text-center transition ${activeTab === 'reviews' ? 'bg-slate-50 text-brand-goldDark border-b-2 border-brand-gold font-black' : 'text-slate-500 hover:text-slate-900'}`}
              >
                {t('reviews')} ({product.reviewsCount})
              </button>
            </div>

            <div className="p-4 sm:p-5 text-xs text-slate-700 leading-relaxed space-y-3">
              {activeTab === 'fabric' && (
                <>
                  <p className="font-semibold text-slate-900">
                    {lang === 'bn' ? product.descriptionBn : product.description}
                  </p>
                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    <p><strong className="text-brand-goldDark">ফেব্রিক / উপাদান:</strong> {lang === 'bn' ? product.fabricBn : product.fabric}</p>
                    <p><strong className="text-brand-goldDark">ধরণের নাম:</strong> {product.category.toUpperCase()}</p>
                    <p><strong className="text-brand-goldDark">উপলব্ধ সাইজ:</strong> {product.sizes ? product.sizes.join(', ') : 'Free Size'}</p>
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
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">নুসরাত পারভীন</span>
                      <div className="flex text-amber-500"><Star className="size-3 fill-amber-500" /><Star className="size-3 fill-amber-500" /><Star className="size-3 fill-amber-500" /><Star className="size-3 fill-amber-500" /><Star className="size-3 fill-amber-500" /></div>
                    </div>
                    <p className="text-slate-600 text-[11px]">"কাপড়ের মান এবং ফিনিশিং অসাধারণ! ছবিতে যেমন দেখেছি হুবহু সেরকম পেয়েছি। ধন্যবাদ কারিশমা শপকে।"</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">সাদিয়া রহমান</span>
                      <div className="flex text-amber-500"><Star className="size-3 fill-amber-500" /><Star className="size-3 fill-amber-500" /><Star className="size-3 fill-amber-500" /><Star className="size-3 fill-amber-500" /><Star className="size-3 fill-amber-500" /></div>
                    </div>
                    <p className="text-slate-600 text-[11px]">"ব্যাগটার লুকস আড়ংয়ের চেয়েও প্রিমিয়াম লেগেছে। চেইন ও ম্যাটেরিয়াল কোয়ালিটি খুব হেভি।"</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-8 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
              {t('relatedProducts')}
            </h3>
            <Link to={`/shop?category=${product.category}`} className="text-xs font-bold text-brand-goldDark hover:underline">
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
