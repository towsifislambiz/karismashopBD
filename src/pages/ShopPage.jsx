import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { categories } from '../data/products';
import ProductCard from '../components/ProductCard';
import OneClickOrderModal from '../components/OneClickOrderModal';

export default function ShopPage() {
  const { lang, t } = useLanguage();
  const { products } = useProducts();
  const { wishlist } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get('category') || 'all';
  const filterType = searchParams.get('filter') || 'all';
  const [sortBy, setSortBy] = useState('featured');

  const [modalProduct, setModalProduct] = useState(null);
  const [modalColor, setModalColor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenOneClick = (product, color = null) => {
    setModalProduct(product);
    setModalColor(color);
    setIsModalOpen(true);
  };

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category filter
    if (selectedCategory !== 'all') {
      list = list.filter(p => p.category === selectedCategory);
    }

    // Filter by flash sale or wishlist
    if (filterType === 'flash') {
      list = list.filter(p => p.isFlashSale);
    } else if (filterType === 'wishlist') {
      const favIds = wishlist.map(w => w.id);
      list = list.filter(p => favIds.includes(p.id));
    }

    // Sorting
    if (sortBy === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [products, selectedCategory, filterType, sortBy, wishlist]);

  const handleCategoryChange = (catId) => {
    const newParams = new URLSearchParams(searchParams);
    if (catId === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', catId);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="border-b border-brand-border pb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-brand-gold text-xs font-bold uppercase tracking-wider">
          <Sparkles className="size-3.5" />
          <span>{lang === 'bn' ? 'কারিশমা শপ কালেকশন' : 'CURATED BOUTIQUE SHOP'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white">
          {filterType === 'wishlist'
            ? (lang === 'bn' ? 'আপনার পছন্দের পণ্যসমূহ' : 'Your Wishlist')
            : filterType === 'flash'
            ? (lang === 'bn' ? '🔥 ধামাকা ফ্ল্যাশ সেল অফার' : '🔥 Exclusive Flash Sale')
            : (lang === 'bn' ? 'সকল পোশাক ও ব্যাগ কালেকশন' : 'All Boutique Collection')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          {lang === 'bn'
            ? `মোট ${filteredProducts.length} টি প্রিমিয়াম প্রোডাক্ট পাওয়া গেছে`
            : `Showing ${filteredProducts.length} premium boutique products`}
        </p>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition border ${
                selectedCategory === cat.id
                  ? 'border-brand-gold bg-brand-gold text-brand-noir shadow-gold-soft'
                  : 'border-brand-border bg-brand-surface text-slate-300 hover:border-slate-600'
              }`}
            >
              {lang === 'bn' ? cat.nameBn : cat.name}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 self-end md:self-auto text-xs">
          <SlidersHorizontal className="size-4 text-brand-gold" />
          <span className="text-slate-400">{lang === 'bn' ? 'সর্ট করুন:' : 'Sort by:'}</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-brand-surface border border-brand-border text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-brand-gold text-xs"
          >
            <option value="featured">{lang === 'bn' ? 'সেরা পছন্দ' : 'Featured'}</option>
            <option value="price_asc">{lang === 'bn' ? 'দাম: কম থেকে বেশি' : 'Price: Low to High'}</option>
            <option value="price_desc">{lang === 'bn' ? 'দাম: বেশি থেকে কম' : 'Price: High to Low'}</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <p className="text-lg font-serif font-bold text-slate-300">
            {lang === 'bn' ? 'এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।' : 'No products found in this category.'}
          </p>
          <button
            onClick={() => handleCategoryChange('all')}
            className="px-5 py-2 rounded-xl bg-brand-gold text-brand-noir text-xs font-bold"
          >
            {lang === 'bn' ? 'সকল পণ্য দেখুন' : 'Show All Products'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onOneClickOrder={handleOpenOneClick}
            />
          ))}
        </div>
      )}

      {/* 1-Click Fast Order Modal */}
      <OneClickOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={modalProduct}
        initialColor={modalColor}
      />
    </div>
  );
}
