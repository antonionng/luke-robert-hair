import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          DEFAULT: '#687B69',  // Core brand color from logo
          light: '#A4B5A5',
          pale: '#E8EDE8',
          dark: '#4A5A4B',
        },
        education: {
          DEFAULT: '#C9A86A',  // Warm gold that complements sage
          light: '#E0C99A',
          dark: '#A88A52',
        },
        salon: {
          DEFAULT: '#7A8E8F',  // Cool teal-grey that complements sage
          light: '#A8B9BA',
          dark: '#5A6D6E',
        },
        accent: {
          cream: '#F5F3ED',    // Soft cream from logo
          mint: '#B8D4C8',     // Fresh mint
          terracotta: '#D4A088', // Warm terracotta
        },
        offwhite: '#FAFAF8',
        graphite: '#2C2C2C',
        mist: '#E9E9E7',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        heading: ['var(--font-heading)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'zoom': 'zoom 0.3s ease-in-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        zoom: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.03)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-education': 'linear-gradient(135deg, #C9A86A 0%, #E0C99A 100%)',
        'gradient-salon': 'linear-gradient(135deg, #7A8E8F 0%, #A8B9BA 100%)',
        'gradient-sage': 'linear-gradient(135deg, #687B69 0%, #A4B5A5 100%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;
