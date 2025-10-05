import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	resolve: {
		alias: {
			'$lib': path.resolve('./src/lib')
		}
	},
	test: {
		browser: {
			enabled: true,
			name: 'chromium', // or 'firefox' or 'webkit'
			headless: true,
			provider: 'playwright'
		},
		include: ['src/**/*.{test,spec}.{js,ts}'],
		setupFiles: ['src/setupTests.ts'],
		globals: true,
		// Add this to ensure Svelte components are transformed correctly
		transformMode: {
			web: ['\.svelte$']
		}
	}
});
