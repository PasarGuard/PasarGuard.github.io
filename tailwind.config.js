import animate from 'tailwindcss-animate';
import logical from 'tailwindcss-logical';

export default {
  darkMode: 'class',
  safelist: ['dark'],
  prefix: '',
  content: [
    './content/**/*',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Geist'],
        mono: ['Geist Mono'],
        vazir: ['Vazir', 'Tahoma', 'Arial', 'sans-serif'],
        persian: ['Vazir', 'Tahoma', 'Arial', 'sans-serif'],
      },
      colors: {
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
        xl: 'calc(var(--radius) + 4px)',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'collapsible-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-collapsible-content-height)' },
        },
        'collapsible-up': {
          from: { height: 'var(--radix-collapsible-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'collapsible-down': 'collapsible-down 0.2s ease-in-out',
        'collapsible-up': 'collapsible-up 0.2s ease-in-out',
      },
      // Custom RTL utilities
      spacing: {
        'rtl-0': '0',
        'rtl-1': '0.25rem',
        'rtl-2': '0.5rem',
        'rtl-3': '0.75rem',
        'rtl-4': '1rem',
      },
    },
  },

  plugins: [
    animate,
    logical,
    function({ addUtilities }) {
      const rtlUtilities = {
        '.rtl-text-right': {
          'text-align': 'right',
          'direction': 'rtl',
        },
        '.rtl-text-left': {
          'text-align': 'left',
          'direction': 'ltr',
        },
        '.rtl-mr-auto': {
          '[dir="rtl"] &': {
            'margin-left': 'auto',
            'margin-right': '0',
          },
        },
        '.rtl-ml-auto': {
          '[dir="rtl"] &': {
            'margin-right': 'auto',
            'margin-left': '0',
          },
        },
        '.rtl-float-right': {
          '[dir="rtl"] &': {
            'float': 'left',
          },
          '[dir="ltr"] &': {
            'float': 'right',
          },
        },
        '.rtl-float-left': {
          '[dir="rtl"] &': {
            'float': 'right',
          },
          '[dir="ltr"] &': {
            'float': 'left',
          },
        },
      };
      addUtilities(rtlUtilities);
    }
  ],
};
