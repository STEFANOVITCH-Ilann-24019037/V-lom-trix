/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        lime:    '#CBFF00',
        surface: '#0e0e14',
        card:    '#13131a',
        border:  '#1f1f2e',
        danger:  '#ff3535',
        warning: '#ff9500',
        success: '#00e676',
      },
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        body:    ['Outfit', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

