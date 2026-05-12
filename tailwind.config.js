/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#050816",
        secondary: "#aaa6c3",
        tertiary: "#151030",
        accent: "#8b5cf6",
        cyan2: "#06b6d4",
        "black-100": "#100d25",
        "black-200": "#090325",
        "white-100": "#f3f3f3",
      },
      boxShadow: {
        card: "0px 35px 120px -15px #211e35",
        glow: "0 0 40px rgba(139, 92, 246, 0.5)",
      },
      screens: { xs: "450px" },
      fontFamily: {
        sans: ['"Space Grotesk"', "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      backgroundImage: {
        "hero-pattern": "radial-gradient(ellipse at top, rgba(139,92,246,0.15), transparent 60%), radial-gradient(ellipse at bottom, rgba(6,182,212,0.15), transparent 60%)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s ease-in-out infinite",
        "gradient": "gradient 8s linear infinite",
        "spin-slow": "spin 20s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        gradient: {
          "0%, 100%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
        },
      },
    },
  },
  plugins: [],
};