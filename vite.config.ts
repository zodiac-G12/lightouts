// / <reference types="vitest" />
import {defineConfig} from 'vite';
import solidPlugin from 'vite-plugin-solid';
// import devtools from 'solid-devtools/vite';

export default defineConfig({
  plugins: [
    /*
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
    // devtools(),
    solidPlugin(),
  ],
  base: process.env.GITHUB_PAGES ? '/lightouts/' : './',
  build: {
    target: 'esnext',
    outDir: 'docs',
  },
  test: {
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
  resolve: {
    alias: {
      '@/': `${__dirname}/src/`,
    },
  },
});
