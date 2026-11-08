import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import CustomerAuthModal from './components/CustomerAuthModal';
import FloatingWhatsApp from './components/FloatingWhatsApp';

// Code-split pages for blazing fast initial mobile load
const HomePage = lazy(() => import('./pages/HomePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'));
const CustomerAccountPage = lazy(() => import('./pages/CustomerAccountPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Ultra-light skeleton fallback while routing
function PageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 animate-pulse space-y-6">
      <div className="h-48 sm:h-80 rounded-3xl bg-slate-100 border border-slate-200/60" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="aspect-[3/4] rounded-2xl bg-slate-100 border border-slate-200/40" />
        ))}
      </div>
    </div>
  );
}

// Auto scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const navigate = useNavigate();

  // Agency Secret: Pressing Ctrl+Shift+A opens hidden Admin Panel
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        navigate('/admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden relative bg-brand-canvas text-brand-textDark selection:bg-brand-gold selection:text-brand-noir">
      <ScrollToTop />
      <Navbar />

      <main className="flex-1">
        <Suspense fallback={<PageSkeleton />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success/:trackingId" element={<OrderSuccessPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/account" element={<CustomerAccountPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
      <CartDrawer />
      <CustomerAuthModal />
      <FloatingWhatsApp />
    </div>
  );
}
