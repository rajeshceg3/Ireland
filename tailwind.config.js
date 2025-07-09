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
      colors: {
        primary: withOpacity('--color-primary'),
        secondary: withOpacity('--color-secondary'),
        background: withOpacity('--color-background'),
        'text-primary': withOpacity('--color-text'), // Renamed to avoid conflict
        'card-background': withOpacity('--color-card-background'),
        'muted-text': withOpacity('--color-muted-text'),
            'header': withOpacity('--color-header-text'), // New color for header text
      }
    },
  },
  plugins: [],
};
