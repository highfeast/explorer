/** @type {import('tailwindcss').Config} */
import { default as flattenColorPalette } from "tailwindcss/lib/util/flattenColorPalette";

export default {
  content: ["./index.html", "./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["var(--font-roboto)"],
      },
      animation: {
        aurora: "aurora 80s linear infinite",
        scroll:
          "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "animate-pulse": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        // aurora: {
        //   from: {
        //     backgroundPosition: "50% 50%, 50% 50%",
        //   },
        //   to: {
        //     backgroundPosition: "350% 50%, 350% 50%",
        //   },
        // },

        aurora: {
          from: {
            backgroundPosition:
              "50% 50%, 0% 0%, 25% 25%, 50% 50%, 75% 75%, 100% 100%",
          },
          to: {
            backgroundPosition:
              "50% 50%, 100% 100%, 125% 125%, 150% 150%, 175% 175%, 200% 200%",
          },
        },
        scroll: {
          to: {
            transform: "translate(calc(-50% - 0.5rem))",
          },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
    },
  },
  plugins: [addVariablesForColors],
};

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}
