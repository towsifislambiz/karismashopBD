export const initialProducts = [
  // ==========================================
  // 1. THREE-PIECE COLLECTION (থ্রি-পিস কালেকশন)
  // ==========================================
  {
    id: 'ks-tp-01',
    name: 'Al-Chishty Embroidered Monochrome Festive Three-Piece',
    nameBn: 'আল-চিস্তি এক্সক্লুসিভ ব্ল্যাক & হোয়াইট এমব্রয়ডারি থ্রি-পিস',
    category: 'three-piece',
    categoryBn: 'থ্রি-পিস',
    price: 2450,
    originalPrice: 3200,
    rating: 4.9,
    reviewsCount: 64,
    badge: 'সেরা পছন্দ',
    badgeEn: 'Bestseller',
    isFlashSale: true,
    flashSaleDiscount: '২৪% ছাড়',
    inStock: true,
    stockCount: 14,
    fabric: 'Pure Cotton Linen with Heavy Threadwork & Striped Silk Dupatta',
    fabricBn: 'পিওর কটন লিনেন, নেকলাইন সিকোয়েন্স এমব্রয়ডারি ও সেমি-সিল্ক স্ট্রাইপ ওড়না',
    description: 'A masterpiece of classic elegance. Intricate white floral thread embroidery against deep midnight black with matching designer culottes and a luxurious striped dupatta.',
    descriptionBn: 'উৎসব ও পার্টিওয়্যারের জন্য ক্লাসিক ব্ল্যাক অ্যান্ড হোয়াইট কম্বিনেশন। ফ্রন্ট নেকলাইনে নিখুঁত কারুকাজ, প্রিন্টেড ম্যাচিং ট্রাউজার এবং লাক্সারি নরম স্ট্রাইপ ওড়না।',
    images: [
      '/assets/products/threepiece_black_white.png',
      '/assets/products/threepiece_kashmiri_lavender.png'
    ],
    colors: [
      { name: 'Midnight Black', nameBn: 'মিডনাইট ব্ল্যাক', hex: '#111111', image: '/assets/products/threepiece_black_white.png' },
      { name: 'Lavender Haze', nameBn: 'ল্যাভেন্ডার পার্পল', hex: '#8E7DA8', image: '/assets/products/threepiece_kashmiri_lavender.png' }
    ],
    sizes: ['S (36)', 'M (38)', 'L (40)', 'XL (42)', 'XXL (44)']
  },
  {
    id: 'ks-tp-02',
    name: 'Al-Chishty Royal Kashmiri Embroidered Lavender Three-Piece',
    nameBn: 'কাশ্মীরি রয়াল ল্যাভেন্ডার এমব্রয়ডারি বুটিক থ্রি-পিস',
    category: 'three-piece',
    categoryBn: 'থ্রি-পিস',
    price: 2650,
    originalPrice: 3450,
    rating: 5.0,
    reviewsCount: 42,
    badge: 'নতুন আগমন',
    badgeEn: 'Trending',
    isFlashSale: false,
    inStock: true,
    stockCount: 18,
    fabric: 'Premium Viscose Slub with Multicolored Floral Kashmiri Stitch & Printed Silk Dupatta',
    fabricBn: 'প্রিমিয়াম ভিসকোস স্ল্যাব ও মাল্টিকালার কাশ্মীরি সুতার কাজ, ডিজিটাল প্রিন্টেড সিল্ক ওড়না',
    description: 'Graceful pastel lavender hue adorned with vibrant floral threadwork along the neckline, hemlines, and contrasting blush rose culotte trousers.',
    descriptionBn: 'মনোমুগ্ধকর প্যাস্টেল ল্যাভেন্ডার কালারের ওপর কাশ্মীরি ফ্লোরাল সুতার আকর্ষণীয় নকশা। সাথে ব্ল্যাশ রোজ ট্রাউজার ও সফট অর্গাঞ্জা সিল্ক ওড়না।',
    images: [
      '/assets/products/threepiece_kashmiri_lavender.png',
      '/assets/products/threepiece_lavender_rose.png',
      '/assets/products/threepiece_lavender_fullview.png'
    ],
    colors: [
      { name: 'Lilac Lavender', nameBn: 'ল্যাভেন্ডার পার্পল', hex: '#7C72A0', image: '/assets/products/threepiece_kashmiri_lavender.png' },
      { name: 'Dusty Rose', nameBn: 'ডাস্টি রোজ পিংক', hex: '#C27D8C', image: '/assets/products/threepiece_dustyrose_teal.png' }
    ],
    sizes: ['M (38)', 'L (40)', 'XL (42)', 'XXL (44)']
  },
  {
    id: 'ks-tp-03',
    name: 'Exclusive Dusty Rose & Teal Border Festive Three-Piece',
    nameBn: 'এক্সক্লুসিভ ডাস্টি রোজ ও টিল বর্ডার বুটিক থ্রি-পিস',
    category: 'three-piece',
    categoryBn: 'থ্রি-পিস',
    price: 2590,
    originalPrice: 3350,
    rating: 4.8,
    reviewsCount: 38,
    badge: 'হট ডিল',
    badgeEn: 'Hot Deal',
    isFlashSale: true,
    flashSaleDiscount: '২২% ছাড়',
    inStock: true,
    stockCount: 11,
    fabric: 'Fine Cotton Twill with Delicate Thread Embroidery & Printed Dupatta',
    fabricBn: 'ফাইন কটন টুইল, চমৎকার টিল থ্রেড এমব্রয়ডারি ও ফুল বর্ডার প্রিন্ট ওড়না',
    description: 'Unique dual-tone color harmony featuring soft dusty rose pink kameez paired with deep teal trousers and a matching floral statement dupatta.',
    descriptionBn: 'ডাস্টি রোজ ও ডিপ টিল কালারের রাজকীয় কম্বিনেশন। জামার বুক ও হাতায় ভারী এমব্রয়ডারি এবং মানানসই প্রিন্টেড ওড়না।',
    images: [
      '/assets/products/threepiece_dustyrose_teal.png',
      '/assets/products/threepiece_lavender_rose.png'
    ],
    colors: [
      { name: 'Dusty Rose & Teal', nameBn: 'ডাস্টি রোজ & টিল', hex: '#B57482', image: '/assets/products/threepiece_dustyrose_teal.png' },
      { name: 'Lavender & Plum', nameBn: 'ল্যাভেন্ডার & প্লাম', hex: '#6D5B8E', image: '/assets/products/threepiece_lavender_rose.png' }
    ],
    sizes: ['S (36)', 'M (38)', 'L (40)', 'XL (42)']
  },
  {
    id: 'ks-tp-04',
    name: 'Al-Chishty Ivory Cream & Indigo Paisley Summer Linen Three-Piece',
    nameBn: 'আইভরি ক্রিম ও ইন্ডিগো পেইসলে লাক্সারি লিনেন থ্রি-পিস',
    category: 'three-piece',
    categoryBn: 'থ্রি-পিস',
    price: 2350,
    originalPrice: 2950,
    rating: 4.9,
    reviewsCount: 51,
    badge: 'আড়ং স্টাইল',
    badgeEn: 'Pure Linen',
    isFlashSale: false,
    inStock: true,
    stockCount: 22,
    fabric: '100% Breathable Organic Khadi Linen with Cross-Stitch & Chiffon Dupatta',
    fabricBn: '১০০% পিওর অরগানিক খাদি লিনেন ও নিখুঁত ক্রস-স্টিচ কারুকাজ, সফট শিফন ওড়না',
    description: 'Understated luxury for discerning women. Natural ivory breathable linen base embroidered with timeless indigo paisley motifs.',
    descriptionBn: 'অফিস, মিটিং কিংবা যেকোনো ঘরোয়া আড্ডায় আভিজাত্যের ছোঁয়া। প্রিমিয়াম আইভরি লিনেন কাপড়ে ঐতিহ্যবাহী ইন্ডিগো পেইসলে নকশা।',
    images: [
      '/assets/products/threepiece_ivory_paisley.png',
      '/assets/products/threepiece_black_white.png'
    ],
    colors: [
      { name: 'Ivory Cream', nameBn: 'আইভরি ক্রিম', hex: '#F4EEDB', image: '/assets/products/threepiece_ivory_paisley.png' }
    ],
    sizes: ['S (36)', 'M (38)', 'L (40)', 'XL (42)', 'XXL (44)']
  },

  // ==========================================
  // 2. DUBAI ABAYA & BORKA (আবায়া ও বোরকা)
  // ==========================================
  {
    id: 'ks-ab-01',
    name: 'Dubai Imperial Stonework Black Party Abaya & Hijab Set',
    nameBn: 'দুবাই ইম্পেরিয়াল স্টোনওয়ার্ক ব্ল্যাক পার্টি আবায়া ও হিজাব সেট',
    category: 'abaya',
    categoryBn: 'আবায়া ও বোরকা',
    price: 3650,
    originalPrice: 4800,
    rating: 5.0,
    reviewsCount: 89,
    badge: 'দুবাই ইমপোর্ট',
    badgeEn: 'Dubai Luxury',
    isFlashSale: true,
    flashSaleDiscount: '২৪% ছাড়',
    inStock: true,
    stockCount: 9,
    fabric: 'Original Dubai Nida Fabric with Crystal Stone Hand-embellishments',
    fabricBn: 'অরিজিনাল দুবাই নিদা ফেব্রিক, ক্রিস্টাল স্টোনওয়ার্ক ও নিখুঁত হ্যান্ড-এমব্রয়ডারি',
    description: 'Imported Dubai luxury party wear abaya. Features sparkling cascading stone chains on shoulders and front panel. Comes with matching designer hijab.',
    descriptionBn: 'দুবাইয়ের অরিজিনাল সফট প্রিমিয়াম নিদা ফেব্রিক। শোল্ডার ও ফ্রন্টে রাজকীয় ক্রিস্টাল স্টোনের ড্রপ চেইন কাজ। সাথে প্রিমিয়াম ম্যাচিং হিজাব সম্পূর্ণ ফ্রি।',
    images: [
      '/assets/products/abaya_dubai_stonework_black.png',
      '/assets/products/abaya_vertical_sequin_black.png',
      '/assets/products/abaya_black_embroidered_cuff.png'
    ],
    colors: [
      { name: 'Imperial Jet Black', nameBn: 'জেট ব্ল্যাক', hex: '#0D0E12', image: '/assets/products/abaya_dubai_stonework_black.png' }
    ],
    sizes: ['52 (Height 5\'0\"-5\'2\")', '54 (Height 5\'3\"-5\'5\")', '56 (Height 5\'6\"-5\'8\")']
  },
  {
    id: 'ks-ab-02',
    name: 'Minimalist Mocha Taupe Belted Kimono Abaya with Hijab',
    nameBn: 'মিনিমালিস্ট মোকা টোপ বেল্টেড কিমোনো আবায়া ও হিজাব',
    category: 'abaya',
    categoryBn: 'আবায়া ও বোরকা',
    price: 2850,
    originalPrice: 3600,
    rating: 4.9,
    reviewsCount: 37,
    badge: 'মডেস্ট ট্রেন্ড',
    badgeEn: 'Minimalist',
    isFlashSale: false,
    inStock: true,
    stockCount: 16,
    fabric: 'Korean Zoom Georgette with Adjustable Waist Tie & Flared Kimono Sleeves',
    fabricBn: 'কোরিয়ান জুম জর্জেট ফেব্রিক, ওয়াইড কিমোনো হাতা ও অ্যাডজাস্টেবল কোমর বেল্ট',
    description: 'Modern modest wear silhouette in serene earthy mocha. Wide kimono sleeves and detachable belt offer customizable styling for both daily and formal wear.',
    descriptionBn: 'আধুনিক রুচিশীল নারীদের জন্য মার্জিত ও প্রফেশনাল ডিজাইন। নরম সফট কোরিয়ান জুম ফেব্রিক এবং ফ্লেয়ার্ড কিমোনো কাট।',
    images: [
      '/assets/products/abaya_mocha_kimono.png',
      '/assets/products/abaya_lilac_shrug_flaresleeve.png'
    ],
    colors: [
      { name: 'Mocha Taupe', nameBn: 'মোকা টোপ ব্রাউন', hex: '#9E7A6B', image: '/assets/products/abaya_mocha_kimono.png' },
      { name: 'Muted Lilac', nameBn: 'মিউটেড ল্যাভেন্ডার', hex: '#A384A8', image: '/assets/products/abaya_lilac_shrug_flaresleeve.png' }
    ],
    sizes: ['52', '54', '56']
  },
  {
    id: 'ks-ab-03',
    name: 'Dubai Royal Black Abaya with Intricate Lace Cuff Sleeves',
    nameBn: 'দুবাই রয়েল ব্ল্যাক আবায়া উইথ জরি লেইস কাফ হাতা',
    category: 'abaya',
    categoryBn: 'আবায়া ও বোরকা',
    price: 3150,
    originalPrice: 3950,
    rating: 4.9,
    reviewsCount: 46,
    badge: 'প্রিমিয়াম কালেকশন',
    badgeEn: 'Exclusive',
    isFlashSale: false,
    inStock: true,
    stockCount: 15,
    fabric: 'Premium Dubai Cherry Georgette with Metallic Thread Border Cuffs',
    fabricBn: 'প্রিমিয়াম দুবাই চেরি জর্জেট, হাতার কাফে অ্যান্টিক গোল্ডেন জরি সুতার রাজকীয় বর্ডার',
    description: 'Rich dark silhouette elevated with stunning metallic zari embroidered wide cuffs. Light, flowy, non-transparent and perfectly tailored.',
    descriptionBn: 'স্মার্ট ও মার্জিত আউটলুক। হাতার কাফে অ্যান্টিক জরি ও সিকোয়েন্স কারুকাজ। কাপড়টি দীর্ঘস্থায়ী, অ্যান্টি-রিংকেল এবং সম্পূর্ণ নন-ট্রান্সপারেন্ট।',
    images: [
      '/assets/products/abaya_black_embroidered_cuff.png',
      '/assets/products/abaya_vertical_sequin_black.png'
    ],
    colors: [
      { name: 'Onyx Black', nameBn: 'অনিক্স ব্ল্যাক', hex: '#0B0B0E', image: '/assets/products/abaya_black_embroidered_cuff.png' }
    ],
    sizes: ['52', '54', '56']
  },
  {
    id: 'ks-ab-04',
    name: 'Crinkle Georgette Butterfly Cut Olive Green Modest Abaya',
    nameBn: 'ক্রিঙ্কল জর্জেট বাটারফ্লাই কাট অলিভ গ্রিন মডেস্ট আবায়া',
    category: 'abaya',
    categoryBn: 'আবায়া ও বোরকা',
    price: 2950,
    originalPrice: 3800,
    rating: 4.8,
    reviewsCount: 29,
    badge: 'বাটারফ্লাই কাট',
    badgeEn: 'Butterfly Cut',
    isFlashSale: true,
    flashSaleDiscount: '২২% ছাড়',
    inStock: true,
    stockCount: 12,
    fabric: 'High Density Crinkle Georgette with Flared Batwing Sleeves',
    fabricBn: 'হাই-ডেনসিটি টেক্সচার্ড ক্রিঙ্কল জর্জেট, এলিগ্যান্ট ব্যাটউইং বাটারফ্লাই হাতা',
    description: 'Mesmerizing olive green abaya with graceful waterfall draping. Designed with extra flare for utmost modesty and breathable comfort.',
    descriptionBn: 'এক্সট্রা ঘের ও সুন্দর ড্র্যাপ সম্বলিত অলিভ গ্রিন বাটারফ্লাই আবায়া। সারাদিন ব্যবহারের জন্য আরামদায়ক ও ব্রিদেবল।',
    images: [
      '/assets/products/abaya_olive_crinkle_georgette.png',
      '/assets/products/abaya_grey_floral_embroidered.png'
    ],
    colors: [
      { name: 'Royal Olive', nameBn: 'রয়াল অলিভ গ্রিন', hex: '#586A41', image: '/assets/products/abaya_olive_crinkle_georgette.png' },
      { name: 'Smoky Grey', nameBn: 'স্মোকি গ্রে ফ্লোরাল', hex: '#7E828D', image: '/assets/products/abaya_grey_floral_embroidered.png' }
    ],
    sizes: ['52', '54', '56']
  },

  // ==========================================
  // 3. MODEST GOWNS & MAXI DRESSES (গাউন ও ম্যাক্সি)
  // ==========================================
  {
    id: 'ks-gw-01',
    name: 'Festive Vibrant Floral Flared Modest Party Gown with Dupatta',
    nameBn: 'ফেস্টিভ ভাইব্রেন্ট ফ্লোরাল ফ্লেয়ার্ড মডেস্ট গাউন ও ওড়না সেট',
    category: 'gowns',
    categoryBn: 'গাউন ও ড্রেস',
    price: 2750,
    originalPrice: 3500,
    rating: 4.9,
    reviewsCount: 58,
    badge: 'ফেস্টিভ স্পেশাল',
    badgeEn: 'Festive Special',
    isFlashSale: true,
    flashSaleDiscount: '২১% ছাড়',
    inStock: true,
    stockCount: 17,
    fabric: 'Smooth Japanese Satin Georgette with Full Floral Print & Matching Shimmer Hijab',
    fabricBn: 'জাপানিজ সিল্কি সাটিন জর্জেট, ভাইব্রেন্ট মাল্টিকালার ফ্লোরাল প্রিন্ট ও শিমার হিজাব',
    description: 'An eye-catching festive party gown adorned with cheerful blossom bouquets. Features bell-flare sleeves and comfortable inner lining for a flattering modest look.',
    descriptionBn: 'বিয়ে, গায়ে হলুদ বা পারিবারিক উৎসবে আলাদা আকর্ষণ তৈরি করতে এই ভাইব্রেন্ট ফ্লোরাল গাউনটি অনন্য। সাথে সুন্দর ম্যাচিং হিজাব।',
    images: [
      '/assets/products/gown_floral_festive_01.png',
      '/assets/products/gown_floral_festive_02.png'
    ],
    colors: [
      { name: 'Crimson Blossom', nameBn: 'ক্রিমসন ব্লসম রেড', hex: '#B82836', image: '/assets/products/gown_floral_festive_01.png' }
    ],
    sizes: ['M (38)', 'L (40)', 'XL (42)', 'Free Size']
  },
  {
    id: 'ks-gw-02',
    name: 'Midnight Navy Polka Dot Tiered Maxi Gown with Mustard Hijab',
    nameBn: 'মিডনাইট নেভি পোলকা ডট টিয়ার্ড ম্যাক্সি গাউন ও মাস্টার্ড হিজাব',
    category: 'gowns',
    categoryBn: 'গাউন ও ড্রেস',
    price: 2450,
    originalPrice: 3100,
    rating: 4.8,
    reviewsCount: 33,
    badge: 'ক্যাজুয়াল chic',
    badgeEn: 'Casual Chic',
    isFlashSale: false,
    inStock: true,
    stockCount: 20,
    fabric: 'Premium Georgette with Inner Lining, Elasticated Waist & Contrast Hijab',
    fabricBn: 'প্রিমিয়াম জর্জেট ফেব্রিক (ইনার সহ), ড্রস্ট্রিং ওয়েস্টবেল্ট ও কনট্রাস্ট মাস্টার্ড হিজাব',
    description: 'Playful yet sophisticated polka dot tiered gown. Elasticated cuffs and drawstrings ensure a snug, comfortable fit.',
    descriptionBn: 'ক্লাসিক পোলকা ডট প্যাটার্ন ও থ্রি-লেয়ার টিয়ার্ড ফ্রক স্টাইল গাউন। সাথে ব্রাইট মাস্টার্ড হিজাবের স্টাইলিশ কনট্রাস্ট।',
    images: [
      '/assets/products/gown_polkadot_navy_maxi.png',
      '/assets/products/abaya_lilac_shrug_flaresleeve.png'
    ],
    colors: [
      { name: 'Navy & White Dot', nameBn: 'নেভি ব্লু & পোলকা', hex: '#1E2B45', image: '/assets/products/gown_polkadot_navy_maxi.png' }
    ],
    sizes: ['M', 'L', 'XL', 'Free Size']
  },

  // ==========================================
  // 4. LUXURY DESIGNER HANDBAGS & CLUTCHES (হ্যান্ডব্যাগ ও পার্স)
  // ==========================================
  {
    id: 'ks-bg-01',
    name: 'Karishma Sculpted Floral-Charm Luxury Signature Tote Bag',
    nameBn: 'কারিশমা স্কাল্পটেড ফ্লোরাল-চার্ম লাক্সারি সিগনেচার টোট ব্যাগ',
    category: 'handbags',
    categoryBn: 'হ্যান্ডব্যাগ ও পার্স',
    price: 1850,
    originalPrice: 2600,
    rating: 5.0,
    reviewsCount: 112,
    badge: 'টপ সেলিং',
    badgeEn: 'Most Popular',
    isFlashSale: true,
    flashSaleDiscount: '২৯% ছাড়',
    inStock: true,
    stockCount: 35,
    fabric: 'Imported Structured Vegan Leather with Gold CC Hardware & Handcrafted Blossom Tassel',
    fabricBn: 'ইমপোর্টেড স্ট্রাকচার্ড ওয়াটারপ্রুফ ভেগান লেদার, গোল্ডেন হার্ডওয়্যার ও হ্যান্ডক্রাফটেড ফ্লাওয়ার ট্যাসেল',
    description: 'Our most iconic designer handbag. Unique scalloped V-silhouette accented with an artisanal floral tassel and golden monogram medallion. Spacious triple-compartment interior.',
    descriptionBn: 'বাংলাদেশের ট্রেন্ডি বুটিক ব্যাগ কালেকশন। প্রিমিয়াম ফিনিশিং, গোল্ডেন মেটালিক লোগো ও কিউট ফ্লাওয়ার চার্ম। ভেতরে ৩টি স্পেশাল কম্পার্টমেন্ট রয়েছে।',
    images: [
      '/assets/products/hero_handbag_collection_podium.png',
      '/assets/products/bag_tote_floral_white.png',
      '/assets/products/bag_tote_floral_babyblue.png',
      '/assets/products/bag_tote_floral_sage.png',
      '/assets/products/bag_tote_floral_navy.png'
    ],
    colors: [
      { name: 'Pearl White', nameBn: 'পার্ল হোয়াইট', hex: '#FDFBF7', image: '/assets/products/bag_tote_floral_white.png' },
      { name: 'Sage Mint Green', nameBn: 'সেইজ মিন্ট গ্রিন', hex: '#C2D6C0', image: '/assets/products/bag_tote_floral_sage.png' },
      { name: 'Baby Sky Blue', nameBn: 'স্কাই ব্লু', hex: '#ADC6DA', image: '/assets/products/bag_tote_floral_babyblue.png' },
      { name: 'Deep Slate Navy', nameBn: 'ডিপ স্লেট নেভি', hex: '#37495B', image: '/assets/products/bag_tote_floral_navy.png' },
      { name: 'Ochre Mustard', nameBn: 'মাস্টার্ড গোল্ড', hex: '#C89D3C', image: '/assets/products/hero_handbag_collection_podium.png' }
    ],
    sizes: ['Medium Tote (13\" × 10\" × 5\")']
  },
  {
    id: 'ks-bg-02',
    name: 'Aimeedir Ribbon Scarf & Fluffy Pom-Pom Top-Handle Shoulder Bag',
    nameBn: 'এইমিদির রিবন স্কার্ফ & ফ্লাফি পম-পম টপ-হ্যান্ডেল শোল্ডার ব্যাগ',
    category: 'handbags',
    categoryBn: 'হ্যান্ডব্যাগ ও পার্স',
    price: 1950,
    originalPrice: 2800,
    rating: 4.9,
    reviewsCount: 76,
    badge: 'ডিজাইনার চয়েস',
    badgeEn: 'Designer Choice',
    isFlashSale: false,
    inStock: true,
    stockCount: 24,
    fabric: 'Dual-Tone Smooth Matte Vegan Leather with Silk Twilly Scarf & Plush Charm',
    fabricBn: 'ডুয়াল-টোন প্রিমিয়াম ম্যাট লেদার, সিল্ক বো স্কার্ফ ও সফট পম-পম চার্ম',
    description: 'Exquisite French boutique charm. Features elegant color-blocked exterior with gold-tone zip pocket, detachable silk printed bow ribbon and plush faux-fur pom-pom.',
    descriptionBn: 'ফ্রেঞ্চ ফ্যাশন ইন্সপায়ারড কালার-ব্লক শোল্ডার ব্যাগ। সাথে রিমুভেবল সিল্কি রিবন স্কার্ফ ও আকর্ষণীয় কিউট পম-পম। সাথে লং বেল্ট দেওয়া আছে।',
    images: [
      '/assets/products/bag_pompom_shoulder_quad.png',
      '/assets/products/bag_tote_floral_white.png'
    ],
    colors: [
      { name: 'Powder Blue & Ivory', nameBn: 'পাউডার ব্লু & হোয়াইট', hex: '#9BB7D4', image: '/assets/products/bag_pompom_shoulder_quad.png' },
      { name: 'Classic Black & White', nameBn: 'ব্ল্যাক & হোয়াইট', hex: '#1C1C1F', image: '/assets/products/bag_pompom_shoulder_quad.png' },
      { name: 'Beige with Navy Bow', nameBn: 'বেইজ উইথ নেভি', hex: '#DED5C3', image: '/assets/products/bag_pompom_shoulder_quad.png' },
      { name: 'Pearl Heart Charm', nameBn: 'পিওর হোয়াইট', hex: '#FFFFFF', image: '/assets/products/bag_pompom_shoulder_quad.png' }
    ],
    sizes: ['Crossbody / Shoulder (11\" × 8.5\" × 4.5\")']
  },
  {
    id: 'ks-bg-03',
    name: 'Luxury Crocodile Texture Trio Flap Crossbody Clutch Collection',
    nameBn: 'লাক্সারি ক্রোকোডাইল টেক্সচার্ড স্লিং ক্লাচ ব্যাগ',
    category: 'handbags',
    categoryBn: 'হ্যান্ডব্যাগ ও পার্স',
    price: 1450,
    originalPrice: 2100,
    rating: 4.8,
    reviewsCount: 59,
    badge: 'স্পেশাল অফার',
    badgeEn: 'Best Value',
    isFlashSale: true,
    flashSaleDiscount: '৩১% ছাড়',
    inStock: true,
    stockCount: 28,
    fabric: 'Embossed Glossy Crocodile Vegan Leather with Magnetic Snap Closure',
    fabricBn: 'গ্লসি এমবসড ক্রোকোডাইল প্যাটার্ন লেদার, ম্যাগনেটিক স্ন্যাপ ও গোল্ডেন মেটাল চেইন',
    description: 'Sleek, timeless and compact. The embossed crocodile texture adds rich depth, making it the perfect clutch for parties, dinners and smart everyday styling.',
    descriptionBn: 'পার্টি বা ক্যাজুয়াল আউটফিটের সাথে ক্যারি করার জন্য পারফেক্ট। গ্লসি ফিনিশিং, ফোন, টাকা ও কসমেটিক্স রাখার জন্য উপযুক্ত সাইজ।',
    images: [
      '/assets/products/bag_clutch_crocodile_multi.png',
      '/assets/products/bag_crossbody_minmin_multi.png'
    ],
    colors: [
      { name: 'Dark Espresso Brown', nameBn: 'এসপ্রেসো ডার্ক ব্রাউন', hex: '#3B2418', image: '/assets/products/bag_clutch_crocodile_multi.png' },
      { name: 'Cognac Rust', nameBn: 'কনিয়াক রাস্ট অরেঞ্জ', hex: '#9E4424', image: '/assets/products/bag_clutch_crocodile_multi.png' },
      { name: 'Camel Tan', nameBn: 'ক্যামেল ট্যান', hex: '#B88452', image: '/assets/products/bag_clutch_crocodile_multi.png' }
    ],
    sizes: ['Compact Clutch (9\" × 5.5\" × 2.5\")']
  },
  {
    id: 'ks-bg-04',
    name: 'Min-Min Multi-Zip Genuine Grain Compact Crossbody Phone Bag',
    nameBn: 'মিন-মিন মাল্টি-জিপার কমপ্যাক্ট ক্রসবাডি ট্রাভেল ব্যাগ',
    category: 'handbags',
    categoryBn: 'হ্যান্ডব্যাগ ও পার্স',
    price: 1290,
    originalPrice: 1850,
    rating: 4.9,
    reviewsCount: 84,
    badge: 'ডেইলি ইউজ',
    badgeEn: 'Daily Essential',
    isFlashSale: false,
    inStock: true,
    stockCount: 31,
    fabric: 'Supple Pebble Grain PU Leather with Heavy Duty Dual Zippers & Adjustable Webbed Strap',
    fabricBn: 'সফট পেবল গ্রেইন লেদার, মজবুত ডুয়াল মেটাল জিপার ও আরামদায়ক ওয়াইড স্ট্র্যাপ',
    description: 'Engineered for busy women on the move. Dual deep zippered compartments safely store all large smartphones, cards, keys, and makeup with quick access.',
    descriptionBn: 'যেকোনো সাইজের স্মার্টফোন, পাওয়ার ব্যাংক, টাকা ও চাবি রাখার জন্য সুপার সুবিধাজনক। ওয়াটার রেজিস্ট্যান্ট ও অত্যন্ত টেকসই।',
    images: [
      '/assets/products/bag_crossbody_minmin_multi.png',
      '/assets/products/bag_clutch_crocodile_multi.png'
    ],
    colors: [
      { name: 'Burgundy Wine', nameBn: 'বার্গান্ডি ওয়াইন', hex: '#581825', image: '/assets/products/bag_crossbody_minmin_multi.png' },
      { name: 'Olive Green', nameBn: 'মিলিটারি অলিভ', hex: '#63654E', image: '/assets/products/bag_crossbody_minmin_multi.png' },
      { name: 'Espresso Brown', nameBn: 'চকলেট ব্রাউন', hex: '#544136', image: '/assets/products/bag_crossbody_minmin_multi.png' },
      { name: 'Onyx Black', nameBn: 'জেট ব্ল্যাক', hex: '#1A1A1E', image: '/assets/products/bag_crossbody_minmin_multi.png' },
      { name: 'Cement Grey', nameBn: 'সিমেন্ট গ্রে', hex: '#87898B', image: '/assets/products/bag_crossbody_minmin_multi.png' },
      { name: 'Warm Taupe', nameBn: 'টোপ স্যান্ড', hex: '#B2A38F', image: '/assets/products/bag_crossbody_minmin_multi.png' }
    ],
    sizes: ['Compact Crossbody (7.5\" × 5.5\" × 3.5\")']
  }
];

export const categories = [
  { id: 'all', name: 'All Collection', nameBn: 'সকল কালেকশন', icon: 'Sparkles', count: 12 },
  { id: 'three-piece', name: 'Three-Piece', nameBn: 'থ্রি-পিস', icon: 'Shirt', count: 4, image: '/assets/products/threepiece_black_white.png' },
  { id: 'abaya', name: 'Dubai Abaya & Borka', nameBn: 'আবায়া ও বোরকা', icon: 'Sparkle', count: 4, image: '/assets/products/abaya_dubai_stonework_black.png' },
  { id: 'gowns', name: 'Modest Gowns', nameBn: 'মডেস্ট গাউন', icon: 'Heart', count: 2, image: '/assets/products/gown_floral_festive_01.png' },
  { id: 'handbags', name: 'Designer Handbags', nameBn: 'হ্যান্ডব্যাগ ও পার্স', icon: 'ShoppingBag', count: 4, image: '/assets/products/hero_handbag_collection_podium.png' }
];
