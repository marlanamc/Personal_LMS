import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/content/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "16px",
        md: "24px",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
    },
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        // Midnight Learning Sanctuary - Pastel Dark Theme
        primary: {
          DEFAULT: "var(--color-primary)",
          dark: "var(--color-primary-dark)",
          light: "var(--color-primary-light)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          dark: "var(--color-secondary-dark)",
          light: "var(--color-secondary-light)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          dark: "var(--color-accent-dark)",
          light: "var(--color-accent-light)",
        },
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        error: "var(--color-error)",
        info: "var(--color-info)",
        text: {
          DEFAULT: "var(--color-text)",
          muted: "var(--color-text-muted)",
          light: "var(--color-text-light)",
        },
        bg: {
          primary: "var(--color-bg-primary)",
          secondary: "var(--color-bg-secondary)",
          tertiary: "var(--color-bg-tertiary)",
          elevated: "var(--color-bg-elevated)",
        },
        border: {
          DEFAULT: "var(--color-border)",
          dark: "var(--color-border-dark)",
        },
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "12px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        full: "9999px",
      },
      boxShadow: {
        sm: "0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)",
        DEFAULT: "0 4px 12px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)",
        md: "0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)",
        lg: "0 10px 30px rgba(0, 0, 0, 0.4), 0 4px 10px rgba(0, 0, 0, 0.3)",
        xl: "0 20px 50px rgba(0, 0, 0, 0.5), 0 8px 20px rgba(0, 0, 0, 0.4)",
        "glow-pink": "0 0 20px var(--glow-pink)",
        "glow-mint": "0 0 20px var(--glow-mint)",
        "glow-lavender": "0 0 20px var(--glow-lavender)",
        "glow-aqua": "0 0 20px var(--glow-aqua)",
        "glow-peach": "0 0 20px var(--glow-peach)",
        "glow-pink-lg": "0 0 30px var(--glow-pink)",
        "glow-mint-lg": "0 0 30px var(--glow-mint)",
        "glow-lavender-lg": "0 0 30px var(--glow-lavender)",
      },
      transitionDuration: {
        fast: "150ms",
        DEFAULT: "300ms",
        slow: "500ms",
      },
      transitionTimingFunction: {
        bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
        "3xl": "64px",
      },
      zIndex: {
        base: "1",
        dropdown: "100",
        sticky: "200",
        fixed: "300",
        modal: "400",
        popover: "500",
        tooltip: "600",
      },
    },
  },
  plugins: [],
};

export default config;
