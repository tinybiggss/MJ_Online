# NeighborhoodShare: activation without retention, and the rebuild that followed

## The problem

I built NeighborhoodShare twice. The first version is the one described on my own site: 170 users across 20 communities before I wound it down, because tool sharing proved too infrequent to stay top of mind (site/src/lib/content.ts:173). What I have now is the same product, rebuilt. Tool lending is the whole scope, not the on-ramp to something larger.

The product idea is simple. Neighbors borrow and lend tools and household items. You photograph a drill, a vision model fills in brand, model, category and condition, and the listing is visible only to people inside a radius you set.

The hard part of this product was behavioral. The behavior I designed for is rare. My own write-up of the first version says it directly: borrowing a tool is something you do every six months, maybe. A network whose core loop runs twice a year has no second visit.

## What was actually blocking use

The legacy numbers come from a technical document written out of a structured interview (content-drafts/neighborhoodshare-technical-doc.md). They separate into four failures, and I spent most of 2025 treating them as one problem.

Acquisition worked. Roughly 60 signups came from door-to-door flyers and a neighborhood association meeting in my own zip, 95126. Roughly 110 more came from a Resilient Tomorrow newsletter post and email list, spread across many zips, and they were mostly interested but still waiting for activation when the beta ended.

Listing failed. About 75 to 80 tools sat in the production database, and all but about 5 of them were ones I added myself. Only 5 of the 95 active users ever listed anything, about 6 percent. AI photo categorization worked. Signup was easy. The friction I was proud of removing was not the friction that stopped them.

Density never formed, and my rollout design was part of why. A zip only activated at 20 or more users plus a captain, with an adjacent-zip exception of 18 plus 2 within 5 miles. Twenty zips were active and 82 interested people were waiting for activation. The gate demanded local density, and local density depended on the listing behavior the gate was withholding.

Retention failed for a reason no interface change would fix. People who signed up did not come back, because a drill is not a daily or weekly need. My conclusion in that document was that tool sharing belongs inside a broader community product rather than standing alone.

One piece of evidence deserves care. The one concentrated neighborhood, 95126, is where those 60 local signups were, and even there listing was rare. Concentration alone was not sufficient. Frequency was the binding constraint and supply was the visible symptom.

## What I designed

The rebuild is the design response to that diagnosis, and the diagnosis sets the scope. PRD.md opens with a table of confirmed scope decisions. DEC-003 in PROJECT-MEMORY.json is the one that matters for growth: rollout became open signup plus address and radius matching, and ZIP gating and the captain program were dropped.

Dropping a gate does not remove the cold start, so the rebuild carries deliberate answers to it, each one traceable to code.

Wanted posts let demand appear before supply. A neighbor posts what they need, and any neighbor can hit I can help, which notifies the poster (migration 20260712080000_m8_trust_safety.sql). A Wanted post is the one thing a member can create before any item exists nearby.

Graceful radius expansion: when nothing matches at your radius, the search route widens to the next radius step and says so. The empty state tells a brand-new member their neighborhood is just getting started and to be the neighbor who lists first (app/routes/search.tsx).

Photo-first listing: /listings/new opens with one button, Add a photo to get started, which creates a draft and jumps straight to the upload and AI autofill step. Before the change, a member had to type a title and category before the photo step was even reachable. Nothing was removed: the manual form is still there behind a toggle, just demoted (TASKS.md M12).

The Founding Neighbor checklist on the profile page gives a new member four next steps: earn the badge, activate a first listing, reach three useful listings, complete a first exchange. The invite nearby people step is deliberately omitted until referral tracking ships (issue #11). The badge is awarded at onboarding instead of incidentally later (migration 20260714010000_m14_founding_neighbor_checklist.sql).

Retention mechanics: a weekly digest emails a summary of new listings near you plus your points and level, and skips members with nothing new and no activity (migration 20260713010000_m9_digest.sql). Points come only from completed exchanges, 25 for a lend and 10 for a borrow, land pending and clear 24 hours later, so they reward neighborly action rather than check-ins (migration 20260712070000_m7_gamification.sql).

Privacy is in the product because the address is the sensitive part of a hyperlocal network. Precise address stays private, neighbors see a jittered location, and contact details stay hidden until you approve a request.

## What I'd change

The rebuild fixes the activation and supply problems I could name. It does not fix frequency, and I should not dress it up as if it does. The app at neighborhoodshare.app still asks people to borrow a drill.

I would pick one neighborhood and stay there. The legacy run spread 170 signups across 20 zips, and even the concentrated zip did not produce listings. A relaunch that fans out again repeats the mistake. I would seed one radius with roughly 30 to 50 people recruited the way I recruited in 95126, and resist every channel that does not serve that radius.

I would instrument before the first signup. The relaunch epic (issue #3) already defines the right success measures: landing visitor to neighborhood start conversion, onboarding completion, first active listing rate, members listing three or more items, qualified invitations and referred activations, first completed exchange per neighborhood. I have measured none of them. The legacy beta ran PostHog and Plausible; the rebuild has no analytics dependency at all. Every number in this case study comes from the legacy beta or from the code. Not measured: anything about the rebuild.

I would finish the referral path (issue #11) before anything else. The points ledger already reserves a referral event, and the server can award it idempotently with anti-abuse rules, but no member can create an invitation link. Density from existing members is the one lever that does not depend on behavioral frequency.

The scope question is settled, and the answer makes the hard part harder. This is a tool lending product and the rebuild did not widen it, so the frequency constraint is permanent rather than temporary. Retention has to be designed for a need that shows up months apart, which makes a weekly digest the wrong hook and pushes the return pressure onto wanted posts, where someone can state demand before any supply exists. My earlier write-up concluded that tool sharing belongs inside a broader community product. I did not take that route, and I would rather say so than let a scope change I never made do the arguing for me: I am testing whether this works at its original scope before I change the scope.

## Growth read

The legacy beta is a clean case of activation without retention, caused by behavioral frequency rather than product quality. Signups were cheap, listing was rare, and 82 people sat behind a gate that required the density nobody had.

What I take from it is a specific growth thesis: for a neighbor to neighbor exchange market, the metric that matters is listings and completed exchanges per radius per unit of time, not signups. Signups were the number I had, and it was close to meaningless.

The rebuild bets that activation and supply can be fixed and made visible, and that the frequency problem gets solved by widening the product. That bet is untested. The build is real and the cold start surfaces are designed, but TASKS.md still lists the residual real-signup smoke test as outstanding, no founding neighborhood has been recruited, no funnel has been instrumented, and the referral lever is unshipped. A hiring manager should read this as a diagnosis I trust and a second version I have not yet proven.

## Sources

- 170 users across 20 communities, wound down for infrequency: site/src/lib/content.ts:173 (the same site copy promises a fold into a wider platform; that expansion has not happened and this case study does not claim it)
- Signup totals of 170, 20 active zips, 82 interested awaiting activation, 75 to 80 tools listed, about 5 added by other users, about 6 percent listing rate of 95 active users: content-drafts/neighborhoodshare-technical-doc.md (Platform Results, Market Validation Results)
- The 6-month development cycle running February to September 2025: content-drafts/neighborhoodshare-technical-doc.md (Platform Results)
- Acquisition split of roughly 60 local 95126 signups from door-to-door and neighborhood association meetings, roughly 110 from the Resilient Tomorrow newsletter and email list, most still waiting for activation: content-drafts/neighborhoodshare-technical-doc.md (Grassroots Marketing Efforts)
- Borrowing frequency of roughly every six months, tool sharing as a feature rather than a standalone product, and the assessment that the product was not adopted: content-drafts/neighborhoodshare-technical-doc.md (Root Cause, Key Validation Learnings, Honest Assessment)
- ZIP activation criteria of 20 or more users plus a captain, adjacent-zip exception of 18 plus 2 within 5 miles, and 82 users waiting: content-drafts/neighborhoodshare-technical-doc.md (Beta Management, Zip Code Clustering Logic) and NeighborShare/server/routes/beta-rollout.ts
- Legacy analytics stack of PostHog and Plausible: content-drafts/neighborhoodshare-technical-doc.md (Data Collection Minimization)
- Rebuild scope decisions, open signup plus radius matching, dropping ZIP gating and captains: Dev/NeighborhoodShare/PRD.md section 1 and PROJECT-MEMORY.json DEC-003 (2026-07-11)
- Wanted posts as demand visible before supply: Dev/NeighborhoodShare/supabase/migrations/20260712080000_m8_trust_safety.sql
- Graceful radius expansion and the empty-neighborhood copy: Dev/NeighborhoodShare/app/routes/search.tsx
- Privacy model of a jittered public location, exact address kept private, and contact details revealed only after approval: Dev/NeighborhoodShare/app/routes/home.tsx and migration 20260712050000_m5_exchanges.sql (exchange_contact_info)
- Illustrative example gallery that never touches the listings database, so it cannot read as local inventory: Dev/NeighborhoodShare/app/components/ExampleGallery.tsx and issue #8
- Photo-first listing creation with the manual form behind a toggle: Dev/NeighborhoodShare/app/routes/listings/new.tsx and TASKS.md M12 (2026-07-13)
- Founding Neighbor checklist with the invite step omitted pending referral tracking: Dev/NeighborhoodShare/app/routes/profile.tsx and issue #10
- Founding Neighbor badge awarded at onboarding: Dev/NeighborhoodShare/supabase/migrations/20260714010000_m14_founding_neighbor_checklist.sql
- Weekly digest content, the skip rule, and its Sunday schedule: Dev/NeighborhoodShare/supabase/migrations/20260713010000_m9_digest.sql
- Point values of 25 for a lend and 10 for a borrow, pending to cleared 24 hour cool-off, anti-abuse rules, and the radius-scoped 90 day leaderboard: Dev/NeighborhoodShare/supabase/migrations/20260712070000_m7_gamification.sql
- The shipped badge catalog (First Share, Good Neighbor, Toolbox Titan I to III, Reliable, Connector, Founding Neighbor) and the PRD badge list that also named Trailblazer, Always On Time and category-mastery badges: migration 20260712070000_m7_gamification.sql and Dev/NeighborhoodShare/PRD.md section 6
- No analytics dependency in the rebuild, against the legacy PostHog and Plausible stack: Dev/NeighborhoodShare/package.json dependencies
- Relaunch business goal and the six named success measures, still unmeasured: GitHub issue #3 on tinybiggss/NeighborhoodShare
- Referral links, the reserved referral event, and the qualification gate: GitHub issue #11 and migration 20260712070000_m7_gamification.sql
- Public URL and the fact that the rebuild is live on Supabase plus Cloudflare Workers: Dev/NeighborhoodShare/PROJECT-MEMORY.json (project status, 2026-07-13)
- Milestones M0 to M13 complete with the residual real-signup smoke test and Lighthouse audit still outstanding: Dev/NeighborhoodShare/TASKS.md (header, 2026-07-13) and GitHub issue #13


## What I would measure next

1. Loan completion and a second 30-day return window for the first version. The exact count was not tracked, and surviving database rows would put a real return rate beside the 6 percent listing rate, which is the only retention-adjacent number I have.
2. The 95126 cohort on its own. About 60 of the 170 signups came from door-to-door and neighborhood association work in that ZIP. Whether concentration alone would have rescued the listing rate is the cleanest test available to me and I never ran it.
3. A funnel in the rebuild before the first signup, not after the first twenty. Nothing in the current build can be evaluated, because it has no analytics dependency at all.
4. Referral qualification, meaning a point value and the milestone that earns it. Both are unapproved in issue #11, so the invite step in the founding-neighbor checklist is deliberately omitted.

## Scope and status

- Tool lending only. The rebuild did not widen the product, and nothing in this case study claims a platform expansion. The site copy that promises a fold into a wider community platform describes an intention, not a shipped change.
- The rebuild is live but has not been launched as a growth result. It is presented here as a design response to the diagnosis above, not as a measured win. No member has completed a loan in it yet.

## Still open

- The neighborhood-density badge. The PRD specified one for the first fifty members in a new neighborhood, aimed directly at cold start. The shipped badge catalog has no such badge, and I have not decided whether that was a deliberate cut or an oversight.
