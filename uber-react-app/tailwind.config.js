/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Uber Move"', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'uber-gray-100': '#F6F6F6',
        'uber-gray-200': '#EEEEEE',
        'uber-gray-800': '#333333',
      }
    },
  },
  plugins: [],
}
