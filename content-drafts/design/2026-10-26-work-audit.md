# Work page audit: what actively blocks the portfolio read

Date: 2026-10-27 (card t_8791595e, deliverable named 2026-10-26).
Scope: mikejones.online/work and its support files, read both live and in the repo,
against one standard: could a design hiring manager (Anthropic 5446776008)
tell in 30 seconds that this is a designer's portfolio, and in 60 seconds what
Mike diagnosed and shipped.

Method: live captures (desktop 1440 and mobile 390 of /work and the homepage,
2026-10-27), full read of every file the page depends on. Nothing below is a
generic heuristic: each finding names the rule, the token, or the line.

## The verdict in one paragraph

/work is a ventures directory that a designer's portfolio was asked to live
in. Its first content block is client acquisition, its loudest visuals are
raw white rectangles from other people's default chart color, and the three
finished case studies are not wired to the site at all. The theme underneath
is a single-state inline token set that cannot produce a second theme, and
the typography loads its two faces from two different third-party CDNs, one
of which is Google. None of this is a polish deficit. It is structural, which
is why this card calls for a replacement world rather than a pass.

## Findings

### F1. Information architecture fails the thirty-second read

- `site/src/pages/work.astro:9-14`: the H1 is "The work." and the very next
  sentence is "Four ventures you can engage". The page announces an audience
  of buyers, not readers of work.
- `site/src/pages/work.astro:18-33`: the first content block is the ventures
  grid. Every card's action is "Visit ->" to an external site
  (work.astro:29). A hiring manager meets four exits before meeting one piece
  of work.
- `site/src/pages/work.astro:64-69`: the page's only close is "Want something
  like this inside your org?" This is consulting copy. On a portfolio whose
  first job is hiring-manager proof, the final screen is addressed to
  consulting clients.
- `site/src/pages/index.astro:21`: the homepage's primary promise, "See the
  work", lands on an inventory. The promise and the product are one
  substitution apart.
- There are exactly zero case-study routes in the site: the page list is
  `404, about, contact, 2 GHN routes, 4 week routes, index, resume, thanks,
  work, writing`, and none of them is a case study. The three publish files
  exist on disk and are unreachable from the site.

### F2. The imagery actively argues against design practice

- `site/src/pages/work.astro:43-45`: entries with `diagram` or `contain` wrap
  their images in `bg-white`; the AI Memory System and OfflineAI cards render
  as raw white rectangles dropped on `#0a0a0b`. In the live capture these are
  the two loudest objects on the page, and they are wireframe exports, not
  design artifacts.
- `object-cover` on the same line crops content out of the frame for image
  entries; the `contain` exception handles two entries and contradicts the
  others. One rule, three behaviors.
- `site/src/lib/content.ts:108` gives Corvus, a systems project, a raven
  object photo. It is decorative. A hiring manager reads an unexplained image
  where an artifact belongs.
- Live capture evidence: comp-work-desk captures and the original
  work-desktop-1440 capture (design scratch: work-desktop-1440.png).

### F3. The theme is a one-state inline system that cannot be a brand

- `site/src/styles/global.css:11-32`: the entire token layer is Tailwind
  `@theme`, written inline in the stylesheet. There is no theme file, no
  second state, no way to serve a light surface to any route.
- `global.css:13` + `:22`: true near-black `#0a0a0b` with one saturated
  amber `#f59433` is the exact pairing PRODUCT.md's anti-references warn
  about ("generic AI/SaaS template ... the 2026 AI-generated look"), and it
  is also what the current craft literature calls the calibration trap. The
  site does not read as someone who chose it; it reads as 2026's default.
- `global.css:19`: `--color-field-faint #8a8780` at ~5.5:1 is used for
  metadata at `text-xs` and smaller (work.astro:25, 49). Passing AA at the
  floor, on the smallest text on the page, next to amber role labels doing
  accent work in the same row (work.astro:24).
- Corner vocabulary is untethered: `rounded-xl` (work.astro:22),
  `rounded-2xl` (work.astro:65), `rounded-md` (FieldLayout.astro:51). Three
  radii, no token, and no rule about which surface earns which.
- Spacing rhythm is untethered the same way: `pt-16 pb-12` (work.astro:8),
  `py-10` (work.astro:37), `py-20` (work.astro:64) carry no relationship to
  a scale.

### F4. Typography has no in-repo truth

- `site/src/layouts/FieldLayout.astro:17-21`: the identity faces (Cabinet
  Grotesk, Satoshi) load from `api.fontshare.com`, a render-blocking
  cross-origin stylesheet fetched on every page load, with no font files in
  the repository. A third-party CDN outage or a policy change silently
  degrades the site's entire personality.
- `site/src/layouts/Base.astro:31-37` and `:49-53`: a second channel, a
  Google Fonts loader for Inter, JetBrains Mono, and Fraunces. It is dead
  code: no page passes the `fonts` prop, so it never fires. It contradicts
  the standing no-Google constraint in shipped code, which is worse than
  having it active: it is a violation waiting to be switched on.
- Two faces carry the personality with no mono for a data-heavy site that
  prints resumes, citations, and figures (content.ts:197-204). Numerals in
  data contexts inherit a proportional UI face.

### F5. The narrative the case files carry is missing entirely

- The three publish-length case studies
  (`content-drafts/case-studies/publish/` are complete and verified on disk
  and absent from the rendered site. The diagnosis that earned the "170 users
  across 20 communities" figure is unpublishable; the number alone lives on
  as a blurb (`content.ts:173`). A portfolio that reads as diagnosis is the
  entire reason these files were written.
- The grid's NeighborhoodShare entry is a four-sentence summary of a 799-word
  argument. It cannot do the argument's job.

## What works, and is preserved in the redesign

- The accessibility scaffolding: skip link (FieldLayout.astro:23-27),
  keyboard-complete mobile nav with Escape handling and focus return
  (FieldLayout.astro:108-132), `prefers-reduced-motion` coverage at both
  global and component scope (global.css:50-57, 88-90, 131-136).
- The no-placeholder discipline: cards render text-forward instead of fake
  imagery (content.ts:81-84 policy comment).
- The Tailwind v4 setup itself: the `@theme` map-to-utilities path is the
  right mechanism and the redesign keeps every existing utility name
  (see the brand spec).
- The copy voice: verified, citation-bearing, plain (content.ts:1-6 heading
  comment and the RAG pipeline).

## Already landed by this run (so the repo matches the audit's remedy)

- `site/src/styles/tokens.css` exists (the token layer, both themes).
- `global.css` maps the existing utility names onto those tokens; nothing
  else changed in class usage.
- Fonts are self-hosted in `site/public/fonts` (9 woff2 files, OFL
  licensed); the fontshare stylesheet and the Google Fonts loader are
  removed; `npm run build` passes on all 14 routes.
- Nothing about route behavior changed; the theme's dark state is the site
  default exactly as it was.

This audit records the as-found state; the line numbers match the repo as of
2026-10-27 09:08.

## Needs from Mike

None in this document. The five batched questions live at the end of the
brand spec (3) and the flow and workflow doc (2).