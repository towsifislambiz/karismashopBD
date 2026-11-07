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
          noir: '#08090C',          // 1. Deepest Obsidian Velvet Black
          surface: '#0F1118',       // Elevated Card Background
          card: '#151822',          // Secondary Surface
          border: 'rgba(212, 175, 55, 0.15)', // Hairline Gold Border
          borderHover: '#D4AF37',   // Gold Border Accent
          gold: '#D4AF37',          // 2. Primary Imperial Metallic Gold
          goldLight: '#F7E5A9',     // Champagne Shimmer
          goldDark: '#A68019',      // Rich Antique Gold
          goldMuted: 'rgba(212, 175, 55, 0.12)',
          white: '#FFFFFF',         // 3. Crisp Pearl White
          cream: '#FDFBF7',         // Warm Silk White
          textMuted: '#9EABC0',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Hind Siliguri"', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'serif'],
        bengali: ['"Hind Siliguri"', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 6px 24px -2px rgba(212, 175, 55, 0.4)',
        'gold-intense': '0 10px 32px 0 rgba(212, 175, 55, 0.65)',
        'gold-soft': '0 8px 30px rgba(212, 175, 55, 0.15)',
        'luxury': '0 14px 40px -5px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(212, 175, 55, 0.18)',
        'luxury-hover': '0 20px 48px -8px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(212, 175, 55, 0.55)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F8E7AC 0%, #D4AF37 55%, #A68019 100%)',
        'gold-shimmer': 'linear-gradient(90deg, #D4AF37 0%, #FFF2CC 50%, #D4AF37 100%)',
        'gold-liquid': 'linear-gradient(135deg, #F8E7AC 0%, #E2BE50 30%, #D4AF37 60%, #9E7A16 100%)',
        'gold-btn': 'linear-gradient(135deg, #F7E4A1 0%, #DDB847 45%, #B88E1C 100%)',
        'gold-btn-hover': 'linear-gradient(135deg, #FFF0BA 0%, #E6C252 50%, #C79C24 100%)',
        'noir-gradient': 'linear-gradient(180deg, #0F1118 0%, #08090C 100%)',
      }
    },
  },
  plugins: [],
}