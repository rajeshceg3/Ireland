// tailwind.config.js
// Helper function to use withOpacity
function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        primary: withOpacity('--color-primary'),
        'primary-soft': withOpacity('--color-primary-soft'),
        secondary: withOpacity('--color-secondary'),
        accent: withOpacity('--color-accent'),
        background: withOpacity('--color-background'),
        surface: withOpacity('--color-surface'),
        'text-primary': withOpacity('--color-text'),
        'card-background': withOpacity('--color-surface'), // Alias for backward compat if needed
        'muted-text': withOpacity('--color-muted-text'),
        'header': withOpacity('--color-header-text'),
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'bounce-soft': 'bounceSoft 2s infinite',
        'shimmer': 'shimmer 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        bounceSoft: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-5px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      },
      boxShadow: {
        'glow': '0 0 25px rgba(var(--color-primary), 0.5)',
        'glow-accent': '0 0 25px rgba(var(--color-accent), 0.5)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'neumorphic': '20px 20px 60px #d1d9e6, -20px -20px 60px #ffffff',
        'premium': '0 10px 40px -10px rgba(0,0,0,0.1)',
      },
      backdropBlur: {
        'xs': '2px',
        'xl': '24px',
        '2xl': '40px',
        '3xl': '60px',
      }
    },
  },
  plugins: [],
};
