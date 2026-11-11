import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, Mail, MapPin, ShieldCheck, Heart, Sparkles, Lock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useStoreSettings } from '../context/StoreSettingsContext';

export default function Footer() {
  const { lang, t } = useLanguage();
  const { settings } = useStoreSettings();
  const navigate = useNavigate();

  const footerClicksRef = React.useRef(0);
  const footerTimerRef = React.useRef(null);

  const handleFooterLogoClick = (e) => {
    footerClicksRef.current += 1;
    clearTimeout(footerTimerRef.current);

    if (footerClicksRef.current >= 5) {
      e.preventDefault();
      footerClicksRef.current = 0;
      navigate('/admin');
      return;
    }

    footerTimerRef.current = setTimeout(() => {
      footerClicksRef.current = 0;
    }, 2500);
  };

  return (
    <footer className="bg-brand-noir border-t border-brand-gold/20 text-slate-400 text-xs pt-12 sm:pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-brand-border">
          {/* 1. Brand Description (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              to="/"
              onClick={handleFooterLogoClick}
              className="flex items-center gap-3 cursor-pointer select-none"
              title="KARISHMASHOPBD (লোগোতে ৫ বার ক্লিক করলে অ্যাডমিন প্যানেল ওপেন হবে)"
            >
              <div className="size-12 rounded-2xl bg-white p-1 border border-brand-gold/40 flex items-center justify-center active:scale-95 transition shadow-sm">
                <img src="/assets/brand/ks-logo.webp" alt="KARISHMASHOPBD" className="size-full object-contain" />
              </div>
              <div>
                <div className="flex items-center tracking-tight leading-none font-sans font-black text-2xl sm:text-3xl">
                  <span className="text-[#38BDF8] drop-shadow-sm">
                    KARISHMA
                  </span>
                  <span className="text-white drop-shadow-sm">
                    SHOPBD
                  </span>
                </div>
                <span className="text-xs font-sans font-bold text-amber-300/90 tracking-wide block mt-1">
                  Your Quality Shopping Destination
                </span>
                <span className="text-[11px] font-sans font-medium text-teal-300/90 tracking-wide block">
                  Customers Satisfaction Is Our First Priority
                </span>
              </div>
            </Link>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-sm">
              {lang === 'bn'
                ? 'Karishma Shop BD বাংলাদেশের একটি নির্ভরযোগ্য প্রিমিয়াম বুটিক ফ্যাশন ব্র্যান্ড। প্রতিটি পোশাকে আভিজাত্য, উন্নতমানের ফেব্রিক ও আধুনিক ফ্যাশনের অনন্য সমন্বয়।'
                : 'Karishma Shop BD is a distinguished boutique fashion house specializing in luxury Three-Piece, authentic Dubai Abayas, and handcrafted designer handbags.'}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-brand-gold/60 shadow-md">
                <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-black text-slate-900 tracking-wide font-sans">
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
                  <a
                    href={`https://wa.me/88${(settings?.whatsappNumber || '01965643684').replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand-gold font-mono font-bold text-slate-100 flex items-center gap-1.5 transition"
                  >
                    <span>{settings?.whatsappNumber || '01965643684'}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-sans font-semibold">WhatsApp</span>
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="size-4 text-brand-gold shrink-0 mt-0.5" />
                <a
                  href="mailto:karishmashop786@gmail.com"
                  className="hover:text-brand-gold text-slate-200 font-mono transition"
                >
                  karishmashop786@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="size-4 text-brand-gold shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {lang === 'bn'
                    ? (settings?.addressBn || 'ফজল মেম্বার ম্যানশন (১ম তলা), সিডিএ রোড, শিকলবাহা, ৩নং ওয়ার্ড, কর্ণফুলী, চট্টগ্রাম - ৪৩৭১')
                    : (settings?.address || 'Fazal Member Mansion (1st floor), CDA Road, Shikalbaha, Ward No-03, Karnafully, Chittagong - 4371')}
                </span>
              </li>
            </ul>

            {/* Accepted Payments Preview */}
            <div className="pt-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1.5">
                {lang === 'bn' ? 'পেমেন্ট মেথড:' : 'Payment Methods:'}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-brand-gold/30 text-[11px] font-bold text-slate-200">
                  🚚 ক্যাশ অন ডেলিভারি
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-pink-950/60 to-rose-950/60 border border-pink-500/50 text-[11px] font-bold text-pink-300 font-mono">
                  বিকাশ / নগদ: 01819305805
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
