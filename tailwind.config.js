/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			heading: [
  				'Avapore',
  				'sans-serif'
  			],
  			heading2: [
  				'Avalont',
  				'sans-serif'
  			],
  			header: [
  				'Stargaze Stencil',
  				'sans-serif'
  			],
  			body1: [
  				'Astronomus-Regular',
  				'sans-serif'
  			],
  			body: [
  				'Octa Brain',
  				'sans-serif'
  			]
  		},
  		colors: {
  			dark_background: '#010510',
  			card_background: 'rgba(31, 41, 55, 0.6)',
  			text_primary: '#E0E7FF',
  			text_secondary: '#9CA3AF',
  			input_background: '#FFFFFF1A',
  			input_border: '#FFFFFF0F',
  			btn_gradient_start: '#0AC488',
  			btn_gradient_start_tab: '#33A0EA1A',
  			btn_gradient_end_tab: '#0AC4881A',
  			btn_gradient_end: '#33A0EA',
  			link_color: '#6366F1',
  			gray_line: '#4B5563',
  			metamask_orange: '#F16912',
  			trust_blue: '#0A7DFB',
  			coinbase_gray: '#333A4A',
  			help_link_green: '#0AC488',
  			dashboard_title_start: '#00C0FF',
  			dashboard_title_end: '#2D8CFF',
  			chart_bfm_stroke: '#00C0FF',
  			chart_bfm_fill_start: '#00C0FF',
  			chart_bfm_fill_end: '#00C0FF',
  			chart_eusd_stroke: '#FF5757',
  			chart_eusd_fill_start: '#FF5757',
  			chart_eusd_fill_end: '#FF5757',
  			bar_income: '#6366F1',
  			bar_withdrawal: '#A855F7',
  			line_bfm_stroke: '#00C0FF',
  			line_bfm_fill_start: '#00C0FF',
  			line_bfm_fill_end: '#00C0FF',
  			line_eusd_stroke: '#FF5757',
  			line_eusd_fill_start: '#FF5757',
  			line_eusd_fill_end: '#FF5757',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
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
}