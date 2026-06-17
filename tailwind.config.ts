import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050510",
        surface: "#0d0d1a",
        "surface-2": "#12122a",
        "surface-3": "#1a1a35",
        border: "#1e1e40",
        "border-light": "#2a2a55",
        primary: {
          DEFAULT: "#7c3aed",
          50: "#f5f3ff",
          100: "#ede9fe",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
        accent: {
          DEFAULT: "#3b82f6",
          blue: "#3b82f6",
          purple: "#7c3aed",
          pink: "#ec4899",
          cyan: "#06b6d4",
        },
        text: {
          primary: "#f1f5f9",
          secondary: "#94a3b8",
          muted: "#64748b",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "hero-gradient": "linear-gradient(135deg, #050510 0%, #0d0a1f 50%, #050510 100%)",
        "card-gradient": "linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(59,130,246,0.1) 100%)",
        "glow-purple": "radial-gradient(ellipse at center, rgba(124,58,237,0.3) 0%, transparent 70%)",
        "glow-blue": "radial-gradient(ellipse at center, rgba(59,130,246,0.2) 0%, transparent 70%)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Cal Sans", "Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "shimmer": "shimmer 2s infinite linear",
        "pulse-slow": "pulse 3s infinite",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "spin-slow": "spin 8s linear infinite",
        "border-spin": "border-spin 4s linear infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(124,58,237,0.5), 0 0 20px rgba(124,58,237,0.2)" },
          "100%": { boxShadow: "0 0 20px rgba(124,58,237,0.8), 0 0 60px rgba(124,58,237,0.4)" },
        },
        "border-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        "glow-sm": "0 0 10px rgba(124,58,237,0.3)",
        "glow-md": "0 0 20px rgba(124,58,237,0.4), 0 0 40px rgba(124,58,237,0.1)",
        "glow-lg": "0 0 40px rgba(124,58,237,0.5), 0 0 80px rgba(124,58,237,0.2)",
        "glow-blue": "0 0 20px rgba(59,130,246,0.4)",
        "card": "0 4px 24px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.05) inset",
        "card-hover": "0 8px 40px rgba(0,0,0,0.8), 0 1px 0 rgba(255,255,255,0.08) inset, 0 0 0 1px rgba(124,58,237,0.3)",
      },
    },
  },
  plugins: [],
};
export default config;
