/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        sand: "#f7f1e8",
        clay: "#c86d45",
        moss: "#4d7c62",
        gold: "#f1b94e",
      },
      boxShadow: {
        panel: "0 20px 50px rgba(23, 32, 51, 0.12)",
      },
      fontFamily: {
        display: ["Georgia", "serif"],
        body: ["Trebuchet MS", "sans-serif"],
      },
    },
  },
  plugins: [],
};
