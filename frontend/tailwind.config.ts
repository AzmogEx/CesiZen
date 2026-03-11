import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        candlelight: {
          50: "#fffde6",
          100: "#fffacc",
          200: "#fff599",
          300: "#ffef66",
          400: "#ffe833",
          500: "#fce117",
          600: "#e5c800",
          700: "#b39c00",
          800: "#806f00",
          900: "#4d4300",
          950: "#332d00",
        },
        malachite: {
          50: "#e6fdf0",
          100: "#ccfbe0",
          200: "#99f7c2",
          300: "#66f3a3",
          400: "#33ef85",
          500: "#06c656",
          600: "#05a348",
          700: "#047d37",
          800: "#035827",
          900: "#023316",
          950: "#01220f",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Poppins", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
