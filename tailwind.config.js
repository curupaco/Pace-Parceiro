/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    neon: '#ccff00',
                    purple: '#8b5cf6',
                    dark: '#0f172a',
                    orange: '#fb923c',
                }
            },
            animation: {
                'fade-in': 'fade-in 0.5s ease-out',
            },
            keyframes: {
                'fade-in': {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            }
        },
    },
    plugins: [],
}
