#!/usr/bin/env node
/**
 * feed-notice.mjs — the notice loop: would a rebuild change what is published, and what
 * has happened that the record doesn't know about?
 *
 * Implements docs/plans/feed-pipeline-v1.md §4. Compares the vault and Substack against
 * the artifacts committed under public/, which are the baseline: there is no state file
 * of the world to seed or to lie. Five findings:
 *   F1 unlogged_publication       a Substack post the publication log doesn't have
 *   F2 unrecorded_surface         a surface in a log note's prose but not its frontmatter
 *   F3 kb_drift                   a public KB page whose published projection changed
 *   F4 rebuild_would_change_output  regenerating public/ would produce something else
 *   F5 source_unreachable         a source could not be evaluated, which is not silence
 *
 * Writes in exactly two places: the staging tree and the kanban board. Never the vault,
 * never public/, never a commit. git runs only as `status --porcelain` on two paths. The
 * generators it runs write to a temp dir that is removed before it returns. It is not
 * wired into astro:build:start, because a build must not create cards.
 *
 * Usage:
 *   node scripts/feed-notice.mjs            # normal run
 *   node scripts/feed-notice.mjs --dry      # compute + print, write nothing, card nothing
 *   node scripts/feed-notice.mjs --no-net   # skip Substack: F1 and the feed half of F4
 *   node scripts/feed-notice.mjs --json     # one JSON object on stdout
 *
 * Environment: VAULT_DIR, HERMES_BIN, FEED_NOTICE_ASSIGNEE (content), FEED_NOTICE_BOARD
 * (default), FEED_NOTICE_PRIORITY (40). For tests: FEED_NOTICE_STAGING, FEED_NOTICE_NO_CARD=1.
 *
 * Exit: 0 nothing to report · 10 findings staged (card attempted) · 1 detector error
 * (unreadable or unparsable vault input) · 2 VAULT_DIR absent (silent no-op).
 */

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  SUBSTACK_FEED,
  identityKeys,
  isConfidential,
  normaliseUrl,
  parseSubstackRss,
  readFrontmatter,
  titleSlug,
} from './feed-build.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(HERE, '..');
const REPO = path.resolve(SITE, '..');

const NOTICE_SINCE = '2026-10-30'; // Social/Published/README.md rule 5 forbids bulk backfill, so earlier RSS items stay unlogged on purpose.

const EXIT_CLEAN = 0;
const EXIT_ERROR = 1;
const EXIT_NO_VAULT = 2;
const EXIT_STAGED = 10;

const FETCH_TIMEOUT_MS = 15000;
const CHILD_TIMEOUT_MS = 120000;
const NAG_AFTER_DAYS = 7;
const KEEP_RUN_DIRS = 14;
const RUN_DIR_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}-\d{2}$/;
const TIME_ZONE = 'America/Los_Angeles';

// youtube.com is excluded on purpose: the one existing log note embeds a class video and
// says it is not a surface of the article. That false positive would teach Mike to ignore F2.
const SURFACE_HOSTS = {
  'bsky.app': 'bluesky',
  'linkedin.com': 'linkedin',
  'facebook.com': 'facebook',
  'instagram.com': 'instagram',
  'x.com': 'x',
  'twitter.com': 'twitter',
  'tiktok.com': 'tiktok',
};

const FINDING_LABELS = {
  unlogged_publication: 'F1',
  unrecorded_surface: 'F2',
  kb_drift: 'F3',
  rebuild_would_change_output: 'F4',
  source_unreachable: 'F5',
};
const SEVERITY_ORDER = ['high', 'medium', 'low'];

// Regenerating always moves these, so comparing them would report a change every time.
const VOLATILE_KEYS = new Set(['generated_at', 'generatedAt']);
// The nightly KB pass moves these without changing a published claim (plan D2). A real edit
// still fires through the digest, so these are recorded in notice.json rather than fired on.
const BOOKKEEPING_KEYS = new Set(['updated', 'last_modified', 'orphans']);

class DetectorError extends Error {}

const warn = (message) => console.error(`[feed-notice] ${message}`);

// --- time ------------------------------------------------------------------

function timeParts(date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: TIME_ZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(date)
      .map((part) => [part.type, part.value]),
  );
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    clock: `${parts.hour}:${parts.minute}`,
    dirName: `${parts.year}-${parts.month}-${parts.day}T${parts.hour}-${parts.minute}`,
  };
}

const daysBetween = (fromDate, toDate) => (Date.parse(toDate) - Date.parse(fromDate)) / 86400000;

// --- the publication log ---------------------------------------------------

function stripComments(text) {
  return text.replace(/<!--[\s\S]*?(?:-->|$)/g, '');
}

/** Strict: a note whose frontmatter won't parse has lost its platforms, so it can't be judged. */
function readStrict(file, vaultDir) {
  try {
    return readFrontmatter(file, { strict: true });
  } catch (err) {
    throw new DetectorError(`cannot read ${path.relative(vaultDir, file)}: ${err.message.split('\n')[0]}`);
  }
}

/** [[Social/Drafts/2026-10-29-slug]] or [[...|alias]] → 2026-10-29-slug. */
function wikilinkLeaf(value) {
  const match = String(value).match(/\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/);
  return (match ? match[1] : String(value)).trim().split('/').pop();
}

function draftIsConfidential(value, vaultDir) {
  if (!value) return false;
  const file = path.join(vaultDir, 'Social', 'Drafts', `${wikilinkLeaf(value)}.md`);
  if (!fs.existsSync(file)) return false;
  try {
    return isConfidential(readFrontmatter(file, { strict: true }).fm);
  } catch {
    // Drafts are freer-form than log notes. One that can't be read can't be cleared, so withhold.
    return true;
  }
}

function readPublicationLog(vaultDir) {
  const dir = path.join(vaultDir, 'Social', 'Published');
  let names;
  try {
    names = fs.readdirSync(dir);
  } catch (err) {
    throw new DetectorError(`cannot read Social/Published: ${err.message}`);
  }
  return names
    .filter((name) => name.endsWith('.md') && !/^readme/i.test(name))
    .sort()
    .map((name) => {
      const { fm, body } = readStrict(path.join(dir, name), vaultDir);
      const platforms = (Array.isArray(fm.platforms) ? fm.platforms : []).filter(Boolean);
      const piece = String(fm.piece || path.basename(name, '.md'));
      return {
        piece,
        stem: path.basename(name, '.md'),
        sourceDraft: fm.source_draft ? wikilinkLeaf(fm.source_draft) : null,
        body,
        loggedUrls: new Set(platforms.map((p) => normaliseUrl(p.url)).filter(Boolean)),
        keys: identityKeys({ id: piece, title: fm.title, platforms }),
        confidential: isConfidential(fm) || draftIsConfidential(fm.source_draft, vaultDir),
      };
    });
}

// --- F1: Substack posts the log doesn't have -------------------------------

const DATE_PREFIX = /^\d{4}-\d{2}-\d{2}-/;

/**
 * Strict and caught, on purpose: feed-build's lenient fallback logs the filename to stdout,
 * which would name a confidential draft and break --json. A draft that won't parse can't be
 * cleared either, so it is no match, the same way draftIsConfidential withholds it.
 */
function readDrafts(vaultDir, log) {
  const dir = path.join(vaultDir, 'Social', 'Drafts');
  let names;
  try {
    names = fs.readdirSync(dir);
  } catch {
    return [];
  }
  const withheld = new Set(log.filter((note) => note.confidential).flatMap((note) => [note.stem, note.piece, note.sourceDraft]).filter(Boolean));
  return names
    .filter((name) => name.endsWith('.md') && !/^readme/i.test(name))
    .sort()
    .flatMap((name) => {
      const stem = path.basename(name, '.md');
      let fm;
      try {
        fm = readFrontmatter(path.join(dir, name), { strict: true }).fm;
      } catch {
        return [];
      }
      const logLink = String(fm.published_log ?? '').includes('Social/Published/') ? wikilinkLeaf(fm.published_log) : null;
      return [
        {
          stem,
          title: typeof fm.title === 'string' ? fm.title.trim() : '',
          url: normaliseUrl(fm.url),
          logSlug: logLink ? titleSlug(logLink.replace(DATE_PREFIX, '')) : '',
          withheld: isConfidential(fm) || withheld.has(stem) || withheld.has(logLink),
        },
      ];
    });
}

/**
 * The first tier with any match decides. Anything but one clear match is no match: a piece's
 * companion note can share its title (…-packaging does), and a wrong stem is a wrong record,
 * while no match asks Mike to rename. A withheld draft ends the search too, rather than
 * letting a weaker tier name something else for a post that draft claims.
 */
function findDraft(entry, urlSlug, drafts) {
  const url = normaliseUrl(entry.url);
  const title = titleSlug(entry.title);
  const tiers = [
    // A published_log link only says this post if its name does: every published draft has one.
    (draft) => (url && draft.url === url) || (draft.logSlug && [urlSlug, title].includes(draft.logSlug)),
    (draft) => title && titleSlug(draft.title) === title,
  ];
  for (const inTier of tiers) {
    const matches = drafts.filter(inTier);
    if (matches.length) return matches.length === 1 && !matches[0].withheld ? matches[0] : null;
  }
  return null;
}

function yamlUrl(url) {
  return /^[\w:/.\-?=&%~+]+$/.test(url) ? url : JSON.stringify(url);
}

// A draft stem is a filename, so unlike a slug it can hold anything YAML would misread.
function yamlPiece(piece) {
  return /^\d{4}-\d{2}-\d{2}-[\w.-]*$/.test(piece) ? piece : JSON.stringify(piece);
}

/** Byte-for-byte a valid Social/Published note, per its README's schema. */
function logNoteProposal(piece, draft, entry, date) {
  const sourceDraft = draft ? `source_draft: ${JSON.stringify(`[[Social/Drafts/${draft.stem}]]`)}\n` : '';
  const noMatch = draft ? '' : "- No Social/Drafts note matched this post — rename this file to the draft's stem if one exists.\n";
  return `---
piece: ${yamlPiece(piece)}
title: ${JSON.stringify(draft?.title || entry.title)}
status: published
audience: [public]
first_published: ${date}
${sourceDraft}platforms:
  - platform: substack
    form: article
    url: ${yamlUrl(entry.url)}
    date: ${date}
---

# ${piece} — publication log

One piece, one record. This note carries only the surfaces it went live on.

## Log

- **${date}** — Substack article published, live at ${entry.url}.
${noMatch}`;
}

function detectUnlogged(rssItems, log, vaultDir) {
  const known = new Set(log.flatMap((note) => note.keys));
  const drafts = readDrafts(vaultDir, log);
  const findings = [];
  let preHorizon = 0;
  for (const entry of rssItems) {
    const date = timeParts(new Date(entry.date_published)).date;
    if (date < NOTICE_SINCE) {
      preHorizon += 1;
      continue;
    }
    // The URL slug, not the title: Substack freezes it at publish, while A/B tests move titles.
    const slug = titleSlug(entry.id.replace(/^substack-/, '')) || titleSlug(entry.title);
    const rssPiece = `${date}-${slug}`;
    const draft = findDraft(entry, slug, drafts);
    const piece = draft?.stem ?? rssPiece;
    // id:<draft stem> too: one note per piece, and the proposed cp would overwrite that note.
    if ([...identityKeys(entry), `id:${rssPiece}`, `id:${piece}`].some((key) => known.has(key))) continue;
    findings.push({
      kind: 'unlogged_publication',
      severity: 'high',
      id: `unlogged:${piece}`,
      title: `Substack published "${entry.title}" and the log has no record of it`,
      detail: `No Social/Published note matches its URL or title. It went out ${entry.date_published}.`,
      evidence: [entry.url],
      proposal: { path: `proposals/${piece}.md`, content: logNoteProposal(piece, draft, entry, date) },
    });
  }
  return { findings, preHorizon };
}

// --- F2: surfaces in a log note's prose but not its frontmatter ------------

function surfacePlatform(url) {
  let host;
  try {
    host = new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
  const match = Object.keys(SURFACE_HOSTS).find((known) => host === known || host.endsWith(`.${known}`));
  return match ? SURFACE_HOSTS[match] : null;
}

function surfacesInBody(body) {
  const surfaces = [];
  // The nearest date at or above the URL: a log entry's date opens it, and its URL may wrap below.
  let date = null;
  for (const line of stripComments(body).split(/\r?\n/)) {
    date = line.match(/\b\d{4}-\d{2}-\d{2}\b/)?.[0] ?? date;
    for (const raw of line.match(/https?:\/\/[^\s<>()[\]"'`]+/g) || []) {
      const url = raw.replace(/[.,;:!?*_]+$/, '');
      const platform = surfacePlatform(url);
      if (platform) surfaces.push({ platform, url, date });
    }
  }
  return surfaces;
}

function platformsPatch(surfaces) {
  return surfaces
    .map(({ platform, url, date }) => `  - platform: ${platform}\n    form: post\n    url: ${yamlUrl(url)}\n    date: ${date ?? 'null'}\n`)
    .join('');
}

function detectSurfaces(log) {
  const findings = [];
  for (const note of log) {
    if (note.confidential) continue;
    const seen = new Set();
    const missing = surfacesInBody(note.body).filter(({ url }) => {
      const key = normaliseUrl(url);
      if (!key || note.loggedUrls.has(key) || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    const patchPath = `patches/${note.piece}.platforms.yaml`;
    const patch = platformsPatch(missing);
    for (const platform of new Set(missing.map((surface) => surface.platform))) {
      findings.push({
        kind: 'unrecorded_surface',
        severity: 'medium',
        id: `surface:${note.piece}:${platform}`,
        title: `${note.piece} went live on ${platform}, and only its prose says so`,
        detail: 'The URL is in the note body but not in frontmatter platforms:, so the feed cannot carry it as a mirror.',
        evidence: missing.filter((surface) => surface.platform === platform).map((surface) => surface.url),
        proposal: { path: patchPath, content: patch },
      });
    }
  }
  return findings;
}

// --- generators ------------------------------------------------------------

function runGenerator(script, args, env) {
  const result = spawnSync(process.execPath, [path.join(HERE, script), ...args], {
    cwd: SITE,
    encoding: 'utf8',
    timeout: CHILD_TIMEOUT_MS,
    env: { ...process.env, ...env },
  });
  if (result.error) throw new DetectorError(`${script} did not run: ${result.error.message}`);
  return result;
}

function readJsonIfPresent(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}

function currentDigest(vaultDir, committedKbDir) {
  const result = runGenerator('kb-to-agents.mjs', ['--digest', '--json'], {
    KB_DIR: path.join(vaultDir, 'KB'),
    KB_OUT_DIR: committedKbDir,
  });
  if (result.status !== 0) {
    throw new DetectorError(`kb-to-agents --digest exited ${result.status}: ${(result.stderr || result.stdout).trim().split('\n').pop()}`);
  }
  return JSON.parse(result.stdout);
}

function rebuildKb(vaultDir, tempRoot) {
  const kbOut = path.join(tempRoot, 'agents', 'kb');
  const result = runGenerator('kb-to-agents.mjs', ['--json'], {
    KB_DIR: path.join(vaultDir, 'KB'),
    KB_OUT_DIR: kbOut,
    LLMS_OUT: path.join(tempRoot, 'llms.txt'),
  });
  if (result.status !== 0) throw new DetectorError(`kb-to-agents exited ${result.status}: ${result.stderr.trim().split('\n').pop()}`);
  return kbOut;
}

/** Null when the generator kept its output rather than rewriting it, i.e. Substack was down. */
function rebuildFeed(vaultDir, tempRoot, feedArgs) {
  const feedOut = path.join(tempRoot, 'feed');
  const result = runGenerator('feed-build.mjs', feedArgs, { VAULT_DIR: vaultDir, FEED_OUT_DIR: feedOut });
  if (result.status !== 0) throw new DetectorError(`feed-build exited ${result.status}: ${result.stderr.trim().split('\n')[0]}`);
  return fs.existsSync(path.join(feedOut, 'feed.json')) ? feedOut : null;
}

// --- F3: KB pages whose published projection changed -----------------------

/**
 * A page leaves the export by going confidential or `public: no` as easily as by being
 * deleted, and this can't tell which. So it is counted, never named.
 */
function withdrawnFinding(count) {
  return {
    kind: 'kb_drift',
    severity: 'medium',
    id: 'kb:withdrawn',
    title: `${count} published KB file(s) are no longer in the export`,
    detail: 'A rebuild will withdraw them. Their names are left out because the page may no longer be public.',
    evidence: [`${count} file(s) under /agents/kb/`],
    proposal: null,
  };
}

function baseIdOf(fileName) {
  return fileName.replace(/\.md$/, '').replace(/-part\d+$/, '');
}

function detectKbDrift({ current, committedDigest, committedIndex, rebuiltIndex, committedKbDir }) {
  const findings = [];
  const titles = new Map([...(committedIndex?.pages ?? []), ...(rebuiltIndex?.pages ?? [])].map((page) => [page.id, page.title]));
  let withdrawn = 0;

  if (committedDigest) {
    for (const [id, page] of Object.entries(current.pages)) {
      const before = committedDigest.pages?.[id]?.digest;
      if (before === page.digest) continue;
      const url = `/agents/kb/${page.files[0]}`;
      const title = titles.get(id) ?? id;
      findings.push({
        kind: 'kb_drift',
        severity: 'medium',
        id: `kb:${id}`,
        title: before ? `"${title}" changed since the published export` : `"${title}" is new since the published export`,
        detail: `Public URL ${url}.`,
        evidence: [url, `committed ${before ?? 'none'}`, `current ${page.digest}`],
        proposal: null,
      });
    }
    withdrawn += Object.keys(committedDigest.pages ?? {}).filter((id) => !current.pages[id]).length;
  }

  if (committedIndex) {
    const listed = new Set(committedIndex.pages.flatMap((page) => page.files ?? []));
    const onDisk = fs.readdirSync(committedKbDir).filter((name) => name.endsWith('.md'));
    for (const name of onDisk.filter((file) => !listed.has(file)).sort()) {
      if (!current.pages[baseIdOf(name)]) {
        withdrawn += 1;
        continue;
      }
      findings.push({
        kind: 'kb_drift',
        severity: 'medium',
        id: `drift:site/public/agents/kb/${name}`,
        title: `Orphan in the published export: ${name}`,
        detail: 'The committed index.json does not list it, so it is a file that was published and no longer should be.',
        evidence: [`/agents/kb/${name}`],
        proposal: null,
      });
    }
  }

  if (withdrawn) findings.push(withdrawnFinding(withdrawn));
  return findings;
}

// --- F4: would a rebuild change the output? --------------------------------

function diffJson(before, after, at, diffs) {
  if (Array.isArray(before) && Array.isArray(after)) {
    if (before.length !== after.length) diffs.content.push(`${at}.length`);
    const shared = Math.min(before.length, after.length);
    for (let i = 0; i < shared; i += 1) diffJson(before[i], after[i], `${at}[${i}]`, diffs);
    return;
  }
  const bothObjects = before && after && typeof before === 'object' && typeof after === 'object' && !Array.isArray(before) && !Array.isArray(after);
  if (bothObjects) {
    for (const key of new Set([...Object.keys(before), ...Object.keys(after)])) {
      if (VOLATILE_KEYS.has(key)) continue;
      const child = at ? `${at}.${key}` : key;
      if (BOOKKEEPING_KEYS.has(key)) {
        if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) diffs.bookkeeping.push(child);
      } else {
        diffJson(before[key], after[key], child, diffs);
      }
    }
    return;
  }
  if (before !== after) diffs.content.push(at);
}

function comparableText(name, text) {
  // Atom's feed-level <updated> falls back to the clock only when there are no entries.
  if (name.endsWith('.xml') && !text.includes('<entry>')) return text.replace(/<updated>[^<]*<\/updated>/g, '');
  if (name.endsWith('.md')) return text.replace(/^updated: .*\n/m, '');
  return text;
}

function listFiles(root, dir = root) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? listFiles(root, full) : [path.relative(root, full).split(path.sep).join('/')];
  });
}

/** `files` is [servedPath, committedFile, rebuiltFile] for each artifact to compare. */
function compareFiles(files) {
  const changed = [];
  const removed = [];
  const bookkeeping = [];
  for (const [served, committedFile, rebuiltFile] of files) {
    const hasCommitted = fs.existsSync(committedFile);
    const hasRebuilt = fs.existsSync(rebuiltFile);
    if (!hasRebuilt) {
      removed.push(served);
      continue;
    }
    if (!hasCommitted) {
      changed.push(served);
      continue;
    }
    const before = fs.readFileSync(committedFile, 'utf8');
    const after = fs.readFileSync(rebuiltFile, 'utf8');
    if (before === after) continue;
    if (served.endsWith('.json')) {
      const diffs = { content: [], bookkeeping: [] };
      diffJson(JSON.parse(before), JSON.parse(after), '', diffs);
      if (diffs.content.length) changed.push(served);
      else if (diffs.bookkeeping.length) bookkeeping.push(served);
    } else if (comparableText(served, before) === comparableText(served, after)) {
      bookkeeping.push(served);
    } else {
      changed.push(served);
    }
  }
  return { changed, removed, bookkeeping };
}

function feedSummary(committedDir, rebuiltDir) {
  const before = readJsonIfPresent(path.join(committedDir, 'feed.json'))?.items ?? [];
  const after = readJsonIfPresent(path.join(rebuiltDir, 'feed.json'))?.items ?? [];
  const delta = after.length - before.length;
  if (delta) return `${delta > 0 ? '+' : ''}${delta} item${Math.abs(delta) === 1 ? '' : 's'}`;
  const diffs = { content: [], bookkeeping: [] };
  diffJson(before, after, '', diffs);
  return diffs.content.length ? `${diffs.content.length} item field(s) changed` : 'feed metadata changed';
}

function detectFeedRebuild(committedDir, rebuiltDir) {
  const names = [...new Set([...listFiles(committedDir), ...listFiles(rebuiltDir)])].sort();
  const files = names.map((name) => [`/feed/${name}`, path.join(committedDir, name), path.join(rebuiltDir, name)]);
  const { changed, removed, bookkeeping } = compareFiles(files);
  const paths = [...changed, ...removed];
  if (!paths.length) return { findings: [], bookkeeping };
  const summary = feedSummary(committedDir, rebuiltDir);
  return {
    bookkeeping,
    findings: [
      {
        kind: 'rebuild_would_change_output',
        severity: 'high',
        id: 'drift:site/public/feed',
        title: `A rebuild would change the published feed (${summary})`,
        detail: summary,
        evidence: paths,
        proposal: null,
      },
    ],
  };
}

function kbSummary(committedDigest, rebuiltDigest) {
  const parts = [];
  const before = Object.keys(committedDigest?.pages ?? {});
  const after = Object.keys(rebuiltDigest?.pages ?? {});
  if (before.length !== after.length) parts.push(`${before.length}→${after.length} pages`);
  const moved = after.filter((id) => committedDigest?.pages?.[id] && committedDigest.pages[id].digest !== rebuiltDigest.pages[id].digest);
  if (moved.length) parts.push(`digest changed on ${moved.length} page${moved.length === 1 ? '' : 's'}`);
  return parts.join(', ') || 'export files changed';
}

function detectKbRebuild({ committedPublic, tempRoot, kbOut, committedDigest, current }) {
  const committedKb = path.join(committedPublic, 'agents', 'kb');
  const names = [...new Set([...listFiles(committedKb), ...listFiles(kbOut)])].sort();
  const files = names.map((name) => [`/agents/kb/${name}`, path.join(committedKb, name), path.join(kbOut, name)]);
  files.push(['/llms.txt', path.join(committedPublic, 'llms.txt'), path.join(tempRoot, 'llms.txt')]);
  const { changed, removed, bookkeeping } = compareFiles(files);
  // Same rule as F3: a file leaving the export may have gone private, so only a part of a
  // page that is still public is named.
  const namedRemovals = removed.filter((served) => current.pages[baseIdOf(path.basename(served))]);
  const unnamed = removed.length - namedRemovals.length;
  const evidence = [...changed, ...namedRemovals, ...(unnamed ? [`${unnamed} file(s) withdrawn`] : [])];
  if (!evidence.length) return { findings: [], bookkeeping };
  const summary = kbSummary(committedDigest, readJsonIfPresent(path.join(kbOut, 'digest.json')));
  return {
    bookkeeping,
    findings: [
      {
        kind: 'rebuild_would_change_output',
        severity: 'high',
        id: 'drift:site/public/agents/kb',
        title: `A rebuild would change the published agent export (${summary})`,
        detail: summary,
        evidence,
        proposal: null,
      },
    ],
  };
}

function defaultGitStatus() {
  const result = spawnSync('git', ['status', '--porcelain', '--', 'site/public/feed', 'site/public/agents'], { cwd: REPO, encoding: 'utf8' });
  if (result.error || result.status !== 0) {
    warn(`git status failed, baseline cleanliness not checked: ${result.error?.message ?? result.stderr.trim()}`);
    return '';
  }
  return result.stdout;
}

function dirtyBaselineFinding(porcelain) {
  const lines = porcelain.split('\n').filter(Boolean);
  if (!lines.length) return [];
  // A deleted export file may be a page that went private, so deletions are counted, not named.
  const kept = lines.filter((line) => !/^( D|D )/.test(line));
  const deletions = lines.length - kept.length;
  return [
    {
      kind: 'rebuild_would_change_output',
      severity: 'low',
      id: 'drift:site/public:uncommitted',
      title: 'the baseline on disk is not what shipped',
      detail: `${lines.length} uncommitted change(s) under site/public/feed and site/public/agents.`,
      evidence: [...kept.slice(0, 40), ...(deletions ? [`${deletions} deletion(s)`] : [])],
      proposal: null,
    },
  ];
}

// --- F5: sources that could not be evaluated -------------------------------

function sourceFinding(id, title, detail, evidence) {
  return { kind: 'source_unreachable', severity: 'low', id, title, detail, evidence, proposal: null };
}

async function loadRss({ noNet, rssXml }) {
  if (noNet) return { items: [], skippedReason: 'network skipped (--no-net)' };
  try {
    let xml = rssXml;
    if (xml === undefined) {
      const res = await fetch(SUBSTACK_FEED, {
        headers: { 'user-agent': 'mikejones.online feed notice' },
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      xml = await res.text();
    }
    const items = parseSubstackRss(xml);
    if (!items.length) throw new Error('response contained no usable items');
    return { items, skippedReason: null };
  } catch (err) {
    return { items: [], skippedReason: err.message };
  }
}

// --- detection -------------------------------------------------------------

async function detect({ vaultDir, publicDir, noNet, rssXml, feedArgs, gitStatus }) {
  const kbDir = path.join(vaultDir, 'KB');
  if (!fs.existsSync(kbDir)) throw new DetectorError(`cannot read KB/ in ${vaultDir}`);

  const log = readPublicationLog(vaultDir);
  const rss = await loadRss({ noNet, rssXml });
  const committedKbDir = path.join(publicDir, 'agents', 'kb');
  const committedDigest = readJsonIfPresent(path.join(committedKbDir, 'digest.json'));
  const committedIndex = readJsonIfPresent(path.join(committedKbDir, 'index.json'));
  const current = currentDigest(vaultDir, committedKbDir);
  const findings = [];
  const bookkeeping = [];

  let preHorizon = null;
  const substackReadable = !rss.skippedReason;
  if (substackReadable) {
    const unlogged = detectUnlogged(rss.items, log, vaultDir);
    findings.push(...unlogged.findings);
    preHorizon = unlogged.preHorizon;
  }
  findings.push(...detectSurfaces(log));

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'feed-notice-'));
  try {
    const kbOut = rebuildKb(vaultDir, tempRoot);
    const rebuiltIndex = readJsonIfPresent(path.join(kbOut, 'index.json'));
    findings.push(...detectKbDrift({ current, committedDigest, committedIndex, rebuiltIndex, committedKbDir }));

    const kbRebuild = detectKbRebuild({ committedPublic: publicDir, tempRoot, kbOut, committedDigest, current });
    findings.push(...kbRebuild.findings);
    bookkeeping.push(...kbRebuild.bookkeeping);

    let feedReason = rss.skippedReason;
    if (!feedReason) {
      const feedOut = rebuildFeed(vaultDir, tempRoot, feedArgs);
      if (feedOut) {
        const feedRebuild = detectFeedRebuild(path.join(publicDir, 'feed'), feedOut);
        findings.push(...feedRebuild.findings);
        bookkeeping.push(...feedRebuild.bookkeeping);
      } else {
        // Comparing against nothing would manufacture drift.
        feedReason = 'feed-build could not fetch Substack and kept its output';
      }
    }
    if (feedReason) {
      findings.push(
        sourceFinding(
          'source:substack',
          noNet ? 'The feed was not evaluated (network skipped)' : `Substack could not be read (${feedReason})`,
          noNet
            ? 'Run without --no-net to check for unlogged posts and feed drift. This run says nothing about either.'
            : 'Unlogged posts and feed drift were not evaluated. This says nothing about whether anything was published.',
          [SUBSTACK_FEED],
        ),
      );
    }
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }

  if (!committedDigest) {
    findings.push(
      sourceFinding(
        'source:kb-digest',
        'The committed digest.json is missing',
        'KB pages could not be compared to what was published. A rebuild writes public/agents/kb/digest.json.',
        ['site/public/agents/kb/digest.json'],
      ),
    );
  }

  findings.push(...dirtyBaselineFinding(gitStatus()));
  findings.sort((a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity));

  return {
    findings,
    bookkeeping,
    rss: { read: substackReadable, fetched: rss.items.length, pre_horizon: preHorizon, skipped_reason: rss.skippedReason, horizon: NOTICE_SINCE },
  };
}

// --- ledger ----------------------------------------------------------------

function readLedger(file) {
  const parsed = readJsonIfPresent(file);
  if (parsed?.version === 1 && parsed.seen) return parsed;
  if (fs.existsSync(file)) warn(`ledger ${file} is unreadable; treating every finding as new`);
  return { version: 1, seen: {} };
}

const ledgerKey = (finding) => `${finding.kind}:${finding.id}`;

/**
 * `carded` findings deserve a card. Everything else in `reported` is staged without one.
 * A source failure is always reported and never escalated, so it stages but cards only once.
 */
function classify(findings, ledger, today) {
  const carded = [];
  const reported = [];
  const silent = [];
  for (const finding of findings) {
    const seen = ledger.seen[ledgerKey(finding)];
    const nagDue = finding.severity === 'high' && seen && daysBetween(seen.last_carded ?? seen.first_seen, today) >= NAG_AFTER_DAYS;
    if (!seen || seen.card_owed || nagDue) {
      carded.push(finding);
      reported.push(finding);
    } else if (finding.kind === 'source_unreachable') {
      reported.push(finding);
    } else {
      silent.push(finding);
    }
  }
  return { carded, reported, silent };
}

/** Rebuilt from the current findings, so one that disappears fires again if it returns. */
function nextLedger(ledger, findings, { today, cardedToday, cardOwed }) {
  const seen = {};
  for (const finding of findings) {
    const key = ledgerKey(finding);
    const before = ledger.seen[key];
    const entry = {
      first_seen: before?.first_seen ?? today,
      last_seen: today,
      last_carded: cardedToday.has(key) ? today : (before?.last_carded ?? null),
      runs: (before?.runs ?? 0) + 1,
    };
    if (cardOwed.has(key)) entry.card_owed = true;
    seen[key] = entry;
  }
  return { version: 1, seen };
}

// --- report ----------------------------------------------------------------

function countLine(findings) {
  const counts = SEVERITY_ORDER.map((severity) => [severity, findings.filter((f) => f.severity === severity).length]).filter(([, n]) => n);
  return `${findings.length} finding(s)${counts.length ? `: ${counts.map(([severity, n]) => `${n} ${severity}`).join(', ')}` : ''}.`;
}

function rssSentence(rss) {
  if (!rss.read) return `Substack was not evaluated (${rss.skipped_reason}), so nothing here says whether a post went out.`;
  return `Watching since ${rss.horizon}; fetched ${rss.fetched} RSS item(s), of which ${rss.pre_horizon} are pre-horizon and intentionally unrecorded.`;
}

const REBUILD_ARTIFACTS = { 'drift:site/public/feed': '/feed/feed.json', 'drift:site/public/agents/kb': '/agents/kb' };

function headline(findings) {
  const rebuilds = findings.filter((f) => REBUILD_ARTIFACTS[f.id]);
  if (rebuilds.length) return `Rebuild would change what is published: ${rebuilds.map((f) => `${REBUILD_ARTIFACTS[f.id]} (${f.detail})`).join(', ')}.`;
  return 'No rebuild change is newly reported by this run.';
}

function actionsFor(findings, { stagingPath, vaultDir }) {
  const actions = [];
  for (const finding of findings.filter((f) => f.kind === 'unlogged_publication')) {
    actions.push(`Approve the log note: cp ${path.join(stagingPath, finding.proposal.path)} ${path.join(vaultDir, 'Social', 'Published')}/`);
  }
  const patches = new Set(findings.filter((f) => f.kind === 'unrecorded_surface').map((f) => f.proposal.path));
  for (const patch of patches) {
    actions.push(`Add the surface: paste ${path.join(stagingPath, patch)} under platforms: in Social/Published/${path.basename(patch, '.platforms.yaml')}.md`);
  }
  if (findings.some((f) => f.kind === 'kb_drift' || f.kind === 'rebuild_would_change_output')) {
    actions.push('Rebuild + commit both public/feed and public/agents together: cd site && npm run build, then review and commit.');
  }
  if (findings.some((f) => f.id === 'source:substack')) {
    actions.push('Re-run with the network available: npm run feed:notice');
  }
  if (findings.some((f) => f.id === 'source:kb-digest')) {
    actions.push('Run a build so public/agents/kb/digest.json exists, and commit it.');
  }
  return actions;
}

function renderReport({ findings, stillOpen, rss, now, stagingPath, vaultDir, dry }) {
  const { date, clock } = timeParts(now);
  const open = stillOpen ? ` ${stillOpen} already-reported finding(s) remain open.` : '';
  const where = dry ? 'Dry run: nothing was staged.' : `Staged at ${stagingPath}.`;
  const lines = [
    `# feed notice — ${date} ${clock} PT`,
    countLine(findings),
    '',
    `${headline(findings)} ${rssSentence(rss)}${open} ${where}`,
    '',
    '## Do this',
    ...actionsFor(findings, { stagingPath, vaultDir }).map((action, i) => `${i + 1}. ${action}`),
    '',
    '## Findings',
  ];
  for (const finding of findings) {
    lines.push(`### ${FINDING_LABELS[finding.kind]} ${finding.kind} (${finding.severity}) — ${finding.id}`);
    lines.push(finding.title, finding.detail);
    lines.push(...finding.evidence.map((item) => `- ${item}`));
    if (finding.proposal) lines.push('', `Proposal: ${finding.proposal.path}`, '```', finding.proposal.content.trimEnd(), '```');
    lines.push('');
  }
  return `${lines.join('\n').trimEnd()}\n`;
}

// --- staging ---------------------------------------------------------------

function writeStagedRun(stagingRoot, runDirName, findings, report, noticeBase) {
  const runDir = path.join(stagingRoot, runDirName);
  // A second run in the same minute replaces the first, rather than mixing their proposals.
  fs.rmSync(runDir, { recursive: true, force: true });
  fs.mkdirSync(runDir, { recursive: true });
  for (const { proposal } of findings) {
    if (!proposal) continue;
    const file = path.join(runDir, proposal.path);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, proposal.content);
  }
  fs.writeFileSync(path.join(runDir, 'report.md'), report);
  writeNoticeJson(runDir, noticeBase, { attempted: false });
  return runDir;
}

function writeNoticeJson(runDir, noticeBase, card) {
  fs.writeFileSync(path.join(runDir, 'notice.json'), `${JSON.stringify({ ...noticeBase, delivered: { card } }, null, 2)}\n`);
}

/** Unbounded staging would become a second library, the failure the vault already paid for. */
function pruneRunDirs(stagingRoot) {
  const dirs = fs
    .readdirSync(stagingRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && RUN_DIR_PATTERN.test(entry.name))
    .map((entry) => entry.name)
    .sort();
  for (const name of dirs.slice(0, Math.max(0, dirs.length - KEEP_RUN_DIRS))) {
    fs.rmSync(path.join(stagingRoot, name), { recursive: true, force: true });
  }
}

// --- card ------------------------------------------------------------------

function resolveHermesBin(configured, home) {
  if (configured) return configured;
  const installed = path.join(home, '.hermes', 'hermes-agent', '.hermes', 'bin', 'hermes');
  return fs.existsSync(installed) ? installed : 'hermes';
}

function hermesExists(bin) {
  if (bin.includes(path.sep)) return fs.existsSync(bin);
  return (process.env.PATH || '').split(path.delimiter).some((dir) => dir && fs.existsSync(path.join(dir, bin)));
}

const KIND_WORDS = { unlogged_publication: 'unlogged', unrecorded_surface: 'surface', kb_drift: 'kb', rebuild_would_change_output: 'drift', source_unreachable: 'source' };

function cardTitle(date, findings) {
  const kinds = [...new Set(findings.map((f) => KIND_WORDS[f.kind]))];
  return `feed notice ${date} — ${findings.length} finding(s) [${kinds.join(', ')}]`;
}

/** Never throws, and never touches the exit code: a delivery failure must not lose the finding. */
function deliverCard({ card, date, findings, reportFile }) {
  const key = `feed-notice-${date}`;
  if (card.disabled) return { attempted: false, ok: false, key, reason: 'FEED_NOTICE_NO_CARD' };

  const bin = resolveHermesBin(card.hermesBin, card.home);
  if (!hermesExists(bin)) {
    warn(`*** NO CARD WRITTEN: hermes binary not found (${bin}). The finding stays staged. Set HERMES_BIN.`);
    return { attempted: false, ok: false, key, reason: 'hermes_absent' };
  }
  const profile = path.join(card.home, '.hermes', 'profiles', card.assignee);
  if (!fs.existsSync(profile)) {
    // A card to a phantom assignee parks in ready, invisible by construction (2026-10-27).
    warn(`*** NO CARD WRITTEN: assignee "${card.assignee}" has no profile at ${profile}. The finding stays staged. Fix FEED_NOTICE_ASSIGNEE.`);
    return { attempted: false, ok: false, key, reason: 'assignee_absent' };
  }
  const result = spawnSync(
    bin,
    ['kanban', '--board', card.board, 'create', '--assignee', card.assignee, '--priority', String(card.priority), '--idempotency-key', key, '--body-file', reportFile, '--json', cardTitle(date, findings)],
    { encoding: 'utf8', timeout: CHILD_TIMEOUT_MS },
  );
  if (result.error || result.status !== 0) {
    warn(`*** CARD WRITE FAILED: ${result.error?.message ?? (result.stderr || '').trim()}. The finding stays staged.`);
    return { attempted: true, ok: false, key, reason: 'hermes_failed' };
  }
  return { attempted: true, ok: true, key, id: readJsonText(result.stdout)?.id ?? null };
}

function readJsonText(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// --- run -------------------------------------------------------------------

/**
 * Returns { exitCode, output }. The CLI maps environment to these options; tests also pass
 * `publicDir`, `rssXml`, `feedArgs`, and `gitStatus` so they touch neither repo nor network.
 */
async function runNotice({
  vaultDir,
  stagingRoot,
  publicDir = path.join(SITE, 'public'),
  dry = false,
  noNet = false,
  rssXml,
  feedArgs = [],
  gitStatus = defaultGitStatus,
  now = new Date(),
  card = { disabled: true },
}) {
  if (!fs.existsSync(vaultDir)) return { exitCode: EXIT_NO_VAULT, output: { status: 'vault_absent', vault: vaultDir } };

  const detected = await detect({ vaultDir, publicDir, noNet, rssXml, feedArgs, gitStatus });
  const { findings, bookkeeping, rss } = detected;
  const { date: today, dirName } = timeParts(now);

  const ledgerFile = path.join(stagingRoot, 'ledger.json');
  const ledger = readLedger(ledgerFile);
  const { carded, reported, silent } = classify(findings, ledger, today);
  const summary = {
    generated_at: now.toISOString(),
    horizon: NOTICE_SINCE,
    rss,
    counts: Object.fromEntries(SEVERITY_ORDER.map((severity) => [severity, reported.filter((f) => f.severity === severity).length])),
    findings: reported,
    still_open: silent.map((f) => f.id),
    bookkeeping,
  };

  if (!reported.length) {
    // Silence is a valid output. Only the ledger moves, and only if it has something to record.
    if (!dry && (findings.length || Object.keys(ledger.seen).length)) {
      fs.mkdirSync(stagingRoot, { recursive: true });
      fs.writeFileSync(ledgerFile, `${JSON.stringify(nextLedger(ledger, findings, { today, cardedToday: new Set(), cardOwed: new Set() }), null, 2)}\n`);
    }
    return { exitCode: EXIT_CLEAN, output: { ...summary, staged: null, delivered: null }, report: null };
  }

  const stagingPath = path.resolve(stagingRoot, dirName);
  const report = renderReport({ findings: reported, stillOpen: silent.length, rss, now, stagingPath, vaultDir, dry });

  if (dry) {
    return { exitCode: EXIT_STAGED, output: { ...summary, staged: null, delivered: null }, report };
  }

  const runDir = writeStagedRun(stagingRoot, dirName, reported, report, summary);
  pruneRunDirs(stagingRoot);

  // At most one card a day. A finding that arrives after today's card waits for tomorrow's.
  const alreadyCarded = Object.values(ledger.seen).some((entry) => entry.last_carded === today);
  let delivered = { attempted: false, ok: false, key: `feed-notice-${today}`, reason: carded.length ? 'already_carded_today' : 'nothing_new' };
  if (carded.length && !alreadyCarded) {
    delivered = deliverCard({ card, date: today, findings: reported, reportFile: path.join(runDir, 'report.md') });
  }
  writeNoticeJson(runDir, summary, delivered);

  const cardedKeys = new Set(reported.map(ledgerKey));
  const owedBecause = carded.length && !delivered.ok && delivered.reason !== 'FEED_NOTICE_NO_CARD';
  fs.writeFileSync(
    ledgerFile,
    `${JSON.stringify(
      nextLedger(ledger, findings, {
        today,
        cardedToday: delivered.ok ? cardedKeys : new Set(),
        cardOwed: owedBecause ? new Set(carded.map(ledgerKey)) : new Set(),
      }),
      null,
      2,
    )}\n`,
  );

  return { exitCode: EXIT_STAGED, output: { ...summary, staged: runDir, delivered }, report };
}

async function main() {
  const args = process.argv.slice(2);
  const dry = args.includes('--dry');
  const jsonOut = args.includes('--json');
  const noNet = args.includes('--no-net');
  const vaultDir = process.env.VAULT_DIR || '/Users/michaeljones/Dev/Obsidian/Mike_Thinking_Space';

  let result;
  try {
    result = await runNotice({
      vaultDir,
      stagingRoot: process.env.FEED_NOTICE_STAGING || path.join(SITE, 'content.staging', 'feed-notice'),
      dry,
      noNet,
      card: {
        disabled: process.env.FEED_NOTICE_NO_CARD === '1',
        hermesBin: process.env.HERMES_BIN,
        home: os.homedir(),
        assignee: process.env.FEED_NOTICE_ASSIGNEE || 'content',
        board: process.env.FEED_NOTICE_BOARD || 'default',
        priority: process.env.FEED_NOTICE_PRIORITY || '40',
      },
    });
  } catch (err) {
    if (!(err instanceof DetectorError)) console.error(err);
    warn(`detector error: ${err.message}`);
    if (jsonOut) console.log(JSON.stringify({ status: 'error', error: err.message }));
    process.exitCode = EXIT_ERROR;
    return;
  }

  if (result.exitCode === EXIT_NO_VAULT) warn(`vault not found (${vaultDir}) — CI/cloud build: nothing to evaluate.`);
  if (jsonOut) console.log(JSON.stringify({ exit: result.exitCode, ...result.output }));
  else if (result.report) console.log(result.report);
  else if (result.exitCode === EXIT_CLEAN) console.log(`[feed-notice] nothing to report. ${rssSentence(result.output.rss)}`);
  process.exitCode = result.exitCode;
}

export { NOTICE_SINCE, runNotice };

const invokedDirectly =
  process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url));
if (invokedDirectly) main();
