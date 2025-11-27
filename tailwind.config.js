/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mont: ["Montserrat", "sans-serif"],
        backgroundImage: {
          "gradient-radial": "radial-gradient(circle, #FCF9E9 10%, #FFBDBD)",
        },
      },
    },
  },
  plugins: [],
};
