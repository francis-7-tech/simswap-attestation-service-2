/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        canvas: '#000000',
        surface: { 1: '#0A0A0A', 2: '#141414' },
        border: { subtle: '#1F1F1F', strong: '#2A2A2A' },
        text: { primary: '#FAFAFA', secondary: '#A3A3A3', tertiary: '#525252' },
        accent: {
          DEFAULT: '#00F5D4',
          dim: 'rgba(0, 245, 212, 0.08)',
          border: 'rgba(0, 245, 212, 0.25)',
        },
        status: {
          safe: '#22C55E',
          warning: '#F59E0B',
          critical: '#FF4D4D',
        },
      },
      fontFamily: {
        sans: ['Inter_400Regular'],
        medium: ['Inter_500Medium'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.02em',
        micro: '0.12em',
      },
    },
  },
  plugins: [],
};
