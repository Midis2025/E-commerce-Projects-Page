import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { concepts } from './src/config.js';

const root = fileURLToPath(new URL('.', import.meta.url));

/*
 * Multi-page build: the review homepage plus one static page per concept
 * (concepts/<id>/index.html → /concepts/<id>/). Plain files, so any static
 * host serves them without rewrite rules.
 */
const input = {
  main: resolve(root, 'index.html'),
  ...Object.fromEntries(concepts.map((c) => [`concept-${c.id}`, resolve(root, `concepts/${c.id}/index.html`)])),
};

/* /concepts/<id> → /concepts/<id>/ in dev and preview, like static hosts do. */
function conceptTrailingSlash() {
  const redirect = (req, res, next) => {
    const [pathname, query] = req.url.split('?');
    if (/^\/concepts\/[\w-]+$/.test(pathname)) {
      res.statusCode = 301;
      res.setHeader('Location', `${pathname}/${query ? `?${query}` : ''}`);
      res.end();
      return;
    }
    next();
  };
  // Block bodies on purpose: a function returned from these hooks is run as a post-hook.
  return {
    name: 'concept-trailing-slash',
    configureServer(server) {
      server.middlewares.use(redirect);
    },
    configurePreviewServer(server) {
      server.middlewares.use(redirect);
    },
  };
}

export default defineConfig({
  plugins: [conceptTrailingSlash()],
  build: { rollupOptions: { input } },
});
