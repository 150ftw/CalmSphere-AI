/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#F9F9F7",
        foreground: "#1A2F23",
        primary: {
          DEFAULT: "#4A6C58",
          foreground: "#FFFFFF"
        },
        secondary: {
          DEFAULT: "#E09F7D",
          foreground: "#2A1A10"
        },
        accent: {
          DEFAULT: "#A4C3D2",
          foreground: "#1A2F23"
        },
        muted: {
          DEFAULT: "#E8E8E4",
          foreground: "#6B7C70"
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#1A2F23"
        },
        border: "#E2E2DE",
        input: "#E2E2DE",
        ring: "#4A6C58",
        chart: {
          "1": "#E09F7D",
          "2": "#A4C3D2",
          "3": "#D4A373",
          "4": "#4A6C58",
          "5": "#E8E8E4"
        }
      },
      fontFamily: {
        fraunces: ['Fraunces', 'serif'],
        satoshi: ['Satoshi', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      borderRadius: {
        lg: '1rem',
        md: '0.75rem',
        sm: '0.5rem',
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(74, 108, 88, 0.05)',
        float: '0 20px 40px -4px rgba(74, 108, 88, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.7s ease-out',
        'slide-up': 'slideUp 0.7s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(2rem)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}