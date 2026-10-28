---
title: "Distills: turning a knowledge product into a returning habit"
slug: distills
kind: case-study
short: Distills
tag: "distills.app"
status: "live, zero paying users"
rowTitle: "Distills: turning a knowledge product into a returning habit"
diag: "The interview had a hidden price tag, and nothing brought the owner back."
navMark: "live, zero paying users"
position: "Distills is not a funnel, it is a distribution loop."
ledger: ["knowledge product at distills.app", "live, zero paying users", "Pro $199 / Career $399 annual (2026-10-23)", "embeddable answer widget + knowledge base"]
---

# Distills: turning a knowledge product into a returning habit

## The problem

Distills (distills.app) turns a person's career documents into a hosted page that answers questions about them. A visitor opens distills.app/c/mike-jones, asks what he has shipped, and gets an answer in my own words from my own files, without emailing me.

The only input is an interview. The owner answers questions about their work, and each answer becomes something the page can later speak to.

So the loop is the product: a visitor asks, the owner fills the gap, the next visitor gets a better answer. That loop needs an owner who comes back, and the product did nothing to bring them back.

My targets were 60% wizard completion, 8% day-7 conversion to Pro, and $1,500 MRR by month six. The log beside them is empty. My October 2026 review of my own product: polished for months, zero paying users.

## What was actually blocking use

I ran the flow as a new user. Two things were wrong before anyone could judge the output.

The interview had a hidden price tag. The meta description promises twenty questions. In practice the product wrapped up sooner, because a hard-coded finish line decided I was done at eight answers. The landing page said thirty to forty-five minutes, and the button at the bottom of that page said under an hour. Three promises, and the person answering has no idea which one is true.

Nothing explained why I was being asked. Walking in, there was no sense of what the interview was for, what a good answer would buy me, or what the page would do with it. A career was being turned into a questionnaire nobody agreed to.

And after the AI finished, the product dropped me on a settings page instead of the profile it had just built. The one thing I came for was the one thing I did not see.

None of it is measured. Views, chats, and wall hits are recorded. Signup, step completion, and where people leave are not.

## What I designed

**A finish line you can see.** A strength meter fills as answers accumulate, a tray lists what the profile can now speak to, and at eight solid answers the Generate button becomes a pulsing primary. The person being interviewed can tell when they are done instead of guessing.

**Upload limits that tell the truth.** The file cap lived in the browser while the server enforced something stricter, so a paying customer could hit a three-file wall with no warning and no explanation. The limit is now server-owned and shown before upload, so there is no surprise rejection and a wall that states a number.

**A reason to come back that is not a nag.** When a visitor asks something the profile cannot answer, the question is handed to the owner as a work item, and filling it makes the next answer better. Around that sit milestone emails at fifteen and then fifty answered questions, a reminder at thirty days if nobody has visited, and profiles that expire at ninety.

## What I'd change

Show the finished profile first. A new owner should land on the page they just built, with a share card and a link, not a settings screen. The review estimates two to four hours between generation and a profile anyone sees, and nothing else matters if nobody gets that far.

Make the copy agree with itself, and put a price on the wall. Eight to fourteen answers, or twenty. A locked feature should say what it costs instead of returning an error.

Instrument the wizard. Without it I cannot say which step loses people, so the activation work here rests on one person's run.

## Growth read

Distills is not a funnel, it is a distribution loop. Free at $0, and every owner ships a widget that answers questions on their own site, carrying a Built with Distills badge unless they pay. The free tier spreads the hosted path instead of replacing it.

Free to Pro sells the hosted URL and the analytics behind it. Pro to Career adds job description mode, role-specific profile URLs, and up to ten job targets. As of 2026-10-23, Pro is $16.58 a month billed as one $199 annual payment, and Career is $33.25 a month billed as one $399 annual payment.

I would measure completion through to a live shared profile, week-four return for owners who got an unanswered question, and conversion split by whether the owner got a gap notification. That notification is the activation event I trust, and none of the three are measured yet.

## Sources

- The twenty-question meta, the thirty to forty-five minute claim, the under-an-hour button, and the annual prices, read 2026-10-23: https://distills.app/
- The eight-answer finish line, the strength meter, and the post-generation handoff to a settings page: my own run of the live flow plus the October 2026 UX review at `/Users/michaeljones/Dev/Obsidian/Mike_Thinking_Space/Distills/Re-evaluation/2026-10-12/30-uiux-review.md`
