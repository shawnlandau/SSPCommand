/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Neutral foundation colors
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E0E0E0',
          300: '#CCCCCC',
          400: '#999999',
          500: '#666666',
          600: '#4D4D4D',
          700: '#333333',
          800: '#262626',
          900: '#1A1A1A',
        },
        // Pastel accent color (muted blue)
        accent: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          300: '#9FB3C8',
          400: '#829AB1',
          500: '#627D98',
          600: '#486581',
          700: '#334E68',
          800: '#243B53',
          900: '#102A43',
        },
        // Background colors
        background: '#FAFAFA',
        'background-secondary': '#F5F5F5',
        // Card colors
        card: '#FFFFFF',
        'card-secondary': '#E0E0E0',
        // Text colors
        foreground: '#262626',
        'foreground-secondary': '#4D4D4D',
        'foreground-muted': '#666666',
        // Border colors
        border: '#E0E0E0',
        'border-secondary': '#CCCCCC',
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['32px', { lineHeight: '40px', fontWeight: '700' }],
        'section': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'body': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '16px', fontWeight: '400' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      boxShadow: {
        'soft': '0 2px 8px 0 rgba(0, 0, 0, 0.06)',
        'medium': '0 4px 16px 0 rgba(0, 0, 0, 0.08)',
        'large': '0 8px 32px 0 rgba(0, 0, 0, 0.12)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
    },
  },
  plugins: [],
}
