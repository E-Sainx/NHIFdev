/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}', // Adjust paths according to your project structure
    './public/index.html' // Ensure the main HTML file is included
  ],
  theme: {
    extend: {
      colors: {
        customBlue: '#00afef', // Add your custom color here
      },
    },
  },
  plugins: [],
}
