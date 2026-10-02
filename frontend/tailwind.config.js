/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAF8F5", // Warm ivory background
        surface: "#FFFFFF",    // Crisp white cards
        border: "#EBE6DF",     // Subtle warm border
        primary: {
          DEFAULT: "#1E293B",  // Deep Charcoal
          foreground: "#FFFFFF",
        },
        charcoal: {
          900: "#0F172A",
          800: "#1E293B",
          700: "#334155",
          600: "#475569",
          500: "#64748B",
          400: "#94A3B8",
          300: "#CBD5E1",
          100: "#F1F5F9",
        },
        terracotta: {
          50: "#FFF5F2",
          100: "#FFE8E3",
          200: "#FFD0C7",
          500: "#E06D53",
          600: "#C9553C",
          700: "#A83E28",
        },
        emerald: {
          50: "#ECFDF5",
          100: "#D1FAE5",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
        },
        teal: {
          50: "#F0FDFA",
          100: "#CCFBF1",
          500: "#14B8A6",
          600: "#0D9488",
          700: "#0F766E",
        },
        amber: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        'warm-sm': '0 1px 3px rgba(40, 30, 20, 0.04), 0 1px 2px rgba(40, 30, 20, 0.02)',
        'warm-md': '0 4px 14px -2px rgba(40, 30, 20, 0.06), 0 2px 6px -1px rgba(40, 30, 20, 0.03)',
        'warm-lg': '0 10px 25px -3px rgba(40, 30, 20, 0.07), 0 4px 10px -2px rgba(40, 30, 20, 0.04)',
      }
    },
  },
  plugins: [],
}
