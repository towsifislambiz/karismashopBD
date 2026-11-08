import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Flame, ShieldCheck, Star, ShoppingBag, Zap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useProducts } from '../context/ProductContext';
import HeroSlider from '../components/HeroSlider';
import CategoryGrid from '../components/CategoryGrid';
import ProductCard from '../components/ProductCard';
import OneClickOrderModal from '../components/OneClickOrderModal';

export default function HomePage() {
  const { lang, t } = useLanguage();
  const { products } = useProducts();

  const [modalProduct, setModalProduct] = useState(null);
  const [modalColor, setModalColor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenOneClick = (product, color = null) => {
    setModalProduct(product);
    setModalColor(color);
    setIsModalOpen(true);
  };

  // Filter products
  const flashSaleProducts = products.filter(p => p.isFlashSale).slice(0, 4);
  const threePieceProducts = products.filter(p => p.category === 'three-piece').slice(0, 4);
  const handbagProducts = products.filter(p => p.category === 'handbags').slice(0, 4);
  const abayaProducts = products.filter(p => p.category === 'abaya').slice(0, 8);

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* 1. Hero Carousel Slider */}
      <HeroSlider />

      {/* 2. Visual Category Showcase */}
      <CategoryGrid />

      {/* 3. Flash Sale / Hot Deals Section (Pure Royal Gold & Noir) */}
      {flashSaleProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#141622] via-[#090A0F] to-[#181B26] border border-brand-gold/40 shadow-luxury-noir space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold/15 border border-brand-gold/40 text-brand-gold text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="size-4 text-brand-gold animate-pulse" />
                  <span>{lang === 'bn' ? 'সীমিত সময়ের স্পেশাল অফার' : 'LIMITED TIME DEALS'}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  ✦ {lang === 'bn' ? 'আজকের ধামাকা ফ্ল্যাশ সেল' : 'Today\'s Exclusive Flash Sale'}
                </h2>
              </div>

              <Link
                to="/shop?filter=flash"
                className="btn-noir-secondary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-sm"
              >
                <span>{lang === 'bn' ? 'সকল অফার দেখুন' : 'View All Deals'}</span>
                <ArrowRight className="size-4 text-brand-gold" />
              </Link>
            </div>

            {/* Flash Sale Product Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {flashSaleProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOneClickOrder={handleOpenOneClick}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Featured Three-Piece Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold text-brand-goldDark uppercase tracking-wider block mb-1 font-sans">
              👗 {lang === 'bn' ? 'বুটিক কালেকশন' : 'PREMIUM FESTIVE'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              {lang === 'bn' ? 'আল-চিস্তি এক্সক্লুসিভ থ্রি-পিস' : 'Exclusive Three-Piece Collection'}
            </h2>
          </div>
          <Link
            to="/shop?category=three-piece"
            className="text-xs sm:text-sm font-bold text-brand-goldDark hover:text-slate-900 transition flex items-center gap-1"
          >
            <span>{lang === 'bn' ? 'সব থ্রি-পিস দেখুন' : 'See All Three-Piece'}</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {threePieceProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onOneClickOrder={handleOpenOneClick}
            />
          ))}
        </div>
      </section>

      {/* 5. Special Luxury Handbags Banner & Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Handbag Feature Banner (Royal Velvet Noir & Imperial Gold) */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#12141D] via-[#090A0F] to-[#181B26] border border-brand-gold/40 p-6 sm:p-10 shadow-luxury-noir">
          {/* Subtle gold ambient glow in the corner */}
          <div className="absolute top-0 right-1/3 size-72 rounded-full bg-brand-gold/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 size-60 rounded-full bg-brand-goldDark/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-3 sm:space-y-4">
              <span className="px-3.5 py-1.5 rounded-full bg-brand-gold/15 text-brand-gold text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 border border-brand-gold/40 shadow-xs">
                <span>👜</span>
                <span>{lang === 'bn' ? 'ডিজাইনার হ্যান্ডব্যাগ কালেকশন' : 'LUXURY HANDBAGS'}</span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white leading-tight">
                {lang === 'bn' ? (
                  <>ফ্লোরাল চার্ম টোট ব্যাগ — <span className="text-gold-gradient">৫টি আকর্ষণীয় কালার</span></>
                ) : (
                  <>Sculpted Floral Totes — <span className="text-gold-gradient">Available in 5 Colors</span></>
                )}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed font-sans">
                {lang === 'bn'
                  ? 'স্মার্ট অফিস, পার্টি কিংবা ক্যাজুয়াল যেকোনো আউটফিটের সাথে শতভাগ মানানসই। ওয়াটারপ্রুফ প্রিমিয়াম লেদার ও ক্লাসিক লুক।'
                  : 'Artisanal vegan leather with radiant gold hardware and signature blossom tassels. Triple-compartment interior for effortless styling.'}
              </p>
              <div className="pt-2">
                <Link
                  to="/shop?category=handbags"
                  className="btn-gold-primary inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-xs sm:text-sm font-black tracking-wide shadow-gold-glow hover:scale-105 transition-all"
                >
                  <ShoppingBag className="size-4 stroke-[2.2]" />
                  <span>{lang === 'bn' ? 'ব্যাগ কালেকশন কিনুন' : 'Shop Handbags Now'}</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative rounded-2xl p-2 bg-[#12141D] border border-brand-gold/40 shadow-2xl group">
                <img
                  src="/assets/products/hero_handbag_collection_podium.png"
                  alt="Handbag Collection"
                  className="w-full max-w-sm rounded-xl object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Handbags Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {handbagProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onOneClickOrder={handleOpenOneClick}
            />
          ))}
        </div>
      </section>

      {/* 6. Dubai Abaya & Borka Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold text-brand-goldDark uppercase tracking-wider block mb-1 font-sans">
              🧕 {lang === 'bn' ? 'দুবাই মডেস্ট ফ্যাশন' : 'DUBAI MODEST WEAR'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              {lang === 'bn' ? 'দুবাই স্টোন ও এমব্রয়ডারি বোরকা' : 'Dubai Abaya & Modest Wear'}
            </h2>
          </div>
          <Link
            to="/shop?category=abaya"
            className="text-xs sm:text-sm font-bold text-brand-goldDark hover:text-slate-900 transition flex items-center gap-1"
          >
            <span>{lang === 'bn' ? 'সকল আবায়া কালেকশন' : 'See All Abaya'}</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {abayaProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onOneClickOrder={handleOpenOneClick}
            />
          ))}
        </div>
      </section>

      {/* 7. 1-Click Fast Order Modal */}
      <OneClickOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={modalProduct}
        initialColor={modalColor}
      />
    </div>
  );
}
