import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Semantic tokens — prefer these in new code */
        paper: "rgb(var(--paper) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-2": "rgb(var(--surface-2) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        "ink-dim": "rgb(var(--ink-dim) / <alpha-value>)",
        "ink-faint": "rgb(var(--ink-faint) / <alpha-value>)",
        ember: "rgb(var(--ember) / <alpha-value>)",
        "ember-dim": "rgb(var(--ember-dim) / <alpha-value>)",
        shadow: "rgb(var(--shadow) / <alpha-value>)",
        rule: "rgb(var(--rule) / <alpha-value>)",

        /* Theme-invariant — for text/marks overlaid on dark photographs */
        bone: "rgb(var(--bone) / <alpha-value>)",
        "bone-dim": "rgb(var(--bone-dim) / <alpha-value>)",
        "bone-faint": "rgb(var(--bone-faint) / <alpha-value>)",

        /* Legacy aliases — kept so existing JSX keeps working */
        dark: "rgb(var(--paper) / <alpha-value>)",
        cream: "rgb(var(--ink) / <alpha-value>)",
        gold: "rgb(var(--ember) / <alpha-value>)",
        mid: "rgb(var(--surface) / <alpha-value>)",
        muted: "rgb(var(--ink-dim) / <alpha-value>)",
      },
      fontFamily: {
        serif: [
          "Cormorant Garamond",
          "Noto Serif Khmer",
          "Georgia",
          "serif",
        ],
        sans: [
          "Inter",
          "Noto Sans Khmer",
          "system-ui",
          "sans-serif",
        ],
      },
      letterSpacing: {
        widest: "0.18em",
        kicker: "0.32em",
      },
    },
  },
  plugins: [],
};

export default config;
