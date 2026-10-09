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
    sitemap(),
    {
      // Regenerate the agent-query KB export before every local build
      // (kb-to-agents.mjs keeps committed output when the vault is absent,
      // so Cloudflare Pages CI falls back to the committed files).
      name: 'kb-to-agents',
      hooks: {
        'astro:build:start': async () => {
          const { execFileSync } = await import('node:child_process');
          try {
            execFileSync('node', ['scripts/kb-to-agents.mjs'], {
              stdio: 'inherit',
              cwd: new URL('.', import.meta.url).pathname,
            });
          } catch (err) {
            console.warn('[kb-to-agents] regeneration failed; building with committed output.', err);
          }
        },
      },
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
