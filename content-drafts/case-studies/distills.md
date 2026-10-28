# Distills: turning a knowledge product into a returning habit

## The problem

Distills (distills.app) takes a person's career documents and an AI interview and produces a hosted page that answers questions about them. A visitor opens distills.app/c/mike-jones, asks how I approach ambiguous design problems, and gets a first person answer drawn from my own files.

The engine worked. Hybrid retrieval, an enforced no fabrication rule, streaming answers, a self-hostable widget with a Built with Distills badge. None of that was the problem.

The problem was everything between a stranger's first click and the owner's second week. Two loops had to close. The visitor loop: someone arrives, asks a question, and the owner sees it. The owner loop: the owner sees the question, fills the gap in the knowledge base, and the next visitor gets a better answer. Every design decision I made served those two loops.

One honest constraint up front. My own product metrics file sets targets of 60% wizard completion, 8% day 7 free to Pro conversion, 12% day 30, and $1,500 MRR by month 6. Those are targets. The weekly log next to them is empty, and my October 2026 UX review of the product states plainly that it had been polished for months with zero paying users. Nothing in this case study claims a growth number I cannot point at.

## What was actually blocking use

I ran the flow myself and wrote down what broke before I looked for dashboards. The wizard had no funnel instrumentation at all. profile_events records view, chat, hit_wall, and gap against a hosted profile, but nothing records signup, step completion, or drop off.

My first run notes, March 2026, are the source. After generation I did not know what to do next. The dashboard offered photo, bio, slug, links, and a knowledge tab, while the thing I had just built sat one hop behind a View live profile link. The code confirms it: public/js/output.js:155 redirects to /dashboard?new=1, and public/js/dashboard.js:327-338 renders a text alert that auto hides after 8 seconds rather than the profile itself. The user invests 30 to 45 minutes and lands on a settings page.

Buttons were lying to me too. The suggested prompt pills on the profile page did nothing when clicked. The chat box did not send. The Upgrade to Pro button in analytics did nothing. Gated features that should have been locked instead accepted the click and returned an error string, so a paywall looked like a bug.

The interview also had a hidden price tag. My own meta description says Answer 20 questions. The real finish line is 8 answers, hard coded as READY_THRESHOLD in public/js/interview.js:18, where 8 answers reads as Enough for a solid profile. The landing page says 20 to 30 exchanges and 30 to 45 minutes. The bottom CTA says under an hour. Six numbers for one product, and no instrumented funnel to tell me which one was killing the flow.

## What I designed

Shipped and in production now:

**A progress device that ends the interview early.** The profile strength meter fills as answers accumulate, a tray shows what the profile can now speak to, and at 8 answers the Generate button promotes itself to a pulsing primary with a toast. The comment in public/js/interview.js:376 states the intent: about 8 solid answers already make a generate ready profile, so the meter ramps to 85% by then and eases toward 100%. This turns 20 advertised questions into a reachable finish line, and gives a first time user something to look at while they type.

**Upload promises that match server enforcement.** Upload limits used to live as a flat client constant, so a Pro user was capped at 3 files. They now come from one place, worker/src/lib/tier-limits.js, and the wizard fetches the truth from GET /api/session/limits. The live endpoint returned {"tier":"free","maxFiles":3} when I checked it. The same fix shipped a per file extraction breakdown and an amber badge for scanned PDFs where almost no text could be read, so a silent OCR failure surfaces at upload instead of becoming a hollow profile three steps later.

**A retention loop built on the owner's own gaps.** When a visitor asks something the knowledge base cannot answer, the question is logged as a gap event and surfaced at /api/analytics/:slug/gaps. That turns an unanswered visitor question into a work item for the owner. Around it sit the habit triggers: milestone emails when the chatbot passes 15 and then 50 answered questions (worker/src/routes/chat.js:260), a re engagement email 30 days after creation for profiles with zero visitors (worker/src/routes/cron-lifecycle.js:32), and a 90 day inactivity expiry with 30, 7, and 1 day warnings. Free owners get a teaser of their weekly question count; Pro owners get views, chats, derived bounces, hit wall rate, and top topics.

Designed, specified, not yet shipped:

**Ingest first instead of a wall.** The company knowledge base prototype renders 8 required intake fields plus 11 interview questions as 19 textareas on a single page, then prints shell commands for the user to run. My October 21 spec makes value arrive before the wall: ingest the owner's site, show what was learned as editable cards with a source chip and a confidence tag, ask only the remaining gaps one at a time, and finish with one button that runs the pipeline server side. The spec estimates 19 textareas becoming roughly 7 interview moments for a company that publishes an FAQ. That is an estimate, not a measurement.

## What I'd change

I would ship the post generation handoff first. Show the finished profile, a share card, and the shareable link instead of a settings page. The review estimates 2 to 4 hours and I agree. Every other fix is worth less if the user never sees the artifact they just made.

Second, a copy coherence pass. The interview should say 8 to 14 answers, or the meta should say 20. Six numbers across six surfaces reads as a company that does not know its own product.

Third, wizard funnel instrumentation, which does not exist. I cannot currently answer which step loses people, so activation work today is reasoning from my own first run notes rather than from data. That is the weakest part of this product and it is a measurement gap, not a design gap.

Fourth, the paywall. Locked features should be visibly locked with a price, not error strings. And I would cut the hand animated fake chat on the landing page that competes with the real live demo two sections above it.

## Growth read

Distills is not a funnel, it is a distribution loop. Every free owner ships a widget that answers questions on their own site, and the widget carries a Built with Distills badge unless they pay. The artifact distributes the product to the exact audience most likely to need it, which is why the free tier downloads rather than removes the hosted path. The hosted profile is the utility that makes the badge worth carrying.

Three expansion steps sit on top of that loop. Free to Pro sells the hosted URL and the analytics behind it. Pro to Career sells job description mode, role specific profile URLs, and up to 10 job targets, which turns a profile into a job application tool. Live prices as of 2026-10-23 are $16.58 a month billed as one $199 annual payment for Pro, and $33.25 billed as $399 for Career, with the annual framing shown as the default. The $24 Pro and $49 Studio figures in my business analysis are planning numbers, not what the site charges. The third step is the company knowledge base, which turns one user into one company and introduces a monthly maintenance relationship instead of a one time download.

I would measure three things, in this order: wizard completion through to a live shared profile, week 4 return rate for owners who have at least one answered visitor question, and free to paid conversion split by whether the owner received a gap notification. The gap notification is the activation event I trust, because it is the moment the product becomes useful to someone other than the owner. None of the three are measured yet.

The demand gate for the company knowledge base is running and resolves around October 26. It passes on money adjacent commitment: 3 of 10 discovery owners take ongoing maintenance, at least 5 of 10 cold, at least 2 verticals, and at least 1 undiscounted $149 take. The original criterion, owners surfacing the problem unprompted, was retired because a Reddit probe found 0 of 49 sampled owner threads articulating agent facing demand. I would rather hold a smaller measured number than keep a flattering one.

## Sources

- Landing page promise, pricing, and the six conflicting time and answer numbers (the "Answer 20 questions" meta is index.html:10): https://distills.app/ and /Users/michaeljones/Dev/distill-app/public/index.html
- Post generation redirect to settings: /Users/michaeljones/Dev/distill-app/public/js/output.js:155 and public/js/dashboard.js:327
- 8 answer finish line, strength meter, knowledge tray, milestone and gap mechanics: /Users/michaeljones/Dev/distill-app/public/js/interview.js:18, :369-450
- Tier limits and the limits endpoint: /Users/michaeljones/Dev/distill-app/worker/src/lib/tier-limits.js, /Users/michaeljones/Dev/distill-app/worker/src/routes/session.js, live GET https://distills.app/api/session/limits
- Milestone and lifecycle emails: /Users/michaeljones/Dev/distill-app/worker/src/routes/chat.js:260, worker/src/lib/email.js:152, worker/src/routes/cron-lifecycle.js:32
- Gap and analytics event model: /Users/michaeljones/Dev/distill-app/worker/src/routes/analytics-gaps.js, worker/src/routes/analytics.js, worker/src/schema.sql
- My own first run notes on what broke: /Users/michaeljones/Dev/Obsidian/Mike_Thinking_Space/Distills/Testing/Testing 2026-03-12.md
- UX review stating zero paying users, the post generation leak, and the copy drift: /Users/michaeljones/Dev/Obsidian/Mike_Thinking_Space/Distills/Re-evaluation/2026-10-12/30-uiux-review.md
- Ingest first and one click finish spec, including the 19 textarea wall and the 7 moment estimate: /Users/michaeljones/Dev/Obsidian/Mike_Thinking_Space/Distills/Plans/2026-10-21-prototype-landing-and-flow-redesign-spec.md
- Target metrics and the empty weekly log: /Users/michaeljones/Dev/Obsidian/Mike_Thinking_Space/Distills/Distills Product Metrics.md
- Gate criteria, 0 of 49 Reddit probe, pricing ladder, career disposition: /Users/michaeljones/Dev/Obsidian/Mike_Thinking_Space/KB/business/distills.md and /Users/michaeljones/Dev/distills-prototype/offer.json


## What I would measure next

1. Wizard completion through to a live shared profile. No funnel events exist for it, so the four missing events (signup, upload complete, interview complete, generate) have to land before there is anything to read.
2. Week 4 return rate for owners with at least one answered visitor question. That is the number that says whether the gap loop became a habit or fired once.
3. Free to paid conversion split by whether the owner ever received a gap notification. The whole thesis rests on that notification being the activation trigger, which makes this the single most load-bearing missing metric.
4. Minutes from account creation to the first answered visitor question. Today that is an estimate from landing copy, not a measured distribution.
5. Whether any gap notification has ever produced a knowledge base edit, and the lag between the two. If owners ignore the gap list, the retention loop is decorative.

## Scope and status

- The portfolio leads with the shipped career product at distills.app, not the company knowledge base prototype. They are different products at different maturity, and one narrative is stronger than two.
- Pricing is settled: Free at $0, Pro at $16.58 a month billed as one $199 annual payment, Career at $33.25 a month billed as one $399 annual payment. That is what the live site charges today.
- Three design items in this document are specified and unbuilt: the ingest-first interview, one-click finish, and a landing page at the production bar. No code has been touched in either repo for any of them, and the case study calls them designs rather than shipped work.

## Still open

- Which of those three unbuilt items to build first, and whether the interview should shrink before the landing page gets rebuilt.
