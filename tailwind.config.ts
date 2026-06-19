import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#15110E",        // backstage charcoal — primary background
        ink2: "#1C1714",       // slightly lifted panel background
        velvet: "#39102A",     // curtain plum — section accents
        velvet2: "#4B1736",
        brass: "#C9A04D",      // rail hardware / primary accent
        brassLight: "#E6C97E",
        brassDim: "#8A6B33",
        cream: "#F2E9DA",      // tag paper / primary light text
        creamDim: "#C9BFAF",
        signal: "#F0057A",     // Dropp-lineage pink — live / AI indicator only
        moss: "#7FA98A",       // positive metric
        rust: "#C0603A",       // negative metric / warning
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        tag: ["var(--font-tag)", "monospace"],
      },
      boxShadow: {
        tag: "0 14px 30px -12px rgba(0,0,0,0.55)",
        rail: "inset 0 1px 0 rgba(230,201,126,0.4), 0 1px 2px rgba(0,0,0,0.4)",
      },
      backgroundImage: {
        grain: "radial-gradient(circle at 1px 1px, rgba(242,233,218,0.05) 1px, transparent 0)",
      },
      keyframes: {
        sway: {
          "0%, 100%": { transform: "rotate(-1.4deg)" },
          "50%": { transform: "rotate(1.4deg)" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        sway: "sway 6s ease-in-out infinite",
        ticker: "ticker 28s linear infinite",
        rise: "rise 0.6s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};
export default config;
