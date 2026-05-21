/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        accent:  '#4F46E5',
        bg:      '#F7F8FA',
        border:  '#E4E7EC',
        text:    '#101828',
        muted:   '#667085',
        danger:  '#D92D20',
        warning: '#B54708',
        success: '#027A48',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
        mono:    ['DM Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
