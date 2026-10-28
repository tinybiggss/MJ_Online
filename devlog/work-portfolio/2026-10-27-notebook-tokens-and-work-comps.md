# Work portfolio design run (card t_8791595e), 2026-10-27

Norm's design run for mikejones.online/work. Full package lives in
`content-drafts/design/` (audit, brand-theme spec, comps, flow + workflow
doc); comps in `content-drafts/design/comps/` with a README.

## What changed in shipped code (the only code edits)

- New: `site/src/styles/tokens.css` — the brand token layer, "Notebook"
  system: two themes (`data-theme="dark"` desk default, `data-theme="light"`
  paper for document pages, `data-theme="auto"` via prefers-color-scheme),
  type scale, spacing, radius, elevation, motion, focus tokens. All
  contrast pairs verified numerically (>= 4.5:1 for text, >= 5.7:1 for
  on-accent text).
- Changed: `site/src/styles/global.css` — `@theme inline` maps every
  existing Tailwind utility name onto the token layer (bg-field-bg,
  text-signal, font-display, ...); adds `font-doc` / `font-data` utilities;
  global visible `:focus-visible` outline in the accent; selection themed.
  Kept: fade-up keyframes, reveal class, mobile nav rules, reduced-motion
  coverage, portrait/tint treatment (accent now reads from the token).
- Changed: `site/src/layouts/Base.astro` — removed the dead Google Fonts
  loader and the unused `fonts` prop (no page passed it; zero-Google
  constraint now actually holds). Open Graph / Twitter meta untouched.
- Changed: `site/src/layouts/FieldLayout.astro` — removed the fontshare CDN
  stylesheet; identity fonts now self-hosted.
- New: `site/public/fonts/` — 9 OFL-licensed woff2 files (Archivo 500/600/
  700/800, Source Serif 4 400/400i/600, Fragment Mono 400/400i), 184KB
  total, `font-display: swap`, lazy-loaded by use.

## Verified

- `npm run build`: 14 pages, all existing routes intact, no visual dark-mode
  regression on home/work (captured and compared).
- Fonts serve 200 from `/fonts/...`, Archivo loads in 4 weights; doc serif
  and mono stay lazy until a document page uses them.
- Comps render both themes + mobile with real repo screenshots, frozen case
  copy verified verbatim (22 units, zero edits), zero em dashes in new copy,
  keyboard focus verified via trusted input, reduced motion verified at
  1e-06s.
- Impeccable detector run once: 29 warnings are ruled-inset false positives
  (computed insets 12 to 48px, verified in browser), 1 advisory counts the
  12 pre-existing content.ts em dashes reproduced verbatim in the comps.

## Not shipped on purpose

- `work.astro` rewire + `/work/<slug>` routes + content collections publish
  script: the implementation step after Mike signs the direction (5 batched
  questions in the design docs). The surface brief at
  `.impeccable/surfaces/site-src-pages-work-astro.md` carries the direction
  contract (seed 914ad2d2).