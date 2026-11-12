/**
 * The instruments — what the loops are actually built out of.
 *
 * Edited by hand, and it should stay short: a stack list that grows past a
 * screen is a shopping problem, not an architecture. Every entry earns its
 * place by doing something no other entry on the list does; the `why` line is
 * the tradeoff, not the pitch.
 *
 * Deliberately not generated from config: a nightly build that adds whatever
 * happened to be installed would turn this into an inventory. This is the
 * short list I would defend.
 */

export type Instrument = {
  name: string;
  where: string;
  job: string;
  why: string;
  href?: string;
};

export type Layer = {
  title: string;
  note: string;
  items: Instrument[];
};

export const layers: Layer[] = [
  {
    title: "The agent",
    note: "one system, three surfaces",
    items: [
      {
        name: "Hermes Agent",
        where: "always-on host · this desktop",
        job: "Runs the scheduler, holds the profiles, the skills and the board. Every loop on this site is a job it fires; every page here is written by it.",
        why: "One process that owns state, so cron, notes and the board cannot disagree about what happened.",
      },
      {
        name: "Conduit",
        where: "iPhone",
        job: "The same system from a phone: boards for reading, chat for asking, and a queue that survives losing signal.",
        why: "Review happens away from the desk. A system you can only inspect sitting down gets inspected rarely.",
      },
    ],
  },
  {
    title: "The record",
    note: "the brain is a folder",
    items: [
      {
        name: "Obsidian",
        where: "this machine",
        href: "/system/vault/",
        job: "The vault: decisions, notes, the knowledge base the loops read and write. If a loop learns something, this is where it lands.",
        why: "Markdown in a folder — no database, no vendor, no export step. Greppable by the agent and readable by me in ten years.",
      },
    ],
  },
  {
    title: "The models",
    note: "rented and owned",
    items: [
      {
        name: "Ollama",
        where: "cloud · own GPU",
        job: "The daily driver. Cloud models for the volume of loop work, local models on the GPU box for anything that must not leave the network.",
        why: "One interface for rented and owned compute, so a loop can move between them without being rewritten.",
      },
      {
        name: "Claude",
        where: "cloud",
        job: "The long-reasoning seat: planning, editing, and the design reviews that come back as findings rather than compliments.",
        why: "Called when the answer has to survive being argued with, not when the answer is bulk.",
      },
      {
        name: "ChatGPT",
        where: "cloud",
        job: "The second opinion, and the image work. Used where a disagreement is worth more than a confirmation.",
        why: "A different house disagrees differently. Two models that agree is a data point; one model agreeing with itself is not.",
      },
    ],
  },
  {
    title: "The builders",
    note: "delegated, then reviewed",
    items: [
      {
        name: "Claude Code",
        where: "this machine",
        job: "Implementation, delegated: one task, one directory, a written brief, a diff that comes back for review.",
        why: "Holds a codebase in context long enough to finish a change instead of describing one.",
      },
      {
        name: "Codex",
        where: "this machine",
        job: "A second coding agent, running in parallel on an unrelated task.",
        why: "Two tasks do not queue behind one context window. Parallel agents only work when the briefs are written down — which is the real constraint.",
      },
    ],
  },
  {
    title: "The hand",
    note: "speech is the input method",
    items: [
      {
        name: "Wispr Flow",
        where: "desktop · phone",
        job: "Speech to text, everywhere. Most of what is on this site was spoken first — a brief, a correction, a paragraph while walking.",
        why: "Typing is the bottleneck on thinking aloud. Not an accessibility feature here: the reason a brief can be four paragraphs instead of four words.",
      },
    ],
  },
  {
    title: "The plumbing",
    note: "CLI, no dashboards",
    items: [
      {
        name: "himalaya · icalBuddy · gh · ffmpeg",
        where: "this machine",
        job: "Mail, calendar, source control, media. Read and written by the agent through the shell, never through a web app.",
        why: "Anything a loop has to check needs to be a command that returns text, or the loop cannot close.",
      },
      {
        name: "Telegram",
        where: "cloud",
        job: "Delivery. Every loop that has something to say sends it here, and a reply comes back as the next instruction.",
        why: "The notification and the control surface are the same thread, so answering a ping is the same act as steering the job.",
      },
      {
        name: "Astro · Cloudflare Pages",
        where: "cloud",
        job: "This site: static pages built from the same generated data the loops produce, deployed on push.",
        why: "The site is an output of the system, not a thing maintained beside it. If the pages can drift from the data, they will.",
      },
    ],
  },
];

export const instruments = layers.flatMap((l) => l.items);
