import type { Config } from 'tailwindcss'

const config: Config & { safelist?: any[] } = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // Commonly used classes that might be purged in production
    'text-slate-900',
    'text-slate-700',
    'text-slate-600',
    'text-slate-500',
    'underline',
    'underline-offset-4',
    'bg-white',
    'text-white',
    'antialiased',
    'font-medium',
    'text-sm',
    'mt-4',
    'flex',
    'gap-3',
    // Dynamic color utilities
    { pattern: /(text|bg|border)-(slate|gray|neutral|red|orange|amber|yellow|green|teal|blue|indigo|violet|purple|pink)-(50|100|200|300|400|500|600|700|800|900)/ },
    // Grid utilities that might be dynamic
    { pattern: /(col|row)-span-(1|2|3|4|5|6|7|8|9|10|11|12)/ },
    // Common spacing that might be dynamic
    { pattern: /(m|p)(t|r|b|l|x|y)?-(0|1|2|3|4|5|6|8|10|12|16|20|24|32|40|48|56|64|72|80|96)/ },
  ],
  theme: {
    extend: {
      colors: {
        // LinkedIn brand colors
        brand: {
          DEFAULT: '#0A66C2',
          50: '#E6F1FB',
          100: '#D1E6F9',
          200: '#A3CDF3',
          300: '#74B4ED',
          400: '#469BE7',
          500: '#1882E1',
          600: '#0A66C2',
          700: '#08539B',
          800: '#064074',
          900: '#042D4D',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    function({ addUtilities }: { addUtilities: any }) {
      addUtilities({
        '.line-clamp-2': {
          display: '-webkit-box',
          '-webkit-line-clamp': '2',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
        },
      })
    }
  ],
  darkMode: "class",
}

export default config