
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
          DEFAULT: '#0EA5E9',                   // amplitude blue
          foreground: '#fff'
        },
        secondary: {
          DEFAULT: '#D3E4FD',                   // soft secondary blue
          foreground: '#0A4B76'
        },
        destructive: {
          DEFAULT: '#FF3333',                   // red for destructive actions
          foreground: '#fff'
        },
        muted: {
          DEFAULT: '#F0F7FF',                   // Amplitude muted bg
          foreground: '#0A4B76'
        },
        accent: {
          DEFAULT: '#33C3F0',                   // vivid accent blue
          foreground: '#fff'
        },
        popover: {
          DEFAULT: '#FFF',
          foreground: '#0A4B76'
        },
        card: {
          DEFAULT: '#FFF',
          foreground: '#0A4B76'
        },
        sidebar: {
          DEFAULT: '#F0F7FF',                   // sidebar bg - subtle blue/gray
          foreground: '#0A4B76',
          primary: '#0EA5E9',
          'primary-foreground': '#fff',
          accent: '#33C3F0',
          'accent-foreground': '#fff',
          border: '#D3E4FD',
          ring: '#33C3F0'
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
