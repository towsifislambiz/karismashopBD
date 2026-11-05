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
  const abayaProducts = products.filter(p => p.category === 'abaya').slice(0, 4);

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* 1. Hero Carousel Slider */}
      <HeroSlider />

      {/* 2. Visual Category Showcase */}
      <CategoryGrid />

      {/* 3. Flash Sale / Hot Deals Section */}
      {flashSaleProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-rose-950/60 via-brand-surface to-brand-noir border border-rose-500/30 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold uppercase tracking-wider">
                  <Flame className="size-4 text-rose-500 animate-pulse" />
                  <span>{lang === 'bn' ? 'সীমিত সময়ের স্পেশাল অফার' : 'LIMITED TIME DEALS'}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  {lang === 'bn' ? '🔥 আজকের ধামাকা ফ্ল্যাশ সেল' : '🔥 Today\'s Exclusive Flash Sale'}
                </h2>
              </div>

              <Link
                to="/shop?filter=flash"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-rose-300 hover:text-white transition"
              >
                <span>{lang === 'bn' ? 'সকল অফার দেখুন' : 'View All Deals'}</span>
                <ArrowRight className="size-4" />
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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-brand-border pb-4">
          <div>
            <span className="text-xs font-bold text-brand-gold uppercase tracking-wider block mb-1">
              👗 {lang === 'bn' ? 'বুটিক কালেকশন' : 'PREMIUM FESTIVE'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              {lang === 'bn' ? 'আল-চিস্তি এক্সক্লুসিভ থ্রি-পিস' : 'Exclusive Three-Piece Collection'}
            </h2>
          </div>
          <Link
            to="/shop?category=three-piece"
            className="text-xs sm:text-sm font-bold text-brand-gold hover:text-brand-goldLight transition flex items-center gap-1"
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
        {/* Handbag Feature Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-surface via-brand-card to-brand-noir border border-brand-gold/40 p-6 sm:p-10 shadow-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-3 sm:space-y-4">
              <span className="px-3 py-1 rounded-full bg-brand-gold/20 text-brand-gold text-[11px] font-bold uppercase tracking-wider inline-block border border-brand-gold/40">
                👜 {lang === 'bn' ? 'ডিজাইনার হ্যান্ডব্যাগ কালেকশন' : 'LUXURY HANDBAGS'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white leading-tight">
                {lang === 'bn' ? (
                  <>ফ্লোরাল চার্ম টোট ব্যাগ — <span className="text-gold-gradient">৫টি আকর্ষণীয় কালার</span></>
                ) : (
                  <>Sculpted Floral Totes — <span className="text-gold-gradient">Available in 5 Colors</span></>
                )}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
                {lang === 'bn'
                  ? 'স্মার্ট অফিস, পার্টি কিংবা ক্যাজুয়াল যেকোনো আউটফিটের সাথে শতভাগ মানানসই। ওয়াটারপ্রুফ প্রিমিয়াম লেদার ও ক্লাসিক লুক।'
                  : 'Artisanal vegan leather with radiant gold hardware and signature blossom tassels. Triple-compartment interior for effortless styling.'}
              </p>
              <div className="pt-2">
                <Link
                  to="/shop?category=handbags"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-gold to-brand-goldDark text-brand-noir font-black text-xs sm:text-sm shadow-gold-glow hover:brightness-110 transition"
                >
                  <ShoppingBag className="size-4" />
                  <span>{lang === 'bn' ? 'ব্যাগ কালেকশন কিনুন' : 'Shop Handbags Now'}</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <img
                src="/assets/products/hero_handbag_collection_podium.png"
                alt="Handbag Collection"
                className="w-full max-w-sm rounded-2xl object-cover shadow-2xl border border-brand-gold/30 hover:scale-105 transition duration-500"
              />
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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-brand-border pb-4">
          <div>
            <span className="text-xs font-bold text-brand-gold uppercase tracking-wider block mb-1">
              🧕 {lang === 'bn' ? 'দুবাই মডেস্ট ফ্যাশন' : 'DUBAI MODEST WEAR'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              {lang === 'bn' ? 'দুবাই স্টোন ও এমব্রয়ডারি বোরকা' : 'Dubai Abaya & Modest Wear'}
            </h2>
          </div>
          <Link
            to="/shop?category=abaya"
            className="text-xs sm:text-sm font-bold text-brand-gold hover:text-brand-goldLight transition flex items-center gap-1"
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
