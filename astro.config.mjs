import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // We want fully-static HTML output. No SSR runtime needed for this site.
  output: 'static',
  // Single-page site — keep root index only.
  trailingSlash: 'never',
  // Friendly dev server defaults.
  server: {
    host: true,
    port: 4321,
  },
});
