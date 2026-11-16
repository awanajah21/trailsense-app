/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        /* Menggunakan Inter sebagai font utama, fallback ke system-ui[cite: 1] */
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        /* Palet Warna Primary (Green)[cite: 1] */
        primary: {
          50: '#F0FDF4',   /*[cite: 1] */
          100: '#DCFCE7',  /*[cite: 1] */
          200: '#BBF7D0',  /*[cite: 1] */
          400: '#22C55E',  /*[cite: 1] */
          500: 'var(--color-primary)', /* #16A34A[cite: 1] */
          600: 'var(--color-primary-hover)', /* #15803D[cite: 1] */
          700: '#166534',  /*[cite: 1] */
          900: '#052E16',  /*[cite: 1] */
        },
        /* Palet Warna Netral (Grays)[cite: 1] */
        gray: {
          100: '#F3F4F6', /*[cite: 1] */
          200: 'var(--color-border)', /* #E5E7EB[cite: 1] */
          400: '#9CA3AF', /*[cite: 1] */
          500: 'var(--color-text-secondary)', /* #6B7280[cite: 1] */
          700: '#374151', /*[cite: 1] */
          900: 'var(--color-text)', /* #111827[cite: 1] */
        },
        /* Warna Semantik[cite: 1] */
        background: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)',
        info: 'var(--color-info)',
        secondary: '#0EA5E9', /*[cite: 1] */
        accent: '#F97316',    /*[cite: 1] */
      },
      borderRadius: {
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)', /* Ini akan digunakan untuk Card UI (16px)[cite: 1] */
        'xl': 'var(--radius-xl)',
        'card': 'var(--radius-lg)', 
      },
      boxShadow: {
        /* Subtle shadow untuk komponen Card[cite: 1] */
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
}