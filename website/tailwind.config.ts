import type { Config } from "tailwindcss";
const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");
const plugin = require('tailwindcss/plugin')

const config: Config = {
    darkMode: "class",
    content: ["./app/pages/**/*.{js,ts,jsx,tsx,mdx}", "./app/components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{ts,tsx}"],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        textShadow: {
            sm: "black 1px 1px 0.1em, black 0px 0px 0.1em, black 0px 0px 0.1em",
            DEFAULT: "black 1px 1px 0.2em, black 0px 0px 0.2em, black 0px 0px 0.2em"
        },
        extend: {
            fontFamily: {
                himagsikan: ["Himagsikan", "sans-serif"],
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                inherit: "inherit",
            },
            colors: {
                discord: "#5562ea",
                telegram: "#27a3e2",
                jade: {
                    "50": "#edfcf4",
                    "100": "#d3f8e2",
                    "200": "#aaf0ca",
                    "300": "#73e2ac",
                    "400": "#3bcc8a",
                    "500": "#17b271",
                    "600": "#0b905b",
                    "700": "#09734c",
                    "800": "#0a5b3d",
                    "900": "#094b34",
                    "950": "#042a1e",
                },
                lemon: {
                    "50": "#ffffe7",
                    "100": "#fbffc1",
                    "200": "#fbff87",
                    "300": "#fffe42",
                    "400": "#fff30f",
                    "500": "#ebd402",
                    "600": "#cfaa00",
                    "700": "#a57a03",
                    "800": "#885f0b",
                    "900": "#744e0f",
                    "950": "#442904",
                },
                smoke: {
                    "50": "#f6f6f6",
                    "100": "#e7e7e7",
                    "200": "#d1d1d1",
                    "300": "#b0b0b0",
                    "400": "#888888",
                    "500": "#6d6d6d",
                    "600": "#5d5d5d",
                    "700": "#4f4f4f",
                    "800": "#454545",
                    "900": "#141414",
                    "950": "#040404",
                },
                sky: {
                    "50": "#ebfffd",
                    "100": "#cefffc",
                    "200": "#a2fffc",
                    "300": "#63fdf9",
                    "400": "#1cf4f2",
                    "500": "#00e1e2",
                    "600": "#03adb7",
                    "700": "#0a8994",
                    "800": "#126d78",
                    "900": "#145a65",
                    "950": "#063d46",
                },
                blood: {
                    "50": "#fff1f1",
                    "100": "#ffe0e0",
                    "200": "#ffc7c7",
                    "300": "#ff9f9f",
                    "400": "#ff6868",
                    "500": "#fa3939",
                    "600": "#e81a1a",
                    "700": "#c31212",
                    "800": "#a11313",
                    "900": "#851717",
                    "950": "#490606",
                },
                water: {
                    "50": "#eefaff",
                    "100": "#d9f2ff",
                    "200": "#bce9ff",
                    "300": "#8eddff",
                    "400": "#59c7ff",
                    "500": "#32abff",
                    "600": "#1b8df5",
                    "700": "#1475e1",
                    "800": "#175eb6",
                    "900": "#19508f",
                    "950": "#143157",
                },
            },
            screens: {
                xs: "480px",
                "3xl": "1920px",
                "4xl": "2560px",
                ...defaultTheme.screens,
            },
            maxHeight: {
                110: "27rem",
                112: "28rem",
                128: "32rem",
                144: "36rem",
                ...defaultTheme.maxHeight,
            },
            minHeight: {
                110: "27rem",
                112: "28rem",
                128: "32rem",
                144: "36rem",
                ...defaultTheme.minHeight,
            },
            height: {
                110: "27rem",
                112: "28rem",
                128: "32rem",
                144: "36rem",
                ...defaultTheme.height,
            },
            maxWidth: {
                "8xl": "90rem",
                "9xl": "100rem",
                "10xl": "110rem",
                "11xl": "120rem",
                ...defaultTheme.maxWidth,
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [require("@tailwindcss/forms"), require("tailwindcss-animate"), addVariablesForColors, plugin(function ({ matchUtilities, theme }: any) {
        matchUtilities(
          {
            'text-shadow': (value: any) => ({
              textShadow: value,
            }),
          },
          { values: theme('textShadow') }
        )
      })
    ],
};
// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }: any) {
    let allColors = flattenColorPalette(theme("colors"));
    let newVars = Object.fromEntries(Object.entries(allColors).map(([key, val]) => [`--${key}`, val]));

    addBase({
        ":root": newVars,
    });
}

export default config;
