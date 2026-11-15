/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#0B1026",
        mars: "#E8643C",
        sand: "#F4B26A",
        shield: "#4FC3F7",
        life: "#5BD99A",
        solar: "#FFD23F",
        paper: "#FFF8F0",
      },
      fontFamily: {
        display: ["Fredoka", "Trebuchet MS", "ui-rounded", "system-ui", "sans-serif"],
        body: ["Nunito", "Avenir Next", "system-ui", "sans-serif"],
      },
      borderRadius: {
        bubble: "1.75rem",
      },
      boxShadow: {
        soft: "0 16px 48px rgb(3 7 18 / 25%)",
        glow: "0 0 28px rgb(244 178 106 / 24%)",
      },
    },
  },
  plugins: [],
};
