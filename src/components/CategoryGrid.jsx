import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { categories } from '../data/products';

export default function CategoryGrid() {
  const { lang, t } = useLanguage();

  const displayCategories = categories.filter(c => c.id !== 'all');

  return (
    <section className="py-12 sm:py-16 bg-brand-canvas px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-brand-goldDark text-xs font-bold uppercase tracking-wider mb-1 font-sans">
              <Sparkles className="size-3.5" />
              <span>{lang === 'bn' ? 'এক্সক্লুসিভ কালেকশন' : 'CURATED COLLECTIONS'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
              {lang === 'bn' ? 'পছন্দের ক্যাটাগরি বেছে নিন' : 'Shop by Category'}
            </h2>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-brand-goldDark hover:text-slate-900 transition group"
          >
            <span>{lang === 'bn' ? 'সব কালেকশন ব্রাউজ করুন' : 'View All Products'}</span>
            <ArrowUpRight className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid (4 Large Boutique Cards) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayCategories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.id}`}
              className="group relative rounded-3xl overflow-hidden bg-white border border-brand-gold/30 hover:border-brand-gold transition-all duration-500 shadow-luxury-white hover:shadow-luxury-white-hover flex flex-col aspect-[4/5]"
            >
              {/* Product Background Image */}
              <div className="size-full overflow-hidden bg-slate-100 relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="size-full object-cover object-top group-hover:scale-110 transition-transform duration-700 brightness-95 group-hover:brightness-105"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-noir via-brand-noir/40 to-transparent" />
              </div>

              {/* Card Footer Content */}
              <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 flex items-end justify-between gap-2 z-10">
                <div>
                  <span className="text-[10px] sm:text-xs text-brand-gold font-bold uppercase tracking-wider block font-sans">
                    {cat.count} {lang === 'bn' ? 'টি ডিজাইন' : 'Designs'}
                  </span>
                  <h3 className="text-base sm:text-xl font-serif font-bold text-white group-hover:text-brand-gold transition leading-snug">
                    {lang === 'bn' ? cat.nameBn : cat.name}
                  </h3>
                </div>

                <div className="size-8 sm:size-9 rounded-full bg-brand-surface/90 border border-brand-gold/40 text-brand-gold flex items-center justify-center shrink-0 group-hover:bg-brand-gold group-hover:text-brand-noir transition shadow-md">
                  <ArrowUpRight className="size-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
