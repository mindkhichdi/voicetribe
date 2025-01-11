import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ["Playfair Display", "serif"],
        mono: ["Space Mono", "monospace"],
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#9b87f5",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#7E69AB",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#8B5CF6",
          foreground: "#FFFFFF",
        },
        purple: {
          light: "#D6BCFA",
          DEFAULT: "#9b87f5",
          dark: "#1A1F2C",
          soft: "#E5DEFF",
          vivid: "#8B5CF6",
        },
      },
      keyframes: {
        "recording-pulse": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.1)", opacity: "0.8" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "typewriter": {
          "from": { width: "0" },
          "to": { width: "100%" },
        },
      },
      animation: {
        "recording-pulse": "recording-pulse 2s ease-in-out infinite",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "float": "float 3s ease-in-out infinite",
        "typewriter": "typewriter 2s steps(40, end)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;