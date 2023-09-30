/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
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
      },
    },
  },
  plugins: [],
};
