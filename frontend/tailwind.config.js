/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      height: {
        "9/10": "90%",
        "1/10": "10%",
        "500px": "500px",
      },
      width: {
        700: "700px",
      },
      minWidth: {
        700: "700px",
      },
      maxWidth: {
        "3/4": "75%",
      },
      borderRadius: {
        "18px": "18px",
        "56px": "56px",
      },
      fontSize: {
        "10px": "10px",
      },
      padding: {
        "2px": "2px",
      },
    },
  },
  plugins: [],
};
