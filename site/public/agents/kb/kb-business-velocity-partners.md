---
id: kb-business-velocity-partners
title: Velocity Partners
updated: 2026-10-28
source: Mike Jones public knowledge base (https://mikejones.online/llms.txt)
---

# Velocity Partners

## Velocity Partners

Consulting arm. Core revenue. The bridge that funds resilient-tomorrow.

### Offer (repositioned 2026-08-21)

Shape: curriculum, one-to-many, bounded programs — not open-ended retainers IP: reusable by default (a curriculum compounds; a retainer doesn't) Stance: augment-not-replace — a commercial argument (stalled rollouts trace to fear), not just an ethical one Old offer ("I rebuild your operations with agents", bespoke): superseded; retained in history of Velocity Partners.md Pending hook change (Mike 2026-10-13, resume rebuild): "Product Evaluation, Fractional COO, and AI Process Integration" — replaces the resume-side hook; VP-site copy not yet updated (history 2026-10-15).

### Offerings Decomposition (2026-10-03; grill date Mon 2026-10-05)

Velocity Partners/Offerings-Analysis-2026-10-03.md (draft-for-grill, pricing estimates) reframes VP as one fractional-executive platform with three productized components: Offering 1 AI-readiness assessment (front door, est. $7.5K–$15K fixed) · Offering 2 knowledge base as source of truth for AI (delivery, est. $15K–$25K pilot + maintenance retainer) · Offering 3 AI instruction + certification cohorts (one-to-many scale lever, aligned with full rate set 2026-10-05: $10K/mo · 40h (direction + advisory, prototyping capped ≤10h/mo; floor $7.5K; max 2 concurrent retainers by the bandwidth (zero observed demand for the public/agent-discoverability half — an R&D bet, see agentic-web). Open grill questions: 90-day wedge, the Offering-2 builder trap vs "director, not doer", bandwidth covenant (max retainers). Analysis is grounded but supersedes nothing until Mike grills it 2026-10-05.

### Agentic-Web Offering Decided (2026-10-02; not yet built)

Mike's Gamma-rebuild answers (T-2026-09-25-GAM1, resolved 2026-10-02) made the agentic web VP's site-level offering: "prepare your business for the Agentic web" — knowledge bases, agentic indexes, KB-driven bots (same pattern as distills). velocitypartners.io to be rebuilt as a simple house-style page with that offer, findable by agents, made indexable (was noindex), DNS moved off GoDaddy to Cloudflare, "26 years" → 29. Implementation cards T-2026-10-02-VK7 (VP site) and T-2026-10-02-HAJ (jones-co.us rebuild) queued — decided, not built. Thesis detail: agentic-web.

### Person-Brand Leg Live (2026-10-09); VP Site Blocked on Distills

The mikejones.online leg of the person-roof portfolio shipped. The live-portfolio change-set went to prod 2026-10-09 13:45 PT — commit 9b3c9b3, CI run 37988799634 (VK7 ship; card T-2026-10-09-CHZ) — with the LinkedIn-approved headline integrated and headshot-bw.png live on the homepage. Re-verified live in the 10-09 15:00 PT sweep: mikejones.online /agents/kb/index.json 200, /llms.txt 200, /agents/query?q=xbox returns the career-history result (mike-career-history). The KB→surface chain this run exercised is publication-layer's first live deployment. velocitypartners.io — REBUILT LOCALLY 2026-10-12, deploy-gated on Mike. *(Superseded 2026-10-26: the rebuild deployed to pages.dev and the design was rejected the same day — see "VP Site: Position Approved, Frame Rejected" below. Kept as history.)* House-style Astro page + agent layer (/llms.txt, /agents/kb, /agents/query) lives in ~/Dev/velocitypartners-io (commits bb3f1af / a652cfa / 609b66f; local-only — no remote, no deploy, DNS untouched; CC adversarial gate r2 APPROVE recorded in PLAN.md). 29-years fixed; content re-extracted and preserved verbatim per the CC gate; rate-free marketing belt (aborts on $-figures). Preview ready for Mike review; his 3 pending decisions: (1) approve the Cloudflare Pages deploy, (2) stand up mail routing or swap the displayed address (hello@velocitypartners.io is undeliverable today — zone has no MX/TXT, dig-verified), (3) approve the GoDaddy→Cloudflare NS cutover sequence. In prod, velocitypartners.io still serves the Gamma site until those land. Tracked on T-2026-10-02-VK7. 2026-10-09 20:56, Mike: VP site work BLOCKED until the Distills SMB work is done. If Distills can be marketed as an SMB tool, VP points at it as the type of work VP does — and it becomes an additional Distills marketing point. Unblock chain: Mike reviews the CC-gated SMB market scan (T-2026-10-09-P5P) and spec (T-2026-10-09-XMS, incl. OQ-1/OQ-2) — both delivered 10-09 20:40, CC-gate APPROVED — then T-2026-10-09-CHZ flips back to todo and VK7/JYT work resumes.

### VP Site: Position Approved, Frame Rejected (2026-10-26)

The 10-12 deploy gate finally opened — and closed on the other issue. Approved, then shipped to pages.dev. Mike read the index-v2 preview 2026-10-26 ~13:05 ("I ran through the index-v2, and I think it's great. Let's go with it.") — taken as confirming the five positioning lines in Velocity Partners/VP-Positioning-Rework-2026-10-16.md (the approving run made that ruling; it was never line-by-line with Mike and stays vetoable). Shipped to Cloudflare Pages project velocitypartners-io (commit e527b84, dual adversarial gate r4: Claude Code + Codex both APPROVE; /, /llms.txt, /agents/kb/index.json, /agents/query all probed green). Rejected ~15:50 the same day — design and frame, not positioning. Verbatim: *"If I were to land on this page, I would not hire this company. The little eyebrows after Velocity Partners, the VP-01.rev2016: there's just so much, everything about this. I'm the eyebrow. I don't like the eyebrows."* The positioning approval stands; the furniture (kicker labels, visible VP-01 / rev 2026 build strings, deck-shaped section openers) does not. Three directions delivered 2026-10-26 15:43 (design lane, kanban t_9fe20a3f): a 9-failure mechanical critique plus three real HTML comps — A The Letter (Notion grammar), B Working Proof (Vercel grammar: proof in the first viewport), C The Brief (Coinbase grammar) — with RECOMMENDATION.md picking B on one deciding factor. All comps verified: banned-list clean, 1440/390 with no horizontal scroll, proof hrefs 200, cal.com CTA, no rates. Mike's direction pick is the gate: T-2026-10-27-CZM (todo, high). No build work resumes before that word. Prod velocitypartners.io still serves the old Gamma site, DNS was never touched, and deploy + the GoDaddy→Cloudflare NS cutover stay gated.

### Strategic Frame

VP is a bridge, not a destination. Every engagement is judged on one question: *does this shorten the bridge or lengthen it?* Binding constraint is bandwidth, not values — a fully consumed 40-hour week is one whose work *feeds RT instead of competing with it*: aligned work produces two outputs from the same hours (the engagement + the RT material), unaligned work produces one.

### Open Items

VP site: Mike picks a design direction (T-2026-10-27-CZM) before the rebuild resumes — the 10-12 rebuild is now on pages.dev, position approved, design rejected 2026-10-26; prod still serves the old Gamma site (history 2026-10-28) Pitch deck refresh to ICP-approved framing AAPD methodology retired (DEC-008, 2026-08-21) — "still core, role evolving" superseded 2026-10-15; successor shapes: the agentic-web offering + the agent-terms/gate-review candidate (history 2026-10-15) RT content pipeline revival would create aligned-work capacity (rt-content-pipeline)
