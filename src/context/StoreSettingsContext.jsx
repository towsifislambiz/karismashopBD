import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

const StoreSettingsContext = createContext();

const DEFAULT_SETTINGS = {
  storeName: 'Karishma Shop BD',
  tagline: 'Exclusive Three-Piece, Dubai Abaya & Luxury Handbags',
  taglineBn: 'এক্সক্লুসিভ থ্রি-পিস, দুবাই আবায়া ও লাক্সারি হ্যান্ডব্যাগ',
  hotline: '01749765271',
  whatsappNumber: '01749765271',
  bkashNumber: '01749765271',
  deliveryFeeInside: 80,
  deliveryFeeOutside: 150,
  freeDeliveryThreshold: 3500,
  announcementText: '✨ প্রিমিয়াম বুটিক কালেকশন | ৩,৫০০ টাকার অর্ডারে সারা দেশে ডেলিভারি সম্পূর্ণ ফ্রি!',
  announcementTextEn: '✨ Premium Boutique Collection | Free Nationwide Delivery on Orders Over ৳3,500!',
  address: 'বাড়ি ১২, রোড ৫, ধানমন্ডি, ঢাকা - ১২০৯',
  email: 'support@karishmashop.com',
  facebookPage: 'https://facebook.com/karishmashopbd',
  instagramPage: 'https://instagram.com/karishmashopbd',
  coinSettings: {
    welcomeCoins: 50,
    cashbackPercentage: 2,
    coinValueInTaka: 1,
    maxCoinRedeemPercent: 20
  }
};

export const StoreSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('karishma_store_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('karishma_store_settings', JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed saving settings locally:', e);
    }
  }, [settings]);

  // Firestore sync
  useEffect(() => {
    try {
      const docRef = doc(db, 'settings', 'karishma_config');
      const unsubscribe = onSnapshot(docRef, (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setSettings(prev => ({
            ...prev,
            ...data,
            coinSettings: {
              ...prev.coinSettings,
              ...(data.coinSettings || {})
            }
          }));
        }
      }, (err) => {
        console.warn('Settings firestore sync fallback to local:', err.message);
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn('Settings listener fallback:', err);
    }
  }, []);

  const updateSettings = async (newSettings) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    try {
      localStorage.setItem('karishma_store_settings', JSON.stringify(updated));
      await setDoc(doc(db, 'settings', 'karishma_config'), updated, { merge: true });
    } catch (err) {
      console.warn('Settings update saved locally only:', err);
    }
  };

  return (
    <StoreSettingsContext.Provider value={{
      settings,
      coinSettings: settings.coinSettings || DEFAULT_SETTINGS.coinSettings,
      updateSettings
    }}>
      {children}
    </StoreSettingsContext.Provider>
  );
};

export const useStoreSettings = () => useContext(StoreSettingsContext);
