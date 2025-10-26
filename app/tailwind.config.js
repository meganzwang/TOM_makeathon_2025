/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#9146FF"
      },
      fontFamily: {
        sans: ["Outfit", "ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: []
}