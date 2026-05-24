import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    target: 'es2021',
    lib: {
      entry: resolve(__dirname, 'src/lindenweg-dashboard.ts'),
      formats: ['es'],
      fileName: () => 'lindenweg-dashboard.js',
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'terser',
    sourcemap: true,
    copyPublicDir: false,
  },
});

