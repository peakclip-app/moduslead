import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        bg: '#F1F3F2',
        ink: '#161A1F',
        grid: '#9AA4AE',
        s1: '#4A6FA5',
        s2: '#3D8B83',
        s3: '#C98A3B',
        s4: '#8B5A7C',
        cta: '#3D8B83',
      },
    },
  },
  plugins: [],
}

export default config
