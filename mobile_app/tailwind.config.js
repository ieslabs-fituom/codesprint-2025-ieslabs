/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        blue: '#124076',
        black: '#2F3640',
        white: '#FFFFFF',
        gray: '#7F8C8D',
        gray2: '#F3F3F3',
        gray2: '#BCBCBC',
        green: '#27AE60',
        red: '#C0392B',
      }
    },
  },
}

