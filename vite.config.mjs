/// <reference types="vitest" />
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import EnvironmentPlugin from 'vite-plugin-environment';

const vendors = ['react', 'react-dom', 'react-router-dom', 'classnames', 'tailwind-merge'];

export default defineConfig({
    plugins: [react(), EnvironmentPlugin('all'), tailwindcss()],
    server: {
        port: 8080,
        open: true,
        host: 'localhost',
        hmr: {
            port: 8080,
            host: 'localhost'
        }
    },
    optimizeDeps: {
        esbuildOptions: {
            target: 'esnext',
        },
        exclude: [],
    },
    resolve: {
        alias: {
            '@': '/src',
        },
    },
    define: {
        global: 'window',
    },
    build: {
        target: 'esnext',
        emptyOutDir: true,
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    if (id.includes('node_modules')) {
                        const isVendor = vendors.some((vendor) => id.includes(vendor));
                        if (isVendor) {
                            return 'vendor';
                        }
                    }
                },
            },
        },
    },
    esbuild: {
        legalComments: 'none',
    },
    test: {
        globals: true,
        environment: 'jsdom',
        // setupFiles: './src/setupTests.js',
        coverage: {
            provider: 'istanbul',
            reportsDirectory: './reports/coverage',
            thresholds: {
                global: {
                    statements: 80,
                    branches: 80,
                    functions: 80,
                    lines: 80,
                },
            },
            reporter: ['text', ['json', { file: 'coverage-summary.json' }], ['html', { subdir: 'lcov-report' }]],
            include: ['src/utils/**/*.{ts,tsx}'],
            exclude: ['**/setupTests.js', '**/vite.config.mjs', 'src/index.tsx'],
        },
    },
});
