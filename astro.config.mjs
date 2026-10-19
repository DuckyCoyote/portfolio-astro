import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // We want fully-static HTML output. No SSR runtime needed for this site.
  output: 'static',
  // Two languages: Spanish at "/", English at "/en/".
  // Components read the active one from Astro.currentLocale (see src/i18n).
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  // Friendly dev server defaults.
  server: {
    host: true,
    port: 4321,
  },
});
