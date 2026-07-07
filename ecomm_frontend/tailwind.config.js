/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0f2340',
          800: '#1e3a5f',
          700: '#2d4f7a',
          600: '#3d6494',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        teal: {
          600: '#0d9488',
          700: '#0f766e',
        },
      },
    },
  },
  plugins: [],
}