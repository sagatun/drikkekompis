/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        bangers: ["Bangers", "cursive"],
        letterSpacing: {
          wider: "0.1em",
        },
      },
      backgroundColor: {
        "chat-blue": "#0084ff",
        "chat-gray": "#f0f0f0",
      },
    },
    backgroundImage: {
      drikkekompisLogo: "url('./Header/DrikkekompisLogo1.png')",
    },
  },
  plugins: [],
};
