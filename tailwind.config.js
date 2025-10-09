const getSizeTokens = () => {
    const sizes = {};
    for (let i = 0; i <= 200; i += 0.5) {
        sizes[i] = `${i / 4}rem`;
    }
    return sizes;
};

const sizeTokens = getSizeTokens();

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            width: {
                ...sizeTokens,
            },
            height: {
                ...sizeTokens,
            },
            inset: {
                18: '4.5rem',
            },
            gap: {
                ...sizeTokens,
            },
            colors: {
                'black-11': '#111111',
            },
            minWidth: {
                ...sizeTokens,
            },
            maxWidth: {
                ...sizeTokens,
            },
            minHeight: {
                ...sizeTokens,
            },
            maxHeight: {
                ...sizeTokens,
            },
            margin: {
                ...sizeTokens,
            },
            padding: {
                ...sizeTokens,
            },
            fontSize: {
                sm: ['14px', '24px'],
                xxs: ['10px', '20px'],
            },
        },
    },
};
