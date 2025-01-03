/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'],

    plugins: [require('flowbite/plugin')],

    darkMode: 'selector',

    theme: {
        extend: {
            backgroundImage: {
                'bottleskyline-light': "url('/images/bottleskyline-light.svg')",
                'bottleskyline-dark': "url('/images/bottleskyline-dark.svg')"
              },
             backgroundPosition: {
        'bottom-custom': 'right 10% bottom -10px',
      },
      backgroundSize: {
        'auto-11': 'auto 11%',
      },
            colors: {
                'dark': {
                    50: '#00ffd3',
                    100: '#00c9a7',
                    200: '#009C82',
                    300: '#008a6f',
                    400: '#00636c',
                    500: '#034648',
                    600: '#043a3b',
                    700: '#042A2B',
                    800: '#38383C',
                    900: '#28282C',
                    p_foreground: '#009C82',
                    s_foreground: '#042A2B',
                    text: '#F4F7F5',
                    p_bg: '#38383C',
                    s_bg: '#28282C',
                    input_bg: '#374151',
                },
                'light': {
                    50: '#00ffd3',
                    100: '#00c9a7',
                    200: '#009C82',
                    300: '#008a6f',
                    400: '#00636c',
                    500: '#034648',
                    600: '#043a3b',
                    700: '#042A2B',
                    800: '#38383C',
                    900: '#28282C',
                    p_foreground: '#A4C3B2',
                    s_foreground: '#042A2B',
                    text: '#28282C',
                    p_bg: '#F4F3EE',
                    s_bg: '#D9D9D9',
                    input_bg: '#F4F3EE',
                },
            }
        }
    }
};