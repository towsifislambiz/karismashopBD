import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight, Trash2, Zap, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import OneClickOrderModal from '../components/OneClickOrderModal';

export default function WishlistPage() {
  const { lang, t } = useLanguage();
  const { wishlist, removeFromWishlist, clearWishlist, addToCart } = useCart();
  const [selectedProductForOrder, setSelectedProductForOrder] = React.useState(null);

  const handleAddAllToCart = () => {
    wishlist.forEach(product => {
      addToCart(product, 1);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 min-h-[70vh]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <Link
            to="/shop"
            className="text-xs font-bold text-brand-goldDark hover:text-slate-900 flex items-center gap-1.5 mb-1.5 transition"
          >
            <ArrowLeft className="size-3.5" />
            <span>{lang === 'bn' ? 'শপে ফিরে যান' : 'Continue Shopping'}</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              {lang === 'bn' ? 'আমার পছন্দের তালিকা (উইশলিস্ট)' : 'My Wishlist'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-gold/15 text-brand-goldDark border border-brand-gold/30">
              {wishlist.length} {lang === 'bn' ? 'টি পণ্য' : 'items'}
            </span>
          </div>
        </div>

        {wishlist.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleAddAllToCart}
              className="btn-gold-primary px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5"
            >
              <ShoppingBag className="size-4" />
              <span>{lang === 'bn' ? 'সব কার্টে যোগ করুন' : 'Add All to Cart'}</span>
            </button>
            <button
              onClick={clearWishlist}
              className="px-3 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-300 text-xs font-bold flex items-center gap-1 transition"
            >
              <Trash2 className="size-3.5" />
              <span>{lang === 'bn' ? 'তালিকা মুছুন' : 'Clear All'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {wishlist.length === 0 ? (
        <div className="max-w-md mx-auto py-16 text-center space-y-4">
          <div className="size-20 rounded-full bg-white border border-brand-gold/30 shadow-luxury-white mx-auto flex items-center justify-center text-brand-goldDark">
            <Heart className="size-9 stroke-[1.5]" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-serif font-bold text-slate-900">
              {lang === 'bn' ? 'আপনার উইশলিস্টে কোনো পণ্য নেই' : 'Your Wishlist is Empty'}
            </h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              {lang === 'bn'
                ? 'পছন্দের থ্রি-পিস, দুবাই আবায়া কিংবা লাক্সারি হ্যান্ডব্যাগের হার্ট আইকনে ক্লিক করে সহজেই এখানে সেভ করে রাখুন।'
                : 'Browse our exclusive catalog and click the heart icon on any product to save it here.'}
            </p>
          </div>
          <Link
            to="/shop"
            className="btn-gold-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black shadow-md mt-2"
          >
            <span>{lang === 'bn' ? 'কালেকশন এক্সপ্লোর করুন' : 'Explore Collections'}</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      ) : (
        /* Wishlist Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlist.map((product) => {
            const discountPercent = product.originalPrice
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 0;

            return (
              <div
                key={product.id}
                className="group flex flex-col rounded-3xl bg-white border border-brand-gold/30 hover:border-brand-gold transition-all duration-300 shadow-luxury-white hover:shadow-luxury-white-hover overflow-hidden"
              >
                {/* Image */}
                <div className="relative aspect-[3/4] w-full bg-[#F8F9FA] p-3 flex items-center justify-center border-b border-slate-100 overflow-hidden">
                  <Link to={`/product/${product.id}`} className="size-full flex items-center justify-center">
                    <img
                      src={product.image || product.images?.[0] || '/assets/brand/logo.png'}
                      alt={product.name}
                      className="size-full object-contain group-hover:scale-105 transition duration-500"
                    />
                  </Link>

                  {/* Discount Badge */}
                  {discountPercent > 0 && (
                    <span className="badge-gold-foil absolute top-3 left-3 text-[10px] font-black px-2 py-0.5 rounded shadow">
                      -{discountPercent}%
                    </span>
                  )}

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-3 right-3 size-8 rounded-full bg-white/90 border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-300 flex items-center justify-center shadow transition"
                    title={lang === 'bn' ? 'উইশলিস্ট থেকে মুছুন' : 'Remove'}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>

                {/* Info */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-brand-goldDark uppercase tracking-wider block font-sans">
                      {lang === 'bn' ? product.categoryBn : product.category}
                    </span>
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-serif text-sm font-bold text-slate-900 hover:text-brand-goldDark transition line-clamp-2">
                        {lang === 'bn' ? product.nameBn : product.name}
                      </h3>
                    </Link>
                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="font-mono text-base font-black text-brand-goldDark">
                        ৳{product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="font-mono text-xs text-slate-400 line-through">
                          ৳{product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedProductForOrder(product)}
                      className="btn-gold-primary py-2 px-1 rounded-xl text-[11px] font-black flex items-center justify-center gap-1"
                    >
                      <Zap className="size-3" />
                      <span className="whitespace-nowrap tracking-tight">{lang === 'bn' ? 'অর্ডার' : 'Order'}</span>
                    </button>
                    <button
                      onClick={() => addToCart(product, 1)}
                      className="btn-black-secondary py-2 px-1 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1"
                    >
                      <ShoppingBag className="size-3 text-brand-gold" />
                      <span className="whitespace-nowrap tracking-tight">{lang === 'bn' ? 'কার্টে' : 'Add'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 1-Click Order Modal */}
      {selectedProductForOrder && (
        <OneClickOrderModal
          isOpen={!!selectedProductForOrder}
          onClose={() => setSelectedProductForOrder(null)}
          product={selectedProductForOrder}
        />
      )}
    </div>
  );
}
