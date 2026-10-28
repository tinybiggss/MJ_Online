# Brand and theme spec: "Notebook"

Date: 2026-10-27 (card t_8791595e deliverable named 2026-10-26).
Landed as: `site/src/styles/tokens.css` (consumed via `site/src/styles/global.css`).
Both comp files render from a mirrored copy with identical values:
`content-drafts/design/comps/tokens.css`.

## Point of view

Mike's portfolio has to survive a hiring manager deciding whether the person
can diagnose and ship. The case-study copy is diagnosis-first and
receipt-backing: every number cites a file, a migration, or a decision ID.
The brand mechanism follows the content: design as a lab notebook, where
every claim shows its receipt. Structure comes from ruled lines, not boxes.
The single accent is record red, reserved for evidence marks and the one
primary control. Nothing on the page is decorative; the proof is the style.

What this refuses: the venture-directory order (audit F1), the near-black
plus saturated-amber calibration look (audit F3), and the two-CDN typography
truth (audit F4).

Roll provenance: direction seed key 914ad2d2, assigned candidate 4 of the
grounded list (the lab notebook). Five challenger disciplines were fused as
named raises: one measured reading path (the Versailles hand), a
front-promise / back-honesty row anatomy (the seed packet rack), receipts made
visible instead of hidden (the hand-drawn zine hand, realized as real
screenshot plates and inline mono citations rather than doodles), numbered
plate rigor for the systems index (the Breton plate book), and named theme
states, paper and desk, with an auto mode that needs no JavaScript (the
lighting desk). The nixie counter challenger declined: its palette duplicates
the incumbent and the calibration trap its raise would feed.

Alternates kept open for Mike (each fully buildable from the same tokens on a
palette swap):

1. "Field Report": the case studies as professional field reports: heavier
   data furniture, numbered findings, tables in the body. Close cousin; the
   notebook is warmer, the field report colder. My top-ranked candidate at
   derivation time; the roll assigned the notebook instead, which is the
   better human register for the same mechanism.
2. "Plate Book": the systems index as a parts catalog of numbered units with
   constructed keylines everywhere, case studies as assembled plates. Strong
   designerly identity; risks reading as an ornament exercise at portfolio
   length.

## The three decisions a reader would notice

1. **Document pages are paper.** /work and the case-study routes pin the
   light paper theme (a hiring manager reads in a day-lit room; a document is
   a document at night too). The rest of the site keeps the dark desk identity
   as its default, so the brand update reads at the boundary: you cross from
   instrument desk into working paper. `data-theme="light"` on the routes,
   zero JavaScript.
2. **Record red replaces signal amber, and it is semantic.** The accent
   appears exactly where claims link to receipts: inline citation pills, the
   mark under each case's position line and under "What I'd change", the
   "Read the case study" affordance, and the primary button. Amber is gone
   entirely. Anywhere else, red is a bug.
3. **Ruled structure replaces cards.** The page reads as a notebook page:
   hairline rules between entries, mono receipt labels on the left column,
   reading body in a serif at a 66-character measure, no nested boxes, no
   rounded panels. The three radii vocabularies (audit F3) collapse to
   `--radius-none` for surfaces, `--radius-sm` and `--radius-md` for
   controls.

## Tokens (as landed in `site/src/styles/tokens.css`)

### Color, theme "desk" (dark, site default)

| Token | Value | Role |
|---|---|---|
| `--bg` | `#121418` | lamp-lit graphite page ground |
| `--surface` | `#1a1d22` | raised sheet |
| `--surface-2` | `#22262c` | second step (receipt pills, plates) |
| `--hairline` | `#2c3036` | ruled lines |
| `--hairline-strong` | `#41464e` | section-strong rules |
| `--ink` | `#ebe8e1` | primary text, 15.07:1 |
| `--ink-2` | `#a29e96` | secondary text, 6.91:1 |
| `--ink-3` | `#8a867e` | metadata, 5.09:1 |
| `--accent` | `#e56c4a` | record red: receipts, evidence, primary control, 5.77:1 |
| `--accent-ink` | `#1a0d09` | text on filled accent, 5.95:1 |
| `--accent-press` | `#f2916f` | hover/pressed accent |
| `--danger` | `#c75c8c` | form validation, distinct hue from the accent |

### Color, theme "paper" (light, document pages)

| Token | Value | Role |
|---|---|---|
| `--bg` | `#faf9f6` | paper ground |
| `--surface` | `#ffffff` | sheet / plate |
| `--surface-2` | `#f3f1ea` | receipt pills, subtle panels |
| `--hairline` | `#e5e3db` | ruled lines |
| `--hairline-strong` | `#c9c6bb` | section-strong rules |
| `--ink` | `#1c1a15` | primary text, 16.51:1 |
| `--ink-2` | `#514e45` | secondary text, 7.90:1 |
| `--ink-3` | `#6b675c` | metadata, 5.36:1 |
| `--accent` | `#b23317` | record red, 5.90:1 on paper |
| `--accent-ink` | `#fff5ef` | text on filled accent, 5.79:1 |
| `--accent-press` | `#96270f` | hover/pressed accent |
| `--danger` | `#a61e4d` | form validation |

Selection color follows the active theme from the same tokens
(`--selection`). Contrast values verified by computed relative luminance,
not by eye.

### Typography

| Token | Value | Voice |
|---|---|---|
| `--face-ui` | Archivo 500/600/700/800 | UI + display (self-hosted) |
| `--face-doc` | Source Serif 4 400/400-italic/600 | long-form reading body |
| `--face-data` | Fragment Mono 400/400-italic | receipts, figures, metadata |

Scale: `--text-2xs` 11px through `--text-3xl` 40px, plus `--text-display`
`clamp(2.5rem, 6.5vw, 4.375rem)`. Reading body is `--text-lg` 19px at
`--leading-doc` 1.65 in a 66-character measure (`--measure-doc`).
`--leading-display` 1.02 for page titles; tracking held at
`--track-display -0.022em` (inside the -0.04em craft floor for a document
voice).

Provenance: all three families are SIL Open Font License, fetched once and
committed to `site/public/fonts/` as latin-subset woff2 (9 files, 184KB
total). Archivo 5.2.5, Source Serif 4 5.3.1, Fragment Mono 5.2.5. No font
CDN, no Google services; `font-display: swap`; serif faces load lazily on
document pages only.

### Space, radius, elevation, motion

- Space scale `--space-2xs` 4px to `--space-3xl` 128px (0.25 to 8rem).
- Radius: `--radius-none 0` (surfaces, the notebook page), `--radius-sm
  2px` (inputs, tags), `--radius-md 4px` (primary controls only), `--radius-pill`.
- Elevation: `--raise-sheet` and `--raise-pop`, both offset-plus-blur shadows,
  for floating sheets only. The ruled page itself carries no shadow.
- Motion: one reveal gesture (fade-up from an already-laid-out state,
  `--dur-slow` 480ms, `--ease-out-expo` cubic-bezier(0.16, 1, 0.3, 1),
  travel 12px), hover color shifts at `--dur-instant` 120ms. Nothing
  scroll-gated. `prefers-reduced-motion` zeroes all of it (verified at
  1e-06s in the comp captures).
- Focus: `--focus-outline` 2px solid record red with `--focus-offset` 3px,
  applied globally via `:focus-visible` (verified by trusted keyboard input:
  solid 2px `rgb(178, 51, 23)` on real Tab focus).
- Selection themed from the active palette.

## Implementation status, verified

- Tokens in the repo: `site/src/styles/tokens.css` (both themes + auto mode,
  zero JS).
- Mapping: `global.css` now uses `@theme inline` to map every existing
  utility name (`bg-field-bg`, `text-signal`, `font-display`, ...) onto the
  token layer, and adds `font-doc` and `font-data` utilities. Established
  routes keep their classes; the theme layer is the only change.
- Fonts: 9 self-hosted woff2 files shipped in `site/public/fonts`; the
  fontshare stylesheet (FieldLayout.astro:17-21) and the dead Google Fonts
  loader (Base.astro) are removed.
- Build: `npm run build` passes, 14 pages, all existing routes intact; dark
  identity unchanged as the default on established routes.
- Existing copy strings (venture blurbs, statuses, location line) still carry
  a handful of em dashes from the pre-existing content.ts copy. They are
  reproduced verbatim in the comps. A 30-second copy sweep of those files is
  queued for implementation but not applied (the frozen-copy rule protects
  prose without approval; the em-dash rule binds new copy).
- What deliberately did NOT ship: rewriting `work.astro` and adding the
  case-study routes. That is the implementation step after these comps are
  signed off, and it is specified in the flow and workflow doc.

## Decisions recorded

Mike delegated all three on 2026-10-27 ("go with your recommendations").

1. **Direction: Notebook, as landed.** The Field Report and Plate Book alternates are closed and stay recorded above as the roads not taken.
2. **Reading body: Source Serif 4.** Archivo continues to carry UI and display, Fragment Mono carries data and receipts.
3. **Document default: paper pinned.** `/work` and the case-study routes set `data-theme="light"`. Auto remains available for any future page that wants it, but document pages do not follow the visitor's system setting, because a hiring manager reads in a day-lit room and the paper ground is what makes the case study read as a document at any hour.
