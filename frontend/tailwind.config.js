/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      filter: {
        glow: "drop-shadow(0 0 10px rgba(0, 255, 0, 0.8)) drop-shadow(0 0 20px rgba(0, 255, 0, 0.5))",
        filterGlow: "drop-shadow(0 0 5px #00D4E9) drop-shadow(0 0 40px #00D4E9)"
      },
      colors: {
        primary: "#00D4E9", // You can name your color
        primary2: "#16349D", // You can name your color
        seconday: "#10B981", // Another custom color
        gradient1: "#08b9d5",
        gradient2: "#D1D5DB",
        header: "#222223",
        footer: "#272A2F",
        footerMenu: "#1C1F24",
        box: "#222223",
        input: "#17181c",
        purple: "#B96BFC",
        buttonBlue: "#0053DE",
        blueLight: "#112a83",
        blueDark: "#00060a",
        blueNeon: "#15A3F9"
      },
      textShadow: {
        greenGlow: "0 0 14px #00D4E9, 0 2px 0 rgb(0 255 0 / 0%)"
      },
      backgroundColor: {
        purple: "#B96BFC",
        "dashboard-box": "#262B2F"
      },
      backgroundImage: {
        "primary-gradient": "linear-gradient(133deg, #16349D 3%, #000420 100%)",
        "blue-green-gradient": "linear-gradient(90deg, #1E40AF, #10B981)",
        "radial-gradient": "radial-gradient(circle, #ff5733, #10B981)",
        "custom-radial-gradient": "radial-gradient(circle, #1E40AF, #ff5733)",
        "red-radial-gradient": "linear-gradient(90deg, #740100 15%,#0a0001 , #740100 85%)",
        "miningBg": "url('../src/assets/images/miningBg.png')"
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
        chau: ['"Chau Philomene One"', 'sans-serif'],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(50%)" },
          "100%": { transform: "translateX(-100%)" }
        },
        blink: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0 }
        },
        glow: {
          "0%": {
            textShadow:
              "0 0 5px rgba(0, 212, 233, 1), 0 0 10px rgba(0, 212, 233, 0.7)"
          },
          "100%": {
            textShadow:
              "0 0 15px rgba(0, 212, 233, 0), 0 0 30px rgba(0, 212, 233, 0.2)"
          }
        },
        scale: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        marquee: "marquee 20s linear infinite",
        blink: "blink 1s step-start infinite",
        glow: "glow 1.5s infinite alternate",
        scale: 'scale 0.3s ease-in-out',
        spinSlow: 'spinSlow 2s linear infinite', // Adjust duration (e.g., 3s) for slower speed
      },
      animationDelay: {
        275: "275ms",
        5000: "5s"
      },
      animationDuration: {
        2000: "2s",
        long: "10s",
        "very-long": "20s"
      }
    }
  },
  plugins: [require("tailwindcss-textshadow"), require("tailwindcss-filters")]
};
