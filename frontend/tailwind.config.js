const plugin = require("tailwindcss/plugin");
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
      monospace: ["monospace"],
    },
    extend: {
      keyframes: {
        accordion: {
          "0%": { height: "0" },
          "100%": { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-closed": {
          "0%": { height: "var(--radix-accordion-content-height)" },
          "100%": { height: "0" },
        },
      },
      animation: {
        "accordion-open": "accordion 400ms linear forwards",
        "accordion-closed": "accordion-closed 400ms linear forwards",
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant, e }) {
      addVariant("data-state-open", ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(
            `data-state-open${separator}${className}`
          )}[data-state='open']`;
        });
      });
    }),
    plugin(function ({ addVariant, e }) {
      addVariant("data-state-closed", ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(
            `data-state-closed${separator}${className}`
          )}[data-state='closed']`;
        });
      });
    }),
  ],
};
