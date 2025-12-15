/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bitcoin: {
          DEFAULT: "#f7931a",
          dark: "#c77b15",
          light: "#ffd700",
        },
        game: {
          bg: "#0f0f1e",
          card: "#1a1a2e",
          cardDark: "#16213e",
          border: "#333",
          hover: "#2d2d44",
          hoverLight: "#3d3d55",
        },
        profit: "#2ed573",
        loss: "#ff4757",
      },
      fontFamily: {
        game: ['"Segoe UI"', "Tahoma", "Geneva", "Verdana", "sans-serif"],
      },
      boxShadow: {
        bitcoin: "0 6px 25px rgba(247, 147, 26, 0.5)",
        "bitcoin-hover": "0 8px 30px rgba(247, 147, 26, 0.7)",
        "bitcoin-active": "0 4px 15px rgba(247, 147, 26, 0.4)",
        game: "0 10px 40px rgba(0, 0, 0, 0.3)",
      },
    },
  },
  plugins: [],
};
