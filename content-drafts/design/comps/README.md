# Comps: /work front door + case-study template

Two working HTML comps rendering the "Notebook" direction (see
`../2026-10-26-brand-theme-spec.md` for the tokens and point of view; see
`../2026-10-26-flow-and-workflow.md` for the information architecture and
the route map). No JavaScript anywhere: theming, collapsible Sources, and
focus states are native CSS and `<details>`.

| File | What it is |
|---|---|
| `work.html` | The /work front door: opening, three case rows, ways to engage, systems index, contact band. Pins the paper theme (`data-theme="light"`). |
| `case-neighborhoodshare.html` | The case-study template carrying the real, frozen NeighborhoodShare copy (verified verbatim: 22 units including all five Sources entries). |

To view: open either file in a browser, or serve this directory (or the
repo root, so images resolve) with any static server:

    python3 -m http.server 4411 --bind 127.0.0.1
    # then visit http://127.0.0.1:4411/content-drafts/design/comps/work.html

- Dark variant: swap `data-theme="light"` to `"dark"` on the <html> element.
- The comps share `comps.css` (the Notebook grammar) and load
  `tokens.css` + `fonts/` locally. `tokens.css` here is a mirrored copy;
  the source of truth is `site/src/styles/tokens.css` (the only difference:
  relative font URLs).
- Project screenshots load from `site/public/img/projects/` (three
  levels up: the comps reference real repo images, nothing staged).
- Copy rules honored: the frozen case-study file is reproduced verbatim
  (formatting only: bold lead sentences, receipt styling); every new UI
  string is em-dash free; the two venture strings that still show an
  existing em dash reproduce pre-existing content.ts copy verbatim, flagged
  in the spec for Mike's decision during implementation.
- Known comp-only state: the Distills and ADD-Friendly Agent case rows link
  to their future `/work/<slug>` routes (not built in this comp run) and the
  end-of-case nav shows them as rows without links. Both are links in the
  implementation.