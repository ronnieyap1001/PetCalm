import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: "#A8C5A0",
        cream: "#FDF8F0",
        charcoal: "#2D2D2D",
        coral: "#E8785C",
        gold: "#D4A959",
        indigo_deep: "#3B3F7A",
        amber_warm: "#E0A95C",
        lavender_soft: "#C9B8DE",
        forest: "#3F6E4A",
        storm: "#3A3A3A",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Lora", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
