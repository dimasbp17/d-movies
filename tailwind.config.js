/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', md: '2.5rem', xl: '4rem' },
      screens: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1440px' },
    },
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
      },
      colors: {
        ink: {
          950: '#07070b',
          900: '#0c0c12',
          850: '#101018',
          800: '#15151f',
          700: '#1e1e2b',
          600: '#2a2a3a',
        },
        accent: {
          DEFAULT: '#f2c46d',
          soft: '#f7dba3',
          deep: '#d9a441',
        },
        rose: {
          glow: '#ff7a93',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(242,196,109,.25), 0 10px 40px -10px rgba(242,196,109,.35)',
        card: '0 20px 50px -20px rgba(0,0,0,.8)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: 0, transform: 'translateY(16px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        'scale-in': {
          from: { opacity: 0, transform: 'scale(.96)' },
          to: { opacity: 1, transform: 'scale(1)' },
        },
        'ken-burns': {
          from: { transform: 'scale(1.08)' },
          to: { transform: 'scale(1)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        progress: {
          from: { transform: 'scaleX(0)' },
          to: { transform: 'scaleX(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up .7s cubic-bezier(.2,.7,.2,1) both',
        'fade-in': 'fade-in .5s ease both',
        'scale-in': 'scale-in .35s cubic-bezier(.2,.7,.2,1) both',
        'ken-burns': 'ken-burns 8s ease-out both',
        shimmer: 'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [],
};
