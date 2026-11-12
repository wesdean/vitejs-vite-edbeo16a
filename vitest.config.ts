/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'istanbul', // Switch to istanbul for WebContainer compatibility
      reporter: ['text', 'json', 'html'],
      include: ['src/components/**/*.tsx', 'src/config/**/*.ts'],
      exclude: ['src/__tests__/**', 'src/main.tsx', 'src/App.tsx'],
    },
  },
});
