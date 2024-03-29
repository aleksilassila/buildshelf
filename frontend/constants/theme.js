const theme = {
  layoutLight: "#85e0a3", // hsl(140deg 60% 70%)
  layout: "#5cd685", // hsl(140deg 60% 60%)
  layoutDark: "#2eb85c", // hsl(140deg 60% 45%)

  lightHighContrast: "#ffffff",
  light: "#fafafa", // hsl(125deg 5% 98%)
  lightMediumContrast: "#f3f3f2", // hsl(60deg 5% 95%)
  lightLowContrast: "#c9cfca", // hsl(125deg 5% 80%)

  darkHighContrast: "#1f2e20", // hsl(125deg 20% 15%)
  dark: "#384739", // hsl(125deg 12% 25%)
  darkMediumContrast: "#545f55", // hsl(125deg 6% 35%)
  darkLowContrast: "#6f7670", // hsl(125deg 3% 45%)

  red: "#d74a45",
  redLight: "#ff5f5a",

  shadow: "0 0 0rem 0 #00000040", // "0 0 0.5rem 0 #00000040"
  bottomShadow: `0 1px 0 0 #c9cfca55`, // lightLowContrast

  text: {
    bold: "text-2xl font-bold mb-2",
    display: "text-xl font-semibold",
    body: "text-stone-700",
    linkDark: "hover:underline text-green-500",
    link: "hover:underline text-green-600",
  },

  ui: {
    outline:
      "outline-0 focus:ring focus-within:ring ring-offset-1 ring-green-300",
    borders: "border border-stone-300 rounded-md",
    spacing: "flex items-center px-4 py-0 h-10",
  },
};

export default theme;
