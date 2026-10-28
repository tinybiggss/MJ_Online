# /work build run (card t_ecb81632), 2026-10-27

Implemented the Norman design package (card t_8791595e): /work as the
portfolio front door, three case-study routes, the content-collections
publish path, and the paper theme pinned on document pages. All decisions
were locked 2026-10-27 ("go with your recommendations"); nothing was
reopened. Build + verify only, no deploy.

## New files

- `site/src/content.config.ts` — Astro content collection `caseStudies`
  (glob loader over `src/content/case-studies/*.md`), zod schema for the
  frontmatter fields, and a refine that fails the build on any em dash in
  any string: the standing zero-em-dash rule now enforces itself at build.
- `site/src/lib/case-format.ts` — renders the frozen markdown into
  template-ready sections: receipt parentheticals become mono receipt pills
  (file paths, file:line, migrations, TASKS items, DEC ids, issue numbers;
  prose parentheticals like "(shipped)" and the Kolberg/Nadeau note stay
  plain), "What was actually blocking use" paragraphs after the intro get
  their lead finding sentence set strong (a 90-char cap keeps run-ons from
  swallowing it), code/bold/italics pass through, Sources lines render code
  spans but no receipt pills (they are already receipts).
- `site/src/lib/case-studies.ts` — deliberate reading order
  (NeighborhoodShare leads: the strongest piece, and it gets the lead plate
  on /work), and build-time guards that fail loudly if a copied file has no
  order slot or an ordered one is missing.
- `site/src/lib/case-format.test.ts` — frozen-copy guard: for each publish
  draft, every paragraph, heading, source line, and the title round-trip
  through the formatter with text unchanged (markdown inline markers
  stripped on the baseline, HTML tags decoded on the render side), plus
  zero-em-dash assertions and the presentation-rule tests (receipt vs plain
  parenthetical, lead treatment scope, (shipped) stays plain).
- `site/scripts/publish-case-studies.mjs` — copies
  `content-drafts/case-studies/publish/<slug>.md` into
  `src/content/case-studies/`; refuses a missing required section heading,
  an empty Sources list, or a frontmatter slug that disagrees with the
  filename. Does not read or rewrite prose. `CASE_DRAFTS_DIR` env override
  for tests/demos; build-time field validation is the collection schema.
- `site/scripts/verify-case-render.mjs` — post-build end-to-end frozen-copy
  check (106 assertions): built page text must contain every paragraph,
  heading, source line, position line, and H1 of each publish draft;
  /work must contain every row title, diagnosis, status, and link; the four
  document pages must pin `data-theme="light"`, four established routes
  must NOT pin (dark desk default); Resilient Tomorrow appears exactly once
  on /work (the ways-to-engage row).
- `site/src/styles/work.css` — the comp's Notebook component layer ported
  off comps.css (minus the comp's own header/footer): page head, case rows,
  ways-to-engage rows, systems index, case template anatomy (crumbs,
  ledger, position line, doc measure, designed rows, receipt pills,
  `<details>` appendix with CSS counters 01 to 05, case-nav, contact band),
  staggered load reveal. Mike's three review fixes built in (below).
- `site/src/pages/work/[slug].astro` — `/work/<slug>` dynamic route
  (getStaticPaths from the collection): frontmatter title must equal the
  frozen H1 and the slug must equal the entry id or the build throws.
- `site/src/content/case-studies/*.md` — the three publish files copied by
  the script (drafts stay the source of truth).

## Changed files

- `site/src/pages/work.astro` — rebuilt: opening (H1 "The work.", receipts
  lede, resume PDF mono link), case rows, ways-to-engage rows, systems
  index (all nine systems, copy verbatim from content.ts, NeighborhoodShare
  links its case), contact band. Paper pinned via `dataTheme="light"`.
- `site/src/lib/content.ts` — em dash sweep: 37 em dashes replaced (each
  with a comma, colon, or period): the 12 rendered on /work, the homepage
  and about-rendered venture descriptions, the career rows, heroLead/intro,
  and the comment header dashes (so the file now greps clean at zero). En
  dashes untouched (year ranges, the official CCAR-F name).
- `site/src/layouts/Base.astro` — optional `dataTheme` prop; `<html>`
  carries `data-theme` only when a page pins it. Unset for every
  established route: dark desk default unchanged.
- `site/src/layouts/FieldLayout.astro` — passes `dataTheme` through.
- `site/src/styles/tokens.css` — added Archivo 400 @font-face (for GHN's
  body text; now 10 self-hosted OFL woff2 files).
- `site/src/pages/GHN/AIFluency/{index,course-interest}.astro`,
  `week-{2,3,4}/index.astro`, `week-2/fallback-projects.astro` — Google
  Fonts sweep (6 files; the card named 5, `course-interest.astro` is the
  sixth the grep found): the two Google `<link>` lines per file replaced
  with a frontmatter import of `styles/tokens.css` (font faces, no CDN),
  and the families swapped: Inter > Archivo, Lora > Source Serif 4,
  JetBrains Mono > Fragment Mono.

## Mike's three review fixes

1. Lead row: NeighborhoodShare carries its product plate inside the row;
   the other two stay ruled text rows. The rows are no longer identical
   weight, and NeighborhoodShare is unmistakably the read-first piece.
2. Status wrap: the case-row status column is a fixed 12rem measure
   (`13rem minmax(0,1fr) 12rem`), so "live, zero paying users" renders on
   one line with "Read the case study" under it at 1440. Verified in the
   1440 capture: no ragged two-line status, no orphaned affordance.
3. Plate treatment: every plate is matted (`--surface-2`) behind a
   `--hairline-strong` keyline, so the white workflow/architecture exports
   read as tipped-in artifacts, not pasted images (visible in the 1440
   capture). Note: "Mission Control" has no image asset in the repo
   (never did); the plate treatment covers the three real-image entries in
   the AI Systems group (Corvus, AI Memory System, OfflineAI), which were
   the two raw white exports + the photo card next to them.

## Verified

- `npm run build`: 17 pages (14 existing routes + /work/neighborhoodshare,
  /work/distills, /work/add-friendly-agent). Route list in the build log:
  no route exists today that did not resolve yesterday.
- Frozen copy: 18 vitest assertions in `case-format.test.ts` + 106
  post-build assertions in `verify-case-render.mjs` (unit comparison of
  publisher text vs BUILT page text; per-project paragraph-for-paragraph).
  Position lines quoted straight from each case's Growth read.
- Publish refusal demonstrated: a doctored draft with `## Growth read`
  deleted was refused ("missing required section heading: Growth read",
  exit 1); all three real files published with 6 sections, 4/4/5 sources.
- Zero `fonts.googleapis.com` / `fonts.gstatic.com` under `site/src` (and
  in `dist/`): grep output empty.
- Zero em dashes in content.ts and in every file this card touched
  (ripgrep U+2014). The site-wide scan shows pre-existing em dashes
  REMAIN in about.astro, resume.astro, index.astro hero, thanks/contact/
  writing pages, substack.ts comments: outside this card's sweep target
  (content.ts). A follow-up card would clear those the same way.
- `<details>` appendix: real keyboard probe via trusted CDP input on the
  built page: 15 Tabs from load reach the summary, Enter opens it
  (open: true), zero page JS involved.
- Screenshots (content-drafts/design/captures/): /work before at 1440/390
  and after at 1440/390; case route at 1440 and 390; sources appendix
  open. The 390 captures used true device emulation via CDP
  (Chrome's --window-size has a 500px minimum window width).

## Decisions this card did not specify (recorded, all cosmetic-scoped)

- navMark (case-nav marks): state/scale receipts instead of repeated
  titles: "170 users across 20 communities, wound down" / "live, zero
  paying users" / "29 consecutive runs, one user" (comp used the Distills
  subtitle there; a repeated title on a nav row reads redundant).
- Position lines for the two uncomped cases, quoted verbatim from each
  case's own Growth read: Distills "Distills is not a funnel, it is a
  distribution loop." / ADD-Friendly Agent "Where it breaks is the seam
  between the agent and the human, and the fix repeats: move the action to
  where the data lives."
- Ledger strips (mono, traced to each case file, nothing invented):
  Distills: knowledge product at distills.app / live, zero paying users /
  Pro $199 / Career $399 annual (2026-10-23) / embeddable answer widget +
  knowledge base. ADD-Friendly Agent: agent protocol and installed skill /
  29 consecutive runs, one user / 31 protocols: 21 SELF, 9 ASSISTED,
  1 HUMAN / runs in 8 Hermes role profiles. (NeighborhoodShare's was fixed
  by the flow doc and unchanged.)
- The lead-row plate only renders on the NeighborhoodShare row (the lead),
  sized min(34rem, 100%), keylined like every plate.
- Grid tracks use minmax(0,1fr) after the mobile capture caught a
  track-blowout from the 34rem plate (found by looking at the 390 capture,
  fixed in the media query too). No other CSS behavior changed.
- The Distills chatbot ("Ask my AI") still renders on /work and case pages:
  pre-existing feature, preserved. Removing it is a separate decision.
- Pre-existing nav quirk observed (not introduced by this card, site-wide
  behavior in FieldLayout): the collapsed mobile-menu links remain
  keyboard-tabbable when visually collapsed (0fr/overflow-hidden keeps
  them in the tab order). Worth a look if a11y depth is wanted.

## Not shipped

- Deploy (Scotty's lane, Mike's go). Working tree left uncommitted for
  review; the three published content copies are untracked files the
  script regenerates.