import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialProducts } from '../data/products';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('karishma_products_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= initialProducts.length) {
          return parsed;
        }
      }
      localStorage.removeItem('karishma_products');
      return initialProducts;
    } catch {
      return initialProducts;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('karishma_products_v3', JSON.stringify(products));
    } catch (e) {
      console.warn('Failed saving products locally:', e);
    }
  }, [products]);

  const resetToDefault = () => {
    setProducts(initialProducts);
    try {
      localStorage.setItem('karishma_products_v3', JSON.stringify(initialProducts));
    } catch (e) {
      console.warn(e);
    }
  };

  const addProduct = (newProduct) => {
    const id = `ks-prod-${Date.now()}`;
    const productWithId = { ...newProduct, id };
    setProducts(prev => [productWithId, ...prev]);
    return productWithId;
  };

  const updateProduct = (id, updates) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const getProductById = (id) => {
    return products.find(p => p.id === id) || null;
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        resetToDefault
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
