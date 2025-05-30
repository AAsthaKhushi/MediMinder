/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2AC9B7',
          light: '#b3eae3',
          dark: '#1a9e8f',
        },
        secondary: {
          DEFAULT: '#6fba82',
          light: '#c8e6d0',
        },
        warning: '#f0b429',
        success: '#22c55e',
        danger: '#ef4444',
      },
      borderRadius: {
        'xl': '1rem',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}
