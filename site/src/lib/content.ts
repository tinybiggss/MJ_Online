/**
 * Single source of truth for site content.
 * Facts verified against the RAG knowledge base (Cowork/content/rag/knowledge.jsonl)
 * and the Obsidian vault. All three design directions import from here so copy
 * stays consistent. Keep terminology aligned with CLAUDE.md standards.
 */

export const identity = {
  name: "Mike Jones",
  title: "AI Implementation Expert & LLM Integration Specialist",
  company: "Jones Collaboration Company, LLC",
  location: "San Jose, CA — serving everywhere",
  email: "mike@mikejones.online",
  tagline: "I help people and organizations operate at the intersection of AI, autonomy, and resilience.",
  // Short positioning line used in heroes
  heroLead: "29 years building systems that ship —",
  heroEmphasis: "now making AI actually work inside organizations.",
  intro:
    "For nearly three decades I've shipped products and led teams at the edge of what technology makes possible — from the launch of the original Xbox to AI-augmented operating models today. I turn fast-moving AI capability into systems people can actually run.",
};

export const stats = [
  { value: "29", unit: "yrs", label: "in tech, since 1997" },
  { value: "120+", unit: "", label: "largest team led" },
  { value: "$12M+", unit: "", label: "budgets managed" },
  { value: "6", unit: "", label: "AAA game launches" },
  { value: "1", unit: "", label: "patent (Xbox SDK)" },
  { value: "Top 1%", unit: "", label: "ChatGPT user globally" },
];

/** The venture ecosystem — the spine of the portfolio. */
export const ventures = [
  {
    key: "velocity",
    name: "Velocity Partners",
    role: "Consulting",
    tagline: "Making AI actually work inside organizations.",
    description:
      "Fractional PMO + AI implementation for teams that need AI to move from demo to dependable. Built on AAPD — AI-Augmented Process Design.",
    status: "Active",
    accent: "indigo",
    href: "https://velocitypartners.io",
  },
  {
    key: "ghn",
    name: "Get Hired Now Academy",
    role: "Teaching",
    tagline: "AI & Claude Code courses for senior career-changers.",
    description:
      "A teaching partnership with Ron Nash's GHN Academy — helping directors and VPs build AI fluency and reposition their expertise. Course series launching July 2026.",
    status: "Launching Jul 2026",
    accent: "amber",
    href: "https://gethirednowprograms.com/",
  },
  {
    key: "resilient",
    name: "Resilient Tomorrow",
    role: "Publishing",
    tagline: "Practical resilience for people exiting the default.",
    description:
      "A publication and growing community on building parallel systems — 1,000+ subscribers, organized around a 7 Pillars framework. Top essay: \"7 Steps to Quietly Exit a System\" (1,000+ likes).",
    status: "1,000+ subscribers",
    accent: "forest",
    href: "https://resilient-tomorrow.com",
  },
  {
    key: "distills",
    name: "Distills",
    role: "Product",
    tagline: "Your career, as an interactive AI.",
    description:
      "An AI SaaS that turns your career documents into a chatbot that fields recruiter and hiring-manager questions. The assistant on this very page is powered by it.",
    status: "Heading to Product Hunt",
    accent: "cyan",
    href: "https://distills.app",
  },
];

/**
 * Things Mike has built — proof of hands-on depth.
 * `group` drives the Work page sections; `featured` surfaces on the home page.
 * `img` is optional — cards render text-forward when there's no real screenshot
 * (no colored-block placeholders, per the design system).
 */
export interface Project {
  name: string;
  group: "AI Systems & Agents" | "Infrastructure & Self-Hosting" | "Community & Real-World";
  blurb: string;
  tags: string[];
  img?: string;
  /** Transparent-background diagram — render on white, contained (not cropped). */
  diagram?: boolean;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    name: "Corvus",
    group: "AI Systems & Agents",
    blurb:
      "A persistent personal AI agent — semantic memory on local Ollama embeddings, hybrid Python + LLM execution, and cron-driven daily briefings. Privacy-first, runs on a Mac Mini.",
    tags: ["Agent orchestration", "Local embeddings", "Python", "Memory design"],
    featured: true,
  },
  {
    name: "AI Memory System",
    group: "AI Systems & Agents",
    blurb:
      "A cross-AI, JSONL-based memory layer that gives Claude, ChatGPT, and local models shared, persistent context across tools.",
    tags: ["RAG", "JSONL", "Context engineering"],
    img: "/img/projects/offline-ai-workflow.png",
    diagram: true,
    featured: true,
  },
  {
    name: "OfflineAI / Local LLM",
    group: "AI Systems & Agents",
    blurb:
      "A privacy-first, self-hosted LLM stack — Ollama, OpenWebUI, and an MCP bridge, auto-starting and always on.",
    tags: ["Ollama", "Self-hosted", "MCP"],
    img: "/img/projects/offline-ai-architecture.png",
    diagram: true,
    featured: true,
  },
  {
    name: "Mission Control",
    group: "AI Systems & Agents",
    blurb:
      "An operations dashboard for a fleet of AI agents, with ADHD-aware UX — a \"Three Things\" focus widget, brain-dump triage, and a signal-filtered activity feed.",
    tags: ["Dashboard UX", "Agent ops", "Signal-to-noise"],
  },
  {
    name: "Agent Executive Suite",
    group: "AI Systems & Agents",
    blurb:
      "A multi-agent org structure — a chief-of-staff agent plus ops, sales, and product agents coordinating across every venture.",
    tags: ["Multi-agent", "Org design", "Delegation"],
  },
  {
    name: "Apollo Media Server",
    group: "Infrastructure & Self-Hosting",
    blurb:
      "A fully self-hosted media stack — Jellyfin, Radarr/Sonarr automation, VPN kill-switch, mergerfs storage, Tailscale remote access — documented so anyone can run it.",
    tags: ["Docker", "Linux", "Storage architecture", "VPN"],
  },
  {
    name: "Local Voice Control",
    group: "Infrastructure & Self-Hosting",
    blurb:
      "A privacy-first home voice system — Home Assistant + Wyoming with on-prem speech, routing deterministic commands locally and complex queries to a local LLM.",
    tags: ["Home Assistant", "Wyoming", "Local LLM", "Privacy by design"],
  },
  {
    name: "Home Solar Array",
    group: "Community & Real-World",
    blurb:
      "A DIY-designed residential solar + 32 kWh battery system — full energy modeling, structural and permitting work, phased rollout, at a fraction of installer cost.",
    tags: ["Energy modeling", "Systems design", "Permitting"],
  },
  {
    name: "NeighborhoodShare",
    group: "Community & Real-World",
    blurb:
      "A neighbor-to-neighbor tool-sharing platform — AI-assisted cataloging, 170 users across 20 communities, now pivoting to library partnerships for distribution.",
    tags: ["React", "GPT-4o Vision", "Go-to-market"],
    img: "/img/projects/neighborhoodshare-home.png",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export const projectGroups = [
  "AI Systems & Agents",
  "Infrastructure & Self-Hosting",
  "Community & Real-World",
] as const;

/** A distinctive thread Mike is developing — AI as executive-function support. */
export const adhd = {
  title: "AI as executive function",
  lead: "Using AI to work with an ADHD brain, not against it.",
  body:
    "I'm building — and living in — a system that externalizes memory, makes time visible, and reduces the friction between intention and action. Corvus captures and triages; daily briefings surface the one next thing; AI handles the mechanics so attention goes where it matters. It's resilience at the scale of a single mind, and it's becoming a framework I want to teach.",
  tags: ["Executive function", "Neurodivergent UX", "Applied AI"],
};

/** Career milestones for the "Operator" timeline / résumé strip. */
export const career = [
  { years: "2023–", org: "Velocity Partners", what: "Founder — AI implementation & fractional PMO" },
  { years: "2022–", org: "Independent R&D", what: "OfflineAI, Resilient Tomorrow, NeighborhoodShare" },
  { years: "2020–22", org: "Kinoo", what: "Principal Technical Program Manager — AR family comms (CES Innovation Award)" },
  { years: "2017–20", org: "8 Circuit Studios", what: "Co-founder / CTO — Web3 gaming" },
  { years: "2009–15", org: "Livescribe · Kabam · Disney Interactive", what: "Director-level roles — gaming & connected hardware" },
  { years: "1999–2009", org: "Microsoft — Xbox & Xbox 360", what: "Launch teams, 6 AAA titles, SDK patent" },
];

/** Resilient Tomorrow's 7 Pillars — featured in the Groundwork direction. */
export const pillars = [
  "Food Sovereignty",
  "Energy Autonomy",
  "Local Wealth Systems",
  "Knowledge Stewardship",
  "Communication Independence",
  "Mutual Aid",
  "Hyperlocal Community",
];

export const nav = [
  { label: "Work", href: "/work" },
  { label: "Writing", href: "/writing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
