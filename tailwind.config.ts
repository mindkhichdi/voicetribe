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
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#000000",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F5F5F5",
          foreground: "#000000",
        },
        accent: {
          DEFAULT: "#FF4545",
          foreground: "#FFFFFF",
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
      },
      animation: {
        "recording-pulse": "recording-pulse 2s ease-in-out infinite",
        "fade-in": "fade-in 0.5s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;