const fontBody = ["Avenir", "Montserrat", "Arial", "sans-serif"];
const fontDisplay = ["Avenir", "Montserrat", "Arial", "sans-serif"];

module.exports = {
  content: [
    "./pages/**/*.{js,jsx,tx,tsx}",
    "./components/**/*.{js,jsx,tx,tsx}",
    "containers/**/*.{js,jsx,tx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: fontBody,
      body: fontBody,
      display: fontDisplay,
    },
  },
  plugins: [],
};
