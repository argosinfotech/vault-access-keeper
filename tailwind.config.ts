
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    fontFamily: {
      // Amplitude uses Inter as primary
      sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
    },
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#7E69AB',                   // amplitude purple
          foreground: '#fff'
        },
        secondary: {
          DEFAULT: '#E5DEFF',                   // soft secondary purple
          foreground: '#43325D'
        },
        destructive: {
          DEFAULT: '#FF467E',
          foreground: '#fff'
        },
        muted: {
          DEFAULT: '#F5F4FB',                   // Amplitude muted bg
          foreground: '#6E59A5'
        },
        accent: {
          DEFAULT: '#9B87F5',                   // vivid accent purple
          foreground: '#fff'
        },
        popover: {
          DEFAULT: '#FFF',
          foreground: '#43325D'
        },
        card: {
          DEFAULT: '#FFF',
          foreground: '#43325D'
        },
        sidebar: {
          DEFAULT: '#F5F4FB',                   // sidebar bg - subtle purple/gray
          foreground: '#43325D',
          primary: '#7E69AB',
          'primary-foreground': '#fff',
          accent: '#9B87F5',
          'accent-foreground': '#fff',
          border: '#E5DEFF',
          ring: '#9B87F5'
        }
      },
      borderRadius: {
        lg: '20px', // Amplitude uses very rounded corners
        md: '12px',
        sm: '8px'
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
