/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all of your component files.
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                primary: "#3B82F6",
                trust: "#22C55E",
                secondary: "#F97316",
                nepali: "#E11D48",
                background: "#F8FAFC",
                surface: "#FFFFFF",
                text: {
                    primary: "#1E2937",
                    secondary: "#64748B",
                },
            },
        },
    },
    plugins: [],
}
