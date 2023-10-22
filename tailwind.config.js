export const content = ['./src/dashboard/**/*.{html,js}'];
export const plugins = [require('@tailwindcss/forms')];
export const theme = {
    extend: {
        colors: {
            tfs: {
                DEFAULT: '#6104FF',
                hover: '#5300E0',
            },
        },
        fontFamily: {
            inter: ['"Inter"', 'sans-serif'],
        },
        boxShadow: {
            'overlay-left': '-16px 0px 80px -24px rgba(0, 0, 0, 0.16)',
            'overlay-right': '16px 0px 80px -24px rgba(0, 0, 0, 0.16)',
            hover: '0px 12px 24px -12px rgba(0, 0, 0, 0.12)',
        },
    },
};

export const variants = {
    extend: {},
};
