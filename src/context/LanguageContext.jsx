import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  bn: {
    // Top Bar & Nav
    hotline: 'হটলাইন',
    freeDeliveryBanner: '✨ প্রিমিয়াম বুটিক কালেকশন | সারা বাংলাদেশে দ্রুত ক্যাশ অন ডেলিভারি!',
    searchPlaceholder: 'থ্রি-পিস, দুবাই আবায়া, হ্যান্ডব্যাগ খুঁজুন...',
    allCategories: 'সকল ক্যাটাগরি',
    home: 'হোম',
    shop: 'শপ',
    threePiece: 'থ্রি-পিস',
    abaya: 'আবায়া ও বোরকা',
    gowns: 'মডেস্ট গাউন',
    handbags: 'হ্যান্ডব্যাগ',
    offers: 'অফার',
    trackOrder: 'অর্ডার ট্র্যাক',
    login: 'লগইন / রেজিস্টার',
    account: 'আমার অ্যাকাউন্ট',
    cart: 'ব্যাগ',
    wishlist: 'পছন্দের তালিকা',
    emptyCart: 'আপনার ব্যাগটি খালি আছে!',
    viewCart: 'ব্যাগ দেখুন',
    checkout: 'অর্ডার করতে এগিয়ে যান',

    // Hero & Badges
    heroTag: '✨ রাজকীয় আভিজাত্যের নতুন সংজ্ঞা',
    heroTitle: 'এক্সক্লুসিভ থ্রি-পিস ও দুবাই লাক্সারি কালেকশন',
    heroSubtitle: 'Karishma Shop BD নিয়ে এলো প্রিমিয়াম ফেব্রিক ও আধুনিক ডিজাইনের অনন্য সমাহার। প্রতিটি পোশাকে মার্জিত সৌন্দর্য ও আভিজাত্য।',
    shopNow: 'এখনই কিনুন →',
    exploreCollection: 'কালেকশন দেখুন',
    originalQuality: '১০০% প্রিমিয়াম কোয়ালিটি',
    fastDelivery: 'সারা দেশে দ্রুত ডেলিভারি',
    codAvailable: 'ক্যাশ অন ডেলিভারি সুবিধা',
    easyReturn: 'সহজ ৭ দিনের রিটার্ন পলিসি',

    // Product & Card
    orderNow: '১-ক্লিকে অর্ডার',
    addToCart: 'কার্টে যোগ করুন',
    quickView: 'দ্রুত দেখুন',
    inStock: 'স্টকে আছে',
    outOfStock: 'স্টক শেষ',
    color: 'কালার',
    size: 'সাইজ',
    sizeGuide: 'সাইজ গাইড',
    fabricDetails: 'ফেব্রিক ও বিবরণ',
    deliveryReturn: 'ডেলিভারি ও রিটার্ন পলিসি',
    reviews: 'কাস্টমার রিভিউ',
    relatedProducts: 'সম্পর্কিত আরও কালেকশন',

    // Checkout & Order Form
    fastOrderTitle: '১-ক্লিকে অর্ডার ফর্ম',
    fastOrderSubtitle: 'কোনো লগইন ছাড়াই নাম ও ঠিকানা দিয়ে এখনই কনফার্ম করুন',
    customerName: 'আপনার নাম',
    namePlaceholder: 'যেমন: ফারহানা আহমেদ',
    phoneNumber: 'মোবাইল নম্বর',
    phonePlaceholder: '১১ ডিজিটের বিকাশ/মোবাইল নম্বর (০১XXXXXXXXX)',
    deliveryAddress: 'পূর্ণ ডেলিভারি ঠিকানা',
    addressPlaceholder: 'রোড, বাড়ি নম্বর, এলাকা বা থানার নাম লিখুন',
    deliveryZone: 'ডেলিভারি এরিয়া বেছে নিন',
    insideDhaka: 'ঢাকা সিটির ভেতরে (৳৮০)',
    outsideDhaka: 'ঢাকা সিটির বাইরে (৳১৫০)',
    paymentMethod: 'পেমেন্ট মেথড বেছে নিন',
    cod: 'ক্যাশ অন ডেলিভারি (পণ্য পেয়ে টাকা দিন)',
    bkash: 'বিকাশ সেন্ড মানি (দ্রুত কনফার্মেশন)',
    bkashInstructions: 'নিচের বিকাশ নম্বরে মোট টাকা Send Money করার পর যে নম্বর থেকে পাঠিয়েছেন সেটি লিখুন:',
    copyNumber: 'নম্বর কপি করুন',
    copied: 'কপি হয়েছে!',
    senderBkashNumber: 'যে বিকাশ নম্বর থেকে পাঠিয়েছেন',
    orderTotal: 'সর্বমোট প্রদেয় বিল',
    deliveryFee: 'ডেলিভারি চার্জ',
    confirmOrderBtn: 'অর্ডার কনফার্ম করুন',
    processingOrder: 'অর্ডার প্রক্রিয়াধীন...',

    // Invoice & Success
    orderSuccessTitle: 'অভিনন্দন! আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে 🎉',
    orderTrackingId: 'অর্ডার ট্র্যাকিং আইডি',
    downloadInvoice: 'ক্যাশ মেমো ডাউনলোড (PDF)',
    whatsappSupport: 'হোয়াটসঅ্যাপে হেল্প নিন',
    continueShopping: 'আরও শপিং করুন',

    // Admin & Status
    adminPanel: 'এডমিন ড্যাশবোর্ড',
    statusPending: 'অপেক্ষমাণ',
    statusConfirmed: 'কনফার্মড',
    statusShipped: 'ডেলিভারির পথে',
    statusDelivered: 'ডেলিভার্ড সম্পন্ন',
    statusCancelled: 'বাতিলকৃত'
  },
  en: {
    // Top Bar & Nav
    hotline: 'Hotline',
    freeDeliveryBanner: '✨ Luxury Boutique Collection | Fast Cash on Delivery Nationwide!',
    searchPlaceholder: 'Search Three-Piece, Dubai Abaya, Handbags...',
    allCategories: 'All Categories',
    home: 'Home',
    shop: 'Shop',
    threePiece: 'Three-Piece',
    abaya: 'Abaya & Borka',
    gowns: 'Modest Gowns',
    handbags: 'Handbags',
    offers: 'Offers',
    trackOrder: 'Track Order',
    login: 'Login / Register',
    account: 'My Account',
    cart: 'Bag',
    wishlist: 'Wishlist',
    emptyCart: 'Your bag is empty!',
    viewCart: 'View Bag',
    checkout: 'Proceed to Checkout',

    // Hero & Badges
    heroTag: '✨ Redefining Royal Elegance',
    heroTitle: 'Exclusive Three-Piece & Dubai Luxury Wear',
    heroSubtitle: 'Karishma Shop BD brings you a magnificent blend of premium fabrics and modest silhouettes. Elegance tailored for the modern woman.',
    shopNow: 'Shop Now →',
    exploreCollection: 'Explore Collection',
    originalQuality: '100% Premium Quality',
    fastDelivery: 'Fast Nationwide Delivery',
    codAvailable: 'Cash on Delivery Available',
    easyReturn: 'Hassle-Free 7-Day Returns',

    // Product & Card
    orderNow: '1-Click Order',
    addToCart: 'Add to Bag',
    quickView: 'Quick View',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    color: 'Color',
    size: 'Size',
    sizeGuide: 'Size Guide',
    fabricDetails: 'Fabric & Specifications',
    deliveryReturn: 'Delivery & Returns Policy',
    reviews: 'Customer Reviews',
    relatedProducts: 'You May Also Love',

    // Checkout & Order Form
    fastOrderTitle: '1-Click Fast Order',
    fastOrderSubtitle: 'Complete your order in seconds without any login hassle',
    customerName: 'Your Full Name',
    namePlaceholder: 'e.g. Farhana Ahmed',
    phoneNumber: 'Mobile Number',
    phonePlaceholder: '11-digit mobile number (01XXXXXXXXX)',
    deliveryAddress: 'Delivery Address',
    addressPlaceholder: 'House, Road, Area, Thana & District',
    deliveryZone: 'Select Delivery Area',
    insideDhaka: 'Inside Dhaka City (৳80)',
    outsideDhaka: 'Outside Dhaka (৳150)',
    paymentMethod: 'Select Payment Method',
    cod: 'Cash on Delivery (Pay upon receipt)',
    bkash: 'bKash Send Money (Instant Confirmation)',
    bkashInstructions: 'Please Send Money to the bKash personal number below and enter your sender number:',
    copyNumber: 'Copy Number',
    copied: 'Copied!',
    senderBkashNumber: 'Sender bKash Mobile Number',
    orderTotal: 'Total Payable Amount',
    deliveryFee: 'Delivery Fee',
    confirmOrderBtn: 'Confirm Order Now',
    processingOrder: 'Processing your order...',

    // Invoice & Success
    orderSuccessTitle: 'Congratulations! Your order has been placed 🎉',
    orderTrackingId: 'Tracking ID',
    downloadInvoice: 'Download Invoice (PDF)',
    whatsappSupport: 'Chat on WhatsApp',
    continueShopping: 'Continue Shopping',

    // Admin & Status
    adminPanel: 'Admin Dashboard',
    statusPending: 'Pending',
    statusConfirmed: 'Confirmed',
    statusShipped: 'In Transit',
    statusDelivered: 'Delivered',
    statusCancelled: 'Cancelled'
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('karishma_lang') || 'bn';
    } catch {
      return 'bn';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('karishma_lang', lang);
      document.documentElement.lang = lang;
    } catch {}
  }, [lang]);

  const toggleLang = () => {
    setLang(prev => (prev === 'bn' ? 'en' : 'bn'));
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations['bn']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
