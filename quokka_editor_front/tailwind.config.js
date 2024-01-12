/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/react-hot-toast/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "project-green": {
          100: "#e9edc9",
          200: "#dbe1bc",
          300: "#ccd5ae",
        },
        "project-beige": {
          100: "#f4f4d5",
          200: "#fefae0",
          300: "#fcf4d7",
          400: "#faedcd",
          500: "#ffeec5",
          600: "#e7c8a0",
          700: "#deb68a",
          800: "#ffe1bb",
          900: "#d4a373",
        },
        "project-theme-dark": {
          100: "#1F2129",
          105: "#1f21292e",
          110: "#5F6066",
          115: "#ffffff29",
          120: "#15172365",
          200: "#20222B",
          300: "#2A2C38",
          350: "#353745",
          400: "#3A3C4E",
          500: "#474A61",
          600: "#5D5F6D",
          700: "#9F9FA2",
        },
        "project-window-bonus": {
          100: "#295E6E",
          150: "#165163",
          200: "#872727",
          300: "#656A46",
        },
      },
    },
  },
  plugins: [],
};
