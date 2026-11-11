import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialProducts } from '../data/products';
import { db } from '../services/firebase';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('karishma_products_cloud') || localStorage.getItem('karishma_products_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= initialProducts.length) {
          return parsed;
        }
      }
      return initialProducts;
    } catch {
      return initialProducts;
    }
  });

  const [isCloudSynced, setIsCloudSynced] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync to local storage for instant offline access
  useEffect(() => {
    try {
      localStorage.setItem('karishma_products_cloud', JSON.stringify(products));
    } catch (e) {
      console.warn('Failed saving products locally:', e);
    }
  }, [products]);

  // Seed initial products to Firestore if empty
  const seedProductsToFirestore = async (listToSeed) => {
    try {
      setIsSyncing(true);
      const batch = writeBatch(db);
      listToSeed.forEach((prod) => {
        const docRef = doc(db, 'karishma_products', prod.id);
        batch.set(docRef, prod, { merge: true });
      });
      await batch.commit();
      setIsCloudSynced(true);
    } catch (e) {
      console.warn('Failed batch seeding to Firestore:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  // Real-time Firestore sync
  useEffect(() => {
    let unsubscribe = null;
    try {
      const colRef = collection(db, 'karishma_products');
      unsubscribe = onSnapshot(colRef, async (snapshot) => {
        if (!snapshot.empty) {
          const cloudList = [];
          snapshot.forEach((docSnap) => {
            cloudList.push({ id: docSnap.id, ...docSnap.data() });
          });
          setProducts(cloudList);
          setIsCloudSynced(true);
        } else {
          // If Firestore is empty on first setup, seed initial catalog
          await seedProductsToFirestore(initialProducts);
        }
      }, (err) => {
        console.warn('Products Firestore listener fallback to local:', err.message);
        setIsCloudSynced(false);
      });
    } catch (err) {
      console.warn('Failed setting up products listener:', err);
      setIsCloudSynced(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const resetToDefault = async () => {
    setProducts(initialProducts);
    await seedProductsToFirestore(initialProducts);
  };

  const addProduct = async (newProduct) => {
    const id = `ks-prod-${Date.now()}`;
    const productWithId = { ...newProduct, id };
    setProducts((prev) => [productWithId, ...prev]);
    try {
      await setDoc(doc(db, 'karishma_products', id), productWithId);
      setIsCloudSynced(true);
    } catch (e) {
      console.warn('Product saved locally, Firestore error:', e);
    }
    return productWithId;
  };

  const updateProduct = async (id, updates) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    try {
      await updateDoc(doc(db, 'karishma_products', id), updates);
    } catch (e) {
      console.warn('Updated locally, Firestore error:', e);
    }
  };

  const deleteProduct = async (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      await deleteDoc(doc(db, 'karishma_products', id));
    } catch (e) {
      console.warn('Deleted locally, Firestore error:', e);
    }
  };

  const syncAllToFirestore = async () => {
    await seedProductsToFirestore(products);
  };

  const getProductById = (id) => {
    return products.find((p) => p.id === id) || null;
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        isCloudSynced,
        isSyncing,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        resetToDefault,
        syncAllToFirestore
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
