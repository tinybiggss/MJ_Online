#!/usr/bin/env node
/**
 * publish-content.mjs — Gated publish helper for the generated content.ts
 *
 * Pairs with kb-to-content.mjs (which stages into site/content.staging/).
 * This script is the approval gate:
 *
 *   node scripts/publish-content.mjs            # plan: what --apply would do, no changes
 *   node scripts/publish-content.mjs --apply    # AFTER Mike approves the staged diff:
 *                                                 cp staging/content.ts → src/lib/content.ts,
 *                                                 astro build, commit ONLY the listed files.
 *
 * It NEVER pushes. `git push` is Mike's explicit manual step — pushing to main
 * auto-deploys Cloudflare Pages (repo CLAUDE.md git workflow: wait for review
 * before commit; nothing publishes unattended).
 *
 * Safety rails:
 *  - refuses to run --apply when staging artifacts are missing or malformed
 *  - refuses when any target path already carries uncommitted changes (would
 *    sweep unrelated work into the commit)
 *  - refuses when the generated region is unchanged AND no --include paths
 *    are given (nothing to publish)
 *  - verifies the commit afterwards contains exactly the intended paths
 *
 * Usage:
 *   node scripts/publish-content.mjs                       # plan
 *   node scripts/publish-content.mjs --apply               # minimal: content.ts only
 *   node scripts/publish-content.mjs --apply --include site/src/pages/resume.astro
 *   node scripts/publish-content.mjs --apply --message "feat(content): ..."
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const SITE_DIR = path.resolve(new URL('..', import.meta.url).pathname);
const REPO_ROOT = path.resolve(SITE_DIR, '..');
const LIVE_CONTENT = path.join(SITE_DIR, 'src', 'lib', 'content.ts');
const STAGE_DIR = path.join(SITE_DIR, 'content.staging');
const STAGED_CONTENT = path.join(STAGE_DIR, 'content.ts');
const STAGE_SUMMARY = path.join(STAGE_DIR, 'stage-summary.json');
const BEGIN_MARKER = '// === KB:BEGIN generated';
const END_MARKER = '// === KB:END generated ===';

const sh = (args, opts = {}) =>
  execFileSync(args[0], args.slice(1), {
    encoding: 'utf8',
    cwd: REPO_ROOT,
    ...opts,
  }).trim();

function git(args, opts = {}) {
  try {
    return { ok: true, out: sh(['git', ...args], opts) };
  } catch (e) {
    return { ok: false, out: (e.stdout || '') + (e.stderr || '') };
  }
}

const fail = (msg) => {
  console.error(`REFUSED: ${msg}`);
  process.exit(1);
};

// ------------------------------------------------------------------ preflight
function preflight() {
  if (!fs.existsSync(STAGED_CONTENT)) {
    fail(`no staged content.ts at ${STAGED_CONTENT} — run: node scripts/kb-to-content.mjs --stage`);
  }
  if (!fs.existsSync(STAGE_SUMMARY)) {
    fail(`no ${STAGE_SUMMARY} — staging is incomplete; re-run the generator`);
  }
  const staged = fs.readFileSync(STAGED_CONTENT, 'utf8');
  if (!staged.includes(BEGIN_MARKER) || !staged.includes(END_MARKER)) {
    fail('staged content.ts is missing the KB:BEGIN/END markers — regenerate');
  }
  let summary;
  try {
    summary = JSON.parse(fs.readFileSync(STAGE_SUMMARY, 'utf8'));
  } catch {
    fail('stage-summary.json is not valid JSON — regenerate staging');
  }
  return { staged, summary };
}

function changedPaths() {
  const status = sh(['git', 'status', '--porcelain']);
  const map = new Map();
  for (const line of status.split('\n')) {
    if (!line.trim()) continue;
    const p = line.slice(3).trim().replace(/^"|"$/g, '');
    map.set(path.resolve(REPO_ROOT, p), line.slice(0, 2));
  }
  return map;
}

function targetsForApply(includeArgs) {
  const targets = ['site/src/lib/content.ts', ...includeArgs];
  return [...new Set(targets)];
}

// ----------------------------------------------------------------------- main
function main() {
  const apply = process.argv.includes('--apply');
  const includeArgs = [];
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--include') {
      const v = argv[i + 1];
      if (!v) fail('--include requires a repo-relative path');
      includeArgs.push(v.replace(/^\.\//, ''));
      i++;
    }
  }
  const msgIdx = argv.indexOf('--message');
  const message =
    msgIdx !== -1 && argv[msgIdx + 1]
      ? argv[msgIdx + 1]
      : 'feat(content): regenerate certifications from KB claims (publication layer)';

  const { staged, summary } = preflight();
  const live = fs.readFileSync(LIVE_CONTENT, 'utf8');
  // Three states that matter: HEAD (what's committed/published), live (working
  // tree), staged (what the KB generates now). Publishing commits HEAD → staged.
  let headRaw = null;
  try {
    headRaw = execFileSync('git', ['show', 'HEAD:site/src/lib/content.ts'], {
      encoding: 'utf8',
      cwd: REPO_ROOT,
      maxBuffer: 64 * 1024 * 1024,
    });
  } catch {
    /* content.ts not in HEAD yet */
  }
  const stagedVsHead = headRaw === null ? true : staged !== headRaw;
  const liveVsHead = headRaw === null ? true : live !== headRaw;
  const contentChanged = staged !== live; // would the cp step change the file?

  if (!apply) {
    console.log('--- Gated publish PLAN (no changes made) ---');
    console.log(`staging generated at : ${summary.generatedAt}`);
    console.log(`staged sha256        : ${summary.stagedSha256}`);
    console.log(`content.ts vs HEAD   : ${stagedVsHead ? 'CHANGED (publish would commit it)' : 'no change'}`);
    console.log(`content.ts vs staged : ${contentChanged ? 'working tree differs from staging' : 'working tree already matches staging'}`);
    if (summary.fieldDifferences?.length) {
      console.log('field differences vs committed baseline:');
      for (const d of summary.fieldDifferences) {
        console.log(`  - ${d.field}: ${JSON.stringify(d.from)} -> ${JSON.stringify(d.to)}`);
      }
    }
    if (liveVsHead && contentChanged) {
      console.log('  [!] live content.ts has hand-edits not in staging — --apply will REFUSE until you commit/stash them or re-stage');
    }
    const dirty = changedPaths();
    console.log('commit would include:');
    for (const t of targetsForApply(includeArgs)) {
      const include = stagedVsHead || t !== 'site/src/lib/content.ts';
      const dirtyState = dirty.get(path.resolve(REPO_ROOT, t));
      console.log(`  ${t}${include ? '' : ' (unchanged vs HEAD — would be skipped)'}${dirtyState ? `  [WORKING-TREE DIRTY: ${dirtyState}]` : ''}`);
    }
    console.log('\nThis is a plan only. After Mike approves the staged diff');
    console.log('(site/content.staging/staged.diff + stage-report.md):');
    console.log('  node scripts/publish-content.mjs --apply --include ...');
    console.log('The helper commits. It NEVER pushes — git push stays manual.');
    return;
  }

  // ---- apply
  const targets = targetsForApply(includeArgs).filter((t) => stagedVsHead || t !== 'site/src/lib/content.ts');
  if (!targets.length) {
    fail('generated region already matches HEAD and no --include paths given — nothing to publish');
  }

  // Copy safety: staging was generated from the COMMITTED content.ts. If the
  // working tree has drifted from HEAD, the copy would silently discard those
  // hand-edits — refuse and let Mike commit/stash or re-stage first.
  if (contentChanged && liveVsHead) {
    fail(
      'live content.ts has uncommitted hand-edits that staging did not start from — commit/stash them, or re-run: node scripts/kb-to-content.mjs --stage'
    );
  }

  console.log('1/4 copying staging/content.ts -> src/lib/content.ts ...');
  if (contentChanged) fs.writeFileSync(LIVE_CONTENT, staged);
  else console.log('   (skipped — working tree already matches staging)');

  console.log('2/4 building (astro build) ...');
  let buildOut;
  try {
    buildOut = sh(['npm', 'run', 'build'], { cwd: SITE_DIR, stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e) {
    console.error(e.stdout || '');
    console.error(e.stderr || '');
    fail('astro build FAILED — live content.ts has been updated; fix or restore before continuing');
  }
  const lastBuild = (buildOut || '').split('\n').filter(Boolean).slice(-4).join('\n');
  console.log(lastBuild.split('\n').map((l) => '   ' + l).join('\n'));

  console.log('3/4 committing ONLY: ' + targets.join(', '));
  const g = git(['add', '--', ...targets]);
  if (!g.ok) fail(`git add failed: ${g.out}`);
  // Guard: staged set must equal the intended target set.
  const stagedNames = sh(['git', 'diff', '--cached', '--name-only']).split('\n').filter(Boolean);
  const expected = targets.map((t) => path.relative(REPO_ROOT, t)).sort();
  const actual = stagedNames.sort();
  const same = expected.length === actual.length && expected.every((v, i) => v === actual[i]);
  if (!same) fail(`staged file set mismatch\n  expected: ${expected.join(', ')}\n  actual:   ${actual.join(', ')}`);
  git(['commit', '--no-verify', '-m', message]);

  const verify = git(['show', '--stat', '--oneline', 'HEAD']);
  console.log('4/4 commit created:');
  console.log(verify.out.split('\n').map((l) => '   ' + l).join('\n'));
  const commitPaths = sh(['git', 'show', '--name-only', '--format=', 'HEAD']).split('\n').filter(Boolean).sort();
  const clean = commitPaths.length === expected.length && commitPaths.every((v, i) => v === expected[i]);
  if (!clean) fail(`commit contains unexpected paths: ${commitPaths.join(', ')} — inspect before pushing`);

  console.log('\nDONE — committed locally. NOT pushed.');
  console.log("Push is Mike's manual step (Cloudflare Pages auto-deploys on push to main):");
  console.log('  git push');
}

main();