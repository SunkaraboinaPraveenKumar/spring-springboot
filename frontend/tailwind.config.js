/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#1f1f1f',
          card: '#2c2b2b',
          text: '#ffffff',
          navbar: '#000000',
        },
        light: {
          bg: '#ffffff',
          card: '#ffffff',
          text: '#000000',
          navbar: '#f8f9fa',
        }
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}
