/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        Primary: ['Jost', 'sans-serif'],
        Secondary: ['Open Sans', 'sans-serif'],
        Logo: ['Playwrite CU', 'cursive']
      },
    },
  },
  plugins: [],
}