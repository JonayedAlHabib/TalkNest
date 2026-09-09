export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          50: '#EEDEEA',
          100: '#E2CAD8',
          200: '#C18DB4',
          400: '#87A7D0',
          600: '#0E1B48',
          700: '#0E1F2F',
        },
        'accent-ink': '#FBF7FA',
        ink: '#0E1F2F',
        'ink-dim': '#27425D',
        'ink-faint': '#8CA0B0',
        paper: '#F3E8EE',
        'paper-raised': '#FEFAFC',
        'paper-inset': '#E2CAD8',
        line: 'rgba(14,31,47,0.13)',
        'line-strong': 'rgba(14,31,47,0.24)',
        online: '#87A7D0',
      },
      fontFamily: {
        sans: ['Karla', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'Times New Roman', 'serif'],
      },
    },
  },
  plugins: [],
}
