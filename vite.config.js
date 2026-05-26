import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { readdirSync, readFileSync, mkdirSync, existsSync, copyFileSync, statSync } from 'node:fs';

const pageEntries = [
  'index',
  'technology',
  'technology-differences',
  'solutions',
  'solution-municipalities',
  'materials',
  'materials-liners',
  'material-dn100',
  'training',
  'contacts',
  'articles',
  'article-inversion-sanitation',
  'cases',
  'case-hamburg',
  'privacy-policy',
  '404',
  'in-development',
  'coming-soon',
].reduce((acc, name) => {
  acc[`src/pages/${name}`] = resolve(__dirname, `src/pages/${name}.html`);
  return acc;
}, {});

function copyDirectory(source, target) {
  if (!existsSync(source)) return;
  mkdirSync(target, { recursive: true });
  for (const entry of readdirSync(source, { withFileTypes: true })) {
    const from = resolve(source, entry.name);
    const to = resolve(target, entry.name);
    if (entry.isDirectory()) {
      copyDirectory(from, to);
      continue;
    }
    copyFileSync(from, to);
  }
}

function partialsPlugin() {
  return {
    name: 'spires-partials-copy',
    apply: 'build',
    generateBundle() {
      const partialsDir = resolve(__dirname, 'src/partials');
      const imagesDir = resolve(__dirname, 'src/images');
      const fontsDir = resolve(__dirname, 'src/fonts');

      if (existsSync(partialsDir)) {
        copyDirectory(partialsDir, resolve(__dirname, 'dist/src/partials'));
      }
      if (existsSync(imagesDir)) {
        copyDirectory(imagesDir, resolve(__dirname, 'dist/src/images'));
      }
      if (existsSync(fontsDir)) {
        copyDirectory(fontsDir, resolve(__dirname, 'dist/src/fonts'));
      }
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/' || req.url?.endsWith('.html')) {
          next();
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [partialsPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'main.html'),
        index: resolve(__dirname, 'index.html'),
        ...pageEntries,
      },
    },
  },
});
