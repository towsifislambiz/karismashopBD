import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

const StoreSettingsContext = createContext();

const DEFAULT_SETTINGS = {
  storeName: 'Karishma Shop BD',
  tagline: 'Exclusive Three-Piece, Dubai Abaya & Luxury Handbags',
  taglineBn: 'এক্সক্লুসিভ থ্রি-পিস, দুবাই আবায়া ও লাক্সারি হ্যান্ডব্যাগ',
  hotline: '01819305805',
  whatsappNumber: '01819305805',
  backupPhone: '01965643684',
  bkashNumber: '01819305805',
  nagadNumber: '01819305805',
  deliveryFeeInside: 80,
  deliveryFeeOutside: 150,
  freeDeliveryThreshold: 3500,
  announcementText: '✨ প্রিমিয়াম বুটিক কালেকশন | ৩,৫০০ টাকার অর্ডারে সারা দেশে ডেলিভারি সম্পূর্ণ ফ্রি!',
  announcementTextEn: '✨ Premium Boutique Collection | Free Nationwide Delivery on Orders Over ৳3,500!',
  address: 'AlHajj Fajal Member Mansion (1st floor), Shikalbaha, Karnafully - 4371, Chittagong',
  addressBn: 'আলহাজ্ব ফজল মেম্বার ম্যানশন (১ম তলা), শিকলবাহা (৩নং ওয়ার্ড), কর্ণফুলী - ৪৩৭১, চট্টগ্রাম',
  email: 'karishmashop786@gmail.com',
  facebookPage: 'https://facebook.com/karismashop',
  instagramPage: 'https://instagram.com/karismashop',
  ownerName: 'Ln Mohammed Jasim Uddin',
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
