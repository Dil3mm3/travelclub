import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#E8F4F0',
          100: '#C4E3D8',
          200: '#8FCBBA',
          400: '#3DA882',
          600: '#1D7A5C',
          800: '#0D4F3A',
          900: '#062E22',
        },
      },
    },
  },
  plugins: [],
}

export default config