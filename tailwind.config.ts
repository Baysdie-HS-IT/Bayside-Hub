import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bay: {
          ink: "#152033",
          navy: "#12355B",
          teal: "#287C8E",
          gold: "#F4B942",
          mist: "#EEF7F8"
        }
      }
    }
  },
  plugins: []
};

export default config;
