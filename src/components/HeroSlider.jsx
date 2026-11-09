import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RefreshCw,
  Headphones,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const SLIDES = [
  {
    id: 1,
    tag: 'FESTIVE COLLECTION 2026',
    tagBn: 'এক্সক্লুসিভ ফেস্টিভ কালেকশন',
    title: 'Where Royal Heritage Meets Modern Elegance',
    titleBn: 'রাজকীয় আভিজাত্য ও আধুনিক বুটিকের নিখুঁত মেলবন্ধন',
    subtitle: 'Handcrafted threadwork embroidery, premium soft linens, and bespoke silk dupattas tailored for statement occasions.',
    subtitleBn: 'হাতে বোনা নিখুঁত সুতার কাজ, প্রিমিয়াম সফট লিনেন ফেব্রিক ও রেশমি সিল্ক ওড়নায় সাজানো আল-চিস্তি বুটিক কালেকশন।',
    image: '/assets/products/threepiece_black_white.webp',
    link: '/shop?category=three-piece',
    buttonText: 'কালেকশন দেখুন',
    buttonTextEn: 'Explore Three-Piece',
    glowColor: 'from-brand-gold/15 via-transparent to-transparent'
  },
  {
    id: 2,
    tag: 'SIGNATURE HANDBAGS',
    tagBn: 'লাক্সারি সিগনেচার হ্যান্ডব্যাগ',
    title: 'Sculpted Floral-Charm Boutique Totes & Clutches',
    titleBn: 'স্কাল্পটেড ফ্লোরাল-চার্ম লাক্সারি ডিজাইনার হ্যান্ডব্যাগ',
    subtitle: 'Artisanal vegan leather with radiant gold hardware and signature blossom tassels. Available in 5 breathtaking pastel & classic hues.',
    subtitleBn: 'প্রিমিয়াম ওয়াটারপ্রুফ ভেগান লেদার ও গোল্ডেন মেটালিক ফিনিশিং। ৫টি আকর্ষণীয় কালারে সাজানো এক্সক্লুসিভ টোট ব্যাগ।',
    image: '/assets/products/hero_handbag_collection_podium.webp',
    link: '/shop?category=handbags',
    buttonText: 'ব্যাগ কালেকশন দেখুন',
    buttonTextEn: 'Shop Designer Bags',
    glowColor: 'from-brand-gold/15 via-transparent to-transparent'
  },
  {
    id: 3,
    tag: 'DUBAI IMPERIAL ABAYA',
    tagBn: 'দুবাই ইম্পেরিয়াল আবায়া ও বোরকা',
    title: 'Pure Dubai Nida Fabrics with Sparkling Stonework',
    titleBn: 'অরিজিনাল দুবাই নিদা ফেব্রিক ও রাজকীয় স্টোনওয়ার্ক বোরকা',
    subtitle: 'Flawlessly modest silhouette adorned with hand-placed crystal cascading chains. Complete with complimentary matching hijab.',
    subtitleBn: 'শোল্ডার ও ফ্রন্টে চোখ জুড়ানো ক্রিস্টাল স্টোনের কারুকাজ। সাথে রয়েছে প্রিমিয়াম ম্যাচিং হিজাব সম্পূর্ণ ফ্রি।',
    image: '/assets/products/abaya_dubai_stonework_black.webp',
    link: '/shop?category=abaya',
    buttonText: 'আবায়া অর্ডার করুন',
    buttonTextEn: 'Order Dubai Abaya',
    glowColor: 'from-brand-gold/15 via-transparent to-transparent'
  }
];

export default function HeroSlider() {
  const { lang, t } = useLanguage();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrent(prev => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent(prev => (prev + 1) % SLIDES.length);
  };

  const slide = SLIDES[current];

  return (
    <>
      <section className="relative overflow-hidden bg-[#0A0B0E] text-slate-100">
        {/* Royal Subtle Ambient Glows - Velvet Black & Gold Harmony */}
        <div className="absolute inset-0 bg-[#0A0B0E]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(212,175,55,0.12),rgba(255,255,255,0))]" />
        <div className={`absolute inset-0 bg-gradient-to-r ${slide.glowColor || 'from-brand-gold/15 via-transparent to-transparent'} opacity-80 transition-all duration-1000 pointer-events-none`} />
        <div className="absolute top-1/4 right-1/4 size-96 rounded-full bg-brand-gold/10 blur-3xl pointer-events-none" />

        {/* Main Slider Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Text & Call To Action */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left z-10">
              {/* Tag Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/40 text-brand-gold text-xs font-bold shadow-gold-soft tracking-wider">
                <Sparkles className="size-3.5 text-brand-gold" />
                <span>{lang === 'bn' ? slide.tagBn : slide.tag}</span>
              </div>

              {/* Headline */}
              <h1 className="text-2xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-[1.2]">
                {lang === 'bn' ? (
                  <>
                    {slide.titleBn.split(' ')[0]} {slide.titleBn.split(' ')[1]}{' '}
                    <span className="text-gold-gradient block sm:inline">
                      {slide.titleBn.split(' ').slice(2).join(' ')}
                    </span>
                  </>
                ) : (
                  <>
                    {slide.title.split(' ').slice(0, 3).join(' ')}{' '}
                    <span className="text-gold-gradient block sm:inline">
                      {slide.title.split(' ').slice(3).join(' ')}
                    </span>
                  </>
                )}
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
                {lang === 'bn' ? slide.subtitleBn : slide.subtitle}
              </p>

              {/* Action Buttons - Unique Luxury Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <Link
                  to={slide.link}
                  className="btn-gold-primary w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm sm:text-base font-black tracking-wide flex items-center justify-center gap-2.5 shadow-gold-glow hover:scale-105 transition-all"
                >
                  <ShoppingBag className="size-4 stroke-[2.5]" />
                  <span>{lang === 'bn' ? slide.buttonText : slide.buttonTextEn}</span>
                  <ArrowRight className="size-4" />
                </Link>

                <Link
                  to="/shop"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-black/60 border border-brand-gold/40 hover:border-brand-gold text-slate-200 hover:text-white font-bold text-sm sm:text-base tracking-wide flex items-center justify-center gap-2 backdrop-blur-md transition-all active:scale-95"
                >
                  <span>{t('exploreCollection')}</span>
                </Link>
              </div>
            </div>

            {/* Right Product Showcase Frame */}
            <div className="lg:col-span-5 relative flex justify-center items-center">
              {/* Glowing Backdrop Circle (Gold & Noir) */}
              <div className="absolute size-72 sm:size-96 rounded-full bg-brand-gold/15 blur-3xl pointer-events-none" />

              {/* Image Card Container (Royal Noir & Fine Gold Rim - No White Bezel) */}
              <div className="relative z-10 w-full max-w-sm sm:max-w-md rounded-3xl bg-gradient-to-b from-[#181A24] to-[#0D0E14] border border-brand-gold/40 p-2.5 sm:p-3.5 shadow-luxury-noir hover:border-brand-gold transition-all duration-500 group">
                <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#111218] to-[#07080B] flex items-center justify-center border border-brand-gold/20">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="size-full object-contain p-2 sm:p-3 group-hover:scale-105 transition-transform duration-700 select-none"
                    loading={current === 0 ? "eager" : "lazy"}
                    decoding="async"
                    fetchPriority={current === 0 ? "high" : "auto"}
                  />

                  {/* Floating Price / Tag Badge */}
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-black/85 backdrop-blur-md border border-brand-gold/30 flex items-center justify-between shadow-lg">
                    <div>
                      <span className="text-[10px] text-brand-gold uppercase font-bold tracking-wider block">
                        {lang === 'bn' ? 'প্রিমিয়াম বুটিক ভ্যারিয়েন্ট' : 'Boutique Exclusive'}
                      </span>
                      <span className="text-xs font-bold text-white font-serif">
                        Karishma Shop BD
                      </span>
                    </div>
                    <Link
                      to={slide.link}
                      className="btn-gold-primary px-3.5 py-1.5 rounded-lg text-xs font-black shadow-sm"
                    >
                      {t('orderNow')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Slide Controls */}
          <div className="flex items-center justify-between pt-6 sm:pt-8 border-t border-brand-gold/20 mt-6">
            <div className="flex items-center gap-2">
              {SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`transition-all duration-300 rounded-full h-2 ${current === idx ? 'w-8 bg-brand-gold shadow-gold-soft' : 'w-2 bg-slate-700 hover:bg-slate-500'}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                className="p-2.5 rounded-xl bg-slate-900/90 border border-brand-gold/30 hover:border-brand-gold text-brand-gold hover:text-white transition active:scale-95 shadow-sm"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2.5 rounded-xl bg-slate-900/90 border border-brand-gold/30 hover:border-brand-gold text-brand-gold hover:text-white transition active:scale-95 shadow-sm"
                aria-label="Next Slide"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

    {/* 2. Trust & Guarantee Banner (Independent Crisp White & Gold Boutique Strip) */}
    <section className="bg-white border-y border-slate-200 py-6 sm:py-8 px-4 sm:px-6 relative z-10 shadow-xs">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
        {/* Card 1: Fast Delivery */}
        <div className="group flex items-center gap-3 sm:gap-4 p-3.5 sm:p-5 rounded-2xl bg-[#FDFBF7] border border-brand-gold/30 hover:border-brand-gold hover:shadow-md transition-all duration-300">
          <div className="size-11 sm:size-12 rounded-2xl bg-gradient-to-tr from-brand-noir via-slate-900 to-slate-800 text-brand-gold flex items-center justify-center shrink-0 border border-brand-gold/40 shadow-sm group-hover:scale-105 transition-transform">
            <Truck className="size-5 text-brand-gold" />
          </div>
          <div className="min-w-0">
            <h4 className="font-serif font-bold text-slate-900 text-xs sm:text-sm leading-tight">
              {lang === 'bn' ? 'সারা দেশে দ্রুত ডেলিভারি' : 'Nationwide Delivery'}
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-1 font-sans leading-snug">
              {lang === 'bn' ? '৪৮ থেকে ৭২ ঘণ্টায় নিশ্চিত হোম ডেলিভারি' : 'Fast 48-72h doorstep delivery'}
            </p>
          </div>
        </div>

        {/* Card 2: 100% Original */}
        <div className="group flex items-center gap-3 sm:gap-4 p-3.5 sm:p-5 rounded-2xl bg-[#FDFBF7] border border-brand-gold/30 hover:border-brand-gold hover:shadow-md transition-all duration-300">
          <div className="size-11 sm:size-12 rounded-2xl bg-gradient-to-tr from-brand-noir via-slate-900 to-slate-800 text-brand-gold flex items-center justify-center shrink-0 border border-brand-gold/40 shadow-sm group-hover:scale-105 transition-transform">
            <ShieldCheck className="size-5 text-brand-gold" />
          </div>
          <div className="min-w-0">
            <h4 className="font-serif font-bold text-slate-900 text-xs sm:text-sm leading-tight">
              {lang === 'bn' ? '১০০% অরিজিনাল বুটিক' : '100% Original Quality'}
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-1 font-sans leading-snug">
              {lang === 'bn' ? 'উন্নতমানের আসল ফেব্রিক ও কারুকাজ' : 'Finest authentic fabrics & finish'}
            </p>
          </div>
        </div>

        {/* Card 3: Easy Return */}
        <div className="group flex items-center gap-3 sm:gap-4 p-3.5 sm:p-5 rounded-2xl bg-[#FDFBF7] border border-brand-gold/30 hover:border-brand-gold hover:shadow-md transition-all duration-300">
          <div className="size-11 sm:size-12 rounded-2xl bg-gradient-to-tr from-brand-noir via-slate-900 to-slate-800 text-brand-gold flex items-center justify-center shrink-0 border border-brand-gold/40 shadow-sm group-hover:scale-105 transition-transform">
            <RefreshCw className="size-5 text-brand-gold" />
          </div>
          <div className="min-w-0">
            <h4 className="font-serif font-bold text-slate-900 text-xs sm:text-sm leading-tight">
              {lang === 'bn' ? '৭ দিনের সহজ এক্সচেঞ্জ' : '7-Day Easy Exchange'}
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-1 font-sans leading-snug">
              {lang === 'bn' ? 'সাইজ সমস্যায় কোনো ঝামেলা ছাড়া এক্সচেঞ্জ' : 'Hassle-free size replacement'}
            </p>
          </div>
        </div>

        {/* Card 4: WhatsApp Support */}
        <div className="group flex items-center gap-3 sm:gap-4 p-3.5 sm:p-5 rounded-2xl bg-[#FDFBF7] border border-brand-gold/30 hover:border-brand-gold hover:shadow-md transition-all duration-300">
          <div className="size-11 sm:size-12 rounded-2xl bg-gradient-to-tr from-brand-noir via-slate-900 to-slate-800 text-brand-gold flex items-center justify-center shrink-0 border border-brand-gold/40 shadow-sm group-hover:scale-105 transition-transform">
            <Headphones className="size-5 text-brand-gold" />
          </div>
          <div className="min-w-0">
            <h4 className="font-serif font-bold text-slate-900 text-xs sm:text-sm leading-tight">
              {lang === 'bn' ? '২৪/৭ লাইভ সাপোর্ট' : '24/7 Live Support'}
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-1 font-sans leading-snug">
              {lang === 'bn' ? 'হোয়াটসঅ্যাপে দ্রুততম সহায়তা ও অর্ডার' : 'Instant WhatsApp assistance'}
            </p>
          </div>
        </div>
      </div>
    </section>
  </>
  );
}
