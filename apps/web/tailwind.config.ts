import type { Config } from "tailwindcss";

/**
 * Portfolio Wars — Dark Crypto-Luxe palette
 * See: Portfolio_Wars_Architecture_Plan.docx §11
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        canvas:      "#0B0B0F",
        surface:     "#15151D",
        elevated:    "#1E1E29",
        fg: {
          DEFAULT: "#F4EFE0",
          muted:   "#A09A8A",
          ink:     "#1A1A22"
        },
        gold: {
          DEFAULT: "#C9A24B",
          bright:  "#E6C76B",
          deep:    "#8C7236"
        },
        silver: "#B5BAC7",
        bronze: "#9B6B3A",
        gain:    "#5BE2A6",
        loss:    "#E26B6B",
        warning: "#E6B85C",
        rule:    "#2A2A36",
        neon:    "#9D5BE2"
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans:    ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'Menlo', 'monospace']
      },
      letterSpacing: {
        eyebrow: "0.18em"
      },
      borderRadius: {
        sharp: "2px"
      },
      boxShadow: {
        medal: "inset 0 0 0 1px rgba(255,255,255,0.45), 0 1px 6px rgba(0,0,0,0.5)",
        champ: "0 24px 60px rgba(0,0,0,0.55), inset 0 0 0 4px rgba(11,11,15,1), inset 0 0 0 5px rgba(201,162,75,0.35)",
        btn:   "inset 0 1px 0 rgba(255,255,255,0.18), 0 0 0 1px rgba(201,162,75,0.4)"
      },
      keyframes: {
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        }
      },
      animation: {
        shimmer: "shimmer 3s linear infinite"
      }
    }
  },
  plugins: []
};

export default config;
