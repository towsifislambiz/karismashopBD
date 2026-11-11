import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

const StoreSettingsContext = createContext();

export const DEFAULT_HERO_BANNERS = [
  {
    id: 1,
    tagBn: 'এক্সক্লুসিভ ফেস্টিভ কালেকশন',
    tag: 'FESTIVE COLLECTION 2026',
    titleBn: 'রাজকীয় আভিজাত্য ও আধুনিক বুটিকের নিখুঁত মেলবন্ধন',
    title: 'Where Royal Heritage Meets Modern Elegance',
    subtitleBn: 'হাতে বোনা নিখুঁত সুতার কাজ, প্রিমিয়াম সফট লিনেন ফেব্রিক ও রেশমি সিল্ক ওড়নায় সাজানো কারিশমা বুটিক কালেকশন।',
    subtitle: 'Handcrafted threadwork embroidery, premium soft linens, and bespoke silk dupattas tailored for statement occasions.',
    image: '/assets/products/threepiece_black_white.webp',
    link: '/shop?category=three-piece',
    buttonText: 'কালেকশন দেখুন',
    buttonTextEn: 'Explore Three-Piece'
  },
  {
    id: 2,
    tagBn: 'লাক্সারি সিগনেচার হ্যান্ডব্যাগ',
    tag: 'SIGNATURE HANDBAGS',
    titleBn: 'স্কাল্পটেড ফ্লোরাল-চার্ম লাক্সারি ডিজাইনার হ্যান্ডব্যাগ',
    title: 'Sculpted Floral-Charm Boutique Totes & Clutches',
    subtitleBn: 'প্রিমিয়াম ওয়াটারপ্রুফ ভেগান লেদার ও গোল্ডেন মেটালিক ফিনিশিং। ৫টি আকর্ষণীয় কালারে সাজানো এক্সক্লুসিভ টোট ব্যাগ।',
    subtitle: 'Artisanal vegan leather with radiant gold hardware and signature blossom tassels. Available in 5 breathtaking pastel & classic hues.',
    image: '/assets/products/hero_handbag_collection_podium.webp',
    link: '/shop?category=handbags',
    buttonText: 'ব্যাগ কালেকশন দেখুন',
    buttonTextEn: 'Shop Designer Bags'
  },
  {
    id: 3,
    tagBn: 'দুবাই ইম্পেরিয়াল আবায়া ও বোরকা',
    tag: 'DUBAI IMPERIAL ABAYA',
    titleBn: 'অরিজিনাল দুবাই নিদা ফেব্রিক ও রাজকীয় স্টোনওয়ার্ক বোরকা',
    title: 'Pure Dubai Nida Fabrics with Sparkling Stonework',
    subtitleBn: 'শোল্ডার ও ফ্রন্টে চোখ জুড়ানো ক্রিস্টাল স্টোনের কারুকাজ। সাথে রয়েছে প্রিমিয়াম ম্যাচিং হিজাব সম্পূর্ণ ফ্রি।',
    subtitle: 'Flawlessly modest silhouette adorned with hand-placed crystal cascading chains. Complete with complimentary matching hijab.',
    image: '/assets/products/abaya_dubai_stonework_black.webp',
    link: '/shop?category=abaya',
    buttonText: 'আবায়া অর্ডার করুন',
    buttonTextEn: 'Order Dubai Abaya'
  }
];

const DEFAULT_SETTINGS = {
  storeName: 'KARISHMASHOPBD',
  tagline: 'Your Quality Shopping Destination • Customers Satisfaction Is Our First Priority',
  taglineBn: 'ইউর কোয়ালিটি শপিং ডেস্টিনেশন • কাস্টমার সন্তুষ্টিই আমাদের প্রথম অগ্রাধিকার',
  hotline: '01819305805',
  whatsappNumber: '01965643684',
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
  facebookPage: 'https://www.facebook.com/profile.php?id=61576612149506',
  instagramPage: 'https://instagram.com/karismashop',
  ownerName: 'Ln Md Jasim Uddin',
  siteLogo: '/assets/brand/ks-logo.webp',
  visitingCardImage: '/assets/brand/visiting-card.webp',
  hotSaleDiscountPercent: 20,
  heroBanners: DEFAULT_HERO_BANNERS,
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
        whatsappNumber: '01965643684',
        facebookPage: 'https://www.facebook.com/profile.php?id=61576612149506',
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
