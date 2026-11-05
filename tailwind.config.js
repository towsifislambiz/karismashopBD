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
          noir: '#090A0F',          // Deepest Luxury Velvet Black
          surface: '#11131B',       // Elevated Card Background
          card: '#161925',          // Secondary Surface
          border: '#262A3C',        // Subtle Luxury Border
          borderHover: '#D4AF37',   // Gold Border Accent
          gold: '#D4AF37',          // Primary Imperial Metallic Gold
          goldLight: '#F3E5AB',     // Champagne Shimmer
          goldDark: '#9C7A14',      // Antique Bronze Gold
          roseGold: '#E5A998',      // Soft Luxury Rose Gold
          roseDeep: '#8E2042',      // Royal Boutique Crimson
          emerald: '#0E4D3E',       // Middle Eastern Modest Emerald
          cream: '#FDFBF7',         // Warm Silk White
          textMuted: '#94A3B8',
          accent: '#10B981',        // High Conversion Order Green
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Hind Siliguri"', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'serif'],
        bengali: ['"Hind Siliguri"', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -4px rgba(212, 175, 55, 0.35)',
        'gold-soft': '0 8px 30px rgba(212, 175, 55, 0.15)',
        'luxury': '0 12px 35px -5px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(212, 175, 55, 0.12)',
        'luxury-hover': '0 20px 45px -8px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(212, 175, 55, 0.35)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F5E6AB 0%, #D4AF37 50%, #997A15 100%)',
        'gold-shimmer': 'linear-gradient(90deg, #D4AF37 0%, #FFF2CC 50%, #D4AF37 100%)',
        'noir-gradient': 'linear-gradient(180deg, #11131B 0%, #090A0F 100%)',
        'royal-gradient': 'linear-gradient(135deg, #161925 0%, #2A1724 100%)',
      }
    },
  },
  plugins: [],
}