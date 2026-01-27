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
        sans: ['Nunito', 'sans-serif'], // Use Nunito as default sans
      },
      colors: {
        primary: withOpacity('--color-primary'),
        secondary: withOpacity('--color-secondary'),
        background: withOpacity('--color-background'),
        'text-primary': withOpacity('--color-text'),
        'card-background': withOpacity('--color-card-background'),
        'muted-text': withOpacity('--color-muted-text'),
        'header': withOpacity('--color-header-text'),
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'bounce-soft': 'bounceSoft 2s infinite',
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
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        bounceSoft: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-5px)' },
        }
      },
      boxShadow: {
        'glow': '0 0 25px rgba(var(--color-primary), 0.6)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'neumorphic': '20px 20px 60px #d1d9e6, -20px -20px 60px #ffffff',
      },
      backdropBlur: {
        'xs': '2px',
        'xl': '24px',
        '2xl': '40px',
      }
    },
  },
  plugins: [],
};
