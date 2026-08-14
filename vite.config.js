import { defineConfig } from 'vite';

// En GitHub Pages la app se sirve desde https://<usuario>.github.io/RAP/, así que
// la build (y su preview) necesitan base '/RAP/'. Solo el servidor de desarrollo
// se queda en la raíz. Se puede sobreescribir con BASE_PATH=/otra/ npm run build.
const BASE = process.env.BASE_PATH || '/RAP/';

export default defineConfig(({ command, isPreview }) => ({
  root: '.',
  publicDir: 'public',
  base: command === 'build' || isPreview ? BASE : '/',
  server: {
    port: 3000,
    open: true
  },
  preview: {
    port: 4173
  },
  build: {
    outDir: 'dist'
  }
}));
