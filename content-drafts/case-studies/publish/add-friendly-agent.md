---
title: "ADD-Friendly Agent: Turning a Book Into an Agent Protocol"
slug: add-friendly-agent
kind: case-study
short: ADD-Friendly Agent
tag: "agent system"
status: "29 runs, one user"
rowTitle: "ADD-Friendly Agent: turning a book into an agent protocol"
diag: "Advice that depends on remembering to apply it is advice for a brain that is not asking."
navMark: "29 consecutive runs, one user"
position: "Where it breaks is the seam between the agent and the human, and the fix repeats: move the action to where the data lives."
ledger: ["agent protocol and installed skill", "29 consecutive runs, one user", "31 protocols: 21 solo, 9 assisted, 1 human", "runs in 8 agent roles"]
---

# ADD-Friendly Agent: Turning a Book Into an Agent Protocol

## The problem

The book is *ADD-Friendly Ways to Organize Your Life* (Kolberg and Nadeau, Routledge, 2nd edition, 2017). Its argument is that strategies fail without structure and support. I have ADHD, I read it, and I used none of it. Advice that depends on remembering to apply it is advice for a brain that is not asking.

So I built the structure and the support as software: an agent protocol that runs on a schedule, reads my own task data, and puts things where I already am.

I am the subject because I am the test case, not because my week is interesting. The question I could not answer anywhere is this: how do you build an ADHD workflow that keeps you on top of what you owe while you are just trying to get through the day?

Every answer I found assumed someone who remembers to check the system, and that person does not need it. Once this holds on me unattended, it becomes a plug-in other people can run on their own bad days.

## What was actually blocking use

I built 31 protocols, sorted by how much support each assumes: 21 you do alone, 9 with an agent's help, 1 that needs another person. Then I wired them to a nightly shutdown and a Sunday review and ran it for four weeks. The protocol text was never the problem.

The ritual held and the handoff did not. My October 4 review found zero completions in ten straight days. Preparing tomorrow's list was the agent's job. Starting it was mine, and a note in a file is not a reason to start.

The commitments ledger sat with no rows for 27 days while the reviews typed real commitments out by hand. A repair was proposed twice and waited a week for approval.

Dollar figures collapsed three times, arriving as 9 to 49 where the number was $99 to $149, because the text passed through a layer that reads a dollar sign as a variable. One nightly run gave up after five failed attempts to read my own files and said so plainly instead of guessing.

None of these are discipline failures. Each is a place where the system asked a person to do something the machine could have done.

## What I designed

**Open with the hot spot, never the backlog.** A session reads a hot spot of five items at most, pulls anything due inside 24 hours to the front, and presents three. Anything I mention mid-task gets one line into the master list so I never have to hold it.

**A 9pm shutdown and a Sunday review.** The shutdown saves state, updates the list, stages tomorrow's first three, and logs one fact. The Sunday review covers the ledger, the queue, the wins, and one repair. Both run unattended and both write down what they did.

**A hard block instead of a reminder.** Every re-staging raises an item's counter, and at three on a priority item it gets promoted into the morning's first three whether I like it or not. The system escalates by moving the item instead of nagging me.

**A completion claim is not a completion.** Saying an item is done opens a check. The shutdown looks for the artifact and reopens the card with what it found attached.

**Move the record to where the work already is.** The ledger fills itself from the master list, one row per commitment, with no separate logging step. It went from zero rows to 21 in two days.

## What I'd change

The quarterly review has never run. The protocol defines it and no job is scheduled. I have not completed a quarter with this system, so there is nothing to review and nothing honest to say about whether it earns its place. That is an absence of data, not a decision against it.

The skill and its installed copy have drifted apart, and two documents still describe an older count of protocols. Version drift is how this kind of system dies, quietly, one stale copy at a time.

And the adoption number is one. Eight agents run the protocol for me, and nobody outside these walls uses it.

## Growth read

The rituals hold: 29 consecutive unattended shutdown runs with no gaps, and 36 dated log entries across 28 days. What breaks is the seam between the agent and the human, and the fix is the same every time. Move the action to where the data already lives.

The protocol runs across eight agent roles, one per job: product, design, dev lead, content, finance, marketing, operations, and release. Same protocol, same data, a different seat. That is the shape a plug-in would have.

I would bring failure-path thinking to the product side. Anthropic's products get used on good days by most people and on bad days by some, and onboarding quietly optimizes away the people on bad days. A protocol built on repairing the system instead of the person is the thing I want when someone else's bad day arrives.

## Sources

- `PROTOCOLS.md` in `/Users/michaeljones/Dev/add-friendly-agent/` for the 31 protocols, the three support levels, and the quarterly review
- `data/log.md` in the same repo for 36 dated entries from September 24 to October 21, including the ten-day zero-completion finding and the auto-log of October 21
- `~/.hermes/cron/output/577137c655f2/` for 29 shutdown runs, including the one that stopped after five failed reads
