/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fdfcfb',
          100: '#fbfaf7',
          200: '#f6f4ee',
          300: '#eee9dd',
          400: '#ded6c3',
        },
        beige: {
          50: '#fbf9f5',
          100: '#f7f3ec',
          200: '#eee6d8',
          300: '#dfd2bc',
          400: '#c8b495',
        },
        charcoal: {
          900: '#1c1917',
          800: '#292524',
          700: '#44403c',
          600: '#57534e',
          500: '#78716c',
          400: '#a8a29e',
          300: '#d6d3d1',
          200: '#e7e5e4',
          100: '#f5f5f4',
        },
        automotive: {
          orange: '#ea580c',
          orangeLight: '#f97316',
          orangeSoft: '#fff7ed',
          orangeBorder: '#fed7aa',
          amber: '#d97706',
          amberSoft: '#fef3c7',
          amberBorder: '#fde68a',
          green: '#16a34a',
          greenSoft: '#f0fdf4',
          greenBorder: '#bbf7d0',
          blue: '#0284c7',
          blueSoft: '#f0f9ff',
          blueBorder: '#bae6fd',
          red: '#dc2626',
          redSoft: '#fef2f2',
          redBorder: '#fecaca',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'warm-sm': '0 1px 2px 0 rgba(41, 37, 36, 0.04)',
        'warm-md': '0 4px 12px -2px rgba(41, 37, 36, 0.06), 0 2px 4px -2px rgba(41, 37, 36, 0.04)',
        'warm-lg': '0 10px 25px -3px rgba(41, 37, 36, 0.08), 0 4px 8px -3px rgba(41, 37, 36, 0.04)',
        'warm-xl': '0 20px 30px -4px rgba(41, 37, 36, 0.1), 0 8px 12px -4px rgba(41, 37, 36, 0.05)',
      }
    },
  },
  plugins: [],
}
