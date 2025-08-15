/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#DC2626",
        secondary: "#1F2937",
        accent: "#F59E0B",
        surface: "#374151",
        background: "#111827",
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#3B82F6"
      },
      fontFamily: {
        display: ["Bebas Neue", "sans-serif"],
        body: ["Inter", "sans-serif"]
      },
      animation: {
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        countdown: "countdown 1s linear forwards"
      },
      keyframes: {
        countdown: {
          "0%": { strokeDasharray: "0 100" },
          "100%": { strokeDasharray: "100 0" }
        }
      }
    },
  },
  plugins: [],
}