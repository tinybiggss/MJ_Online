# Deploying MikeJones.online (Astro → Cloudflare Pages)

The site lives in `/site` and builds to static HTML in `/site/dist`. Replaces the Ghost Pro hosting.

## Build settings

| Setting | Value |
|---|---|
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `site` |
| Node version | 20+ (uses Node 25 locally; set `NODE_VERSION=20` env var if needed) |

## Option A — Git-connected (recommended)

1. Push the repo to GitHub (if not already).
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
3. Pick the repo, set **Root directory = `site`**, build command `npm run build`, output `dist`.
4. Deploy. Every push to `main` rebuilds automatically (this is when the Substack RSS is re-fetched).

## Option B — Direct upload (quick test)

```bash
cd site
npm run build
npx wrangler pages deploy dist --project-name=mikejones-online
```
(Requires `wrangler login` first.)

## Custom domain + DNS cutover

1. In the Pages project → **Custom domains → Set up a domain** → `mikejones.online` (and `www`).
2. Update DNS at the registrar (GoDaddy):
   - Easiest: move nameservers to Cloudflare, then Pages wires the records automatically.
   - Or add the CNAME records Cloudflare shows for the apex + `www`.
3. Wait for SSL to provision; verify `https://mikejones.online` serves the new site.
4. **Only then** cancel the Ghost Pro subscription (so there's no downtime).

## Contact form (Cloudflare Pages Function + Resend)

The form posts to a first-party function at `functions/api/contact.ts` → route `POST /api/contact`. It emails submissions via [Resend](https://resend.com). No adapter needed — Cloudflare Pages picks up the `functions/` directory automatically.

**Setup:**
1. Create a Resend account and **verify the `mikejones.online` domain** (add the DNS records Resend gives you).
2. Create a Resend API key.
3. In Cloudflare Pages → **Settings → Environment variables**, add:
   - `RESEND_API_KEY` = your key
   - `CONTACT_TO` = `mike@mikejones.online`
   - `CONTACT_FROM` = `MikeJones.online <noreply@mikejones.online>` (must be on the verified domain)
4. Redeploy.

The form is progressively enhanced: with JS it submits via `fetch` and shows inline validation + a success state; without JS it does a normal POST and the function redirects to `/thanks`. Honeypot field included for spam. Until `RESEND_API_KEY` is set, the function returns a friendly "email me directly" error.

## Notes

- `public/_headers` sets security headers + caching (Pages reads this automatically).
- `public/robots.txt` + generated `sitemap-index.xml` are included for SEO.
- **Chatbot:** `src/components/ChatbotSlot.astro` currently loads the existing custom widget as a placeholder. To switch to the Distills career-bot, replace the two `<script>` tags there with the Distills embed snippet — nothing else changes.
- The Substack RSS feed is fetched **at build time**. New essays appear on the next deploy/rebuild. To auto-refresh, add a Cloudflare Pages **Deploy Hook** on a cron (e.g. daily) later.

## July 4th Slide Fund (`/july4`)

Unlisted donation page backed by Cloudflare KV. One-time setup in the Cloudflare dashboard:

1. **Workers & Pages → KV → Create namespace** → name it `slide-fund`.
2. In the **Pages project → Settings → Functions → KV namespace bindings**, add a
   binding: variable name `SLIDE_KV` → the `slide-fund` namespace (for Production and Preview).
3. In **Settings → Environment variables**, add `SLIDE_ADMIN_KEY` = a long random secret.
4. Redeploy.

- Public page: `https://mikejones.online/july4`
- Admin: `https://mikejones.online/july4/admin?key=YOUR_SLIDE_ADMIN_KEY`
- Venmo target: `https://venmo.com/u/tinybiggs` (money moves here; the total is self-reported)
- Printable QR: `site/public/july4-qr-print.html` (regenerate with `npm run qr`)

Local testing mirrors production bindings:
```bash
npm run build
npx wrangler pages dev dist --kv SLIDE_KV --binding SLIDE_ADMIN_KEY=testkey
```
