#!/usr/bin/env node
/**
 * kb-to-content.mjs — Publication-layer adapter: Obsidian KB → content.ts (gated)
 *
 * The KB (/Users/michaeljones/Dev/Obsidian/Mike_Thinking_Space/KB) holds
 * compiled claims; only pages marked `public: yes` in frontmatter are
 * publication-grade and may flow to public surfaces (vault CLAUDE.md rule 1,
 * KB/SCHEMA.md "The public: marker"). This generator renders those claims
 * into the KB:BEGIN/KB:END region of site/src/lib/content.ts. Everything
 * outside the region stays hand-maintained — its KB sources are public: no
 * today (default-deny). The KB is read-only input; this script never writes
 * into KB/.
 *
 * FIELD MAP — content.ts export → KB claim source (status 2026-09-25):
 *
 *   identity        hand-maintained — jonesco.md / north-star.md are public: no
 *   stats           hand-maintained — facts spread across pages; none public: yes
 *   ventures        hand-maintained — resilient-tomorrow.md, velocity-partners.md,
 *                   distills.md are public: no; ghn-partnership.md is
 *                   confidential: ghn (can NEVER be public: yes, linter-enforced),
 *                   so the GHN venture card text — including its CCAR-F course
 *                   mention — stays hand-edited until Mike marks the underlying
 *                   facts publication-grade on a non-confidential page
 *   projects        hand-maintained — builder/event-layer facts, outside KB scope
 *   adhd            hand-maintained — personal; outside KB scope (SCHEMA scope test)
 *   career          hand-maintained — event-layer history
 *   pillars         hand-maintained — resilient-tomorrow.md is public: no
 *   nav             hand-maintained — site structure, not a KB claim
 *   certifications  GENERATED ← KB/concepts/ccar-f-certification.md (public: yes),
 *                   the only publication-grade KB page as of 2026-09-25:
 *                     name          ← fact table row "Official name"
 *                     abbrev        ← fact table row "Exam code" (first token)
 *                     issuer        ← fact table row "Issuer" (parenthetical stripped)
 *                     issued        ← fact table row "Issued" (ISO date)
 *                     issuedDisplay ← "Issued" rendered as "Mon YYYY"
 *                     expires       ← fact table row "Expires" (ISO date)
 *                     proofUrl      ← fact table row "Proof" (first https URL)
 *                     scope         ← fact table row "Exam scope" (comma-split)
 *
 * GATED FLOW (mirrors mj-chatbot-backend/scripts/kb-to-rag.mjs):
 *   node scripts/kb-to-content.mjs             # dry run: summary only, writes nothing
 *   node scripts/kb-to-content.mjs --stage     # writes ONLY site/content.staging/
 *   node scripts/publish-content.mjs           # plan the gated publish (no changes)
 *   node scripts/publish-content.mjs --apply   # after Mike approves: cp + build + commit
 * Nothing is ever pushed by these scripts — pushing is Mike's explicit manual
 * step (repo CLAUDE.md git workflow; Cloudflare Pages auto-deploys on push).
 *
 * A KB page marked public: yes with no adapter registered below is reported
 * as UNMAPPED: its facts cannot flow until an adapter is written
 * (default-deny is preserved — unmapped pages emit nothing).
 *
 * Usage:
 *   node scripts/kb-to-content.mjs                  # dry run
 *   node scripts/kb-to-content.mjs --stage          # write staging artifacts
 *   node scripts/kb-to-content.mjs --print-region   # print the generated region
 *   KB_DIR=/path/to/KB node scripts/kb-to-content.mjs
 *   CONTENT_STAGE_DIR=/tmp/x node scripts/kb-to-content.mjs --stage
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const SITE_DIR = path.resolve(new URL('..', import.meta.url).pathname);
const REPO_ROOT = path.resolve(SITE_DIR, '..');
const KB_DIR =
  process.env.KB_DIR || '/Users/michaeljones/Dev/Obsidian/Mike_Thinking_Space/KB';
const LIVE_CONTENT = path.join(SITE_DIR, 'src', 'lib', 'content.ts');
const STAGE_DIR =
  process.env.CONTENT_STAGE_DIR || path.join(SITE_DIR, 'content.staging');

const BEGIN_MARKER =
  '// === KB:BEGIN generated (do not hand-edit — regenerate: node scripts/kb-to-content.mjs)';
const END_MARKER = '// === KB:END generated ===';

/** git without trimming (needed for byte-exact file comparisons). */
function gitRaw(args) {
  try {
    return execFileSync('git', args, {
      encoding: 'utf8',
      cwd: REPO_ROOT,
      maxBuffer: 64 * 1024 * 1024,
    });
  } catch {
    return null;
  }
}

/** The COMMITTED content.ts — the baseline a publish would change. */
function committedContentTs() {
  return gitRaw(['show', 'HEAD:site/src/lib/content.ts']);
}

// ----------------------------------------------------------------- KB reading
const CONFIDENTIAL_VALUES = new Set(['ghn', 'internal']);
const SKIP_PAGES = new Set(['SCHEMA.md', 'index.md', 'log.md']);

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

function loadPages(kbDir) {
  const pages = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) =>
      a.name.localeCompare(b.name)
    )) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.isFile() && e.name.endsWith('.md') && !SKIP_PAGES.has(e.name)) {
        const text = fs.readFileSync(p, 'utf8');
        const { fields, body } = parseFrontmatter(text);
        pages.push({
          rel: path.relative(kbDir, p).split(path.sep).join('/'),
          fields,
          public: (fields['public'] || 'no').toLowerCase() === 'yes',
          confidential: (fields['confidential'] || 'none').toLowerCase(),
          body,
        });
      }
    }
  };
  walk(kbDir);
  return pages;
}

/** Parse the first markdown table whose header is [Fact, Value] into a dict. */
function parseFactTable(body) {
  const lines = body.split(/\r?\n/);
  let current = [];
  const tables = [];
  for (const raw of lines) {
    const t = raw.trim();
    if (t.startsWith('|') && t.endsWith('|')) {
      const cells = t
        .slice(1, -1)
        .split('|')
        .map((c) => c.trim());
      if (cells.every((c) => /^:?-{2,}:?$/.test(c))) continue; // separator row
      current.push(cells);
    } else if (current.length) {
      tables.push(current);
      current = [];
    }
  }
  if (current.length) tables.push(current);
  for (const rows of tables) {
    if (
      rows.length > 1 &&
      rows[0].length >= 2 &&
      /^fact$/i.test(rows[0][0]) &&
      /^value$/i.test(rows[0][1])
    ) {
      const dict = {};
      for (const row of rows.slice(1)) {
        if (row.length >= 2 && row[0]) dict[row[0]] = row[1];
      }
      return dict;
    }
  }
  return null;
}

// ------------------------------------------------------------------- adapters
// One adapter per public: yes KB page. Adding a surface field starts here:
// mark the page public: yes (Mike's call), then register an adapter.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const isoToDisplay = (iso) => {
  const m = /^(\d{4})-(\d{2})(?:-\d{2})?$/.exec(iso || '');
  return m ? `${MONTHS[Number(m[2]) - 1]} ${m[1]}` : iso;
};

const certSourcesRel = 'concepts/ccar-f-certification.md';

function certAdapter(page) {
  const facts = parseFactTable(page.body);
  if (!facts) throw new Error(`${page.rel}: no "Fact | Value" table found`);
  const need = ['Official name', 'Exam code', 'Issuer', 'Issued'];
  const missing = need.filter((k) => !facts[k]);
  if (missing.length) {
    throw new Error(`${page.rel}: fact table missing required rows: ${missing.join(', ')}`);
  }
  const proofUrlMatch = /https?:\/\/[^\s)]+/.exec(facts['Proof'] || '');
  const entry = {
    name: facts['Official name'],
    abbrev: /^\S+/.exec(facts['Exam code'])[0],
    issuer: (facts['Issuer'] || '').replace(/\s*\([^)]*\)\s*$/, '').trim(),
    issued: facts['Issued'],
    issuedDisplay: isoToDisplay(facts['Issued']),
    expires: facts['Expires'] || null,
    proofUrl: proofUrlMatch ? proofUrlMatch[0] : null,
    scope: facts['Exam scope']
      ? facts['Exam scope'].split(',').map((s) => s.trim()).filter(Boolean)
      : [],
  };
  const bad = [];
  if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.issued)) bad.push('Issued not ISO');
  if (entry.expires && !/^\d{4}-\d{2}-\d{2}$/.test(entry.expires)) bad.push('Expires not ISO');
  if (!entry.proofUrl) bad.push('Proof row has no URL');
  if (bad.length) throw new Error(`${page.rel}: ${bad.join('; ')}`);
  return { certifications: [entry] };
}

const ADAPTERS = [
  { page: certSourcesRel, apply: certAdapter },
];

// ------------------------------------------------------------ region assembly
const CERT_PROVENANCE = ` *   Provenance for Certification[] ← KB/${certSourcesRel} (public: yes):
 *     name ← fact table "Official name"; abbrev ← "Exam code" (first token;
 *     CCAR-F is the only approved abbreviation); issuer ← "Issuer"
 *     (parenthetical stripped); issued/issuedDisplay ← "Issued";
 *     expires ← "Expires"; proofUrl ← "Proof" (Credly badge, canonical);
 *     scope ← "Exam scope" (comma-split).`;

function buildRegion(certifications, kbStats) {
  const certJson = JSON.stringify(certifications, null, 2)
    .split('\n')
    .map((l, i) => (i === 0 ? l : '  ' + l))
    .join('\n');
  return `${BEGIN_MARKER}
/**
 * GENERATED REGION — rendered from KB claims by site/scripts/kb-to-content.mjs.
 * DO NOT hand-edit. Flow: KB (public: yes pages only, default-deny) → staging
 * (site/content.staging/) → Mike reviews staged.diff → publish-content.mjs
 * applies + builds + commits. Nothing pushes unattended. Design:
 * KB/pipelines/publication-layer.md in the vault.
 *
 * FIELD MAP (what is generated vs hand-maintained, and why):
 *   certifications GENERATED ← KB/${certSourcesRel} (public: yes${kbStats.publicPages === 1 ? '' : `, +${kbStats.publicPages - 1} more public page(s) — see adapters in the generator`}).
 *   Everything below this region's exports is hand-maintained: its KB sources
 *   are public: no (default-deny) or confidential — see the generator's FIELD
 *   MAP header comment for the page-by-page mapping.
${CERT_PROVENANCE}
 */

export interface Certification {
  name: string;
  abbrev: string;
  issuer: string;
  issued: string;
  issuedDisplay: string;
  expires: string | null;
  proofUrl: string | null;
  scope: string[];
}

export const certifications: Certification[] = ${certJson};
${END_MARKER}`;
}

function spliceRegion(live, region) {
  const bi = live.indexOf(BEGIN_MARKER);
  const ei = live.indexOf(END_MARKER);
  if (bi !== -1 && ei !== -1 && ei > bi) {
    return { out: live.slice(0, bi) + region + live.slice(ei + END_MARKER.length), replaced: true };
  }
  return { out: live.replace(/\s*$/, '\n\n') + region + '\n', replaced: false };
}

function extractCertifications(contentTs) {
  const m = /export const certifications: Certification\[\] = (\[[\s\S]*?\n\]);/.exec(contentTs);
  if (!m) return null;
  try {
    return JSON.parse(m[1]);
  } catch {
    return null;
  }
}

// ----------------------------------------------------------------------- main
function main() {
  const stage = process.argv.includes('--stage');
  const printRegion = process.argv.includes('--print-region');

  if (!fs.existsSync(LIVE_CONTENT)) {
    console.error(`live content.ts not found: ${LIVE_CONTENT}`);
    process.exit(1);
  }
  const pages = loadPages(KB_DIR);

  const perPage = [];
  const fragments = {};
  const unmapped = [];
  for (const page of pages) {
    if (page.confidential && CONFIDENTIAL_VALUES.has(page.confidential)) {
      perPage.push({ rel: page.rel, state: `EXCLUDED (confidential: ${page.confidential} — can never be public)` });
      continue;
    }
    if (!page.public) {
      perPage.push({ rel: page.rel, state: 'excluded (public: no — default-deny)' });
      continue;
    }
    const adapter = ADAPTERS.find((a) => a.page === page.rel);
    if (!adapter) {
      unmapped.push(page.rel);
      perPage.push({ rel: page.rel, state: 'PUBLIC BUT UNMAPPED — needs an adapter in kb-to-content.mjs before its facts can flow' });
      continue;
    }
    Object.assign(fragments, adapter.apply(page));
    perPage.push({ rel: page.rel, state: 'adapter ran' });
  }

  const certifications = fragments.certifications || [];
  const live = fs.readFileSync(LIVE_CONTENT, 'utf8');
  const baseline = committedContentTs() ?? live;
  const region = buildRegion(certifications, { publicPages: pages.filter((p) => p.public).length });
  const { out: stagedContent, replaced } = spliceRegion(baseline, region);

  if (printRegion) {
    console.log(region);
    return;
  }

  const summary = {
    kbDir: KB_DIR,
    pagesRead: pages.length,
    publicPages: pages.filter((p) => p.public).map((p) => p.rel),
    confidentialExcluded: perPage.filter((p) => p.state.includes('EXCLUDED')).map((p) => p.rel),
    unmappedPublicPages: unmapped,
    generatedExports: Object.keys(fragments),
    certifications: certifications.length,
    regionInCommittedBaseline: replaced,
  };

  console.log('--- KB → content.ts adapter (dry run summary) ---');
  console.log(JSON.stringify(summary, null, 2));

  if (!stage) {
    console.log('\nDry run only. Re-run with --stage to write site/content.staging/ (live file untouched).');
    return;
  }

  fs.mkdirSync(STAGE_DIR, { recursive: true });
  const stagedPath = path.join(STAGE_DIR, 'content.ts');
  fs.writeFileSync(stagedPath, stagedContent);

  // Diff vs the COMMITTED content.ts — what publishing would change (git diff
  // --no-index exits 1 when files differ).
  const basePath = path.join(STAGE_DIR, '.baseline-content.ts');
  fs.writeFileSync(basePath, baseline);
  let diffOut = '';
  const diff = (args) => {
    try {
      diffOut += execFileSync('git', ['diff', '--no-index', ...args], {
        encoding: 'utf8',
        maxBuffer: 64 * 1024 * 1024,
      });
    } catch (e) {
      diffOut += e.stdout || '';
    }
    diffOut += '\n';
  };
  diff(['--stat', basePath, stagedPath]);
  diff(['-U3', basePath, stagedPath]);
  fs.rmSync(basePath, { force: true });
  const diffPath = path.join(STAGE_DIR, 'staged.diff');
  fs.writeFileSync(diffPath, diffOut || '(no differences)\n');

  // Per-field differences vs the committed baseline region (if any).
  const baseCerts = extractCertifications(baseline);
  const fieldDiffs = [];
  if (!replaced) {
    fieldDiffs.push({ field: '(region)', from: '(no generated region in live file)', to: '(region introduced)' });
  } else if (baseCerts) {
    const byName = new Map((baseCerts || []).map((c) => [c.name, c]));
    for (const c of certifications) {
      const old = byName.get(c.name);
      if (!old) {
        fieldDiffs.push({ field: `certifications[${c.name}]`, from: '(absent)', to: '(new entry)' });
        continue;
      }
      for (const k of Object.keys(c)) {
        if (JSON.stringify(old[k]) !== JSON.stringify(c[k])) {
          fieldDiffs.push({ field: `certifications[${c.name}].${k}`, from: old[k], to: c[k] });
        }
      }
    }
    for (const old of baseCerts) {
      if (!certifications.some((c) => c.name === old.name)) {
        fieldDiffs.push({ field: `certifications[${old.name}]`, from: '(present)', to: '(removed)' });
      }
    }
  } else {
    fieldDiffs.push({ field: '(region)', from: '(live region not parseable)', to: '(regenerated)' });
  }

  const hash = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
  const summaryJson = {
    generatedAt: new Date().toISOString(),
    ...summary,
    fieldDifferences: fieldDiffs,
    stagedSha256: hash(stagedPath),
    liveContentSha256: hash(LIVE_CONTENT),
  };
  fs.writeFileSync(path.join(STAGE_DIR, 'stage-summary.json'), JSON.stringify(summaryJson, null, 2) + '\n');

  const perPageLines = perPage
    .map((p) => `- \`KB/${p.rel}\` — ${p.state}`)
    .join('\n');
  const diffSection = fieldDiffs.length
    ? fieldDiffs
        .map(
          (d) =>
            `- **${d.field}**: live = ${JSON.stringify(d.from)} → KB = ${JSON.stringify(d.to)} (source: KB/${certSourcesRel}, public: yes)`
        )
        .join('\n')
    : '**None.** Every generated value already matches the live file — the cert facts landed on the site (t_90718efd) before the KB backfill, and the KB now agrees. The changeset awaiting approval is the plumbing itself (generator + generated region + resume.astro consuming it), not a content change.';

  const report = `# content.ts staged diff — for Mike's approval

Generated: ${new Date().toISOString()}
Command: \`node scripts/kb-to-content.mjs --stage\` (in \`site/\`)

## What this is

Publication-layer adapter for mikejones.online ([[publication-layer]]): the
KB is read directly (read-only) and its \`public: yes\` pages are rendered
into the \`KB:BEGIN/END\` region of \`site/src/lib/content.ts\`. Only
publication-grade pages flow — every other KB page is default-deny, and
\`confidential: ghn\`/\`internal\` pages are hard-blocked (linter-enforced in
the vault). Staging itself never writes the live file; applying the staged
output to the working tree is a separate step (\`cp staging/content.ts
src/lib/content.ts\`), and the commit is the approval gate
(\`scripts/publish-content.mjs\` — commits, never pushes).

## KB pages read (${summary.pagesRead})

${perPageLines}

## Differences: KB claims vs live content.ts

${diffSection}

## Excluded from generation (by design)

- GHN venture-card text (incl. its CCAR-F course mention): source
  \`KB/business/ghn-partnership.md\` is \`confidential: ghn\` — can never be
  public, so it stays hand-edited. If the CCAR-F course-build fact should be
  generated, it needs a home on a non-confidential page that Mike marks
  \`public: yes\`.
- identity / stats / ventures / projects / adhd / career / pillars / nav:
  hand-maintained — KB sources are \`public: no\` (default-deny) or outside
  KB scope. The generator's FIELD MAP header documents each mapping.

## After you approve

\`\`\`bash
cd ~/dev/MJ_Online/site
node scripts/publish-content.mjs              # plan only — shows what would happen
node scripts/publish-content.mjs --apply \\    # applies staging + build + commit
  --include site/src/lib/content.ts \\
  --include site/src/pages/resume.astro \\
  --include site/scripts/kb-to-content.mjs \\
  --include site/scripts/publish-content.mjs \\
  --include site/.gitignore
\`\`\`

First publish includes the plumbing files (generator, resume.astro consuming
\`certifications\`, site/.gitignore ignoring \`content.staging/\`). Later
publishes need only \`site/src/lib/content.ts\`. The helper commits and NEVER
pushes — \`git push\` stays yours (Cloudflare Pages deploys on push to main).

Machine-readable: \`staging/stage-summary.json\`; full diff: \`staging/staged.diff\`.
`;
  fs.writeFileSync(path.join(STAGE_DIR, 'stage-report.md'), report);

  console.log(`\nStaged (NOT applied, NOT committed, NOT pushed):`);
  console.log(`  ${stagedPath}`);
  console.log(`  ${diffPath}`);
  console.log(`  ${path.join(STAGE_DIR, 'stage-summary.json')}`);
  console.log(`  ${path.join(STAGE_DIR, 'stage-report.md')}`);
  if (unmapped.length) {
    console.log(`\nWARNING: public: yes pages with no adapter (facts cannot flow): ${unmapped.join(', ')}`);
  }
}

main();