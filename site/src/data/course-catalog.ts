/**
 * GHN AI Fluency Lab — candidate course catalog.
 *
 * Source: Course/Week 3/2026-08-19-Run-of-Show.md, "Block 4: Course Catalog".
 * The run-of-show numbering was inconsistent (started at 6, duplicate 11/12/35,
 * gaps at 20/24), so items are renumbered here 1..46 and keyed by a stable slug.
 * The slug is what gets stored — renumbering later won't orphan past responses.
 *
 * To add a topic: append to the right group. Nothing else needs to change.
 */

export interface CourseTopic {
  id: string;
  title: string;
  blurb: string;
}

export interface CourseGroup {
  name: string;
  topics: CourseTopic[];
}

export const COURSE_GROUPS: CourseGroup[] = [
  {
    name: "Build & Ship",
    topics: [
      { id: "vibe-coding", title: "Vibe-Coding a Product End-to-End", blurb: "Ship something real, start to finish." },
      { id: "rag-system", title: "Build a RAG System (4 Levels)", blurb: "From JSONL keyword search to agentic multi-step." },
      { id: "rag-evaluation", title: "RAG Evaluation", blurb: "The retrieval triad: context relevance, groundedness, answer relevance." },
      { id: "structured-interview-prompt", title: "Designing the Structured Interview Prompt", blurb: "Extract tacit knowledge, not facts." },
      { id: "prompt-evaluation", title: "Prompt Evaluation", blurb: "Treating prompts like code you can regression-test." },
      { id: "chunking-strategy", title: "Chunking Strategy", blurb: "Why the wrong chunk size makes your knowledge base invisible." },
      { id: "apis-with-llms", title: "Using APIs with LLMs", blurb: "Keep AI outputs current without re-interviewing." },
    ],
  },
  {
    name: "Privacy, Sovereignty & Personal Stack",
    topics: [
      { id: "privacy-sovereignty", title: "Privacy & Sovereignty", blurb: "Migrate off the major platforms, one piece at a time." },
      { id: "second-brain", title: "Your Second Brain", blurb: "A memory system that survives your next tool migration." },
      { id: "memory-architectures", title: "Memory Architectures Across Tools", blurb: "JSONL, Obsidian, plain markdown — what actually works." },
      { id: "open-weights-locally", title: "Open-Weights Locally", blurb: "What runs on your laptop, what doesn't, when the cloud still wins." },
    ],
  },
  {
    name: "Skills, Plugins & Extending the Model",
    topics: [
      { id: "skills-plugins-connectors", title: "Skills, Plugins, Connectors (oh my!)", blurb: "Extend what your AI can actually do for you." },
      { id: "personal-agent", title: "Your Own Personal Agent", blurb: "Where to start building something that works for you." },
    ],
  },
  {
    name: "Research & Strategy",
    topics: [
      { id: "research-techniques", title: "Effective Research Techniques", blurb: "Get AI to actually dig, not just guess." },
      { id: "reading-model-releases", title: "Reading Model Releases Critically", blurb: "When a vendor says “30% better on benchmark X.”" },
      { id: "build-vs-buy", title: "Build-vs-Buy for AI", blurb: "When to use a hosted API vs. self-hosted open weights." },
    ],
  },
  {
    name: "Evaluation & Testing",
    topics: [
      { id: "how-to-read-a-benchmark", title: "How to Read a Benchmark", blurb: "N, variance bars, methodology, cherry-picking. The Week 3 deep-dive." },
      { id: "running-your-own-eval", title: "Running Your Own Eval — Deep Dive", blurb: "Pick a use case, build a 20–50 example set, compare models." },
      { id: "third-party-eval-orgs", title: "Third-Party Eval Orgs", blurb: "Stanford HELM, MLCommons, Hugging Face — who to trust." },
    ],
  },
  {
    name: "Security & Risk",
    topics: [
      { id: "sandboxing-agents", title: "Sandboxing Agents Before Deployment", blurb: "Isolated environments, worst-case prompts first." },
      { id: "agent-security", title: "Security Around Your Own AI Agents", blurb: "Auth, scopes, secrets, audit logging, blast-radius limits." },
      { id: "red-teaming-agents", title: "Red-Teaming Your Agents", blurb: "Assign someone whose only job is to break your agent." },
      { id: "containment-blast-radius", title: "Containment & Blast-Radius Design", blurb: "Permissions, kill switches, guardrails." },
      { id: "agent-coordination-failures", title: "Agent Comms & Coordination Failure Modes", blurb: "Multi-agent shared state, conflict resolution." },
    ],
  },
  {
    name: "Product & Workflow",
    topics: [
      { id: "product-principles", title: "Product Principles for Your Workflow", blurb: "Borrow what product teams already use." },
      { id: "agentic-dev-workflow", title: "Agentic Development Workflow", blurb: "Development with a team of agents." },
      { id: "prototype-vs-live", title: "Prototype vs. Live Product", blurb: "Know the line, know what it takes to cross it." },
      { id: "quarterly-ai-reviews", title: "Quarterly AI Strategy Reviews", blurb: "Annual planning is now stale by Q3." },
      { id: "ai-procurement-contracts", title: "Building AI Flexibility into Procurement Contracts", blurb: "Short terms, opt-out clauses, no lock-in." },
      { id: "vendor-watch-dashboard", title: "Building a Vendor-Watch Dashboard", blurb: "Lightweight monitoring of model releases." },
    ],
  },
  {
    name: "Technical Dives",
    topics: [
      { id: "deeper-technical-dives", title: "Deeper Technical Dives", blurb: "GitHub, deployments, databases, using an LLM API." },
      { id: "multi-model-orchestration", title: "Multi-Model Orchestration", blurb: "Different models for spec vs. plan vs. implementation." },
      { id: "spec-as-living-document", title: "Spec as a Living Document", blurb: "Keeping it accurate as the project evolves." },
      { id: "local-model-stack", title: "Building a Local-Model Stack End-to-End", blurb: "Ollama + a small model + an interface. Hands-on." },
      { id: "hugging-face-checkpoints", title: "Open-Model Checkpoints on Hugging Face", blurb: "Reading a model card, swapping models safely." },
    ],
  },
  {
    name: "Specific Workflows & Deliverables",
    topics: [
      { id: "sdd-non-technical", title: "Spec-Driven Development for Non-Technical Deliverables", blurb: "Board memos, PR strategies, email sequences." },
      { id: "email-sequences", title: "Email Sequences with AI", blurb: "Welcome / activate / convert / retain / refer, end-to-end." },
      { id: "board-memos", title: "Board Memos with AI", blurb: "Requirements / context / intent for one-shot writes." },
      { id: "pr-strategies", title: "PR Strategies with AI", blurb: "Coordinating multi-channel launches against a shared spec." },
      { id: "content-detection-disclosure", title: "AI Content Detection & Disclosure", blurb: "Watermarks, C2PA, SynthID, policy." },
    ],
  },
  {
    name: "Industry & Future",
    topics: [
      { id: "trust-vs-escalate", title: "When to Trust a Model and When to Escalate", blurb: "The 99% / 1% boundary." },
      { id: "cost-aware-evaluation", title: "Cost-Aware Evaluation", blurb: "When two models score within a point, the tiebreaker is cost." },
      { id: "eval-drift", title: "Eval Drift Over Time", blurb: "Models update, your eval set stays the same." },
      { id: "legal-landscape-disclosure", title: "The Legal Landscape for AI Disclosure", blurb: "What's the actual rule in your industry?" },
      { id: "eval-as-product", title: "Eval-as-Product", blurb: "How Scale, Surge, and Hugging Face built businesses on this." },
      { id: "claude-certification", title: "Claude Certification", blurb: "Preparing for and passing the certification." },
    ],
  },
];

export const MAX_PICKS = 10;

export const ALL_TOPICS: CourseTopic[] = COURSE_GROUPS.flatMap((g) => g.topics);
