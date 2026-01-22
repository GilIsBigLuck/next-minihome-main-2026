import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* =========================
       * Breakpoints (Semantic aliases)
       * ========================= */
      screens: {
        mobile: "640px",
        tablet: "768px",
        desktop: "1024px",
        wide: "1280px",
      },

      /* =========================
       * Colors
       * ========================= */
      colors: {
        primary: "#0e776c",
        "primary-light": "#e7f3f2",

        bg: {
          light: "#fcfcfc",
          DEFAULT: "#ffffff",
          muted: "#f7f7f7",
          elevated: "#ffffff",
        },

        surface: "#fafafa",

        card: "#ffffff",

        text: {
          primary: "#0e776c",
          DEFAULT: "#0e1b1a",
          secondary: "#6B7280",
          muted: "#9CA3AF",
          inverse: "#ffffff",
        },

        border: {
          DEFAULT: "#E5E7EB",
          subtle: "#F3F4F6",
        },

        brand: {
          primary: "#0e776c",
          accent: "#2563EB",
        },

        state: {
          success: "#16A34A",
          warning: "#F59E0B",
          danger: "#DC2626",
        },
      },

      /* =========================
       * Typography
       * ========================= */
      fontFamily: {
        display: ["var(--font-rubik)", "sans-serif"],
        body: ["var(--font-noto-sans-kr)", "var(--font-inter)", "sans-serif"],
        sans: ["var(--font-noto-sans-kr)", "var(--font-inter)", "sans-serif"],
      },

      /* =========================
       * Font Size (Typography Scale)
       * h1: text-7xl (72px)
       * h2: text-5xl (48px)
       * h3: text-4xl (36px)
       * h4: text-3xl (30px)
       * h5: text-2xl (24px)
       * h6: text-xl (20px)
       * body: text-base (16px)
       * small: text-sm (14px)
       * caption: text-xs (12px)
       * ========================= */

      /* =========================
       * Max Width (Layout)
       * ========================= */
      maxWidth: {
        "layout-xs": "456px",
        "layout-sm": "768px",
        "layout-md": "1200px",
        "layout-lg": "1400px",
        "layout-xl": "1800px",
        "layout-max": "100vw",
      },

      /* =========================
       * Border Radius
       * ========================= */
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
        oval: "50%",
      },

      /* =========================
       * Shadows
       * ========================= */
      boxShadow: {
        card: "0 8px 24px rgba(0,0,0,0.08)",
      },

      /* =========================
       * Z-Index
       * ========================= */
      zIndex: {
        header: "800",
        dropdown: "900",
        modal: "1000",
        toast: "1100",
      },

      /* =========================
       * Keyframes
       * ========================= */
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },

      /* =========================
       * Animation
       * ========================= */
      animation: {
        fadeIn: "fadeIn 0.5s ease-out",
        slideUp: "slideUp 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
