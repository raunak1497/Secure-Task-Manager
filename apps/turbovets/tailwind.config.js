/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",   // <-- REQUIRED for dark mode to work

  content: [
    "./src/**/*.{ts,tsx,js,jsx}",
    "./src/app/**/*.{ts,tsx,js,jsx}",
    "./src/components/**/*.{ts,tsx,js,jsx}",
  ],

  theme: {
    extend: {},
  },
  plugins: [],
};