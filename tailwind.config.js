/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        text: '#000000',
        background: '#EEE0CB',
        surface: '#BAA898',
        primary: '#839788',
        accent: '#BFD7EA',
        'on-primary': '#EEE0CB',
        'on-accent': '#000000',
      },
    },
  },
  plugins: [],
}
