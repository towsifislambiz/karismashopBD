import React, { createContext, useContext, useState, useEffect } from 'react';
import { useStoreSettings } from './StoreSettingsContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { settings } = useStoreSettings();

  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('karishma_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('karishma_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('karishma_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Failed saving cart:', e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('karishma_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Failed saving wishlist:', e);
    }
  }, [wishlist]);

  const addToCart = (product, quantity = 1, selectedColor = null, selectedSize = null) => {
    const color = selectedColor || product.colors?.[0]?.name || 'Standard';
    const size = selectedSize || product.sizes?.[0] || 'Free Size';
    const cartItemId = `${product.id}-${color}-${size}`;

    setCartItems(prev => {
      const existing = prev.find(item => item.id === cartItemId);
      if (existing) {
        return prev.map(item =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          product,
          quantity,
          selectedColor: color,
          selectedSize: size
        }
      ];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === cartItemId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const removeFromCart = (cartItemId) => {
    setCartItems(prev => prev.filter(item => item.id !== cartItemId));
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  // Calculations
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product.price || 0) * item.quantity,
    0
  );

  const itemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const isFreeDeliveryCart = subtotal >= (settings?.freeDeliveryThreshold || 3500);

  // Coupon application logic
  const applyCoupon = (code) => {
    const clean = (code || '').trim().toUpperCase();
    if (clean === 'KARISHMA100') {
      setAppliedCoupon({ code: clean, discount: 100, type: 'fixed' });
      return { success: true, message: '৳১০০ ডিসকাউন্ট কুপন যুক্ত হয়েছে!' };
    } else if (clean === 'BOUTIQUE10') {
      const discount = Math.round(subtotal * 0.1);
      setAppliedCoupon({ code: clean, discount, type: 'percentage' });
      return { success: true, message: '১০% স্পেশাল ছাড় যুক্ত হয়েছে!' };
    }
    return { success: false, message: 'ভুল বা মেয়াদোত্তীর্ণ কুপন কোড!' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        wishlist,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toggleCart: () => setIsCartOpen(prev => !prev),
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isInWishlist,
        subtotal,
        itemsCount,
        isFreeDeliveryCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        couponDiscount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
