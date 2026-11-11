import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

const StoreSettingsContext = createContext();

const DEFAULT_SETTINGS = {
  storeName: 'KARISHMASHOPBD',
  tagline: 'Your Quality Shopping Destination • Customers Satisfaction Is Our First Priority',
  taglineBn: 'ইউর কোয়ালিটি শপিং ডেস্টিনেশন • কাস্টমার সন্তুষ্টিই আমাদের প্রথম অগ্রাধিকার',
  hotline: '01819305805',
  whatsappNumber: '01819305805',
  bkashNumber: '01819305805',
  nagadNumber: '01819305805',
  email: 'karishmashop786@gmail.com',
  deliveryFeeInside: 80,
  deliveryFeeOutside: 150,
  freeDeliveryThreshold: 3500,
  announcementText: '✨ প্রিমিয়াম বুটিক কালেকশন | ৩,৫০০ টাকার অর্ডারে সারা দেশে ডেলিভারি সম্পূর্ণ ফ্রি!',
  announcementTextEn: '✨ Premium Boutique Collection | Free Nationwide Delivery on Orders Over ৳3,500!',
  address: 'Fazal Member Mansion (1st floor), CDA Road, Shikalbaha, Ward No-03, Karnafully, Chittagong - 4371',
  addressBn: 'ফজল মেম্বার ম্যানশন (১ম তলা), সিডিএ রোড, শিকলবাহা, ৩নং ওয়ার্ড, কর্ণফুলী, চট্টগ্রাম - ৪৩৭১',
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
      const parsed = saved ? JSON.parse(saved) : {};
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        email: 'karishmashop786@gmail.com',
        whatsappNumber: '01819305805',
        hotline: '01819305805',
        bkashNumber: '01819305805',
        nagadNumber: '01819305805'
      };
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
