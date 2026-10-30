#!/usr/bin/env node
/**
 * feed-build.mjs — publication-layer adapter: vault + Substack → public syndication feed.
 *
 * Implements P0 of docs/spec/v1-publisher.md (agent-feed-system): one canonical
 * public feed at /feed/feed.json (JSON Feed 1.1) + /feed/atom.xml (Atom mirror)
 * + /feed/index.json (machine map: slices, counts, sources).
 *
 * Design rules inherited from the publication layer, not invented here:
 *   - Default-deny on audience. An item publishes only when it carries an
 *     `audience` including `public`. Nothing is promotional-by-default. A log
 *     entry with no audience, or one outside the taxonomy, does not publish.
 *   - `confidential:` hard-blocks. A source marked confidential never crosses,
 *     even if it also says public, and its Substack copy is held back with it.
 *   - Static only. No API, no database, no runtime. Files are generated at
 *     build time and shipped by Cloudflare Pages.
 *   - Commit is the gate. When the vault is absent (CI/cloud build) the
 *     committed output is kept and nothing is regenerated — the same fallback
 *     kb-to-agents.mjs uses. A build alone is not a publication.
 *   - One direction: vault → feed. This script never writes into the vault.
 *
 * Sources, in precedence order:
 *   1. Social/Published/*.md  — the publication log; authoritative for an item's
 *      platform URLs, dates, and audience.
 *   2. Social/Drafts/*.md     — read-only, for summary text and tags when the log
 *      points at a source draft. Draft text never publishes on its own.
 *   3. Substack RSS           — supplies items the log has not caught up with.
 *      Public by definition, `essay` type, unless the log explicitly blocks the
 *      same post. If the fetch fails the existing output is kept, because the
 *      log alone would silently shrink the feed.
 *
 * Usage:
 *   node scripts/feed-build.mjs            # regenerate public/feed/*
 *   node scripts/feed-build.mjs --dry      # summary only, writes nothing
 *   node scripts/feed-build.mjs --no-net   # skip the Substack fetch, log items only
 *   VAULT_DIR=/path/to/vault node scripts/feed-build.mjs
 *   FEED_OUT_DIR=/tmp/out node scripts/feed-build.mjs   # tests write here, not public/
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { XMLParser } from 'fast-xml-parser';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(HERE, '..');
const OUT_DIR = process.env.FEED_OUT_DIR || path.join(SITE, 'public', 'feed');

const VAULT = process.env.VAULT_DIR || '/Users/michaeljones/Dev/Obsidian/Mike_Thinking_Space';
const SOCIAL = path.join(VAULT, 'Social');
const PUBLISHED_DIR = path.join(SOCIAL, 'Published');
const DRAFTS_DIR = path.join(SOCIAL, 'Drafts');
const KB_DIR = path.join(VAULT, 'KB');

const SITE_URL = 'https://mikejones.online';
const FEED_URL = `${SITE_URL}/feed/feed.json`;
const ATOM_URL = `${SITE_URL}/feed/atom.xml`;
const SUBSTACK_FEED = 'https://resilienttomorrow.substack.com/feed';
// The build hook waits on this script, so a stalled fetch would stall the build.
const FETCH_TIMEOUT_MS = 15000;

const DRY = process.argv.includes('--dry');
const NO_NET = process.argv.includes('--no-net');

// --- taxonomy (docs/spec/v1-publisher.md §5) --------------------------------
const AUDIENCES = ['public', 'work', 'friends', 'family', 'agents'];
const TYPES = ['essay', 'note', 'project', 'dispatch', 'link'];
const FORM_TO_TYPE = {
  article: 'essay',
  essay: 'essay',
  video: 'dispatch',
  short: 'note',
  note: 'note',
  post: 'note',
  project: 'project',
  link: 'link',
};

const log = (...a) => console.log('[feed]', ...a);

// --- helpers ---------------------------------------------------------------

/** Lenient fallback: top-level `key: value` only, last occurrence wins. */
function parseLenientFrontmatter(head) {
  const fm = {};
  for (const line of head.split('\n')) {
    if (!line || /^\s/.test(line)) continue; // nested blocks handled by the real parser
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim().replace(/\s+#.*$/, '');
    const quoted = v.match(/^["'](.*)["']$/);
    if (quoted) v = quoted[1];
    fm[m[1]] = v;
  }
  return fm;
}

function readFrontmatter(file) {
  const raw = fs.readFileSync(file, 'utf8');
  if (!raw.startsWith('---')) return { fm: {}, body: raw };
  const end = raw.indexOf('\n---', 3);
  if (end === -1) return { fm: {}, body: raw };
  const head = raw.slice(3, end);
  const body = raw.slice(raw.indexOf('\n', end + 1) + 1);
  let fm = {};
  try {
    fm = yaml.load(head) || {};
  } catch (err) {
    const lenient = parseLenientFrontmatter(head);
    log(`frontmatter parse failed (${err.message.split('\n')[0]}) — lenient read for ${path.basename(file)}: ${Object.keys(lenient).join(',') || 'nothing'}`);
    fm = lenient;
  }
  return { fm, body };
}

/** [[Social/Drafts/2026-10-29-slug]] or [[...|alias]] → absolute draft path. */
function resolveWikilink(value) {
  if (!value) return null;
  const m = String(value).match(/\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/);
  const target = (m ? m[1] : String(value)).trim();
  const leaf = target.split('/').pop();
  const candidate = path.join(DRAFTS_DIR, `${leaf}.md`);
  return fs.existsSync(candidate) ? candidate : null;
}

function asArray(v) {
  if (v == null) return [];
  return Array.isArray(v) ? v : [v];
}

/** Normalise an audience declaration against the taxonomy. Unknown → dropped + warned. */
function normaliseAudience(v) {
  const out = new Set();
  for (const raw of asArray(v)) {
    const slug = String(raw).trim().toLowerCase();
    if (!slug) continue;
    if (AUDIENCES.includes(slug)) out.add(slug);
    else log(`unknown audience "${slice(raw, 40)}" ignored (not in taxonomy)`);
  }
  return [...out];
}

function slice(s, n) {
  const t = String(s ?? '').replace(/\s+/g, ' ').trim();
  return t.length > n ? `${t.slice(0, n - 1)}…` : t;
}

const NAMED_ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  mdash: '—', ndash: '–', hellip: '…', middot: '·', bull: '•',
  lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”', laquo: '«', raquo: '»',
  copy: '©', reg: '®', trade: '™',
  aacute: 'á', eacute: 'é', egrave: 'è', iacute: 'í', ntilde: 'ñ', oacute: 'ó', ouml: 'ö', uacute: 'ú', uuml: 'ü', ccedil: 'ç',
};

function decodeEntities(text) {
  return text.replace(/&(#\d+|#x[0-9a-f]+|[a-z][a-z0-9]*);/gi, (_, body) => {
    if (body[0] !== '#') return NAMED_ENTITIES[body] ?? NAMED_ENTITIES[body.toLowerCase()] ?? '';
    const isHex = body[1] === 'x' || body[1] === 'X';
    const codePoint = Number.parseInt(body.slice(isHex ? 2 : 1), isHex ? 16 : 10);
    return codePoint > 0 && codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : '';
  });
}

function removeMarkup(input) {
  let text = input;
  // Repeated because removing one comment can join the pieces around it into another.
  let previous;
  do {
    previous = text;
    text = text.replace(/<!--[\s\S]*?-->/g, '');
  } while (text !== previous);
  return text
    // An unterminated comment hides everything after it from a browser, so it does here too.
    .replace(/<!--[\s\S]*$/, '')
    .replace(/-->/g, '')
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '')
    .replace(/<(script|style)\b[\s\S]*$/i, '')
    .replace(/<\/?[a-z!?][^>]*>/gi, '')
    .replace(/<\/?[a-z!?][^>]*$/i, '');
}

/**
 * Comments, then script/style, then tags, then entities. Runs until stable because
 * decoding can expose more markup: `&lt;!-- note --&gt;` is still an internal note.
 */
function stripHtml(input) {
  let text = input;
  for (let pass = 0; pass < 5; pass += 1) {
    const before = text;
    text = decodeEntities(removeMarkup(text));
    if (text === before) break;
  }
  return text;
}

// Capitalised on purpose: these are interface labels, and "you should read more."
// is a sentence. Labels can follow anything because tag stripping leaves them
// directly after the text; the sentence forms must start a sentence.
const BOILERPLATE_LABEL =
  /(?:^|\s+[—–|·-]\s*|\s+)(?:Read more|READ MORE|Continue reading|Keep reading|Read the full (?:post|article|story)|Share(?: this (?:post|article))?|Subscribe(?: now| today| for free)?|Leave a comment|Unsubscribe|Manage (?:your )?subscription)\s*[.!…→»›]*\s*$/;
const BOILERPLATE_SENTENCE =
  /(?:^|(?<=[.!?…"”]\s+))(?:Thanks for reading|Subscribe|Unsubscribe|To unsubscribe|Share this|You(?:'|’)re receiving|You received)[^.!?]*[.!?…]*\s*$/;
const LEADING_FRAGMENTS = /^(?:<!--|-->|--+|[<>&]|\s)+/;

function stripBoilerplate(input) {
  let text = input;
  let previous;
  do {
    previous = text;
    text = text.replace(BOILERPLATE_SENTENCE, '').replace(BOILERPLATE_LABEL, '').trimEnd();
  } while (text !== previous);
  return text;
}

/** Plain-text summary from markdown or HTML. Safe to publish as-is. */
function summarise(md, max = 280) {
  const flattened = stripHtml(String(md || '').replace(/^---[\s\S]*?---/, ''))
    .replace(/^#{1,6}\s+.*$/gm, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/gm, '')
    .replace(/^\s*[-*]\s+/gm, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[\[([^\]|]+)(?:\|([^\]]*))?\]\]/g, (_, a, b) => b || a)
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`>]/g, '')
    .replace(/\|.*\|/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  // Boilerplate goes before truncation, otherwise the cut can hide it from the tail match.
  const text = stripBoilerplate(flattened).replace(LEADING_FRAGMENTS, '');
  if (!text) return '';
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/\s+\S*$/, '')}…`;
}

/** A bare `confidential:` key blocks too: it was marked and never resolved to a negative. */
function isConfidential(fm) {
  if (!Object.hasOwn(fm, 'confidential')) return false;
  const value = String(fm.confidential ?? '').trim().toLowerCase();
  return !['no', 'false', 'none'].includes(value);
}

/** Comparable form of a URL. Empty for anything that is not http(s). */
function normaliseUrl(value) {
  try {
    const url = new URL(String(value ?? '').trim());
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return '';
    return `https://${url.host.toLowerCase()}${url.pathname.replace(/\/+$/, '')}`;
  } catch {
    return '';
  }
}

function titleSlug(title) {
  return String(title ?? '')
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[̀-ͯ'’‘]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function isoDate(value) {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function newestMTime(dir) {
  let newest = 0;
  const walk = (d, depth = 0) => {
    if (depth > 4) return;
    let entries;
    try {
      entries = fs.readdirSync(d, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      if (e.name.startsWith('.') || e.name === 'node_modules') continue;
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p, depth + 1);
      else if (e.isFile()) {
        try {
          const mt = fs.statSync(p).mtimeMs;
          if (mt > newest) newest = mt;
        } catch {
          /* ignore */
        }
      }
    }
  };
  walk(dir);
  return newest ? new Date(newest).toISOString() : null;
}

// --- source 1: the publication log ----------------------------------------

/**
 * Returns the publishable items plus `blocked`: entries that explicitly must not
 * appear. The merge needs those, or the same post would come back through Substack,
 * which treats everything it carries as public. An entry that simply declares no
 * audience is denied here but not blocked, since it asserts nothing about the post.
 */
function loadPublishedItems() {
  if (!fs.existsSync(PUBLISHED_DIR)) return { items: [], blocked: [] };
  const items = [];
  const blocked = [];
  for (const file of fs.readdirSync(PUBLISHED_DIR).filter((f) => f.endsWith('.md') && !/^readme/i.test(f))) {
    const full = path.join(PUBLISHED_DIR, file);
    const { fm } = readFrontmatter(full);
    const slug = String(fm.piece || path.basename(file, '.md'));

    const listed = asArray(fm.platforms).filter((p) => p && p.url);

    const draftPath = resolveWikilink(fm.source_draft);
    let draftFm = {};
    let draftBody = '';
    if (draftPath) {
      const d = readFrontmatter(draftPath);
      draftFm = d.fm;
      draftBody = d.body;
    }

    const block = (reason) => {
      log(`skip ${slug}: ${reason}`);
      blocked.push({ id: slug, title: String(fm.title || draftFm.title || slug), urls: listed.map((p) => String(p.url)) });
    };

    if (isConfidential(fm)) {
      block('confidential');
      continue;
    }
    if (isConfidential(draftFm)) {
      block('source draft confidential');
      continue;
    }

    const finalAudience = normaliseAudience(fm.audience ?? draftFm.audience);
    if (finalAudience.length && !finalAudience.includes('public')) {
      block(`audience ${finalAudience.join(',')} is not public (P0 ships the public slice only)`);
      continue;
    }
    if (!finalAudience.includes('public')) {
      log(`skip ${slug}: no audience in the taxonomy declared — default-deny`);
      continue;
    }

    const platforms = listed.filter((p) => normaliseUrl(p.url));
    if (!platforms.length) {
      log(`skip ${slug}: no platform url — not published`);
      continue;
    }

    // Prefer Substack as the canonical external link, else the first platform.
    const primary = platforms.find((p) => p.platform === 'substack') || platforms[0];

    const type = TYPES.includes(fm.type)
      ? fm.type
      : FORM_TO_TYPE[String(primary.form || '').toLowerCase()] || 'essay';

    const date =
      isoDate(fm.first_published) || isoDate(primary.date) || isoDate(draftFm.date) || null;
    if (!date) {
      log(`skip ${slug}: no usable date`);
      continue;
    }

    const tags = [...new Set([...asArray(fm.tags), ...asArray(draftFm.tags)].map((t) => String(t).trim()).filter(Boolean))];

    items.push({
      id: slug,
      url: primary.url,
      title: String(fm.title || draftFm.title || slug).trim(),
      summary: summarise(fm.summary || draftFm.summary || draftBody),
      date_published: date,
      tags,
      audience: finalAudience,
      type,
      source: draftPath ? path.relative(VAULT, draftPath) : path.relative(VAULT, full),
      platforms: platforms.map((p) => ({ platform: String(p.platform || ''), url: String(p.url), date: isoDate(p.date) })),
    });
  }
  return { items, blocked };
}

// --- source 2: the Substack feed ------------------------------------------

/** Items missing a url, title, or date are dropped: they could not be valid feed items. */
function parseSubstackRss(xml) {
  const parser = new XMLParser({ ignoreAttributes: false, trimValues: true });
  const channel = parser.parse(xml)?.rss?.channel;
  if (!channel) return [];
  const parsed = asArray(channel.item).map((it) => {
    const link = typeof it.link === 'string' ? it.link : it.link?.['#text'] || it.link?.['@_href'] || '';
    const id = link.split('/p/')[1]?.split(/[/?#]/)[0] || link;
    const date = isoDate(it.pubDate || it['dc:date']);
    return {
      id: `substack-${id}`,
      url: link,
      title: stripHtml(String(it.title ?? '')).replace(/\s+/g, ' ').trim(),
      summary: summarise(it.description == null ? '' : String(it.description)),
      date_published: date,
      tags: [],
      audience: ['public'],
      type: 'essay',
      source: 'substack',
      platforms: [{ platform: 'substack', url: link, date }],
    };
  });
  return parsed.filter((entry) => normaliseUrl(entry.url) && entry.title && entry.date_published);
}

async function loadSubstackItems() {
  if (NO_NET) return { items: [], fetched: false };
  try {
    const res = await fetch(SUBSTACK_FEED, {
      headers: { 'user-agent': 'mikejones.online feed builder' },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const items = parseSubstackRss(await res.text());
    if (!items.length) throw new Error('response contained no usable items');
    return { items, fetched: true };
  } catch (err) {
    log(`substack fetch failed (${err.message})`);
    return { items: [], fetched: false };
  }
}

// --- merge -----------------------------------------------------------------

/** Every signal that identifies a post: its URLs, its title, and its id. */
function identityKeys(entry) {
  const urls = [entry.url, ...(entry.urls || []), ...(entry.platforms || []).map((p) => p.url)]
    .map(normaliseUrl)
    .filter(Boolean)
    .map((url) => `url:${url}`);
  const title = titleSlug(entry.title);
  return [...urls, ...(title ? [`title:${title}`] : []), ...(entry.id ? [`id:${entry.id}`] : [])];
}

/**
 * The log wins on identity and Substack fills gaps. A post appears once, and a post
 * the log blocked stays out however Substack spells its URL or title.
 */
function mergeItems(published, substackItems, blocked = []) {
  const seen = new Set(blocked.flatMap(identityKeys));
  const items = [];
  let added = 0;
  const admit = (entry) => {
    const keys = identityKeys(entry);
    const isNew = !keys.some((key) => seen.has(key));
    keys.forEach((key) => seen.add(key));
    if (isNew && entry.audience.includes('public')) {
      items.push(entry);
      return true;
    }
    return false;
  };
  published.forEach(admit);
  for (const entry of substackItems) {
    if (admit(entry)) added += 1;
  }
  items.sort((a, b) => new Date(b.date_published) - new Date(a.date_published));
  return { items, added };
}

// --- emitters --------------------------------------------------------------

function buildJsonFeed(items) {
  return {
    version: 'https://jsonfeed.org/version/1.1',
    title: 'Mike Jones',
    home_page_url: SITE_URL,
    feed_url: FEED_URL,
    description:
      'Mike Jones — product, AI, and resilience. Essays and dispatches, published at mikejones.online.',
    icon: `${SITE_URL}/img/logos/favicon-jones-co.png`,
    language: 'en-US',
    authors: [{ name: 'Mike Jones', url: SITE_URL }],
    items: items.map((i) => ({
      id: i.id,
      url: i.url,
      title: i.title,
      summary: i.summary || undefined,
      // JSON Feed 1.1 requires content_html or content_text on every item. This
      // repeats the summary, so it publishes no article text.
      content_text: i.summary || i.title,
      date_published: i.date_published,
      tags: i.tags.length ? i.tags : undefined,
      // content_html intentionally omitted at P0: summary + link (open question #3).
    })),
  };
}

function escapeXml(s) {
  return String(s ?? '')
    // XML 1.0 cannot represent these at all; one would make the whole feed unparseable.
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F￾￿]/g, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildAtom(items) {
  const updated = items[0]?.date_published || new Date().toISOString();
  const entries = items
    .map(
      (i) => `  <entry>
    <id>${escapeXml(i.url)}</id>
    <title>${escapeXml(i.title)}</title>
    <link rel="alternate" href="${escapeXml(i.url)}"/>
    <published>${i.date_published}</published>
    <updated>${i.date_published}</updated>
    <summary>${escapeXml(i.summary)}</summary>
    <author><name>Mike Jones</name></author>
  </entry>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Mike Jones</title>
  <subtitle>Product, AI, and resilience — published at mikejones.online.</subtitle>
  <link rel="self" href="${ATOM_URL}"/>
  <link rel="alternate" type="text/html" href="${SITE_URL}"/>
  <id>${SITE_URL}/</id>
  <updated>${updated}</updated>
  <author><name>Mike Jones</name><uri>${SITE_URL}</uri></author>
${entries}
</feed>
`;
}

// --- main ------------------------------------------------------------------

async function main() {
  if (!fs.existsSync(SOCIAL)) {
    console.error(`[feed] vault Social/ not found (${SOCIAL}) — CI/cloud build: keeping committed feed output.`);
    return;
  }

  const { items: published, blocked } = loadPublishedItems();
  const { items: substackItems, fetched } = await loadSubstackItems();

  // A network failure must not rewrite the feed down to the log's few items.
  if (!NO_NET && !fetched) {
    console.error('[feed] Substack unavailable — keeping existing feed output.');
    return;
  }

  const { items, added: addedFromSubstack } = mergeItems(published, substackItems, blocked);

  const index = {
    generated_at: new Date().toISOString(),
    canonical: FEED_URL,
    slices: [
      { slug: 'public', feed_url: FEED_URL, atom_url: ATOM_URL, item_count: items.length, token_required: false },
    ],
    sources: {
      published_log: { dir: 'Social/Published', items: published.length },
      substack: {
        url: SUBSTACK_FEED,
        fetched,
        items: substackItems.length,
        merged: addedFromSubstack,
        last_post: substackItems[0]?.date_published || null,
      },
      kb: { last_modified: fs.existsSync(KB_DIR) ? newestMTime(KB_DIR) : null },
    },
    totals: { items: items.length },
    note: 'P0: public slice only. Audiences work/friends/family/agents are defined in docs/spec/v1-publisher.md §5 and ship in P1/P2.',
  };

  const feed = buildJsonFeed(items);
  const atom = buildAtom(items);

  log(`items: ${items.length} (log ${published.length}, substack ${substackItems.length}, merged ${addedFromSubstack})`);
  log(`newest: ${items[0]?.date_published || 'none'} — ${items[0]?.title || ''}`);

  if (DRY) {
    log('dry run — nothing written');
    return;
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, 'feed.json'), `${JSON.stringify(feed, null, 2)}\n`);
  fs.writeFileSync(path.join(OUT_DIR, 'atom.xml'), atom);
  fs.writeFileSync(path.join(OUT_DIR, 'index.json'), `${JSON.stringify(index, null, 2)}\n`);
  log(`wrote ${path.relative(SITE, OUT_DIR)}/{feed.json,atom.xml,index.json}`);
}

export {
  summarise,
  normaliseAudience,
  isConfidential,
  escapeXml,
  normaliseUrl,
  titleSlug,
  mergeItems,
  parseSubstackRss,
  buildJsonFeed,
  buildAtom,
};

// Only build when run directly. Importing for tests must not touch public/feed.
const invokedDirectly =
  process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url));
if (invokedDirectly) {
  main().catch((err) => {
    console.error('[feed] build failed:', err);
    process.exitCode = 1;
  });
}
