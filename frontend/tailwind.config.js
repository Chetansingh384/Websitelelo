/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#6366f1',
                    dark: '#4f46e5',
                },
                secondary: {
                    DEFAULT: '#0ea5e9',
                    dark: '#0284c7',
                },
                dark: {
                    DEFAULT: '#0f172a',
                    surface: '#1e293b',
                }
            },
        },
    },
    plugins: [],
}
