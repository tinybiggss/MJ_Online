#!/usr/bin/env node
/**
 * kb-to-rag.mjs — Publication-layer adapter: KB → Distills RAG (pilot leg)
 *
 * Reads the KB compiled-claims markdown in the Obsidian vault directly (no
 * content duplication) and chunks it into the distill RAG JSONL schema that
 * mj-chatbot-backend ingests (knowledge.jsonl → src/knowledge-data.js).
 *
 * GATED: by default this is a dry run. `--stage` writes ONLY to staging/
 * (knowledge.jsonl, knowledge-data.js, staged.diff, stage-report.md).
 * It never modifies the live knowledge.jsonl / src/knowledge-data.js and
 * never deploys. After Mike approves the staged diff, apply manually:
 *   cp staging/knowledge.jsonl knowledge.jsonl
 *   cp staging/knowledge-data.js src/knowledge-data.js
 *   npm run build && npm run deploy   (deploy is the separate, human step)
 *
 * Confidential exclusion (vault CLAUDE.md rule 1 — nothing confidential
 * reaches the bot):
 *   - pages with `confidential: ghn` or `confidential: internal` frontmatter
 *   - any line inside otherwise-public pages containing a confidential marker
 *     (NDA, GHN, Greenhouse, Coach Ron, Ron, VAR, internal)
 *   - frontmatter, Sources and History sections, blockquotes (internal-voice
 *     material), KB bookkeeping pages (SCHEMA, index, log)
 *
 * Usage:
 *   node scripts/kb-to-rag.mjs             # dry run, summary to stdout
 *   node scripts/kb-to-rag.mjs --stage     # write staging/ artifacts
 *   KB_DIR=/path/to/KB node scripts/kb-to-rag.mjs   # override vault path
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const BACKEND_DIR = path.resolve(new URL('..', import.meta.url).pathname);
const KB_DIR = process.env.KB_DIR || '/Users/michaeljones/Dev/Obsidian/Mike_Thinking_Space/KB';
const LIVE_JSONL = path.join(BACKEND_DIR, 'knowledge.jsonl');
const LIVE_MODULE = path.join(BACKEND_DIR, 'src', 'knowledge-data.js');
const STAGE_DIR = path.join(BACKEND_DIR, 'staging');
const STAGE_JSONL = path.join(STAGE_DIR, 'knowledge.jsonl');
const STAGE_MODULE = path.join(STAGE_DIR, 'knowledge-data.js');
const STAGE_DIFF = path.join(STAGE_DIR, 'staged.diff');
const STAGE_REPORT = path.join(STAGE_DIR, 'stage-report.md');

// ---------------------------------------------------------------- filtering
const CONFIDENTIAL_PAGE_VALUES = new Set(['ghn', 'internal']);
const SKIP_PAGES = new Set(['SCHEMA.md', 'index.md', 'log.md']);
const EXCLUDED_SECTIONS = /^(sources?|history)\b/i;
const MIN_CHUNK_CHARS = 80;

// Matched on body lines only (frontmatter stripped first). Keep names
// case-sensitive; keep marker vocabulary case-insensitive.
const CONF_PATTERNS = [
  /\bNDA\b/,
  /\bGHN\b/i,
  /\bGreenhouse\b/,
  /\bCoach Ron\b/i,
  /\bcoach-ron\b/i,
  /\bRon\b/,
  /\bVAR\b/,
  /\binternal\b/i,
];

// ------------------------------------------------------------------- helpers
function parseFrontmatter(text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!m) return { fields: {}, body: text, conf: null };
  const fields = {};
  for (const line of m[1].split('\n')) {
    const fm = /^([\w-]+):\s*(.*)$/.exec(line);
    if (fm) fields[fm[1]] = fm[2].trim();
  }
  const raw = (fields['confidential'] || 'none').toLowerCase();
  return { fields, body: text.slice(m[0].length), conf: raw === 'none' ? null : raw };
}

function lineIsConfidential(line) {
  return CONF_PATTERNS.some((p) => p.test(line));
}

function isNoiseLine(t) {
  if (t.startsWith('>')) return true; // blockquotes = internal voice/design notes
  if (/^[-*]\s*(History|created|updated)\b/i.test(t)) return true;
  if (/^\|[\s:|-]+\|$/.test(t)) return true; // table separator rows
  return false;
}

function stripMarkdown(line) {
  return line
    .replace(/\[\[([^\]|]+)(\|[^\]]+)?\]\]/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\*\*/g, '')
    .replace(/^\s*[-*]\s+/, '')
    .replace(/^\s*#+\s*/, '')
    .trim();
}

function cleanProse(text) {
  const out = [];
  for (const raw of text.split(/\r?\n/)) {
    const t = raw.trim();
    if (!t) continue;
    if (isNoiseLine(t)) continue;
    if (lineIsConfidential(t)) continue;
    let s = stripMarkdown(t);
    if (s.startsWith('|')) s = s.replace(/\|/g, ' ').replace(/\s+/g, ' ').trim();
    if (s) out.push(s);
  }
  return out.join(' ').replace(/\s+/g, ' ').trim();
}

function splitSections(body) {
  const lines = body.split(/\r?\n/);
  const sections = [];
  let intro = [];
  let current = null;
  for (const line of lines) {
    const hm = /^##\s+(.*)$/.exec(line);
    if (hm) {
      if (current) sections.push(current);
      current = { heading: hm[1].trim(), lines: [] };
    } else if (current) {
      current.lines.push(line);
    } else {
      intro.push(line);
    }
  }
  if (current) sections.push(current);
  return { intro: intro.join('\n'), sections };
}

// ------------------------------------------------------------------ chunking
const TOPIC_BY_TYPE = {
  company: 'company',
  business: 'business',
  concept: 'concept',
  person: 'people',
  pipeline: 'pipeline',
};

function deriveTags(heading, topic, extra) {
  const words = (heading || '')
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);
  return [...new Set([...words, topic, ...extra, 'kb'].filter(Boolean))];
}

function chunkPage(page, seen) {
  const chunks = [];
  const redactions = [];
  const { intro, sections } = splitSections(page.body);

  // Record confidential-marker lines dropped from a public page's content.
  for (const raw of page.body.split(/\r?\n/)) {
    const t = raw.trim();
    if (t && !isNoiseLine(t) && lineIsConfidential(t)) {
      redactions.push({ line: t.slice(0, 160) });
    }
  }

  const emit = (rawText, heading) => {
    const content = cleanProse(rawText);
    if (content.length < MIN_CHUNK_CHARS) return;
    if (seen.has(content)) return;
    seen.add(content);
    const topic = TOPIC_BY_TYPE[page.type] || 'general';
    const isAbout = page.rel === 'company/jonesco.md' && !heading; // zero-keyword fallback target
    const entry = {
      id: `kb-${page.rel.replace(/\.md$/, '').replace(/[^a-z0-9]+/gi, '-')}-${chunks.length + 1}`,
      type: 'narrative',
      topic: isAbout ? 'about' : topic,
      project: page.type === 'business' ? page.fields['title'] || null : null,
      title: heading || page.fields['title'] || page.rel,
      content,
      confidence: 'verified',
      source: `KB/${page.rel}`,
      tags: deriveTags(heading, isAbout ? 'about' : topic, [page.fields['title'] || '']),
    };
    chunks.push(entry);
  };

  if (intro.trim()) emit(intro, null);
  for (const s of sections) {
    if (EXCLUDED_SECTIONS.test(s.heading)) continue;
    emit(s.lines.join('\n'), s.heading);
  }
  return { chunks, redactions };
}

function loadPages(kbDir) {
  const pages = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.isFile() && e.name.endsWith('.md') && !SKIP_PAGES.has(e.name)) {
        const text = fs.readFileSync(p, 'utf8');
        const { fields, body, conf } = parseFrontmatter(text);
        pages.push({
          rel: path.relative(kbDir, p).split(path.sep).join('/'),
          type: fields['type'] || 'unknown',
          conf,
          fields,
          body,
        });
      }
    }
  };
  walk(kbDir);
  return pages;
}

// --------------------------------------------------------------- build & diff
function readLiveJsonl(file) {
  if (!fs.existsSync(file)) return [];
  return fs
    .readFileSync(file, 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      try {
        return JSON.parse(l);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function countBy(arr, key) {
  const c = {};
  for (const e of arr) c[e[key] || 'unknown'] = (c[e[key] || 'unknown'] || 0) + 1;
  return c;
}

function generateModule(entries) {
  const topics = {};
  const types = {};
  for (const e of entries) {
    topics[e.topic] = (topics[e.topic] || 0) + 1;
    types[e.type] = (types[e.type] || 0) + 1;
  }
  return `// Auto-generated knowledge base module (CommonJS)
// Generated at: ${new Date().toISOString()}
// Source: KB (Obsidian Mike_Thinking_Space) via scripts/kb-to-rag.mjs — staged, pending approval
// Entries: ${entries.length}

const knowledgeBase = ${JSON.stringify(entries, null, 2)};

function getKnowledgeBase() {
  return knowledgeBase;
}

const stats = {
  totalEntries: ${entries.length},
  types: ${JSON.stringify(types)},
  topics: ${JSON.stringify(topics)}
};

module.exports = {
  knowledgeBase,
  getKnowledgeBase,
  stats
};
`;
}

// ---------------------------------------------------------------------- main
function main() {
  const stage = process.argv.includes('--stage');
  const pages = loadPages(KB_DIR);
  const seen = new Set();
  const entries = [];
  const perPage = [];
  const redactions = [];

  for (const page of pages) {
    if (page.conf && CONFIDENTIAL_PAGE_VALUES.has(page.conf)) {
      perPage.push({ rel: page.rel, confidential: page.conf, chunks: 0 });
      continue; // confidential page: excluded entirely
    }
    const { chunks, redactions: r } = chunkPage(page, seen);
    redactions.push(...r.map((x) => ({ page: page.rel, ...x })));
    entries.push(...chunks);
    perPage.push({ rel: page.rel, confidential: null, chunks: chunks.length });
  }

  const live = readLiveJsonl(LIVE_JSONL);
  const liveModuleExists = fs.existsSync(LIVE_MODULE);
  const jsonlOut = entries.map((e) => JSON.stringify(e)).join('\n') + '\n';
  const moduleOut = generateModule(entries);

  const summary = {
    kbDir: KB_DIR,
    pagesSeen: pages.length,
    confidentialPagesExcluded: perPage.filter((p) => p.confidential).map((p) => `${p.rel} (${p.confidential})`),
    entriesBuilt: entries.length,
    liveEntries: live.length,
    types: countBy(entries, 'type'),
    topics: countBy(entries, 'topic'),
    redactedLines: redactions.length,
    perPage,
  };

  console.log('--- KB → RAG adapter (dry run summary) ---');
  console.log(JSON.stringify(summary, null, 2));

  if (!stage) {
    console.log('\nDry run only. Re-run with --stage to write staging/ artifacts (live files untouched).');
    return;
  }

  fs.mkdirSync(STAGE_DIR, { recursive: true });
  fs.writeFileSync(STAGE_JSONL, jsonlOut);
  fs.writeFileSync(STAGE_MODULE, moduleOut);

  // Diffs against live files (git diff --no-index exits 1 when files differ).
  let diffOut = '';
  const diff = (args) => {
    try {
      diffOut += execFileSync('git', ['diff', '--no-index', ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    } catch (e) {
      diffOut += e.stdout || '';
    }
    diffOut += '\n';
  };
  diff(['--stat', LIVE_JSONL, STAGE_JSONL]);
  diff(['--stat', LIVE_MODULE, STAGE_MODULE]);
  diff(['-U2', LIVE_JSONL, STAGE_JSONL]);
  fs.writeFileSync(STAGE_DIFF, diffOut || '(no differences)');

  const sample = entries.slice(0, 3).map((e) => `### ${e.id}\n${JSON.stringify(e, null, 2)}`).join('\n\n');
  const report = `# KB → RAG staged diff — for Mike's approval

Generated: ${new Date().toISOString()}
Command: \`node scripts/kb-to-rag.mjs --stage\` (in \`mj-chatbot-backend\`)

## What this is

Pilot leg of the publication layer ([[publication-layer]]): the Obsidian KB
(\`${KB_DIR}\`) is read **directly** — no content duplication — and chunked into
the distill RAG JSONL schema that \`mj-chatbot-backend\` ingests
(\`knowledge.jsonl\` → \`node src/knowledge-loader.js\` → \`src/knowledge-data.js\`).
The live bot chain (mikejones.online → distill-chatbot-widget.js →
mj-chatbot-backend Worker) picks the new knowledge up on the next backend
deploy — **which has NOT happened**. Nothing live was modified.

## Stats

- Live entries today: **${live.length}** (last generated 2026-06-26)
- Staged entries from KB: **${entries.length}**
- Types: ${JSON.stringify(countBy(entries, 'type'))}
- Confidential pages excluded entirely: ${summary.confidentialPagesExcluded.join(', ') || 'none'}
- Confidential lines redacted inside public pages: **${redactions.length}** (see staging/stage-report.md appendix)
- KB bookkeeping excluded: SCHEMA.md, index.md, log.md, frontmatter, Sources/History sections, blockquotes

## Per-page

${perPage.map((p) => `- ${p.rel}${p.confidential ? ` — EXCLUDED (confidential: ${p.confidential})` : ` — ${p.chunks} entries`}`).join('\n')}

## Redacted lines (confidential markers inside public pages)

Counts per page only — the lines themselves are dropped from the RAG and
deliberately NOT reproduced here (this repo is public; the report must not
re-import confidential text).

${redactions.length ? Object.entries(redactions.reduce((acc, r) => { acc[r.page] = (acc[r.page] || 0) + 1; return acc; }, {})).map(([p, n]) => `- \`${p}\`: ${n} line(s) redacted`).join('\n') : '(none)'}

## After you approve

\`\`\`bash
cd ~/dev/MJ_Online/mj-chatbot-backend
cp staging/knowledge.jsonl knowledge.jsonl
cp staging/knowledge-data.js src/knowledge-data.js
npm run build        # regenerates src/knowledge-data.js from knowledge.jsonl
npm run deploy       # separate human step — deploys the Worker
\`\`\`

Verify any time (no side effects): \`node scripts/verify-staged.cjs\` — loads the
staged module through the live retrieval engine and re-runs the retrieval
smoke test.

## Sample entries

${sample}

---
Full machine diff: \`staging/staged.diff\`. This report is the human-readable summary.
`;
  fs.writeFileSync(STAGE_REPORT, report);

  console.log(`\nStaged (NOT applied, NOT deployed):`);
  console.log(`  ${STAGE_JSONL}`);
  console.log(`  ${STAGE_MODULE}`);
  console.log(`  ${STAGE_DIFF}`);
  console.log(`  ${STAGE_REPORT}`);
}

main();