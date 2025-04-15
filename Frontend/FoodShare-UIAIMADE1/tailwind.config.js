/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // You can extend the theme if needed
      height: {
        'screen': '100vh',
      }
    },
  },
  plugins: [],
}
