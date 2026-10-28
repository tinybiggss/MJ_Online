# Tasks — MikeJones.online

> At session start, Claude reads this file and loads tasks into the session task panel.

**Last updated:** 2026-08-24 (course-interest votes tallied — only 2 real responses; ballot re-run queued)

---

## 🔴 Active — In Progress

| # | Task | Notes |
|---|------|-------|
| | _No active tasks_ | |

---

## 🔵 Next Up

| # | Task | Priority | Notes |
|---|------|----------|-------|
| 1 | Re-run the course-interest ballot | High | First run drew only **2 real responses** (~10% of the cohort); 31 of 46 topics got zero votes. Too thin to pick Week 1–2 builds. Both real votes arrived hours after class ended — run it in-class and time-boxed, on a shorter list. See `Corvus/Operations/GHN-Course-Interest-Tally-2026-08-21.md`. |

---

## 📋 Backlog (future, optional)

| Task | Notes |
|------|-------|
| Per-project deep-dive pages | Corvus, Apollo, Home Solar, AI Memory via `/work/[slug]`. |
| Real project imagery | Screenshots/diagrams for Apollo, Mission Control, Solar (Corvus now has a photo). |
| Consulting case studies | Anonymized: CEO-as-bottleneck turnaround; Kinoo Jira→Smartsheet change-management story (from interview transcripts). |
| AI + ADHD content/course | Expand framework into essay series or course landing page. |
| "Vibe coding rewards waterfall rigor" essay | Strong POV from transcripts — good for Resilient Tomorrow or a Writing piece. |
| Refresh Distills KB | Regenerate from newest sources when Mike's positioning evolves. |
| `article:published_time` + JSON-LD on Writing pages | Richer search/social results — offered but not yet done. |
| Per-page share images | Optional `image` prop now exists in Base.astro; case studies could get bespoke cards. |
| Bind D1 `SURVEY_DB` for course-interest | Optional upgrade from inbox-only. Function already writes to it when present; `CREATE TABLE` is in the file header. Removes manual email collection. |
| Add missing GHN catalog items 1–5 | Mike deleted the first five topics from the run-of-show; catalog ships with 46. Append to `site/src/data/course-catalog.ts` if they come back. |
| Font-scale the rest of MikeJones.online | The ~10% bump was applied only to the four AI Fluency Lab pages; the main site still uses the original sizes. |

---

## ✅ Completed (2026-08-24)

| Task | Notes |
|------|-------|
| Tally GHN Week 3 course-interest votes | Re-extracted from raw emails via `extract-votes.mjs`, recomputed with `tally-course-interest.mjs`; Corvus's 08-21 figures reproduced exactly. Mike confirmed 3 of 5 ballots were his own form tests. **Final: 2 real responses.** Top 5 by normalized score: Your Second Brain (0.263), Vibe-Coding End-to-End (0.211), RAG Evaluation (0.211), Sandboxing Agents (0.158), Containment & Blast-Radius (0.158). Canonical data `~/responses-final.jsonl`; raw extraction kept at `~/responses.jsonl`. Sample too thin to drive the Week 1–2 build decision — re-run queued in Next Up. |

---

## ✅ Completed (2026-08-18 → 08-19)

| Task | Notes |
|------|-------|
| GHN AI Fluency Week 3 syllabus | `/GHN/AIFluency/week-3/` — 75-min agenda, taught frameworks block (3A's / 4D's / 3E's + Safe), 6 news anchors, 5-stage spec-driven cycle, benchmarking reality check. Built from `2026-08-19-Run-of-Show.md`; rebuilt three times as Mike revised the source. Commit `289a84d`. |
| Course-interest ballot | `/GHN/AIFluency/course-interest/` — 46 candidate sessions, pick ≤10 + rate 1–5, live cap enforcement, localStorage draft recovery, write-in field. Catalog lives in `src/data/course-catalog.ts`. |
| `POST /api/course-interest` | Pages Function; emails each vote via Resend (reuses existing env vars, no new config) and writes to D1 `SURVEY_DB` when bound. Validation verified against real workerd via `wrangler pages dev`. |
| Normalized tally script | `site/scripts/tally-course-interest.mjs` — reports votes / avg / normalized score. Per-respondent normalization so a voter who rates everything 5 can't outweigh an honest one. |
| Font legibility bump (~10%) | 231 hard-coded `font-size` values + `clamp()` heads across all four AI Fluency Lab pages, plus explicit `body{font-size:17px}`. No overflow at 1280px or 375px. |
| Bug: stranded "Sending…" button | Sticky tracker is a sibling of the form, so hiding the form on success left the bar frozen mid-send. Commit `d27cfbe`. |
| Fix: archived leaderboard link | HF Open LLM Leaderboard is archived; swapped for Artificial Analysis, added direct HF model hub link. Commit `ee27e43`. |

---

## ✅ Completed (2026-07-07)

| Task | Notes |
|------|-------|
| Open Graph + Twitter card meta | Site had only partial OG and no share image/canonical. Added full set in `Base.astro` (og:image/url/site_name/alt, canonical, twitter:summary_large_image) with absolute URLs from `Astro.site` + optional per-page `image` prop. Commit `28cf4a2`, deployed to Cloudflare Pages, verified live. |
| Branded 1200×630 social share card | `public/img/og-default.png` — on-brand near-black card w/ amber accent, homepage B&W headshot, name + "AI that holds up under load" tagline. Reproducible via `scripts/build-og-image.sh`. |

---

## ✅ Completed (2026-06-29)

| Task | Notes |
|------|-------|
| Mobile hamburger navigation | Header nav was `hidden md:flex` with no mobile fallback — iPhone users couldn't reach other pages. Added accessible animated hamburger + slide-down panel (Work/Writing/About/Contact/Résumé/CTA). Verified at 390px & 1280px; commit `7e867ec`, deployed to Cloudflare Pages. |

---

## ✅ Completed (2026-06-25 → 06-26)

| Task | Notes |
|------|-------|
| Design bake-off → Direction D "Field" | Rejected 3 AI-lane reflexes; impeccable critique 34/40 + polish |
| Built full Astro site + Substack RSS | Home/About/Work/Writing/Resume/Contact/404/Thanks |
| Deployed to Cloudflare Pages + git-push auto-deploy | Project `mikejones-online`; GitHub Actions |
| Custom domain cutover off Ghost | Removed R2 binding on apex; activated apex + www; SSL live |
| Cancelled Ghost Pro | No members; nothing to migrate |
| Contact form (Pages Function + Resend) | from noreply@mikejones.online → mike@mikejones.online (verified) |
| Distills career-bot embedded | Pointed at live RAG backend; KB refreshed (202 entries) |
| www → apex redirect | Pages middleware |
| Content enrichment + fact corrections | Interview-sourced voice; RT 2,100+, NeighborhoodShare wound down |
| Spacing/alignment fixes + Corvus photo | Astro inline-span spacing, ventures column alignment |
| Session memory → cross-project ledger | Shared with Corvus / other AI tools |

---

*Updated by Claude + Mike · 2026-08-24 · Course-interest votes tallied and finalized*
