// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Static portfolio site for MikeJones.online — deploys to Cloudflare Pages.
export default defineConfig({
  site: 'https://mikejones.online',
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes("/july4"),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
