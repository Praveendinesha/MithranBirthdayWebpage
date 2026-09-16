/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          blue: {
            50: '#F0F7FB',
            100: '#E1EFF7',
            200: '#C5E2F0',
            300: '#9ACEE5',
            400: '#68B3D6',
            500: '#4299C2',
            600: '#2C7A9F',
          },
          cream: {
            50: '#FCFBF7',
            100: '#FAF6EE',
            200: '#F5EBD8',
            300: '#EFE0BF',
            400: '#E4CC9C',
          },
          gold: {
            100: '#FFF7E6',
            200: '#FEE7B8',
            300: '#FDD585',
            400: '#FBC052',
            500: '#E5A62E',
            600: '#C08316',
          },
          rose: {
            50: '#FFF5F7',
            100: '#FFE5EC',
            200: '#FFCCD8',
            300: '#FF99B3',
          },
          mint: {
            50: '#F2FAF4',
            100: '#E3F6E8',
            200: '#C2ECCB',
            300: '#97DCAB',
          },
          navy: {
            700: '#2A3F60',
            800: '#1D2E49',
            900: '#121F33',
          }
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', 'system-ui', 'sans-serif'],
        royal: ['"Cinzel"', 'serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(2deg)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-16px) rotate(-3deg)' },
        },
        pulseGlow: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 20px rgba(229, 166, 46, 0.3)' },
          '50%': { transform: 'scale(1.05)', boxShadow: '0 0 35px rgba(229, 166, 46, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        shimmer: 'shimmer 2.5s infinite linear',
        wiggle: 'wiggle 1s ease-in-out infinite',
      },
      boxShadow: {
        'soft-card': '0 10px 30px -5px rgba(44, 122, 159, 0.08), 0 4px 12px -2px rgba(44, 122, 159, 0.04)',
        'soft-gold': '0 8px 25px -4px rgba(229, 166, 46, 0.25)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      },
    },
  },
  plugins: [],
}
