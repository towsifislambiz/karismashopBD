import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Phone,
  Globe,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  Layers,
  Crown
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { useStoreSettings } from '../context/StoreSettingsContext';
import { useProducts } from '../context/ProductContext';

export default function Navbar() {
  const { lang, toggleLang, t } = useLanguage();
  const { cartItems, itemsCount, openCart, wishlist } = useCart();
  const { currentUser, userData, userCoins, openAuthModal } = useCustomerAuth();
  const { settings } = useStoreSettings();
  const { products } = useProducts();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Live search filtering
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.nameBn && p.nameBn.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q) ||
      (p.categoryBn && p.categoryBn.toLowerCase().includes(q))
    ).slice(0, 5);
    setSearchResults(filtered);
  }, [searchQuery, products]);

  const handleSelectSearchResult = (productId) => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchOpen(false);
    navigate(`/product/${productId}`);
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* 1. Top Luxury Announcement Strip */}
      <div className="bg-gradient-to-r from-brand-noir via-brand-surface to-brand-noir border-b border-brand-gold/20 py-1.5 px-3 sm:px-6 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Hotline & WhatsApp */}
          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <a
              href={`tel:${settings?.hotline || '01819305805'}`}
              className="flex items-center gap-1.5 text-brand-gold hover:text-brand-goldLight transition font-semibold"
            >
              <Phone className="size-3.5" />
              <span className="hidden sm:inline">{t('hotline')}:</span>
              <span className="font-mono">{settings?.hotline || '01819305805'}</span>
            </a>
            <span className="hidden md:inline-block text-slate-600">|</span>
            <span className="hidden md:inline-flex items-center gap-1 text-slate-300">
              <ShieldCheck className="size-3.5 text-emerald-400" />
              <span>{lang === 'bn' ? '১০০% অরিজিনাল বুটিক কালেকশন' : '100% Original Boutique Wear'}</span>
            </span>
          </div>

          {/* Announcement Ticker */}
          <div className="hidden lg:block text-[11px] font-medium text-amber-200/90 truncate max-w-md animate-pulse">
            {lang === 'bn' ? settings?.announcementText : settings?.announcementTextEn}
          </div>

          {/* Language Switcher & Admin Shortcut */}
          <div className="flex items-center gap-2.5">
            {/* Language Switcher Pill */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-surface border border-brand-gold/40 text-[11px] font-bold text-brand-gold hover:bg-brand-gold hover:text-brand-noir transition shadow-sm active:scale-95"
              title="Change Language / ভাষা পরিবর্তন করুন"
            >
              <Globe className="size-3.5" />
              <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Luxury Navbar (Crisp White + Jet Black + Gold) */}
      <div className={`transition-all duration-300 border-b ${isScrolled ? 'bg-white/95 backdrop-blur-md border-brand-gold/30 py-2.5 shadow-md' : 'bg-white border-slate-200 py-3.5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3 sm:gap-6">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            className="md:hidden p-1.5 sm:p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 hover:text-brand-goldDark transition shrink-0"
            aria-label="Open mobile menu"
          >
            {isMobileMenuOpen ? <X className="size-4 sm:size-5" /> : <Menu className="size-4 sm:size-5" />}
          </button>

          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-2 group shrink-0 min-w-0">
            <div className="relative size-9 sm:size-12 rounded-xl bg-brand-noir p-1 border border-brand-gold/40 group-hover:border-brand-gold shadow-gold-soft transition flex items-center justify-center shrink-0 overflow-hidden">
              <img
                src="/assets/brand/ks-logo.svg"
                alt="Karishma Shop BD"
                className="size-full object-contain filter drop-shadow group-hover:scale-105 transition duration-300"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-serif text-sm sm:text-2xl font-bold tracking-tight text-slate-900 group-hover:text-brand-goldDark transition leading-tight">
                KARISHMA SHOP
              </span>
              <span className="hidden xs:block text-[8px] sm:text-[10px] font-sans tracking-widest text-brand-goldDark uppercase font-bold -mt-0.5">
                BOUTIQUE & ABAYA • BD
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex relative flex-1 max-w-md mx-2">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full bg-slate-50 border border-slate-200 focus:border-brand-gold rounded-full pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-brand-gold transition shadow-sm"
              />
              <Search className="absolute left-3.5 top-2.5 size-4 text-brand-goldDark" />
            </div>

            {/* Live Search Autocomplete Popup */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-brand-gold/40 rounded-2xl p-2 shadow-2xl z-50 overflow-hidden divide-y divide-slate-100">
                {searchResults.map(product => (
                  <button
                    key={product.id}
                    onClick={() => handleSelectSearchResult(product.id)}
                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition text-left group"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="size-10 rounded-lg object-cover bg-slate-100"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-brand-goldDark truncate">
                        {lang === 'bn' ? product.nameBn : product.name}
                      </p>
                      <span className="text-[11px] text-brand-goldDark font-bold font-mono">
                        ৳{product.price}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons: Wishlist, Cart */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Search Trigger for Mobile */}
            <button
              onClick={() => setIsSearchOpen(prev => !prev)}
              className="md:hidden p-1.5 sm:p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:text-brand-goldDark"
              aria-label="Search"
            >
              <Search className="size-4" />
            </button>

            {/* Wishlist Button */}
            <Link
              to="/wishlist"
              className="relative p-1.5 sm:p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-brand-gold text-slate-700 hover:text-brand-goldDark transition shadow-sm"
              title={t('wishlist')}
            >
              <Heart className="size-4 sm:size-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 size-4 bg-brand-noir text-brand-gold font-black rounded-full text-[10px] flex items-center justify-center border border-brand-gold/40 shadow animate-bounce">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Drawer Trigger Button (Signature Liquid Gold) */}
            <button
              onClick={openCart}
              className="btn-gold-primary flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black active:scale-95 transition"
            >
              <div className="relative">
                <ShoppingBag className="size-4 sm:size-5 stroke-[2.5]" />
                {itemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 size-4 bg-brand-noir text-brand-gold border border-brand-gold/80 rounded-full text-[10px] font-black flex items-center justify-center shadow">
                    {itemsCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline tracking-wider uppercase font-black text-xs">
                {t('cart')}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Input Bar */}
        {isSearchOpen && (
          <div className="md:hidden px-4 pt-3 pb-1 border-t border-brand-border mt-2">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full bg-brand-surface border border-brand-border rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-gold"
                autoFocus
              />
              <Search className="absolute left-3 top-2.5 size-4 text-brand-gold" />
            </div>
            {searchResults.length > 0 && (
              <div className="mt-2 bg-brand-card border border-brand-gold/30 rounded-xl p-2 divide-y divide-brand-border">
                {searchResults.map(product => (
                  <button
                    key={product.id}
                    onClick={() => handleSelectSearchResult(product.id)}
                    className="w-full flex items-center gap-3 p-2 text-left"
                  >
                    <img src={product.images[0]} alt="" className="size-9 rounded object-cover" />
                    <div>
                      <p className="text-xs font-bold text-slate-200">{lang === 'bn' ? product.nameBn : product.name}</p>
                      <p className="text-[11px] text-brand-gold font-bold">৳{product.price}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Category Bar (Desktop) */}
      <nav className="hidden md:block bg-slate-50 border-b border-slate-200 text-xs">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <ul className="flex items-center gap-7 py-2.5 font-bold tracking-wide">
            <li>
              <Link to="/" className="text-slate-800 hover:text-brand-goldDark transition flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-brand-goldDark" />
                <span>{t('home')}</span>
              </Link>
            </li>
            <li>
              <Link to="/shop?category=three-piece" className="text-slate-700 hover:text-brand-goldDark transition">
                {t('threePiece')}
              </Link>
            </li>
            <li>
              <Link to="/shop?category=abaya" className="text-slate-700 hover:text-brand-goldDark transition">
                {t('abaya')}
              </Link>
            </li>
            <li>
              <Link to="/shop?category=gowns" className="text-slate-700 hover:text-brand-goldDark transition">
                {t('gowns')}
              </Link>
            </li>
            <li>
              <Link to="/shop?category=handbags" className="text-slate-700 hover:text-brand-goldDark transition">
                {t('handbags')}
              </Link>
            </li>
            <li>
              <Link to="/shop?filter=flash" className="text-brand-goldDark hover:text-slate-900 transition flex items-center gap-1.5 font-bold">
                <span className="size-2 rounded-full bg-brand-gold animate-ping" />
                <span>{lang === 'bn' ? '✦ ফ্ল্যাশ সেল অফার' : '✦ Flash Sale'}</span>
              </Link>
            </li>
          </ul>

          <div className="text-[11px] text-slate-500 flex items-center gap-3">
            <Link to="/account" className="hover:text-brand-goldDark transition">
              {t('trackOrder')}
            </Link>
          </div>
        </div>
      </nav>

      {/* 4. Mobile Slide-out Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-brand-gold/40 px-5 py-4 space-y-3 text-sm shadow-2xl animate-in slide-in-from-top-2 text-slate-800">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('allCategories')}</span>
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 border border-brand-gold/40 text-[11px] font-bold text-brand-goldDark"
            >
              <Globe className="size-3" />
              <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>
          </div>

          <ul className="space-y-2.5 font-bold">
            <li>
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block p-2 rounded-lg hover:bg-slate-50 text-slate-800 hover:text-brand-goldDark transition"
              >
                {t('home')}
              </Link>
            </li>
            <li>
              <Link
                to="/shop?category=three-piece"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block p-2 rounded-lg hover:bg-slate-50 text-slate-800 hover:text-brand-goldDark transition"
              >
                👗 {t('threePiece')}
              </Link>
            </li>
            <li>
              <Link
                to="/shop?category=abaya"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block p-2 rounded-lg hover:bg-slate-50 text-slate-800 hover:text-brand-goldDark transition"
              >
                🧕 {t('abaya')}
              </Link>
            </li>
            <li>
              <Link
                to="/shop?category=gowns"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block p-2 rounded-lg hover:bg-slate-50 text-slate-800 hover:text-brand-goldDark transition"
              >
                ✨ {t('gowns')}
              </Link>
            </li>
            <li>
              <Link
                to="/shop?category=handbags"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block p-2 rounded-lg hover:bg-slate-50 text-slate-800 hover:text-brand-goldDark transition"
              >
                👜 {t('handbags')}
              </Link>
            </li>
            <li>
              <Link
                to="/wishlist"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block p-2 rounded-lg hover:bg-slate-50 text-slate-800 hover:text-brand-goldDark transition flex items-center justify-between"
              >
                <span>❤️ {lang === 'bn' ? 'উইশলিস্ট' : 'Wishlist'}</span>
                {wishlist.length > 0 && (
                  <span className="px-2 py-0.5 text-[10px] rounded-full bg-brand-gold text-brand-noir font-bold">
                    {wishlist.length}
                  </span>
                )}
              </Link>
            </li>
            <li>
              <Link
                to="/shop?filter=flash"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block p-2 rounded-lg bg-amber-50 border border-brand-gold/40 text-brand-goldDark font-bold"
              >
                ✦ {lang === 'bn' ? 'ফ্ল্যাশ সেল অফার' : 'Flash Sale'}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
