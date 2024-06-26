import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {crx, ManifestV3Export} from '@crxjs/vite-plugin'
import manifest from './manifest.json'
import {nodePolyfills} from 'vite-plugin-node-polyfills';
import path from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        options: 'src/options/index.html',
      },
    },
  },
  plugins: [
    react(),
    nodePolyfills({
      include: ['buffer'],
    }),
    crx({ manifest: manifest as ManifestV3Export }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})