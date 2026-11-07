import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ShieldCheck, Heart, Sparkles, Lock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useStoreSettings } from '../context/StoreSettingsContext';

export default function Footer() {
  const { lang, t } = useLanguage();
  const { settings } = useStoreSettings();

  return (
    <footer className="bg-brand-noir border-t border-brand-gold/20 text-slate-400 text-xs pt-12 sm:pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-brand-border">
          {/* 1. Brand Description (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="size-11 rounded-xl bg-brand-surface p-1 border border-brand-gold/40 flex items-center justify-center">
                <img src="/assets/brand/ks-logo.svg" alt="Karishma Shop" className="size-full object-contain" />
              </div>
              <div>
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-wide text-gold-gradient block">
                  KARISHMA SHOP BD
                </span>
                <span className="text-[10px] tracking-widest text-slate-500 uppercase font-bold">
                  EXCLUSIVE BOUTIQUE & ABAYA
                </span>
              </div>
            </Link>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-sm">
              {lang === 'bn'
                ? 'Karishma Shop BD বাংলাদেশের একটি নির্ভরযোগ্য প্রিমিয়াম বুটিক ফ্যাশন ব্র্যান্ড। প্রতিটি পোশাকে আভিজাত্য, উন্নতমানের ফেব্রিক ও আধুনিক ফ্যাশনের অনন্য সমন্বয়।'
                : 'Karishma Shop BD is a distinguished boutique fashion house specializing in luxury Three-Piece, authentic Dubai Abayas, and handcrafted designer handbags.'}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand-surface border border-brand-border flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-400" />
                <span className="text-[11px] font-bold text-slate-200">
                  {lang === 'bn' ? '১০০% অরিজিনাল কোয়ালিটি' : '100% Quality Guaranteed'}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-brand-gold uppercase tracking-wider">
              {lang === 'bn' ? 'ক্যাটাগরি' : 'Categories'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/shop?category=three-piece" className="hover:text-brand-gold transition">
                  👗 {t('threePiece')}
                </Link>
              </li>
              <li>
                <Link to="/shop?category=abaya" className="hover:text-brand-gold transition">
                  🧕 {t('abaya')}
                </Link>
              </li>
              <li>
                <Link to="/shop?category=gowns" className="hover:text-brand-gold transition">
                  ✨ {t('gowns')}
                </Link>
              </li>
              <li>
                <Link to="/shop?category=handbags" className="hover:text-brand-gold transition">
                  👜 {t('handbags')}
                </Link>
              </li>
              <li>
                <Link to="/shop?filter=flash" className="text-rose-400 hover:text-rose-300 transition">
                  🔥 {lang === 'bn' ? 'ফ্ল্যাশ সেল অফার' : 'Flash Sale'}
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Customer Care */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-brand-gold uppercase tracking-wider">
              {lang === 'bn' ? 'গ্রাহক সেবা' : 'Customer Care'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-slate-300">
                  ✨ {lang === 'bn' ? '১০০% অরিজিনাল বুটিক নিশ্চয়তা' : '100% Authentic Boutique Fabric'}
                </span>
              </li>
              <li>
                <span className="text-slate-400">
                  🚚 {lang === 'bn' ? 'ডেলিভারি চার্জ: ঢাকা ৳৮০ | বাইরে ৳১৫০' : 'Delivery: Inside ৳80 | Outside ৳150'}
                </span>
              </li>
              <li>
                <span className="text-slate-400">
                  🔄 {lang === 'bn' ? '৭ দিনের সহজ এক্সচেঞ্জ পলিসি' : '7-Day Easy Exchange Policy'}
                </span>
              </li>
            </ul>
          </div>

          {/* 4. Contact Details */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-brand-gold uppercase tracking-wider">
              {lang === 'bn' ? 'যোগাযোগ' : 'Contact Us'}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2">
                <Phone className="size-4 text-brand-gold shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <a href={`tel:${settings?.hotline || '01819305805'}`} className="hover:text-white font-mono font-bold text-slate-200">
                    {settings?.hotline || '01819305805'} (WhatsApp)
                  </a>
                  <a href="tel:01965643684" className="hover:text-white font-mono text-[11px] text-slate-400">
                    01965643684 (হেল্পলাইন)
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="size-4 text-brand-gold shrink-0 mt-0.5" />
                <a href={`mailto:${settings?.email || 'karishmashop786@gmail.com'}`} className="hover:text-white">
                  {settings?.email || 'karishmashop786@gmail.com'}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="size-4 text-brand-gold shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {settings?.addressBn || 'আলহাজ্ব ফজল মেম্বার ম্যানশন (১ম তলা), শিকলবাহা (৩নং ওয়ার্ড), কর্ণফুলী - ৪৩৭১, চট্টগ্রাম'}
                </span>
              </li>
            </ul>

            {/* Accepted Payments Preview */}
            <div className="pt-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1.5">
                {lang === 'bn' ? 'পেমেন্ট মেথড:' : 'Payment Methods:'}
              </span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded bg-brand-surface border border-brand-border text-[10px] font-bold text-slate-300">
                  🚚 ক্যাশ অন ডেলিভারি
                </span>
                <span className="px-2 py-1 rounded bg-pink-950/40 border border-pink-500/40 text-[10px] font-bold text-pink-300">
                  bKash / Nagad
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-[11px] text-slate-500">
          <p className="flex items-center justify-center sm:justify-start gap-1.5">
            <span>© {new Date().getFullYear()} Karishma Shop BD. All rights reserved.</span>
            {/* Secret discreet agency admin link */}
            <Link
              to="/admin"
              className="opacity-20 hover:opacity-100 hover:text-brand-gold transition p-0.5 inline-flex items-center"
              title="Secure Staff Portal"
            >
              <Lock className="size-3" />
            </Link>
          </p>
          <p className="flex items-center justify-center gap-1">
            <span>Crafted with</span>
            <Heart className="size-3 text-rose-500 fill-rose-500" />
            <span>for exclusive boutique lovers.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
