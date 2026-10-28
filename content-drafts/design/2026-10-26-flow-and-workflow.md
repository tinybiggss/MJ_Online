# Site flow and publishing workflow: /work as the portfolio

Date: 2026-10-27 (card t_8791595e deliverable named 2026-10-26).
Companion docs: `2026-10-26-work-audit.md` (what was failing),
`2026-10-26-brand-theme-spec.md` (the landed tokens).
Comps this doc describes: `content-drafts/design/comps/work.html` and
`content-drafts/design/comps/case-neighborhoodshare.html` (open them in a
browser; both themes, no JavaScript required).

## Part 1: /work information architecture

The front door keeps its route and its H1 ("The work.") and changes what it
is: a case-study page with an index attached, instead of a directory with
work attached. The route is additive: /work keeps resolving, the four venture
links and the nine-system grid all stay on it, and nothing in the site 404s.

Order after the redesign (the comp renders exactly this):

1. **Opening.** H1 plus one receipts line: what this page is, in two
   sentences. This is also where the designer-portfolio signal lives.
2. **Case studies.** The three finished cases as ruled rows: mono label
   (what kind of thing) | title + the one-line diagnosis (quoted verbatim
   from each case's own Growth read) | status + "Read the case study". This
   table is the ten-second read.
3. **Ways to engage.** The four ventures, intact and demoted to a compact
   ruled list of four rows with their off-site links. Execs still find
   Velocity in three seconds.
4. **Systems index.** The nine systems in their three existing groups from
   content.ts, verbatim copy, plates keylined; the NeighborhoodShare row
   links to its case study.
5. **Contact band.** One close that addresses both audiences (the case
   studies as reference; email to start).

Navigation between the three: the case-table rows from /work, plus the
end-of-case nav block on each case page (the three cases as rows, the
current one marked; the implementation turns the other two into links.
The comp shows the pattern with plain rows where the comp itself is the
only build).

### Case-study route and template

- Route: `/work/<slug>` for slug in `neighborhoodshare`, `distills`,
  `add-friendly-agent`. One segment under /work, short, no dates in the URL,
  no "case-study" prefix in the path. Existing routes untouched.
- Template anatomy (as rendered in the NeighborhoodShare comp):
  - Crumb row (mono: Work / case study / NeighborhoodShare).
  - H1 (the frozen title, Archivo, capped at 48px).
  - A mono ledger strip: what it is, state, scale, technology, all values
    traceable to the case file (nothing invented).
  - **Position line**: one honest sentence from the case's Growth read, set
    in serif italic under a red mark, before reading starts. This is the
    memorable moment, and it is what makes the five sections read as a
    narrative: the page states its conclusion first, then earns it.
  - Optional product plate (real screenshot, keylined) for entries that have
    one; the template does not require imagery (add-friendly-agent has none).
  - The five frozen sections as ruled sections at a 66-character measure,
    section H2s in Archivo, lead sentences of the findings paragraph set
    strong (formatting, not prose edits), the "What I'd change" section
    carrying the red mark under its heading.
  - Inline citations render as mono receipt pills (the frozen parentheticals,
    text unchanged, styled as data).
  - Sources: a collapsed `<details>` appendix (native element, keyboard
    accessible, no JS), each citation a numbered receipt (01 to 05).
  - Case index rows, then the contact band.

## Part 2: site flow

### The hiring-manager path

1. **Entry from LinkedIn, the resume PDF, or the Anthropic application.**
   /work is the named destination. From the homepage, "See the work" stays
   the first CTA and now lands on a portfolio.
2. **/work: case table**: the ten-second signal, the sixty-second diagnosis.
3. **One case study end to end** (~2 minutes at 800 words). The position
   line + Growth read are the skim; the middle three sections are the read.
4. **Sources, opened on doubt**: receipts are one click, collapsed by
   default.
5. **Contact**: the case page's contact band and the persistent header CTA
   ("/contact"); email (mike@jones-co.us) for the direct path.
6. **The resume PDF** sits as the parallel asset: reachable from /work (a
   header-row link, mirroring the footer's existing Résumé link) and from
   /contact. It is never the primary action on the portfolio; the case
   studies are the argument, the PDF is the formality (placement question
   below).
7. **The Distills product** is not a step in the hiring path. It appears
   twice, both already honest to its state: as a ways-to-engage row (live,
   zero paying users) and as its case study (which is the stronger artifact
   for a design role).

### The non-hiring visitor path

1. Homepage: ventures list ("One body of work, four front doors") continues
   to serve the consulting audience.
2. /work below the case table: ways to engage + systems index serve the
   exec/peer scan: what exists, what is running, what links out.
3. Resilient Tomorrow: reachable from the ventures rows and the footer as
   today; the newsletter never interrupts the case-study reading path (the
   reading pages carry no subscriptions; mid-read interruptions are exactly
   what the copy's own "What I'd change" argues against in other products).

## Part 3: publishing workflow (one mechanism, specified)

**Mechanism: Astro content collections, with a one-command copy step.**
Justification in two sentences: collections validate every case study at
build time (a missing Sources section or a required field fails the build
instead of shipping a half-drafted page), and they remove the hand-carry
into content.ts entirely. The copy step keeps the human gesture to exactly
one command, so the publish path is auditable and reversible in git.

### Exact steps to publish a case study

1. The finished draft lives at
   `content-drafts/case-studies/publish/<slug>.md` (unchanged; this is where
   the three files are today, verified).
2. Add frontmatter to the top of the file (six fields, no prose changes):

   ```yaml
   title: "NeighborhoodShare: activation without retention, and the rebuild that followed"
   slug: neighborhoodshare
   kind: case-study
   ledger: [tool-sharing platform, wound down rebuilt, 170 users across 20 communities, rebuild Supabase + Cloudflare Workers]
   position: "Read this as a diagnosis I trust and a second version I have not proven."
   appendix: "/case-studies/neighborhoodshare-full"    # optional link to the long version
   ```

3. Run the publish script:
   `node site/scripts/publish-case-studies.mjs neighborhoodshare`
   It copies the file into `site/src/content/case-studies/`, checks the
   schema (title, slug, status), and refuses publish when a required section
   heading (The problem / What was actually blocking use / What I designed /
   What I'd change / Growth read / Sources) is missing.
4. `npm run build` compiles the collections and emits `/work/<slug>/`.
5. Deploy by the existing site pipeline (Scotty's release lane).

Steps 3 and 4 are mechanical; the script is a 20-line file that does not
read or rewrite prose. The frozen-copy principle survives: prose changes
only in the drafts, never by the pipeline.

### What this replaces

- The current hand-carry: copy lives as fields inside `site/src/lib/content.ts`,
  hand-edited per change, unvalidated at build. The case-study type is out of
  content.ts's job entirely; content.ts keeps serving the index blurb that
  the grid needs.
- The long versions in `content-drafts/case-studies/*.md` (1,900 to 2,200
  words each) stay out of the publish path and can later be linked as
  appendix pages if Mike wants the full evidence trail on-site.

## Decisions recorded

Mike delegated both on 2026-10-27 ("go with your recommendations").

4. **Resume PDF: pinned into the /work opening**, as a header-row link next to the case table, mirroring the footer's existing Resumé link. It is never the primary action on the portfolio: the case studies are the argument, the PDF is the formality.
5. **Newsletter: Resilient Tomorrow stays out of the /work surface** except its ways-to-engage row. No essay band on case pages. Mid-read subscription prompts are exactly what the case-study copy argues against in other products.
