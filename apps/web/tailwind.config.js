/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette
        brand: {
          peach:    '#F9A37E',
          sage:     '#A8C69F',
          cream:    '#E8E2D6',
          brown:    '#4A453E',
          'peach-light': '#FBD5C1',
          'peach-dark':  '#E8855A',
          'sage-light':  '#C8DEC4',
          'sage-dark':   '#7AA870',
          'brown-light': '#7A736A',
          'brown-dark':  '#2E2B26',
        },
      },
      fontFamily: {
        heading: ['Quintessential', 'Georgia', 'serif'],
        body:    ['Elm Sans', 'system-ui', 'sans-serif'],
        sans:    ['Elm Sans', 'system-ui', 'sans-serif'],
        serif:   ['Quintessential', 'Georgia', 'serif'],
      },
      keyframes: {
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%':   { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-left': {
          '0%':   { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'swing': {
          '0%, 100%': { transform: 'rotate(-8deg)' },
          '50%':      { transform: 'rotate(8deg)' },
        },
      },
      animation: {
        'fade-in-up':       'fade-in-up 0.4s ease-out forwards',
        'slide-in-right':   'slide-in-right 0.5s ease-out forwards',
        'slide-in-left':    'slide-in-left 0.5s ease-out forwards',
        'swing':            'swing 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
