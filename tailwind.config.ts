import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: ['class'],
  theme: {
    extend: {}
  },
  variants: {
    extend: {}
  },
  plugins: []
}

export default config
