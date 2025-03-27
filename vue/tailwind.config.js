/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        "main": "1200px"
      }
    },
    fontFamily: {
      "sans": ["Times", "Times New Roman", "Georgia"],
      "body": ["Times", "Times New Roman", "Georgia"]
    }
  },
  plugins: [
    require('tailwindcss-primeui')
  ],
}

