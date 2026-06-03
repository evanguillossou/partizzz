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
		container: {
			center: true,
			padding: {
				DEFAULT: '1rem',
				sm: '1.5rem',
				lg: '2rem',
			},
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				// Core brand colors
				'party-pink': '#FF4EB8',
				'party-black': '#000000',
				'party-white': '#FFFFFF',
				
				// Extended pink palette
				pink: {
					50: '#FFF0F9',
					100: '#FFE1F3',
					200: '#FFC7E8',
					300: '#FF9DD5',
					400: '#FF4EB8',
					500: '#FF4EB8',
					600: '#E63DA0',
					700: '#CC2C88',
					800: '#B31B70',
					900: '#990A58',
				},

				// Design system colors
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
			},
			
			fontFamily: {
				display: ['Inter', 'system-ui', 'sans-serif'],
				body: ['Inter', 'system-ui', 'sans-serif'],
				sans: ['Inter', 'system-ui', 'sans-serif'],
				montserrat: ['Montserrat', 'sans-serif'],
			},

			fontSize: {
				'display-xl': ['3rem', { lineHeight: '1', letterSpacing: '-0.02em' }], // 48px
				'display-lg': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }], // 40px
				'display-md': ['2rem', { lineHeight: '1.1', letterSpacing: '-0.01em' }], // 32px
				'display-sm': ['1.75rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }], // 28px
				'heading-xl': ['1.25rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }], // 20px
				'heading-lg': ['1.125rem', { lineHeight: '1.3' }], // 18px
				'heading-md': ['1rem', { lineHeight: '1.4' }], // 16px
				'body-lg': ['1.125rem', { lineHeight: '1.6' }], // 18px
				'body-md': ['1rem', { lineHeight: '1.6' }], // 16px
				'body-sm': ['0.875rem', { lineHeight: '1.6' }], // 14px
				'caption': ['0.75rem', { lineHeight: '1.4' }], // 12px
			},

			spacing: {
				'1': '0.25rem', // 4px
				'2': '0.5rem',  // 8px
				'3': '0.75rem', // 12px
				'4': '1rem',    // 16px
				'5': '1.25rem', // 20px
				'6': '1.5rem',  // 24px
				'8': '2rem',    // 32px
				'10': '2.5rem', // 40px
				'12': '3rem',   // 48px
				'16': '4rem',   // 64px
				'20': '5rem',   // 80px
				'24': '6rem',   // 96px
				'28': '7rem',   // 112px
				'32': '8rem',   // 128px
			},

			borderRadius: {
				'lg': 'var(--radius)',
				'md': 'calc(var(--radius) - 2px)',
				'sm': 'calc(var(--radius) - 4px)',
				'xl': '1rem',
				'2xl': '1.5rem',
				'3xl': '2rem',
			},

			boxShadow: {
				'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
				'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
				'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
				'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
				'2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
				'pink': '0 0 20px rgb(255 78 184 / 0.3)',
				'pink-lg': '0 0 40px rgb(255 78 184 / 0.4)',
				'glow': '0 0 20px rgb(255 78 184 / 0.3)',
				'glow-lg': '0 0 40px rgb(255 78 184 / 0.4)',
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
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'bounce-slow': {
					'0%, 100%': {
						transform: 'translateY(-25%)',
						animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
					},
					'50%': {
						transform: 'translateY(0)',
						animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
					}
				},
				'pulse-slow': {
					'0%, 100%': {
						opacity: '1'
					},
					'50%': {
						opacity: '0.7'
					}
				}
			},

			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-up': 'slide-up 0.3s ease-out',
				'bounce-slow': 'bounce-slow 3s infinite',
				'pulse-slow': 'pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
			},

			// Mobile-first breakpoints
			screens: {
				'xs': '475px',
				'sm': '640px',
				'md': '768px',
				'lg': '1024px',
				'xl': '1280px',
				'2xl': '1536px',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
