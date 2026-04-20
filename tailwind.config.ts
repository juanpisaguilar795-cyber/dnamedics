import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ─── Breakpoints custom ──────────────────────────────
      screens: {
        'xs': '480px',  // Para pantallas pequeñas pero no mínimas
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      // ─── Brand colors ─────────────────────────────────────
      colors: {
        brand: {
          teal: "#007b8f",
          navy: "#1e3a8a",
          cyan: "#0891b2",
        },
      },
      // ─── Fuentes ──────────────────────────────────────────
      fontFamily: {
        cormorant: ["'Cormorant Garamond'", "Georgia", "serif"],
        body: ["'DM Sans'", "system-ui", "sans-serif"],
      },
      // ─── Altura del navbar ────────────────────────────────
      height: { 
        nav: "4rem" 
      },
      // ─── Animaciones ──────────────────────────────────────
      animation: {
        "slide-in-right": "slide-in-right 0.28s cubic-bezier(.4,0,.2,1) both",
        "fade-up": "fade-up 0.4s cubic-bezier(.4,0,.2,1) both",
      },
      keyframes: {
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;