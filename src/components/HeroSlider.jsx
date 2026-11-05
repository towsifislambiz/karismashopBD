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
    image: '/assets/products/threepiece_black_white.png',
    link: '/shop?category=three-piece',
    buttonText: 'কালেকশন দেখুন',
    buttonTextEn: 'Explore Three-Piece',
    themeColor: 'from-amber-500/20 via-brand-noir to-brand-noir'
  },
  {
    id: 2,
    tag: 'SIGNATURE HANDBAGS',
    tagBn: 'লাক্সারি সিগনেচার হ্যান্ডব্যাগ',
    title: 'Sculpted Floral-Charm Boutique Totes & Clutches',
    titleBn: 'স্কাল্পটেড ফ্লোরাল-চার্ম লাক্সারি ডিজাইনার হ্যান্ডব্যাগ',
    subtitle: 'Artisanal vegan leather with radiant gold hardware and signature blossom tassels. Available in 5 breathtaking pastel & classic hues.',
    subtitleBn: 'প্রিমিয়াম ওয়াটারপ্রুফ ভেগান লেদার ও গোল্ডেন মেটালিক ফিনিশিং। ৫টি আকর্ষণীয় কালারে সাজানো এক্সক্লুসিভ টোট ব্যাগ।',
    image: '/assets/products/hero_handbag_collection_podium.png',
    link: '/shop?category=handbags',
    buttonText: 'ব্যাগ কালেকশন দেখুন',
    buttonTextEn: 'Shop Designer Bags',
    themeColor: 'from-brand-gold/25 via-brand-surface to-brand-noir'
  },
  {
    id: 3,
    tag: 'DUBAI IMPERIAL ABAYA',
    tagBn: 'দুবাই ইম্পেরিয়াল আবায়া ও বোরকা',
    title: 'Pure Dubai Nida Fabrics with Sparkling Stonework',
    titleBn: 'অরিজিনাল দুবাই নিদা ফেব্রিক ও রাজকীয় স্টোনওয়ার্ক বোরকা',
    subtitle: 'Flawlessly modest silhouette adorned with hand-placed crystal cascading chains. Complete with complimentary matching hijab.',
    subtitleBn: 'শোল্ডার ও ফ্রন্টে চোখ জুড়ানো ক্রিস্টাল স্টোনের কারুকাজ। সাথে রয়েছে প্রিমিয়াম ম্যাচিং হিজাব সম্পূর্ণ ফ্রি।',
    image: '/assets/products/abaya_dubai_stonework_black.png',
    link: '/shop?category=abaya',
    buttonText: 'আবায়া অর্ডার করুন',
    buttonTextEn: 'Order Dubai Abaya',
    themeColor: 'from-rose-950/40 via-brand-noir to-brand-noir'
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
    <section className="relative overflow-hidden bg-brand-noir text-slate-100">
      {/* Dynamic Background Glow */}
      <div className={`absolute inset-0 bg-gradient-to-r ${slide.themeColor} opacity-70 transition-all duration-1000`} />
      <div className="absolute top-0 right-1/4 size-96 rounded-full bg-brand-gold/10 blur-3xl pointer-events-none" />

      {/* Main Slider Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text & Call To Action */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left z-10">
            {/* Tag Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-surface/90 border border-brand-gold/40 text-brand-gold text-xs font-bold shadow-gold-soft tracking-wider animate-shimmer">
              <Sparkles className="size-3.5 text-brand-gold animate-spin" />
              <span>{lang === 'bn' ? slide.tagBn : slide.tag}</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-[1.15]">
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

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <Link
                to={slide.link}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-brand-gold via-brand-goldLight to-brand-goldDark text-brand-noir font-black text-sm sm:text-base tracking-wide shadow-gold-glow hover:scale-105 active:scale-95 transition flex items-center justify-center gap-2"
              >
                <ShoppingBag className="size-4 stroke-[2.5]" />
                <span>{lang === 'bn' ? slide.buttonText : slide.buttonTextEn}</span>
                <ArrowRight className="size-4" />
              </Link>

              <Link
                to="/shop"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-brand-surface/80 border border-brand-border hover:border-brand-gold text-slate-200 font-bold text-sm tracking-wide hover:bg-brand-surface transition flex items-center justify-center gap-2"
              >
                <span>{t('exploreCollection')}</span>
              </Link>
            </div>
          </div>

          {/* Right Product Showcase Frame */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            {/* Glowing Backdrop Circle */}
            <div className="absolute size-72 sm:size-96 rounded-full bg-gradient-to-tr from-brand-gold/20 to-brand-roseDeep/20 blur-2xl" />

            {/* Image Card Container */}
            <div className="relative z-10 w-full max-w-sm sm:max-w-md rounded-3xl bg-brand-surface/60 border border-brand-gold/30 p-3 sm:p-4 shadow-luxury hover:border-brand-gold/60 transition group">
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-brand-noir/80 flex items-center justify-center">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="size-full object-contain p-2 sm:p-3 group-hover:scale-105 transition-transform duration-700"
                />

                {/* Floating Price / Tag Badge */}
                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-brand-noir/90 backdrop-blur-md border border-brand-gold/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-brand-gold uppercase font-bold tracking-wider block">
                      {lang === 'bn' ? 'প্রিমিয়াম বুটিক ভ্যারিয়েন্ট' : 'Boutique Exclusive'}
                    </span>
                    <span className="text-xs font-bold text-white">
                      Karishma Shop BD
                    </span>
                  </div>
                  <Link
                    to={slide.link}
                    className="px-3 py-1.5 rounded-lg bg-brand-gold text-brand-noir font-black text-xs hover:bg-white transition"
                  >
                    {t('orderNow')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Slide Controls */}
        <div className="flex items-center justify-between pt-6 sm:pt-8 border-t border-brand-border/60 mt-6">
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
              className="p-2 rounded-xl bg-brand-surface border border-brand-border hover:border-brand-gold text-slate-300 hover:text-white transition active:scale-95"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-xl bg-brand-surface border border-brand-border hover:border-brand-gold text-slate-300 hover:text-white transition active:scale-95"
              aria-label="Next Slide"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="bg-brand-surface/90 border-y border-brand-border/80 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-brand-card/50 border border-brand-border/40">
            <div className="size-9 rounded-lg bg-brand-gold/15 text-brand-gold flex items-center justify-center shrink-0 border border-brand-gold/30">
              <Truck className="size-4" />
            </div>
            <div>
              <p className="font-bold text-white">{t('fastDelivery')}</p>
              <p className="text-[11px] text-slate-400">{lang === 'bn' ? 'সারা দেশে দ্রুত হোম ডেলিভারি' : 'Nationwide 48-72h Delivery'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-xl bg-brand-card/50 border border-brand-border/40">
            <div className="size-9 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <ShieldCheck className="size-4" />
            </div>
            <div>
              <p className="font-bold text-white">{t('originalQuality')}</p>
              <p className="text-[11px] text-slate-400">{lang === 'bn' ? '১০০% অরিজিনাল ফেব্রিক গ্যারান্টি' : 'Hand-picked Fabrics'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-xl bg-brand-card/50 border border-brand-border/40">
            <div className="size-9 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              <RefreshCw className="size-4" />
            </div>
            <div>
              <p className="font-bold text-white">{t('easyReturn')}</p>
              <p className="text-[11px] text-slate-400">{lang === 'bn' ? 'সাইজ সমস্যায় সহজ এক্সচেঞ্জ' : 'Easy Exchange Policy'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-xl bg-brand-card/50 border border-brand-border/40">
            <div className="size-9 rounded-lg bg-cyan-500/15 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/30">
              <Headphones className="size-4" />
            </div>
            <div>
              <p className="font-bold text-white">{lang === 'bn' ? '২৪/৭ লাইভ সাপোর্ট' : 'Dedicated Support'}</p>
              <p className="text-[11px] text-slate-400">{lang === 'bn' ? 'হোয়াটসঅ্যাপে তাৎক্ষণিক হেল্প' : 'Instant WhatsApp Help'}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
