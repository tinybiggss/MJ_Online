#!/usr/bin/env node
/**
 * kb-to-agents.mjs — Publication-layer adapter: Obsidian KB → agent-readable
 * static export (public/agents/kb/*.md + public/agents/kb/index.json + public/llms.txt)
 *
 * Day-2 artifact of T-2026-10-05-AQW (portfolio demo) — implements the agent-query
 * scope carded there: read-only facts about Mike Jones for web agents/LLMs in the
 * llms.txt convention. Design decisions on that card:
 *   - Static files only. NO private APIs, NO write surface, NO auth wall.
 *   - Regenerated at build from the SAME KB pages kb-to-rag.mjs / kb-to-content.mjs
 *     read: default-deny on `public:` (only `public: yes` pages flow),
 *     `confidential: ghn|internal` hard-blocked (linter-enforced in the vault),
 *     line-level redaction of confidential markers inside otherwise-public pages
 *     (same patterns as kb-to-rag.mjs), Sources/History sections and blockquotes
 *     excluded (internal voice), KB bookkeeping pages (SCHEMA/index/log) skipped.
 *   - robots.txt stays open so crawlers discover /llms.txt.
 *
 * KB is read-only input; this script never writes into the KB.
 *
 * Cloudflare Pages cannot read the local vault: when KB_DIR is absent the
 * generator keeps whatever committed output exists in public/ (fallback, exit 0)
 * — committed artifacts are what ships, and the commit is Mike's gate. Locally,
 * every `npm run build` regenerates from the live KB via the astro:build:start
 * hook wired in astro.config.mjs.
 *
 * Usage:
 *   node scripts/kb-to-agents.mjs             # regenerate public/ agents output
 *   node scripts/kb-to-agents.mjs --dry       # summary only, writes nothing
 *   KB_DIR=/path/to/KB node scripts/kb-to-agents.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const SITE_DIR = path.resolve(new URL('..', import.meta.url).pathname);
const PUBLIC_DIR = path.join(SITE_DIR, 'public');
const AGENTS_DIR = path.join(PUBLIC_DIR, 'agents', 'kb');
const LLMS_TXT = path.join(PUBLIC_DIR, 'llms.txt');
const KB_DIR = process.env.KB_DIR || '/Users/michaeljones/Dev/Obsidian/Mike_Thinking_Space/KB';
const DRY = process.argv.includes('--dry');

// ------------------------------------------------------------------ filtering
const CONFIDENTIAL_PAGE_VALUES = new Set(['ghn', 'internal']);
const SKIP_PAGES = new Set(['SCHEMA.md', 'index.md', 'log.md']);
const EXCLUDED_SECTIONS = /^(sources?|history)\b/i;
const MIN_CHUNK_CHARS = 80;
const MAX_PAGE_CHARS = 12000; // pages larger than this split into -partN files

// Same vocabulary as kb-to-rag.mjs (mirrored, not drifted).
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
  if (!m) return { fields: {}, body: text };
  const fields = {};
  for (const line of m[1].split('\n')) {
    const fm = /^([\w-]+):\s*(.*)$/.exec(line);
    if (fm) fields[fm[1]] = fm[2].trim();
  }
  return { fields, body: text.slice(m[0].length) };
}

function lineIsConfidential(line) {
  return CONF_PATTERNS.some((p) => p.test(line));
}

function isNoiseLine(t) {
  if (t.startsWith('>')) return true; // blockquotes = internal voice
  if (/^[-*]\s*(History|created|updated)\b/i.test(t)) return true;
  if (t.startsWith('#')) return true; // headings are separators, not prose
  if (/^\|?[\s:|-]+\|?$/.test(t) && t.includes('|')) return true; // table separator rows
  return false;
}

function stripMarkdown(line) {
  return line
    .replace(/\[\[([^\]|]+)(\|[^\]]+)?\]\]/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\*\*/g, '')
    .replace(/^\s*[-*]\s+/, '') // list bullets fold into prose
    .trim();
}

/** Clean one raw section body → prose lines (redaction applied). */
function cleanLines(raw) {
  const out = [];
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim();
    if (!t) continue;
    if (isNoiseLine(t)) continue;
    if (lineIsConfidential(t)) continue;
    let s = stripMarkdown(t);
    if (s.startsWith('|')) s = s.replace(/\|/g, ' ').replace(/\s+/g, ' ').trim();
    if (s) out.push(s);
  }
  return out;
}

function splitSections(body) {
  const lines = body.split(/\r?\n/);
  const sections = [];
  let intro = [];
  let current = null;
  for (const line of lines) {
    const hm = /^(#{1,3})\s+(.*)$/.exec(line);
    if (hm) {
      if (current) sections.push(current);
      current = { level: hm[1].length, heading: hm[2].trim(), lines: [line] };
    } else if (current) {
      current.lines.push(line);
    } else {
      intro.push(line);
    }
  }
  if (current) sections.push(current);
  return { intro, sections };
}

function slugify(rel) {
  return rel
    .replace(/\.md$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function loadPages(kbDir) {
  const pages = [];
  const excluded = [];
  const walk = (dir) => {
    let entries = [];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.isFile() && e.name.endsWith('.md') && !SKIP_PAGES.has(e.name)) {
        const text = fs.readFileSync(p, 'utf8');
        const { fields, body } = parseFrontmatter(text);
        const conf = (fields['confidential'] || 'none').toLowerCase();
        const pub = (fields['public'] || 'no').toLowerCase() === 'yes';
        const rel = path.relative(kbDir, p).split(path.sep).join('/');
        if (CONFIDENTIAL_PAGE_VALUES.has(conf)) {
          excluded.push({ rel, reason: `confidential: ${conf} — never public` });
        } else if (!pub) {
          excluded.push({ rel, reason: 'default-deny (public: no)' });
        } else {
          pages.push({ rel, fields, body });
        }
      }
    }
  };
  walk(kbDir);
  return { pages, excluded };
}

// ---------------------------------------------------------------- page render
function renderPage(page) {
  const { intro, sections } = splitSections(page.body);
  const title = page.fields['title'] || page.rel;
  const updated = page.fields['updated'] || null;
  let cleanedIntro = cleanLines(intro.join('\n'));
  const bodyParts = [];

  const header =
    `---\nid: kb-${slugify(page.rel)}\ntitle: ${title}\n` +
    (updated ? `updated: ${updated}\n` : '') +
    `source: Mike Jones public knowledge base (mikejones.online/llms.txt)\n---\n`;

  const introText = cleanedIntro.join(' ').replace(/\s+/g, ' ').trim();
  if (introText) bodyParts.push(introText);
  for (const s of sections) {
    if (EXCLUDED_SECTIONS.test(s.heading)) continue;
    const cleaned = cleanLines(s.lines.join('\n').replace(/^#{1,3}\s+(.*)$/m, ''));
    if (!cleaned.length) continue;
    const text = `${'#'.repeat(Math.min(s.level + 1, 4))} ${s.heading}\n\n${cleaned.join(' ').replace(/\s+/g, ' ').trim()}`;
    if (text.length < MIN_CHUNK_CHARS) continue;
    bodyParts.push(text);
  }

  // One file per page; split only very large pages by parts.
  const chunks = [];
  if (!bodyParts.length) {
    return { title, updated, chunks, redactedEmpty: true };
  }
  const fullBody = bodyParts.join('\n\n');
  if (fullBody.length <= MAX_PAGE_CHARS) {
    chunks.push({ suffix: '', body: fullBody });
  } else {
    let part = 1;
    let acc = [];
    let accLen = 0;
    for (const bp of bodyParts) {
      if (accLen + bp.length > MAX_PAGE_CHARS && acc.length) {
        chunks.push({ suffix: `-part${part}`, body: acc.join('\n\n') });
        acc = [];
        accLen = 0;
        part += 1;
      }
      acc.push(bp);
      accLen += bp.length;
    }
    if (acc.length) chunks.push({ suffix: `-part${part}`, body: acc.join('\n\n') });
  }

  const summarySource = introText || bodyParts[0] || '';
  const summaryFlat = summarySource.replace(/^#{1,4}\s+.*$/gm, ' ').replace(/\s+/g, ' ').trim();
  const summary = summaryFlat ? summaryFlat.split(/(?<=[.!?])\s/)[0].slice(0, 260) : title;
  const files = chunks.map((c) => `kb-${slugify(page.rel)}${c.suffix}.md`);

  // Search-index entries: one per section (intro included, heading = null).
  // Section text is already redacted (bodyParts derive from cleanLines), but
  // main()'s safety belt sweeps these too. partOf-free: the packer below walks
  // parts in the same order renderPage emitted them, so entry.path always
  // points at the file that actually contains the section.
  let searchAcc = [];
  let searchPart = 0;
  let searchLen = 0;
  const searchChunks = [];
  for (let i = 0; i < bodyParts.length; i++) {
    if (chunks.length > 1 && searchAcc.length && searchLen + bodyParts[i].length > MAX_PAGE_CHARS) {
      searchChunks.push({ fileName: files[searchPart], items: searchAcc });
      searchAcc = [];
      searchPart += 1;
      searchLen = 0;
    }
    searchAcc.push(sectionMeta(bodyParts[i]));
    searchLen += bodyParts[i].length;
  }
  if (searchAcc.length) searchChunks.push({ fileName: files[searchPart], items: searchAcc });

  const seen = new Map();
  const searchEntries = searchChunks.flatMap((sc) =>
    sc.items.map((m) => {
      const baseId = `kb-${slugify(page.rel)}${m.section ? '-' + slugify(m.section) : ''}`;
      const n = seen.get(baseId) || 0;
      seen.set(baseId, n + 1);
      return {
        id: n === 0 ? baseId : `${baseId}-${n + 1}`,
        pageId: `kb-${slugify(page.rel)}`,
        title,
        section: m.section || null,
        updated: updated || null,
        path: `/agents/kb/${sc.fileName}`,
        text: (m.raw || '').slice(0, 1500),
      };
    })
  );

  return { title, updated, summary, chunks, files, searchEntries, redactedEmpty: false };
}

/** Split an emitted bodyPart back into heading + prose for search entries.
 * Also handles bare-intro pages (no heading at all → section null, text = body). */
function sectionMeta(bodyPart) {
  const m = /^#{1,4}\s+(.+?)\s*$/m.exec(bodyPart);
  if (!m) return { section: null, raw: bodyPart.trim() };
  const section = m[1].trim();
  const text = bodyPart.replace(m[0], '').trim();
  return { section, raw: text };
}

// ----------------------------------------------------------------------- main
function main() {
  const dry = DRY || !fs.existsSync(KB_DIR);
  if (!fs.existsSync(KB_DIR)) {
    console.error(`KB_DIR not found: ${KB_DIR} — CI/cloud build: keeping committed agents output as-is.`);
  }

  const { pages, excluded } = fs.existsSync(KB_DIR) ? loadPages(KB_DIR) : { pages: [], excluded: [] };

  const rendered = [];
  for (const page of pages) {
    const r = renderPage(page);
    // Safety belt: no confidential token may survive in any emitted file.
    for (const c of (r.chunks || [])) {
      for (const p of CONF_PATTERNS) {
        if (p.test(c.body)) {
          console.error(`ABORT: confidential token ${p} survived redaction in KB/${page.rel} — fix content or raise the pattern list.`);
          process.exit(3);
        }
      }
    }
    for (const e of r.searchEntries || []) {
      for (const p of CONF_PATTERNS) {
        if (p.test(e.text) || (e.section && p.test(e.section))) {
          console.error(`ABORT: confidential token ${p} survived redaction in KB/${page.rel} (search entry ${e.id}) — fix content or raise the pattern list.`);
          process.exit(3);
        }
      }
    }
    rendered.push({ page, ...r });
  }
  const searchEntries = rendered.flatMap((r) => r.searchEntries || []);

  const summary = {
    kbDir: KB_DIR,
    dry,
    included: rendered.length,
    excluded: excluded.length,
    excludedBy: excluded.reduce((a, e) => ({ ...a, [e.reason]: (a[e.reason] || 0) + 1 }), {}),
    files: rendered.flatMap((r) => r.files || []),
    emptyAfterRedaction: rendered.filter((r) => r.redactedEmpty).map((r) => r.page.rel),
    pages: rendered.map((r) => ({ rel: r.page.rel, files: r.files?.length || 0 })),
  };
  console.log('--- KB → agents export (summary) ---');
  console.log(JSON.stringify(summary, null, 2));

  if (dry) {
    console.log('Dry run (or KB absent): wrote nothing.');
    return;
  }

  fs.mkdirSync(AGENTS_DIR, { recursive: true });

  const QUERY_PROMO =
    'Agent querying: GET /agents/query?q=<terms> returns JSON {query, results:[{id, title, section, path, text}]} — scored passages from these fact sheets, best first. Use it to find and cite specifics (roles, results, certifications, how to engage); cite answer text by /agents/kb/*.md path.';

  const indexEntries = [];
  const llmsLines = [
    '# Mike Jones',
    '',
    '> Mike Jones — 29 years building systems that ship: Xbox and Xbox 360 launch teams (XDK patent), studio director roles at Kabam and Kinoo, and now Velocity Partners (agentic-web consulting), Resilient Tomorrow (publishing), and Distills (open-source AI product). CCAR-F certified by Anthropic.',
    '',
    'This site exposes a read-only, machine-readable knowledge base. Each link below is a static markdown fact sheet; `/agents/kb/index.json` is the machine index. Contact: the form at `/contact` or mike@mikejones.online.',
    '',
    QUERY_PROMO,
    '',
    '## Knowledge base',
    '',
  ];

  for (const r of rendered) {
    if (!r.chunks || !r.chunks.length) {
      console.log(`   skip (no emit after redaction): KB/${r.page.rel}`);
      continue;
    }
    const base = `kb-${slugify(r.page.rel)}`;
    const n = r.chunks.length;
    r.chunks.forEach((c, i) => {
      const fname = `${base}${c.suffix}.md`;
      const partTag = n > 1 ? ` (part ${i + 1}/${n})` : '';
      const text =
        `---\nid: ${base}\ntitle: ${r.title}${partTag}\n` +
        (r.updated ? `updated: ${r.updated}\n` : '') +
        `source: Mike Jones public knowledge base (https://mikejones.online/llms.txt)\n` +
        `---\n\n# ${r.title}${partTag}\n\n${c.body}\n`;
      fs.writeFileSync(path.join(AGENTS_DIR, fname), text);
      if (i === 0) {
        const raw = l1text(r);
        const flat = raw
          .split('\n')
          .filter((l) => !l.startsWith('#') && l.trim())
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
        const s = flat.slice(0, 200);
        llmsLines.push(s ? `- [${r.title}](/agents/kb/${fname}): ${s}` : `- [${r.title}](/agents/kb/${fname})`);
      }
    });
    indexEntries.push({
      id: base,
      title: r.title,
      updated: r.updated,
      summary: r.summary,
      path: `/agents/kb/${base}.md`,
      files: r.files,
    });
    // Clean stale parts: if page was previously multi-part, part2.. remain.
    for (let i = r.chunks.length + 1; i < 10; i++) {
      const stale = path.join(AGENTS_DIR, `${base}-part${i}.md`);
      if (fs.existsSync(stale)) fs.rmSync(stale);
    }
  }

  fs.writeFileSync(LLMS_TXT, llmsLines.join('\n') + '\n');
  fs.writeFileSync(
    path.join(AGENTS_DIR, 'index.json'),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        site: 'https://mikejones.online',
        description: 'Read-only machine index of Mike Jones knowledge-base fact sheets. Human entry point: /llms.txt',
        llmsTxt: '/llms.txt',
        query: { endpoint: '/agents/query?q=<terms>', method: 'GET', returns: 'JSON {query, results:[{id, title, section, path, text}]}', note: 'Scored passages from these fact sheets, best first. Deterministic term scoring — no LLM.' },
        pages: indexEntries,
      },
      null,
      2
    ) + '\n'
  );
  fs.writeFileSync(
    path.join(AGENTS_DIR, 'search-index.json'),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        endpoint: '/agents/query',
        entries: searchEntries,
      },
      null,
      2
    ) + '\n'
  );

  console.log(`\nWrote ${indexEntries.length} page(s) → ${AGENTS_DIR.replace(SITE_DIR + '/', 'site/')}`);
  console.log(`Wrote ${LLMS_TXT.replace(SITE_DIR + '/', 'site/')}`);
  console.log(`Wrote search-index.json (${searchEntries.length} entries) — endpoint /agents/query`);
}

/** First-sentence summary helper (falls back to page summary). */
function l1text(r) {
  return (r.summary || '').slice(0, 200) || '';
}

main();