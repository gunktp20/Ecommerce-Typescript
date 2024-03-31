/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    screens: {
      sm: { min: "0px", max: "600px" },

      md: { min: "601px", max: "1023px" },

      lg: { min: "1024px", max: "1279px" },

      xl: { min: "1280px", max: "1535px" },

      "2xl": { min: "1536px" },

    },
    colors: {
      ...colors,
      transparent: 'transparent',
      current: 'currentColor',
      'white': '#ffffff',
      'primary': {
         50: '#fbe9eb',
        100: '#f4bcc1',
        200: '#ee9ba3',
        300: '#e76e78',
        400: '#e2515e',
        500: '#db2636',
        600: '#c72331',
        700: '#9b1b26',
        800: '#78151e',
        900: '#5c1017',
      },
      'gray':{
         50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#030712',
      }
    }
  },
  plugins: [],
}