/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // 1. BLACK (Noir)
          noir: '#090A0F',          // Deepest Velvet Jet Black
          noirDeep: '#050608',
          noirCard: '#12141D',
          noirSurface: '#181B26',
          // 2. WHITE (Canvas & Cards)
          canvas: '#F8F9FA',        // Crisp Light Boutique Canvas
          pureWhite: '#FFFFFF',     // Pure White Cards & Panels
          ivory: '#FAF8F5',         // Warm Silk Ivory
          surface: '#FFFFFF',       // Default Surface
          card: '#FFFFFF',          // Card Surface
          border: 'rgba(212, 175, 55, 0.25)', // Elegant Gold Hairline Border
          borderLight: '#E2E8F0',   // Subtle Grey Border
          borderHover: '#D4AF37',   // Gold Border Accent
          // 3. GOLD (Imperial Metallic Accent)
          gold: '#D4AF37',          // Primary Imperial Metallic Gold
          goldDark: '#B38918',      // Deep Rich Gold (Legible on White)
          goldLight: '#F7E5A9',     // Champagne Shimmer
          goldMuted: 'rgba(212, 175, 55, 0.12)',
          white: '#FFFFFF',
          textDark: '#0F172A',      // Deep Black Text for White Backgrounds
          textMuted: '#64748B',     // Muted Slate Text
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Hind Siliguri"', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'serif'],
        bengali: ['"Hind Siliguri"', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 6px 24px -2px rgba(212, 175, 55, 0.45)',
        'gold-soft': '0 8px 30px rgba(212, 175, 55, 0.18)',
        'luxury-white': '0 10px 30px -4px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(212, 175, 55, 0.2)',
        'luxury-white-hover': '0 18px 45px -6px rgba(0, 0, 0, 0.12), 0 0 0 1.5px rgba(212, 175, 55, 0.65)',
        'luxury-noir': '0 14px 40px -5px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(212, 175, 55, 0.25)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F8E7AC 0%, #D4AF37 55%, #A68019 100%)',
        'gold-shimmer': 'linear-gradient(90deg, #D4AF37 0%, #FFF2CC 50%, #D4AF37 100%)',
        'gold-liquid': 'linear-gradient(135deg, #F8E7AC 0%, #E2BE50 30%, #D4AF37 60%, #9E7A16 100%)',
        'gold-btn': 'linear-gradient(135deg, #F7E4A1 0%, #DDB847 45%, #B88E1C 100%)',
        'gold-btn-hover': 'linear-gradient(135deg, #FFF0BA 0%, #E6C252 50%, #C79C24 100%)',
        'noir-gradient': 'linear-gradient(180deg, #12141D 0%, #090A0F 100%)',
      }
    },
  },
  plugins: [],
}