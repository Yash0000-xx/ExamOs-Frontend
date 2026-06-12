/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Map your CSS variables to Tailwind theme keys
        workspace: 'var(--bg-workspace)',
        card: 'var(--bg-card)',
        input: 'var(--bg-input)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'border-primary': 'var(--border-primary)',
      },
    },
  },
  plugins: [],
}