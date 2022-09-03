/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx}",
        "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            keyframes: {
                toastInRight: {
                    from: {
                        transform: "translateX(100%)",
                    },
                    to: {
                        transform: "translateX(0)",
                    },
                },
            },
            animation: {
                "toast-in-right": "toastInRight 0.7s",
            },
            colors: {
                "aqueductBlue": "#2662CB"
            }
        },
    },
    plugins: [],
};
