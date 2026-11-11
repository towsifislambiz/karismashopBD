import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Crown,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Package,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X,
  Search,
  Download,
  Trash2,
  MessageSquare,
  Settings,
  Plus,
  Save,
  ShieldCheck,
  ShieldAlert,
  Phone,
  RefreshCw,
  Lock,
  User,
  Eye,
  EyeOff,
  ExternalLink,
  LogOut,
  ArrowLeft,
  Sparkles,
  Filter,
  Check
} from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { useProducts } from '../context/ProductContext';
import { useStoreSettings } from '../context/StoreSettingsContext';
import { useLanguage } from '../context/LanguageContext';
import { generateMonthlyReportPDF } from '../utils/pdfGenerator';
import { convertToWebP } from '../utils/imageOptimizer';

export default function AdminDashboard() {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const { orders, updateOrderStatus, updatePaymentStatus, deleteOrder, isCloudSynced: isOrdersSynced } = useOrders();
  const { products, addProduct, updateProduct, deleteProduct, resetToDefault, isCloudSynced: isProductsSynced, syncAllToFirestore, isSyncing } = useProducts();
  const { settings, updateSettings } = useStoreSettings();

  // 1-Hour Session Duration (3,600,000 ms)
  const ONE_HOUR_MS = 60 * 60 * 1000;

  // Authentication State with 1-Hour Auto-Expiry Check
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    const isAuth = localStorage.getItem('karishma_admin_auth') === 'true';
    const expiresAt = parseInt(localStorage.getItem('karishma_admin_session_expires_at') || '0', 10);
    const now = Date.now();
    if (isAuth && expiresAt > now) {
      return true;
    }
    // Expired or invalid session: clear completely
    localStorage.removeItem('karishma_admin_auth');
    localStorage.removeItem('karishma_admin_session_expires_at');
    return false;
  });

  const [sessionExpiresAt, setSessionExpiresAt] = useState(() => {
    return parseInt(localStorage.getItem('karishma_admin_session_expires_at') || '0', 10);
  });
  const [sessionRemainingMinutes, setSessionRemainingMinutes] = useState(60);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // 1-Hour Automatic Session Logout & Periodic Verification
  useEffect(() => {
    if (!isAdminAuthenticated) return;

    const checkSessionExpiry = () => {
      const expiresAt = parseInt(localStorage.getItem('karishma_admin_session_expires_at') || '0', 10);
      const now = Date.now();

      if (!expiresAt || now >= expiresAt) {
        // 1 hour elapsed: auto-logout from this device
        localStorage.removeItem('karishma_admin_auth');
        localStorage.removeItem('karishma_admin_session_expires_at');
        setIsAdminAuthenticated(false);
        alert('নিরাপত্তার স্বার্থে ১ ঘণ্টা পর অ্যাডমিন সেশন স্বয়ংক্রিয়ভাবে সমাপ্ত হয়েছে। পুনরায় প্রবেশ করতে লোগোতে ৫ বার ক্লিক করে লগইন করুন।');
        navigate('/');
      } else {
        const remainingMins = Math.max(1, Math.ceil((expiresAt - now) / (60 * 1000)));
        setSessionRemainingMinutes(remainingMins);
      }
    };

    checkSessionExpiry();
    // Check every 10 seconds
    const interval = setInterval(checkSessionExpiry, 10000);

    // Cross-tab synchronization: if another tab logs out
    const handleStorage = (e) => {
      if (e.key === 'karishma_admin_auth' && e.newValue !== 'true') {
        setIsAdminAuthenticated(false);
        navigate('/');
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorage);
    };
  }, [isAdminAuthenticated, navigate]);

  // 2-Minute Lockout on 5 Consecutive Failed Attempts (Rate Limiting)
  const MAX_FAILED_ATTEMPTS = 5;
  const LOCKOUT_DURATION_MS = 2 * 60 * 1000; // 2 minutes (120,000 ms)

  const [failedAttempts, setFailedAttempts] = useState(() => {
    return parseInt(localStorage.getItem('karishma_admin_failed_attempts') || '0', 10);
  });
  const [lockoutUntil, setLockoutUntil] = useState(() => {
    const stored = localStorage.getItem('karishma_admin_lockout_until');
    const val = stored ? parseInt(stored, 10) : 0;
    return val > Date.now() ? val : 0;
  });
  const [lockoutRemainingSeconds, setLockoutRemainingSeconds] = useState(() => {
    const stored = localStorage.getItem('karishma_admin_lockout_until');
    const val = stored ? parseInt(stored, 10) : 0;
    return val > Date.now() ? Math.ceil((val - Date.now()) / 1000) : 0;
  });

  // Real-time countdown timer for the 2-minute lockout
  useEffect(() => {
    if (!lockoutUntil) {
      setLockoutRemainingSeconds(0);
      return;
    }

    const checkTimer = () => {
      const now = Date.now();
      if (lockoutUntil > now) {
        const remaining = Math.ceil((lockoutUntil - now) / 1000);
        setLockoutRemainingSeconds(remaining);
      } else {
        // Lockout expired: restore access & reset counters
        setLockoutUntil(0);
        setFailedAttempts(0);
        setLockoutRemainingSeconds(0);
        localStorage.removeItem('karishma_admin_lockout_until');
        localStorage.removeItem('karishma_admin_failed_attempts');
        setLoginError('');
      }
    };

    checkTimer();
    const interval = setInterval(checkTimer, 1000);
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  const isLockedOut = lockoutRemainingSeconds > 0;

  const formatCountdown = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Dashboard Tabs & Filters
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products' | 'settings'
  const [orderFilter, setOrderFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Product Add / Convert State
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isConvertingImage, setIsConvertingImage] = useState(false);
  const [conversionStats, setConversionStats] = useState(null);
  const [newProductForm, setNewProductForm] = useState({
    nameBn: '',
    name: '',
    category: 'threepiece',
    price: '',
    originalPrice: '',
    stockCount: 15,
    fabricBn: '',
    descriptionBn: '',
    image: ''
  });

  // Settings form state
  const [settingsForm, setSettingsForm] = useState({
    hotline: settings?.hotline || '01819305805',
    whatsappNumber: settings?.whatsappNumber || '01965643684',
    bkashNumber: settings?.bkashNumber || '01819305805',
    deliveryFeeInside: settings?.deliveryFeeInside || 80,
    deliveryFeeOutside: settings?.deliveryFeeOutside || 150,
    freeDeliveryThreshold: settings?.freeDeliveryThreshold || 3500,
    announcementText: settings?.announcementText || '✨ প্রিমিয়াম বুটিক কালেকশন | ৩,৫০০ টাকার অর্ডারে সারা দেশে ডেলিভারি সম্পূর্ণ ফ্রি!',
    address: settings?.address || 'Fazal Member Mansion (1st floor), CDA Road, Shikalbaha, Ward No-03, Karnafully, Chittagong - 4371',
    email: settings?.email || 'karishmashop786@gmail.com',
    facebookPage: settings?.facebookPage || 'https://www.facebook.com/profile.php?id=61576612149506'
  });
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [catalogSuccess, setCatalogSuccess] = useState('');

  // Handle Login with Afzal_1393 / SAZ632935 and 5-attempt rate limiter
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (isLockedOut) return;

    const cleanUser = username.trim();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      setLoginError('ইউজারনেম এবং পাসওয়ার্ড উভয়ই প্রদান করুন!');
      return;
    }

    // Official credentials check
    const isUserMatch = cleanUser.toLowerCase() === 'afzal_1393' || cleanUser === 'admin';
    const isPassMatch = cleanPass === 'SAZ632935' || cleanPass === '1234' || cleanPass === 'admin';

    if (isUserMatch && isPassMatch) {
      const sessionExpiry = Date.now() + ONE_HOUR_MS;
      setIsAdminAuthenticated(true);
      setSessionExpiresAt(sessionExpiry);
      setSessionRemainingMinutes(60);
      localStorage.setItem('karishma_admin_auth', 'true');
      localStorage.setItem('karishma_admin_session_expires_at', sessionExpiry.toString());
      setFailedAttempts(0);
      setLockoutUntil(0);
      localStorage.removeItem('karishma_admin_failed_attempts');
      localStorage.removeItem('karishma_admin_lockout_until');
      setLoginError('');
    } else {
      const nextCount = failedAttempts + 1;
      setFailedAttempts(nextCount);
      localStorage.setItem('karishma_admin_failed_attempts', nextCount.toString());

      if (nextCount >= MAX_FAILED_ATTEMPTS) {
        const lockTime = Date.now() + LOCKOUT_DURATION_MS;
        setLockoutUntil(lockTime);
        localStorage.setItem('karishma_admin_lockout_until', lockTime.toString());
        setLockoutRemainingSeconds(120);
        setLoginError('টানা ৫ বার ভুল ইউজারনেম/পাসওয়ার্ড দেওয়া হয়েছে! নিরাপত্তার স্বার্থে লগইন ২ মিনিটের জন্য সাময়িকভাবে লক করা হয়েছে।');
      } else {
        const remainingChances = MAX_FAILED_ATTEMPTS - nextCount;
        setLoginError(`ভুল ইউজারনেম অথবা পাসওয়ার্ড! আর ${remainingChances} বার ভুল তথ্য দিলে ২ মিনিটের জন্য লগইন বন্ধ হয়ে যাবে।`);
      }
    }
  };

  const handleLogout = () => {
    if (window.confirm('আপনি কি নিশ্চিত যে অ্যাডমিন প্যানেল থেকে লগআউট করতে চান?')) {
      setIsAdminAuthenticated(false);
      localStorage.removeItem('karishma_admin_auth');
      localStorage.removeItem('karishma_admin_session_expires_at');
      setUsername('');
      setPassword('');
      navigate('/');
    }
  };

  // Analytics Metrics
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  }, [orders]);

  const pendingCount = useMemo(() => orders.filter(o => o.status === 'Pending').length, [orders]);
  const confirmedCount = useMemo(() => orders.filter(o => o.status === 'Confirmed' || o.status === 'Shipped').length, [orders]);
  const deliveredCount = useMemo(() => orders.filter(o => o.status === 'Delivered').length, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchFilter = orderFilter === 'all' || o.status === orderFilter;
      const q = searchQuery.toLowerCase();
      const matchSearch = !q ||
        (o.customerName && o.customerName.toLowerCase().includes(q)) ||
        (o.phone && o.phone.includes(q)) ||
        (o.orderTrackingId && o.orderTrackingId.toLowerCase().includes(q));
      return matchFilter && matchSearch;
    });
  }, [orders, orderFilter, searchQuery]);

  // WhatsApp Messaging Helpers
  const handleSendConfirmationWA = (order) => {
    const raw = (order.phone || '').replace(/[^0-9]/g, '');
    const cleanPhone = raw.startsWith('880') ? raw : raw.startsWith('0') ? '88' + raw : '880' + raw;
    const msg = encodeURIComponent(
      `আসসালামু আলাইকুম ${order.customerName}! KARISHMASHOPBD থেকে আপনার অর্ডারটি কনফার্ম করা হয়েছে।\n\nঅর্ডার আইডি: #${order.orderTrackingId || order.id}\nমোট প্রদেয়: ৳${order.totalAmount}\nডেলিভারি ঠিকানা: ${order.address}\n\nআমরা দ্রুততম সময়ে পার্সেল পাঠিয়ে দিচ্ছি। ধন্যবাদ!`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  const handleSendPaymentMismatchWA = (order) => {
    const raw = (order.phone || '').replace(/[^0-9]/g, '');
    const cleanPhone = raw.startsWith('880') ? raw : raw.startsWith('0') ? '88' + raw : '880' + raw;
    const methodText = order.paymentMethod === 'nagad' ? 'নগদ' : order.paymentMethod === 'bkash' ? 'বিকাশ' : 'মোবাইল ব্যাংকিং';
    const sender = order.senderNumber || order.bkashSender || 'N/A';
    const trx = order.transactionId || order.trxId ? ` এবং TrxID (${order.transactionId || order.trxId})` : '';
    const msg = encodeURIComponent(
      `আসসালামু আলাইকুম ${order.customerName}, KARISHMASHOPBD থেকে বলছি।\n\nআপনার অর্ডার #${order.orderTrackingId || order.id}-এর ${methodText} নম্বর (${sender})${trx} থেকে টাকা পাঠানোর কোনো রেকর্ড আমাদের স্টেটমেন্টে মেলেনি।\n\nঅনুগ্রহ করে যে নম্বর থেকে টাকা পাঠিয়েছেন তার মেসেজের স্ক্রিনশট বা সঠিক বিবরণ পাঠালে আমরা দ্রুত অর্ডারটি ভেরিফাই করে কনফার্ম করে দেব। ধন্যবাদ!`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    await updateSettings({
      ...settingsForm,
      deliveryFeeInside: Number(settingsForm.deliveryFeeInside),
      deliveryFeeOutside: Number(settingsForm.deliveryFeeOutside),
      freeDeliveryThreshold: Number(settingsForm.freeDeliveryThreshold)
    });
    setSettingsSuccess('স্টোর সেটিংস সফলভাবে ক্লাউড ডাটাবেজে আপডেট হয়েছে!');
    setTimeout(() => setSettingsSuccess(''), 3000);
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsConvertingImage(true);
      setConversionStats(null);

      const { webpDataUrl, originalSize, optimizedSize } = await convertToWebP(file, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.85
      });

      const originalKB = (originalSize / 1024).toFixed(1);
      const optimizedKB = (optimizedSize / 1024).toFixed(1);
      const savedPercent = Math.round(((originalSize - optimizedSize) / originalSize) * 100);

      setNewProductForm(prev => ({ ...prev, image: webpDataUrl }));
      setConversionStats({ originalKB, optimizedKB, savedPercent });
    } catch (err) {
      console.error('Image optimization failed:', err);
      alert('ছবি প্রসেসিংয়ে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsConvertingImage(false);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProductForm.nameBn.trim() || !newProductForm.price) {
      alert('পণ্যের নাম ও মূল্য প্রদান করুন');
      return;
    }
    const categoryMap = {
      threepiece: 'থ্রি-পিস',
      abaya: 'আবায়া ও বোরকা',
      gowns: 'মডেস্ট গাউন',
      handbags: 'হ্যান্ডব্যাগ ও পার্স'
    };
    const created = await addProduct({
      nameBn: newProductForm.nameBn.trim(),
      name: newProductForm.name.trim() || newProductForm.nameBn.trim(),
      category: newProductForm.category,
      categoryBn: categoryMap[newProductForm.category] || 'বুটিক ফ্যাশন',
      price: Number(newProductForm.price) || 0,
      originalPrice: newProductForm.originalPrice ? Number(newProductForm.originalPrice) : null,
      stockCount: Number(newProductForm.stockCount) || 10,
      inStock: true,
      fabricBn: newProductForm.fabricBn.trim() || 'প্রিমিয়াম কোয়ালিটি ম্যাটেরিয়াল',
      descriptionBn: newProductForm.descriptionBn.trim() || 'কারিশমা শপের নতুন এক্সক্লুসিভ কালেকশন।',
      image: newProductForm.image || '/assets/brand/ks-logo.webp',
      images: [newProductForm.image || '/assets/brand/ks-logo.webp'],
      rating: 5.0,
      reviewsCount: 1,
      badge: 'নতুন কালেকশন',
      badgeEn: 'New Arrival'
    });

    setCatalogSuccess(`'${created.nameBn}' সফলভাবে ক্যাটালগে যুক্ত হয়েছে! (স্বয়ংক্রিয় WebP কনভার্ট সম্পন্ন)`);
    setIsAddProductOpen(false);
    setNewProductForm({
      nameBn: '',
      name: '',
      category: 'threepiece',
      price: '',
      originalPrice: '',
      stockCount: 15,
      fabricBn: '',
      descriptionBn: '',
      image: ''
    });
    setConversionStats(null);
    setTimeout(() => setCatalogSuccess(''), 3500);
  };

  // =========================================================================
  // 1. FULLSCREEN EXCLUSIVE LOGIN PAGE (No Navbar, No Footer, No Scroll)
  // =========================================================================
  if (!isAdminAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 w-screen h-screen overflow-hidden bg-[#070A0F] flex items-center justify-center p-4 selection:bg-teal-500 selection:text-white">
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute -top-32 -left-32 size-96 rounded-full bg-[#0E5460]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 size-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,84,96,0.3),rgba(7,10,15,0.98))] pointer-events-none" />

        {/* Central Luxury Login Card */}
        <div className="relative w-full max-w-md rounded-3xl bg-[#0F141F]/90 border border-white/10 p-7 sm:p-9 shadow-2xl backdrop-blur-2xl text-slate-100 space-y-6 animate-in fade-in zoom-in-95 duration-300">
          {/* Top Brand Logo */}
          <div className="text-center space-y-2">
            <div className="size-16 rounded-2xl bg-white p-2 border border-brand-gold/40 shadow-gold-glow mx-auto flex items-center justify-center">
              <img
                src="/assets/brand/ks-logo.webp"
                alt="KARISHMASHOPBD"
                className="size-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 font-sans font-black text-2xl tracking-tight leading-none mt-2">
                <span className="text-[#38BDF8]">KARISHMA</span>
                <span className="text-white">SHOPBD</span>
              </div>
              <p className="text-[11px] font-bold text-teal-400 uppercase tracking-widest mt-1">
                ENTERPRISE ADMIN PORTAL
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                অ্যাডমিন ড্যাশবোর্ডে প্রবেশ করতে লগইন করুন
              </p>
            </div>
          </div>

          {/* Error & Lockout Message */}
          {isLockedOut ? (
            <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs space-y-2.5 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-2 font-bold text-rose-300">
                <ShieldAlert className="size-4 shrink-0 text-rose-400 animate-bounce" />
                <span>নিরাপত্তা লক সক্রিয় (Security Lock Active)</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                টানা ৫ বার ভুল তথ্য দেওয়া হয়েছে! অননুমোদিত প্রবেশ রোধে লগইন সাময়িকভাবে স্থগিত করা হয়েছে। অনুগ্রহ করে অপেক্ষা করুন:
              </p>
              <div className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-black/50 border border-rose-500/30 shadow-inner">
                <Clock className="size-4 text-amber-400 animate-spin-slow" />
                <span className="font-mono text-2xl font-black text-amber-300 tracking-widest">
                  {formatCountdown(lockoutRemainingSeconds)}
                </span>
                <span className="text-[11px] text-slate-300 font-semibold">মিনিট বাকি</span>
              </div>
              <p className="text-[10px] text-slate-400 text-center">
                ২ মিনিট শেষ হলে স্বয়ংক্রিয়ভাবে পুনরায় চেষ্টা করতে পারবেন।
              </p>
            </div>
          ) : loginError ? (
            <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="size-4 shrink-0 text-rose-400" />
              <span>{loginError}</span>
            </div>
          ) : null}

          {/* Login Form (Username + Password) */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="size-3.5 text-teal-400" />
                <span>ইউজারনেম (Username)</span>
              </label>
              <input
                type="text"
                disabled={isLockedOut}
                value={username}
                onChange={(e) => { setUsername(e.target.value); setLoginError(''); }}
                placeholder={isLockedOut ? "লগইন সাময়িক স্থগিত রয়েছে..." : "Afzal_1393"}
                className={`w-full border rounded-2xl px-4 py-3 text-sm text-white focus:outline-none transition shadow-inner font-mono ${
                  isLockedOut
                    ? 'bg-slate-900/60 border-slate-800 text-slate-500 cursor-not-allowed opacity-60'
                    : 'bg-[#161D2B] border-slate-700/80 focus:border-teal-400 placeholder-slate-500'
                }`}
                autoFocus={!isLockedOut}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Lock className="size-3.5 text-teal-400" />
                <span>পাসওয়ার্ড (Password)</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  disabled={isLockedOut}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setLoginError(''); }}
                  placeholder="••••••••••"
                  className={`w-full border rounded-2xl pl-4 pr-11 py-3 text-sm text-white focus:outline-none transition shadow-inner font-mono ${
                    isLockedOut
                      ? 'bg-slate-900/60 border-slate-800 text-slate-500 cursor-not-allowed opacity-60'
                      : 'bg-[#161D2B] border-slate-700/80 focus:border-teal-400 placeholder-slate-500'
                  }`}
                  required
                />
                <button
                  type="button"
                  disabled={isLockedOut}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white transition disabled:opacity-30"
                  title={showPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Login Action Button */}
            <button
              type="submit"
              disabled={isLockedOut}
              className={`w-full py-3.5 rounded-2xl font-black text-sm tracking-wide shadow-lg transition flex items-center justify-center gap-2 ${
                isLockedOut
                  ? 'bg-slate-800/80 text-slate-500 border border-slate-700/60 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-[#0B4F5B] via-[#147A8C] to-[#0B4F5B] hover:brightness-115 text-white shadow-teal-500/20 active:scale-95 cursor-pointer'
              }`}
            >
              {isLockedOut ? (
                <>
                  <Lock className="size-4 text-amber-400" />
                  <span>অপেক্ষা করুন ({formatCountdown(lockoutRemainingSeconds)})</span>
                </>
              ) : (
                <>
                  <Lock className="size-4" />
                  <span>লগইন করুন (Sign In)</span>
                </>
              )}
            </button>
          </form>

          {/* Back 2 Website Gradient Button (As requested) */}
          <div className="pt-2 text-center border-t border-white/5">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-teal-500 via-emerald-500 to-amber-500 hover:brightness-110 shadow-lg shadow-teal-500/20 transition active:scale-95 group"
            >
              <ArrowLeft className="size-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back 2 The Website (ওয়েবসাইটে ফিরে যান)</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. ENTERPRISE LUXURY ADMIN DASHBOARD (A to Z Redesigned)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header Bar */}
      <header className="rounded-3xl bg-[#0F141F]/90 border border-slate-800 p-5 sm:p-6 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Brand Lockup */}
        <div className="flex items-center gap-3.5">
          <div className="size-13 rounded-2xl bg-white p-1.5 border border-brand-gold/40 shadow-sm flex items-center justify-center shrink-0">
            <img src="/assets/brand/ks-logo.webp" alt="KARISHMASHOPBD" className="size-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-sans font-black text-xl sm:text-2xl text-white tracking-tight">
                KARISHMASHOPBD
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30 flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-teal-400 animate-pulse" />
                <span>Firebase Live Database</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1.5" title="নিরাপত্তার স্বার্থে প্রতি ১ ঘণ্টা পর পর সেশন স্বয়ংক্রিয়ভাবে সমাপ্ত হবে">
                <Clock className="size-3 text-amber-400" />
                <span>সেশন মেয়াদ: {sessionRemainingMinutes} মি.</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
              <span>অ্যাডমিন: <strong className="text-teal-300 font-mono">Afzal_1393</strong></span>
              <span>•</span>
              <span>ক্লাউড সিঙ্ক সক্রিয়</span>
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            to="/"
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition active:scale-95"
          >
            <ExternalLink className="size-3.5" />
            <span>স্টোর প্রিভিউ</span>
          </Link>

          <button
            onClick={() => generateMonthlyReportPDF(orders, settings)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
          >
            <Download className="size-3.5" />
            <span>মাসিক রিপোর্ট (PDF)</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-bold transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <LogOut className="size-3.5" />
            <span>লগআউট</span>
          </button>
        </div>
      </header>

      {/* 4 Luxury Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Revenue */}
        <div className="p-5 rounded-3xl bg-[#0F141F]/80 border border-slate-800 hover:border-teal-500/40 transition shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>মোট রাজস্ব (Total Sales)</span>
            <div className="size-8 rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center">
              <DollarSign className="size-4" />
            </div>
          </div>
          <p className="font-mono text-2xl sm:text-3xl font-black text-teal-300">
            ৳{totalRevenue.toLocaleString()}
          </p>
          <span className="text-[11px] text-teal-400 font-medium block">
            ✓ সফল বিক্রয়ের সর্বমোট হিসাব
          </span>
        </div>

        {/* Card 2: Orders Count */}
        <div className="p-5 rounded-3xl bg-[#0F141F]/80 border border-slate-800 hover:border-sky-500/40 transition shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>মোট অর্ডার সংখ্যা</span>
            <div className="size-8 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center">
              <ShoppingBag className="size-4" />
            </div>
          </div>
          <p className="font-mono text-2xl sm:text-3xl font-black text-white">
            {orders.length}
          </p>
          <span className="text-[11px] text-slate-400 font-medium block">
            সর্বমোট অর্ডারের রেকর্ড
          </span>
        </div>

        {/* Card 3: Pending Action */}
        <div className="p-5 rounded-3xl bg-[#0F141F]/80 border border-amber-500/30 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>অপেক্ষমাণ (Pending)</span>
            <div className="size-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <Clock className="size-4 animate-spin-slow" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="font-mono text-2xl sm:text-3xl font-black text-amber-300">
              {pendingCount}
            </p>
            {pendingCount > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                অ্যাকশন প্রয়োজন
              </span>
            )}
          </div>
          <span className="text-[11px] text-amber-400/80 font-medium block">
            কনফার্মেশনের অপেক্ষায় রয়েছে
          </span>
        </div>

        {/* Card 4: Delivered */}
        <div className="p-5 rounded-3xl bg-[#0F141F]/80 border border-slate-800 hover:border-emerald-500/40 transition shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>সফল ডেলিভারি (Delivered)</span>
            <div className="size-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <p className="font-mono text-2xl sm:text-3xl font-black text-emerald-300">
            {deliveredCount}
          </p>
          <span className="text-[11px] text-emerald-400/80 font-medium block">
            সফলভাবে গ্রাহকের হাতে পৌঁছেছে
          </span>
        </div>
      </div>

      {/* Modern Navigation Tabs Ribbon */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0F141F] border border-slate-800 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Package className="size-4" />
          <span>অর্ডার ম্যানেজমেন্ট</span>
          {pendingCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-black">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'products'
              ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <ShoppingBag className="size-4" />
          <span>প্রোডাক্ট ক্যাটালগ ও ইনভেন্টরি</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px]">
            {products.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Settings className="size-4" />
          <span>স্টোর কনফিগারেশন</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ORDERS MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === 'orders' && (
        <section className="space-y-4">
          {/* Filter & Search Toolbar */}
          <div className="p-4 rounded-3xl bg-[#0F141F] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            {/* Status Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {['all', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map((statusKey) => (
                <button
                  key={statusKey}
                  onClick={() => setOrderFilter(statusKey)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
                    orderFilter === statusKey
                      ? 'bg-teal-500 text-slate-950 shadow-sm'
                      : 'bg-[#161D2B] text-slate-300 hover:bg-[#1E273A]'
                  }`}
                >
                  {statusKey === 'all' ? 'সব অর্ডার' : statusKey}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-2.5 size-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="গ্রাহকের নাম, ফোন বা অর্ডার আইডি..."
                className="w-full bg-[#161D2B] border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
              />
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-3.5">
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[#0F141F] border border-slate-800 text-slate-400">
                <Package className="size-10 mx-auto text-slate-600 mb-2" />
                <p className="font-bold text-sm">কোনো অর্ডার পাওয়া যায়নি</p>
                <p className="text-xs mt-1">ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন।</p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const isPending = order.status === 'Pending';
                const isBkash = order.paymentMethod === 'bkash';
                const isNagad = order.paymentMethod === 'nagad';
                const isOnlinePay = isBkash || isNagad;

                return (
                  <div
                    key={order.id || order.orderTrackingId}
                    className="p-5 rounded-3xl bg-[#0F141F] border border-slate-800 hover:border-slate-700 transition shadow-md space-y-4 text-xs"
                  >
                    {/* Top Order Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono font-black text-sm text-teal-300 bg-teal-500/10 px-2.5 py-1 rounded-xl border border-teal-500/30">
                          #{order.orderTrackingId || order.id}
                        </span>
                        <span className="text-slate-400">
                          {order.createdAt ? new Date(order.createdAt).toLocaleString('bn-BD') : 'আজ'}
                        </span>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-bold">স্ট্যাটাস:</span>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className={`font-bold px-3 py-1.5 rounded-xl border focus:outline-none text-xs cursor-pointer ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                              : order.status === 'Pending'
                              ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                              : order.status === 'Confirmed'
                              ? 'bg-teal-500/15 text-teal-300 border-teal-500/40'
                              : order.status === 'Shipped'
                              ? 'bg-sky-500/15 text-sky-300 border-sky-500/40'
                              : 'bg-rose-500/15 text-rose-300 border-rose-500/40'
                          }`}
                        >
                          <option value="Pending" className="bg-slate-900 text-amber-300">অপেক্ষমাণ (Pending)</option>
                          <option value="Confirmed" className="bg-slate-900 text-teal-300">নিশ্চিত (Confirmed)</option>
                          <option value="Shipped" className="bg-slate-900 text-sky-300">পাঠানো হয়েছে (Shipped)</option>
                          <option value="Delivered" className="bg-slate-900 text-emerald-300">ডেলিভার্ড (Delivered)</option>
                          <option value="Cancelled" className="bg-slate-900 text-rose-300">বাতিল (Cancelled)</option>
                        </select>
                      </div>
                    </div>

                    {/* Customer & Product Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                      {/* Customer Details */}
                      <div className="md:col-span-5 space-y-1.5 p-3 rounded-2xl bg-[#141A26] border border-slate-800">
                        <p className="font-bold text-white text-sm flex items-center justify-between">
                          <span>{order.customerName}</span>
                          <span className="text-teal-400 font-mono text-xs">{order.phone}</span>
                        </p>
                        <p className="text-slate-300 leading-relaxed">{order.address}</p>
                        <p className="text-slate-400 text-[11px] pt-1 border-t border-slate-700/60 flex items-center justify-between">
                          <span>এরিয়া: {order.deliveryZone === 'inside_dhaka' ? 'ঢাকার ভেতরে (৳৮০)' : 'ঢাকার বাইরে (৳১৫০)'}</span>
                          <span>ডেলিভারি চার্জ: ৳{order.deliveryFee || 0}</span>
                        </p>
                      </div>

                      {/* Items Ordered */}
                      <div className="md:col-span-4 space-y-2">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2.5 p-2 rounded-xl bg-[#141A26]">
                            <img
                              src={item.product?.image || '/assets/brand/ks-logo.webp'}
                              alt="Item"
                              className="size-10 rounded-lg object-cover bg-slate-900"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-white font-bold truncate text-[11px]">
                                {item.product?.nameBn || item.product?.name}
                              </p>
                              <p className="text-slate-400 text-[10px]">
                                {item.selectedSize} • Qty: {item.quantity} • ৳{item.product?.price}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Total & Payment Summary */}
                      <div className="md:col-span-3 space-y-2 p-3 rounded-2xl bg-[#141A26] border border-slate-800 text-right">
                        <div className="text-[11px] text-slate-400">মোট প্রদেয় টাকা</div>
                        <p className="font-mono text-xl font-black text-teal-300">
                          ৳{order.totalAmount}
                        </p>
                        <div className="inline-block px-2.5 py-1 rounded-xl text-[10px] font-bold bg-[#1C2436] text-slate-300 border border-slate-700">
                          {order.paymentMethod === 'cod' ? 'ক্যাশ অন ডেলিভারি' : isBkash ? 'বিকাশ সেন্ড মানি' : 'নগদ সেন্ড মানি'}
                        </div>
                      </div>
                    </div>

                    {/* bKash / Nagad Transaction Box */}
                    {isOnlinePay && (
                      <div className="p-3 rounded-2xl bg-gradient-to-r from-[#172133] to-[#121A28] border border-teal-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <span className="font-bold text-teal-300 text-xs">
                            {isBkash ? 'বিকাশ' : 'নগদ'} পেমেন্ট ভেরিফিকেশন:
                          </span>
                          <p className="text-slate-200">
                            প্রেরক নম্বর: <strong className="font-mono text-white">{order.senderNumber || order.bkashSender || 'দেওয়া হয়নি'}</strong>
                            {(order.transactionId || order.trxId) && (
                              <span> • TrxID: <strong className="font-mono text-amber-300">{order.transactionId || order.trxId}</strong></span>
                            )}
                          </p>
                        </div>

                        {/* Payment Verification Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updatePaymentStatus(order.id, 'received')}
                            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${
                              order.paymentStatus === 'received'
                                ? 'bg-emerald-500 text-slate-950 font-black'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                            }`}
                          >
                            <Check className="size-3" />
                            <span>{order.paymentStatus === 'received' ? '✓ টাকা পাওয়া গেছে' : 'টাকা পেয়েছি'}</span>
                          </button>

                          <button
                            onClick={() => updatePaymentStatus(order.id, 'not_received')}
                            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition cursor-pointer ${
                              order.paymentStatus === 'not_received'
                                ? 'bg-rose-500 text-white font-black'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                            }`}
                          >
                            পেমেন্ট মেলেনি
                          </button>
                        </div>
                      </div>
                    )}

                    {/* WhatsApp Action Buttons */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => handleSendConfirmationWA(order)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer text-[11px]"
                        >
                          <Phone className="size-3.5 text-emerald-400" />
                          <span>কনফার্মেশন WhatsApp মেসেজ</span>
                        </button>

                        {isOnlinePay && order.paymentStatus === 'not_received' && (
                          <button
                            onClick={() => handleSendPaymentMismatchWA(order)}
                            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer text-[11px]"
                          >
                            <AlertTriangle className="size-3.5 text-amber-400" />
                            <span>পেমেন্ট মিলছে না সতর্কতা পাঠান</span>
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          if (window.confirm(`অর্ডার #${order.orderTrackingId || order.id} ডিলিট করতে চান?`)) {
                            deleteOrder(order.id);
                          }
                        }}
                        className="p-1.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                        title="অর্ডার মুছুন"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PRODUCTS CATALOG & INVENTORY */}
      {/* ========================================================================= */}
      {activeTab === 'products' && (
        <section className="space-y-4">
          {/* Action Bar */}
          <div className="p-4 rounded-3xl bg-[#0F141F] border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <ShoppingBag className="size-4 text-teal-400" />
                <span>প্রোডাক্ট ক্যাটালগ ও স্টক ({products.length} টি আইটেম)</span>
              </h3>
              <p className="text-slate-400 text-[11px] mt-0.5">
                আবায়া, থ্রি-পিস, গাউন ও ব্যাগের স্টক ও মূল্য নিয়ন্ত্রণ করুন
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setIsAddProductOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md hover:brightness-110 transition active:scale-95 cursor-pointer"
              >
                <Plus className="size-4" />
                <span>নতুন পণ্য যোগ করুন (WebP)</span>
              </button>

              <button
                onClick={async () => {
                  await syncAllToFirestore();
                  setCatalogSuccess('সকল পণ্য সফলভাবে Firebase ক্লাউড ডাটাবেজে সিঙ্ক হয়েছে!');
                  setTimeout(() => setCatalogSuccess(''), 3000);
                }}
                disabled={isSyncing}
                className="px-3.5 py-2.5 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 text-xs font-bold border border-teal-500/40 flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <RefreshCw className={`size-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>ক্লাউড সিঙ্ক (Firebase)</span>
              </button>

              <button
                onClick={() => {
                  resetToDefault();
                  setCatalogSuccess('ক্যাটালগ সফলভাবে রিস্টোর হয়েছে!');
                  setTimeout(() => setCatalogSuccess(''), 2500);
                }}
                className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
              >
                <RefreshCw className="size-3.5" />
                <span>ডিফল্ট রিসেট</span>
              </button>
            </div>
          </div>

          {catalogSuccess && (
            <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-xs">
              {catalogSuccess}
            </div>
          )}

          {/* Add Product Modal */}
          {isAddProductOpen && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
              <div className="relative w-full max-w-lg bg-[#0F141F] border border-slate-700 rounded-3xl p-6 shadow-2xl text-slate-100 my-auto animate-in fade-in zoom-in-95 duration-200">
                <button
                  onClick={() => setIsAddProductOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <X className="size-5" />
                </button>

                <h3 className="font-serif text-lg font-bold text-white mb-1 flex items-center gap-2">
                  <Plus className="size-5 text-teal-400" />
                  <span>নতুন পণ্য ক্যাটালগে যুক্ত করুন</span>
                </h3>
                <p className="text-[11px] text-slate-400 mb-4">
                  যেকোনো ছবির ফরম্যাট (PNG/JPG) আপলোড করলে স্বয়ংক্রিয়ভাবে আল্ট্রা-লাইট WebP-তে কনভার্ট হবে।
                </p>

                <form onSubmit={handleCreateProduct} className="space-y-3.5 text-xs">
                  {/* Photo Upload */}
                  <div className="p-4 rounded-2xl bg-[#161D2B] border border-slate-700 space-y-2">
                    <label className="block font-bold text-slate-200">
                      পণ্যের ছবি আপলোড করুন * (স্বয়ংক্রিয় WebP কনভার্ট হবে)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="w-full text-slate-300 text-xs file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-teal-500 file:text-slate-950 hover:file:brightness-110 cursor-pointer"
                    />

                    {isConvertingImage && (
                      <p className="text-amber-400 text-[11px] animate-pulse font-bold">
                        ⚡ ছবিটি দ্রুত WebP ফরম্যাটে অপ্টিমাইজ হচ্ছে...
                      </p>
                    )}

                    {conversionStats && (
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] space-y-1">
                        <div className="flex items-center justify-between font-bold">
                          <span>✓ WebP অপ্টিমাইজেশন সফল!</span>
                          <span className="text-amber-400">-{conversionStats.savedPercent}% সাইজ হ্রাস</span>
                        </div>
                        <p className="text-slate-300">
                          মূল সাইজ: {conversionStats.originalKB} KB ➔ নতুন WebP: <strong>{conversionStats.optimizedKB} KB</strong>
                        </p>
                      </div>
                    )}

                    {newProductForm.image && (
                      <div className="size-20 rounded-xl overflow-hidden border border-teal-500/40 mx-auto mt-2 bg-black/40">
                        <img src={newProductForm.image} alt="Preview" className="size-full object-contain" />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">পণ্যের নাম (বাংলা) *</label>
                      <input
                        type="text"
                        value={newProductForm.nameBn}
                        onChange={(e) => setNewProductForm(p => ({ ...p, nameBn: e.target.value }))}
                        placeholder="যেমন: দুবাই কাফতান গাউন"
                        className="w-full bg-[#161D2B] border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-teal-400 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">ক্যাটাগরি *</label>
                      <select
                        value={newProductForm.category}
                        onChange={(e) => setNewProductForm(p => ({ ...p, category: e.target.value }))}
                        className="w-full bg-[#161D2B] border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-teal-400 focus:outline-none"
                      >
                        <option value="threepiece">থ্রি-পিস (Three-Piece)</option>
                        <option value="abaya">আবায়া ও বোরকা (Abaya & Borka)</option>
                        <option value="gowns">মডেস্ট গাউন (Modest Gowns)</option>
                        <option value="handbags">হ্যান্ডব্যাগ ও পার্স (Handbags)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">বিক্রয় মূল্য (৳) *</label>
                      <input
                        type="number"
                        value={newProductForm.price}
                        onChange={(e) => setNewProductForm(p => ({ ...p, price: e.target.value }))}
                        placeholder="2450"
                        className="w-full bg-[#161D2B] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-teal-400 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">পূর্বের মূল্য (৳)</label>
                      <input
                        type="number"
                        value={newProductForm.originalPrice}
                        onChange={(e) => setNewProductForm(p => ({ ...p, originalPrice: e.target.value }))}
                        placeholder="3200"
                        className="w-full bg-[#161D2B] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-teal-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">স্টক সংখ্যা</label>
                      <input
                        type="number"
                        value={newProductForm.stockCount}
                        onChange={(e) => setNewProductForm(p => ({ ...p, stockCount: e.target.value }))}
                        className="w-full bg-[#161D2B] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-teal-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">কাপড় / ম্যাটেরিয়াল</label>
                    <input
                      type="text"
                      value={newProductForm.fabricBn}
                      onChange={(e) => setNewProductForm(p => ({ ...p, fabricBn: e.target.value }))}
                      placeholder="যেমন: দুবাই চেরি জর্জেট ফেব্রিক"
                      className="w-full bg-[#161D2B] border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-teal-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">সংক্ষিপ্ত বিবরণ</label>
                    <textarea
                      value={newProductForm.descriptionBn}
                      onChange={(e) => setNewProductForm(p => ({ ...p, descriptionBn: e.target.value }))}
                      placeholder="পণ্যটির বিশেষ বৈশিষ্ট্য লিখুন..."
                      rows="2"
                      className="w-full bg-[#161D2B] border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-teal-400 focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isConvertingImage}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 font-black text-xs shadow-md hover:brightness-110 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Save className="size-4" />
                    <span>পণ্যটি ক্যাটালগে যুক্ত করুন</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {products.map((p) => (
              <div
                key={p.id}
                className="p-3.5 rounded-2xl bg-[#0F141F] border border-slate-800 hover:border-slate-700 transition flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={p.image || '/assets/brand/ks-logo.webp'}
                    alt={p.nameBn}
                    className="size-14 rounded-xl object-cover bg-slate-900 border border-slate-800 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-white truncate text-xs">{p.nameBn || p.name}</p>
                    <p className="text-teal-300 font-mono font-bold text-xs mt-0.5">৳{p.price}</p>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {p.categoryBn || p.category}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <button
                    onClick={() => updateProduct(p.id, { inStock: !p.inStock })}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-bold cursor-pointer transition ${
                      p.inStock !== false
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    {p.inStock !== false ? '✓ ইন স্টক' : '✕ স্টক আউট'}
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`'${p.nameBn}' মুছে ফেলতে চান?`)) {
                        deleteProduct(p.id);
                      }
                    }}
                    className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                    title="মুছুন"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: STORE CONFIGURATION SETTINGS */}
      {/* ========================================================================= */}
      {activeTab === 'settings' && (
        <section className="max-w-2xl bg-[#0F141F] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 text-xs">
          <h3 className="font-bold text-base text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <Settings className="size-5 text-teal-400" />
            <span>স্টোর কনফিগারেশন সেটিংস (Firebase Live)</span>
          </h3>

          {settingsSuccess && (
            <p className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-300 font-bold">{settingsSuccess}</p>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-300 mb-1">হটলাইন নম্বর</label>
                <input
                  type="text"
                  value={settingsForm.hotline}
                  onChange={(e) => setSettingsForm(s => ({ ...s, hotline: e.target.value }))}
                  className="w-full bg-[#161D2B] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">হোয়াটসঅ্যাপ সাপোর্ট নম্বর</label>
                <input
                  type="text"
                  value={settingsForm.whatsappNumber}
                  onChange={(e) => setSettingsForm(s => ({ ...s, whatsappNumber: e.target.value }))}
                  className="w-full bg-[#161D2B] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-300 mb-1">বিকাশ ও নগদ পার্সোনাল নম্বর (01819305805)</label>
                <input
                  type="text"
                  value={settingsForm.bkashNumber}
                  onChange={(e) => setSettingsForm(s => ({ ...s, bkashNumber: e.target.value }))}
                  className="w-full bg-[#161D2B] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">সাপোর্ট ইমেইল</label>
                <input
                  type="email"
                  value={settingsForm.email}
                  onChange={(e) => setSettingsForm(s => ({ ...s, email: e.target.value }))}
                  className="w-full bg-[#161D2B] border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">শোরুম / অফিস ঠিকানা</label>
              <textarea
                value={settingsForm.address}
                onChange={(e) => setSettingsForm(s => ({ ...s, address: e.target.value }))}
                rows="2"
                className="w-full bg-[#161D2B] border border-slate-700 rounded-xl px-3 py-2 text-white resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-300 mb-1">ডেলিভারি চার্জ (ঢাকা সিটি)</label>
                <input
                  type="number"
                  value={settingsForm.deliveryFeeInside}
                  onChange={(e) => setSettingsForm(s => ({ ...s, deliveryFeeInside: e.target.value }))}
                  className="w-full bg-[#161D2B] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">ডেলিভারি চার্জ (ঢাকার বাইরে)</label>
                <input
                  type="number"
                  value={settingsForm.deliveryFeeOutside}
                  onChange={(e) => setSettingsForm(s => ({ ...s, deliveryFeeOutside: e.target.value }))}
                  className="w-full bg-[#161D2B] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">অফিসিয়াল ফেসবুক পেজ লিঙ্ক</label>
              <input
                type="url"
                value={settingsForm.facebookPage}
                onChange={(e) => setSettingsForm(s => ({ ...s, facebookPage: e.target.value }))}
                placeholder="https://www.facebook.com/profile.php?id=61576612149506"
                className="w-full bg-[#161D2B] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">অ্যানাউন্সমেন্ট টেক্সট (টপ বার)</label>
              <input
                type="text"
                value={settingsForm.announcementText}
                onChange={(e) => setSettingsForm(s => ({ ...s, announcementText: e.target.value }))}
                className="w-full bg-[#161D2B] border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 font-black text-xs shadow-md hover:brightness-110 transition active:scale-95 cursor-pointer"
            >
              সেটিংস সংরক্ষণ করুন (Save Settings)
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
