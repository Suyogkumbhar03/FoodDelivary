/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'crave-bg': '#FAF7F2',
        'crave-card': '#FFFFFF',
        'crave-border': '#E8E1D7',
        'crave-borderDark': '#332B25',
        'crave-flame': '#E05326',
        'crave-flameDark': '#C23A22',
        'crave-flameLight': '#FDF2EE',
        'crave-wasabi': '#1B7A3D',
        'crave-wasabiBg': '#E8F5E9',
        'crave-espresso': '#211C18',
        'crave-sand': '#6E665E',
        'crave-muted': '#A0978C',
        'crave-creamLow': '#F4EEE6',
        crave: {
          bg: '#FAF7F2',
          card: '#FFFFFF',
          border: '#E8E1D7',
          borderDark: '#332B25',
          flame: '#E05326',
          flameDark: '#C23A22',
          flameLight: '#FDF2EE',
          wasabi: '#1B7A3D',
          wasabiBg: '#E8F5E9',
          espresso: '#211C18',
          sand: '#6E665E',
          muted: '#A0978C',
          creamLow: '#F4EEE6',
        }
      },
      fontFamily: {
        serif: ['"Fraunces"', '"Playfair Display"', 'serif'],
        headline: ['"Fraunces"', '"Playfair Display"', 'serif'],
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        'crave': '1rem',
        'crave-lg': '1.5rem',
        'crave-xl': '2rem',
      }
    },
  },
  plugins: [],
};
