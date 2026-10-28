---
title: "NeighborhoodShare: activation without retention, and the rebuild that followed"
slug: neighborhoodshare
kind: case-study
short: NeighborhoodShare
tag: "tool-sharing platform"
status: "wound down, rebuilt"
rowTitle: "NeighborhoodShare: activation without retention, and the rebuild that followed"
diag: "The legacy beta is activation without retention, caused by behavioral frequency rather than product quality."
navMark: "170 users across 20 communities, wound down"
position: "Read this as a diagnosis I trust and a second version I have not proven."
ledger: ["tool-sharing platform", "wound down, rebuilt", "170 users across 20 communities", "rebuild: Supabase + Cloudflare Workers"]
plate:
  src: /img/projects/neighborhoodshare-home.png
  alt: "NeighborhoodShare home screen"
  caption: "NeighborhoodShare, home screen"
---

# NeighborhoodShare: activation without retention, and the rebuild that followed

## The problem

I built NeighborhoodShare twice. Neighbors list the tools they own, and other neighbors borrow them. The first version reached 170 users across 20 communities before I wound it down.

The product worked. The shape of the need did not. Borrowing a ladder is something you do twice a year at most, and a loop that rare has no second visit.

The rebuild is the same product with tool lending as the whole scope, and it has to answer the question the first version never did: if the need is rare, what makes it worth opening in between?

## What was actually blocking use

The first version's numbers look healthy until you split them apart.

Getting people in worked. About 60 signups came from door-to-door flyers and a neighborhood association meeting in my own zip code, 95126. Roughly 110 more came from a newsletter post and an email list.

Listing failed. Between 75 and 80 tools sat in the database and all but about five were ones I added myself. Five of 95 active users ever listed a tool, about six percent. I had spent the build removing the friction of finding a tool. The friction that stopped people was describing one.

Density never formed, and my rollout was part of why. A zip code only activated at 20 users plus a volunteer captain. Twenty zips were live and 82 people were waiting on neighbors who had not arrived.

Retention failed for a reason no interface change would fix. 95126 was the one dense neighborhood, and listing was still rare there.

## What I designed

Four changes, all of them visible to someone using it.

**Anyone can join.** Signup used to be gated by zip code and a captain, so most people signed up and then waited. Now it is open, and matching runs on your address and a radius you choose. The 82 people behind that gate become the first users of a map instead of a queue.

**You can ask before a tool exists.** A neighbor posts what they need and anyone in range can answer. That reverses the old requirement that supply appear first, so the person who needs a ladder does not sit waiting for someone to think of listing one.

**Listing starts with a photo.** The old form asked you to describe a tool you already own, which is the step people skipped. The new screen opens with one button, add a photo, and the photo fills in the name, the category, and the description. The manual form is still there behind a toggle.

**Trust is a rule.** Points come only from completed exchanges, 25 to lend and 10 to borrow, clearing 24 hours later so a rating cannot be gamed by a click. Your exact address stays private, and contact details stay hidden until the owner approves the request.

## What I'd change

The rebuild fixes activation and supply, the two problems I could name. It does not fix frequency, and I will not dress it up as if it does. The app still asks people to borrow a drill.

I would pick one neighborhood and stay there: one radius, 30 to 50 people recruited the way I recruited in 95126, and no channels outside it until it works.

I would instrument before the first signup. The relaunch defines success measures and I have measured none of them. The first version ran two analytics products. The rebuild runs none.

I would ship referrals first, because density from existing members does not depend on how often someone needs a ladder. My earlier write-up argued that tool sharing belongs inside a broader community product. I did not take that route, and I would rather say so than let a scope change I never made argue for me.

## Growth read

The first version was activation without retention, caused by behavioral frequency rather than product quality. Signups were cheap, listing was rare, and 82 people waited behind a gate nobody could fill.

The metric that matters is listings and completed exchanges per radius per unit of time, not signups.

The rebuild bets that activation and supply can be fixed and made visible. That bet is untested: no founding neighborhood recruited, no instrumentation, no referral path. Read this as a diagnosis I trust and a second version I have not proven.

## Sources

- 170 users across 20 active zips, 82 waiting, 75 to 80 tools listed with about five added by other users, and a six percent listing rate across 95 active users: the NeighborhoodShare technical document, Platform Results and Market Validation Results
- Borrowing roughly twice a year, and the finding that the product was not adopted: the same document, Root Cause and Honest Assessment
- Open signup with radius matching, dropping ZIP gating and captains: the NeighborhoodShare PRD and the 2026-07-11 decision record
