/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#A86651",
        secondary: "#926F64",
        tertiary: "#8F733B",
        neutral: "#807471",

        background: "#F3E1DC",
        surface: "#EEDBD5",
        surfaceSoft: "#F6E7E2",
        borderSoft: "#D8C0B7",

        text: "#4A342E",
        textMuted: "#8D746B",
        whiteSoft: "#F8F3F1",

        danger: "#B6433C",
        warning: "#E8C66A",
        success: "#7A8A4A",
        dark: "#1E120F",
      },
      borderRadius: {
        xl2: "20px",
        xl3: "28px",
        xl4: "36px",
      },
    },
  },
  plugins: [],
};
