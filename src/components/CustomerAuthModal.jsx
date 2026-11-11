import React, { useState } from 'react';
import { X, Mail, Lock, User, LogIn, Sparkles, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { useStoreSettings } from '../context/StoreSettingsContext';

export default function CustomerAuthModal() {
  const { lang, t } = useLanguage();
  const { isAuthModalOpen, closeAuthModal, loginWithEmail, signupWithEmail, loginWithGoogle } = useCustomerAuth();
  const { coinSettings } = useStoreSettings();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const welcomeCoins = Number(coinSettings?.welcomeCoins) || 50;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'register') {
        if (!displayName.trim()) {
          setErrorMsg(lang === 'bn' ? 'অনুগ্রহ করে আপনার নাম দিন।' : 'Please enter your name.');
          setLoading(false);
          return;
        }
        await signupWithEmail(email, password, displayName);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
    } catch (err) {
      setErrorMsg(err.message || 'Google Sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-brand-surface border border-brand-gold/40 rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95">
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-brand-card hover:bg-rose-500/20 text-slate-400 hover:text-white transition"
        >
          <X className="size-5" />
        </button>

        {/* Modal Branding Header */}
        <div className="text-center space-y-1.5 pb-3">
          <div className="size-12 rounded-2xl bg-white border border-brand-gold/40 p-1 mx-auto flex items-center justify-center shadow-sm">
            <img src="/assets/brand/ks-logo.webp" alt="KARISHMASHOPBD" className="size-full object-contain" />
          </div>
          <h3 className="font-serif text-xl font-bold text-white">
            {mode === 'login' ? (lang === 'bn' ? 'কাস্টমার লগইন' : 'Customer Login') : (lang === 'bn' ? 'নতুন একাউন্ট খুলুন' : 'Create Account')}
          </h3>
          <p className="text-xs text-slate-400">
            {lang === 'bn' ? 'আপনার অর্ডার ট্র্যাক ও ক্যাশব্যাক কয়েন ব্যবহার করুন' : 'Track orders & enjoy cashback coin perks'}
          </p>
        </div>

        {/* Welcome Bonus Notice */}
        <div className="my-3 p-2.5 rounded-xl bg-brand-card border border-brand-gold/30 flex items-center gap-2 text-xs text-brand-gold">
          <Sparkles className="size-4 shrink-0 text-amber-400" />
          <span>
            {lang === 'bn'
              ? `🎁 সাইন আপ করলেই পাচ্ছেন ${welcomeCoins}টি কারিশমা কয়েন উপহার!`
              : `🎁 Sign up now and get ${welcomeCoins} Welcome Coins free!`}
          </span>
        </div>

        {errorMsg && (
          <div className="mb-3 p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {lang === 'bn' ? 'আপনার নাম' : 'Full Name'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={lang === 'bn' ? 'যেমন: ফারহানা রহমান' : 'Farhana Rahman'}
                  className="w-full bg-brand-card border border-brand-border focus:border-brand-gold rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                  required
                />
                <User className="absolute left-3 top-2.5 size-4 text-brand-gold/70" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {lang === 'bn' ? 'ইমেইল এড্রেস' : 'Email Address'}
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@gmail.com"
                className="w-full bg-brand-card border border-brand-border focus:border-brand-gold rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                required
              />
              <Mail className="absolute left-3 top-2.5 size-4 text-brand-gold/70" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {lang === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-brand-card border border-brand-border focus:border-brand-gold rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                required
              />
              <Lock className="absolute left-3 top-2.5 size-4 text-brand-gold/70" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-goldDark text-brand-noir font-bold text-xs shadow-gold-glow hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <LogIn className="size-4" />
            <span>
              {loading
                ? 'Processing...'
                : mode === 'login'
                ? (lang === 'bn' ? 'লগইন করুন' : 'Sign In')
                : (lang === 'bn' ? 'একাউন্ট তৈরি করুন' : 'Create Account')}
            </span>
          </button>
        </form>

        {/* Google 1-Click Login */}
        <div className="mt-3 pt-3 border-t border-brand-border space-y-2">
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full py-2 px-3 rounded-xl bg-brand-card hover:bg-brand-surface border border-brand-border text-slate-200 text-xs font-bold transition flex items-center justify-center gap-2"
          >
            <svg className="size-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>{lang === 'bn' ? 'Google দিয়ে ১-ক্লিকে প্রবেশ করুন' : 'Continue with Google'}</span>
          </button>

          {/* Switch tab */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setMode(m => m === 'login' ? 'register' : 'login');
                setErrorMsg('');
              }}
              className="text-xs text-brand-gold hover:underline font-bold"
            >
              {mode === 'login'
                ? (lang === 'bn' ? 'নতুন ক্রেতা? এখানে একাউন্ট খুলুন' : 'New here? Create an account')
                : (lang === 'bn' ? 'আগের একাউন্ট আছে? লগইন করুন' : 'Already have an account? Sign in')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
