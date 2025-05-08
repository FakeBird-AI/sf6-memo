/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {},
    screens: {
      // スマホ: デフォルト (0px～)
      // PC: 1024px以上
      'pc': '1024px',
    }
  },
  plugins: [],
};
