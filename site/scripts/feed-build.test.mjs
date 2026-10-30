import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { XMLValidator } from 'fast-xml-parser';
import {
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
} from './feed-build.mjs';

const SCRIPT = fileURLToPath(new URL('./feed-build.mjs', import.meta.url));

function item(overrides = {}) {
  return {
    id: 'piece',
    url: 'https://resilienttomorrow.substack.com/p/piece',
    title: 'A Piece',
    summary: 'A summary.',
    date_published: '2026-10-01T00:00:00.000Z',
    tags: [],
    audience: ['public'],
    type: 'essay',
    source: 'substack',
    platforms: [],
    ...overrides,
  };
}

// The checks a reader relies on. Shared by the builder test and the committed
// artifact test so both are held to the same definition of a valid feed.
function jsonFeedProblems(feed) {
  const problems = [];
  if (feed.version !== 'https://jsonfeed.org/version/1.1') problems.push(`version ${feed.version}`);
  if (!feed.title) problems.push('feed title missing');
  if (!Array.isArray(feed.items)) return [...problems, 'items is not an array'];
  const ids = new Set();
  for (const entry of feed.items) {
    for (const field of ['id', 'url', 'title', 'date_published']) {
      if (typeof entry[field] !== 'string' || !entry[field]) problems.push(`${entry.id}: ${field} missing`);
    }
    // JSON Feed 1.1 requires content_html or content_text on every item.
    if (!entry.content_html && !entry.content_text) problems.push(`${entry.id}: no content field`);
    if (entry.content_html !== undefined) problems.push(`${entry.id}: content_html is not allowed at P0`);
    if (Number.isNaN(Date.parse(entry.date_published))) problems.push(`${entry.id}: bad date`);
    if (ids.has(entry.id)) problems.push(`${entry.id}: duplicate id`);
    ids.add(entry.id);
  }
  return problems;
}

describe('summarise', () => {
  it('strips an HTML comment that opens the text', () => {
    const out = summarise('<!-- writer: content 2026-10-29 · packaging locked by Mike -->\n\nAI agents are changing things.');
    expect(out).toBe('AI agents are changing things.');
  });

  it('strips a multi-line comment and an unterminated one', () => {
    expect(summarise('<!-- a\nb\nc -->Kept text.')).toBe('Kept text.');
    expect(summarise('Kept text. <!-- internal note never closed')).toBe('Kept text.');
  });

  it('does not reassemble a comment from nested fragments', () => {
    expect(summarise('<!<!-- x -->-- hidden -->Kept text.')).toBe('Kept text.');
  });

  it('removes script and style blocks with their contents', () => {
    const out = summarise('<script>alert(1)</script><style>p{color:red}</style><p>Kept text.</p>');
    expect(out).toBe('Kept text.');
  });

  it('removes tags', () => {
    expect(summarise('<p>Kept <em>this</em> <a href="https://x.test">text</a>.</p>')).toBe('Kept this text.');
  });

  it('decodes named, decimal, and hex entities', () => {
    expect(summarise('Fish &amp; chips')).toBe('Fish & chips');
    expect(summarise('It&#8217;s here &#8212; now')).toBe('It’s here — now');
    expect(summarise('It&#x2019;s here')).toBe('It’s here');
    expect(summarise('Non&nbsp;breaking &ldquo;quote&rdquo;')).toBe('Non breaking “quote”');
  });

  it('treats an entity-encoded comment as a comment', () => {
    expect(summarise('&lt;!-- internal --&gt;Kept text.')).toBe('Kept text.');
  });

  it('survives an out-of-range numeric entity', () => {
    expect(summarise('Kept &#xFFFFFFF; text.')).toBe('Kept text.');
  });

  it('collapses whitespace', () => {
    expect(summarise('one\n\n  two\t three')).toBe('one two three');
  });

  it('strips trailing Substack boilerplate', () => {
    expect(summarise('The real point. Read more')).toBe('The real point.');
    expect(summarise('The real point <a href="#">Read more</a>')).toBe('The real point');
    expect(summarise('The real point. Thanks for reading! Subscribe for free to receive new posts and support my work.')).toBe('The real point.');
    expect(summarise('The real point. Share this post')).toBe('The real point.');
    expect(summarise('The real point. Leave a comment Share Subscribe')).toBe('The real point.');
    expect(summarise('The real point. Unsubscribe')).toBe('The real point.');
    expect(summarise('The real point. Continue reading →')).toBe('The real point.');
  });

  it('keeps ordinary sentences that end in those words', () => {
    expect(summarise('Everything we share.')).toBe('Everything we share.');
    expect(summarise('You should read more.')).toBe('You should read more.');
  });

  it('strips boilerplate before truncating, so the tail cannot survive in the cut', () => {
    const body = `${'word '.repeat(60)}end. Read more`;
    expect(summarise(body, 500)).not.toMatch(/Read more/);
  });

  it('never begins with <, &, or a comment fragment', () => {
    const hostile = ['-->Kept', '< Kept', '& Kept', '&amp; Kept', '&lt; Kept', '--> Kept', '<!-- x --> --> Kept', '---\n\nKept'];
    for (const input of hostile) {
      expect(summarise(input), input).toBe('Kept');
    }
  });

  it('returns an empty string for pure boilerplate or empty input', () => {
    expect(summarise('<!-- only a comment -->')).toBe('');
    expect(summarise('Read more')).toBe('');
    expect(summarise(undefined)).toBe('');
  });

  it('still reduces markdown to text and truncates at a word', () => {
    expect(summarise('# Heading\n\n**Bold** [link](https://x.test) [[Wiki|alias]]')).toBe('Bold link alias');
    const out = summarise('word '.repeat(100), 20);
    expect(out.endsWith('…')).toBe(true);
    expect(out.length).toBeLessThanOrEqual(21);
  });
});

describe('normaliseAudience', () => {
  it('keeps taxonomy values, case-insensitively, and de-duplicates', () => {
    expect(normaliseAudience(['Public', 'public', ' friends '])).toEqual(['public', 'friends']);
    expect(normaliseAudience('public')).toEqual(['public']);
  });

  it('returns nothing for absent or free-text declarations, which is a deny', () => {
    expect(normaliseAudience(undefined)).toEqual([]);
    expect(normaliseAudience(null)).toEqual([]);
    expect(normaliseAudience('Resilient Tomorrow readers (~2,300)')).toEqual([]);
    expect(normaliseAudience('public, friends')).toEqual([]);
  });
});

describe('isConfidential', () => {
  it('blocks any declared value', () => {
    expect(isConfidential({ confidential: 'internal' })).toBe(true);
    expect(isConfidential({ confidential: 'ghn' })).toBe(true);
    expect(isConfidential({ confidential: true })).toBe(true);
  });

  it('blocks a bare key, because the author marked the field and left it unresolved', () => {
    expect(isConfidential({ confidential: null })).toBe(true);
    expect(isConfidential({ confidential: '' })).toBe(true);
  });

  it('blocks even when the same item claims to be public', () => {
    expect(isConfidential({ confidential: 'internal', audience: ['public'] })).toBe(true);
  });

  it('passes only an absent key or an explicit negative', () => {
    expect(isConfidential({})).toBe(false);
    for (const negative of ['no', 'No ', 'false', 'none', false]) {
      expect(isConfidential({ confidential: negative }), String(negative)).toBe(false);
    }
  });
});

describe('escapeXml', () => {
  it('escapes all five reserved characters', () => {
    expect(escapeXml(`<a href="x">Tom & 'Jerry'</a>`)).toBe(
      '&lt;a href=&quot;x&quot;&gt;Tom &amp; &apos;Jerry&apos;&lt;/a&gt;',
    );
  });

  it('removes control characters XML 1.0 cannot represent', () => {
    expect(escapeXml('a\u0000b\u000Bc\td')).toBe('abc\td');
  });

  it('does not double-escape on a single pass and handles null', () => {
    expect(escapeXml('&amp;')).toBe('&amp;amp;');
    expect(escapeXml(null)).toBe('');
  });
});

describe('normaliseUrl', () => {
  it('collapses scheme, host case, trailing slash, query, and fragment', () => {
    const canonical = 'https://resilienttomorrow.substack.com/p/three-ways';
    for (const variant of [
      'https://resilienttomorrow.substack.com/p/three-ways',
      'https://resilienttomorrow.substack.com/p/three-ways/',
      'http://resilienttomorrow.substack.com/p/three-ways',
      'https://ResilientTomorrow.Substack.COM/p/three-ways',
      'https://resilienttomorrow.substack.com/p/three-ways?utm_source=x&utm_medium=y',
      'https://resilienttomorrow.substack.com/p/three-ways/?utm_source=x#comments',
    ]) {
      expect(normaliseUrl(variant), variant).toBe(canonical);
    }
  });

  it('keeps path case and distinct paths distinct', () => {
    expect(normaliseUrl('https://x.test/P/a')).not.toBe(normaliseUrl('https://x.test/p/a'));
    expect(normaliseUrl('https://x.test/p/a')).not.toBe(normaliseUrl('https://x.test/p/b'));
  });

  it('returns an empty string for anything that is not an http(s) url', () => {
    expect(normaliseUrl('')).toBe('');
    expect(normaliseUrl(undefined)).toBe('');
    expect(normaliseUrl('not a url')).toBe('');
    expect(normaliseUrl('javascript:alert(1)')).toBe('');
  });
});

describe('titleSlug', () => {
  it('ignores case, punctuation, and curly versus straight apostrophes', () => {
    expect(titleSlug('It’s Happening: On Your Street!')).toBe(titleSlug("it's happening on your street"));
  });

  it('returns an empty string when there is nothing to compare', () => {
    expect(titleSlug('')).toBe('');
    expect(titleSlug('!!!')).toBe('');
  });
});

describe('mergeItems', () => {
  it('keeps one item when the log and Substack URLs differ only by normalisation', () => {
    const log = item({ id: 'log-slug', url: 'http://resilienttomorrow.substack.com/p/piece/', title: 'Log Title' });
    const substack = item({ id: 'substack-piece', url: 'https://resilienttomorrow.substack.com/p/piece?utm_source=rss', title: 'Other Title' });
    const { items, added } = mergeItems([log], [substack]);
    expect(items.map((entry) => entry.id)).toEqual(['log-slug']);
    expect(added).toBe(0);
  });

  it('keeps one item when only the title matches', () => {
    const log = item({ id: 'log-slug', url: 'https://mikejones.online/writing/piece', title: 'It’s a Piece' });
    const substack = item({ id: 'substack-other', url: 'https://resilienttomorrow.substack.com/p/other', title: "It's a Piece" });
    expect(mergeItems([log], [substack]).items.map((entry) => entry.id)).toEqual(['log-slug']);
  });

  it('matches against every platform a log entry lists, not just its primary', () => {
    const log = item({
      id: 'log-slug',
      url: 'https://bsky.app/profile/x/post/1',
      title: 'Log Title',
      platforms: [
        { platform: 'bluesky', url: 'https://bsky.app/profile/x/post/1' },
        { platform: 'substack', url: 'https://resilienttomorrow.substack.com/p/piece' },
      ],
    });
    const substack = item({ id: 'substack-piece', title: 'Other Title' });
    expect(mergeItems([log], [substack]).items).toHaveLength(1);
  });

  it('collapses duplicates within a single source', () => {
    const first = item({ id: 'a' });
    const second = item({ id: 'b', url: `${first.url}/` });
    expect(mergeItems([], [first, second]).items).toHaveLength(1);
  });

  it('keeps genuinely different posts and sorts newest first', () => {
    const older = item({ id: 'older', url: 'https://x.test/p/older', title: 'Older', date_published: '2026-01-01T00:00:00.000Z' });
    const newer = item({ id: 'newer', url: 'https://x.test/p/newer', title: 'Newer', date_published: '2026-09-01T00:00:00.000Z' });
    expect(mergeItems([older], [newer]).items.map((entry) => entry.id)).toEqual(['newer', 'older']);
  });

  it('does not let Substack re-admit a post the log blocked, by URL', () => {
    const substack = item({ id: 'substack-piece', url: 'https://resilienttomorrow.substack.com/p/piece/?utm_source=rss' });
    const blocked = [{ id: 'secret', title: 'Unrelated', urls: ['http://resilienttomorrow.substack.com/p/piece'] }];
    expect(mergeItems([], [substack], blocked).items).toEqual([]);
  });

  it('does not let Substack re-admit a post the log blocked, by title', () => {
    const substack = item({ id: 'substack-piece', title: 'The Blocked One' });
    const blocked = [{ id: 'secret', title: 'The blocked one!', urls: [] }];
    expect(mergeItems([], [substack], blocked).items).toEqual([]);
  });

  it('drops anything that does not include public, as a last gate', () => {
    expect(mergeItems([item({ audience: ['friends'] })], []).items).toEqual([]);
  });
});

describe('parseSubstackRss', () => {
  const rss = (body) => `<?xml version="1.0"?><rss version="2.0"><channel><title>RT</title>${body}</channel></rss>`;

  it('cleans CDATA descriptions and titles', () => {
    const [entry] = parseSubstackRss(
      rss(`<item>
        <title><![CDATA[It&#8217;s Here]]></title>
        <description><![CDATA[<!-- note --><p>It&#8217;s &amp; more</p>]]></description>
        <link>https://resilienttomorrow.substack.com/p/its-here</link>
        <pubDate>Thu, 08 Oct 2026 21:31:17 GMT</pubDate>
      </item>`),
    );
    expect(entry).toMatchObject({
      id: 'substack-its-here',
      url: 'https://resilienttomorrow.substack.com/p/its-here',
      title: 'It’s Here',
      summary: 'It’s & more',
      date_published: '2026-10-08T21:31:17.000Z',
      audience: ['public'],
    });
  });

  it('handles a feed with a single item', () => {
    const one = `<item><title>One</title><link>https://x.test/p/one</link><pubDate>Thu, 08 Oct 2026 21:31:17 GMT</pubDate></item>`;
    expect(parseSubstackRss(rss(one))).toHaveLength(1);
  });

  it('drops items missing a required field, since they cannot be valid feed items', () => {
    const items = [
      `<item><title>No link</title><pubDate>Thu, 08 Oct 2026 21:31:17 GMT</pubDate></item>`,
      `<item><title>No date</title><link>https://x.test/p/a</link></item>`,
      `<item><link>https://x.test/p/b</link><pubDate>Thu, 08 Oct 2026 21:31:17 GMT</pubDate></item>`,
      `<item><title>Bad link</title><link>javascript:alert(1)</link><pubDate>Thu, 08 Oct 2026 21:31:17 GMT</pubDate></item>`,
    ];
    expect(parseSubstackRss(rss(items.join('')))).toEqual([]);
  });

  it('returns nothing for a document that is not RSS', () => {
    expect(parseSubstackRss('<html><body>Rate limited</body></html>')).toEqual([]);
  });
});

describe('buildJsonFeed', () => {
  it('produces a valid JSON Feed 1.1 document', () => {
    expect(jsonFeedProblems(buildJsonFeed([item()]))).toEqual([]);
  });

  it('carries the summary as content_text and falls back to the title', () => {
    const [withSummary, withoutSummary] = buildJsonFeed([
      item({ id: 'a' }),
      item({ id: 'b', summary: '' }),
    ]).items;
    expect(withSummary.content_text).toBe('A summary.');
    expect(withoutSummary.content_text).toBe('A Piece');
    expect(withoutSummary.summary).toBeUndefined();
  });
});

describe('buildAtom', () => {
  it('stays well-formed when titles and summaries contain markup characters', () => {
    const atom = buildAtom([item({ title: 'Tom & <Jerry>', summary: 'a < b & "c"\u0000' })]);
    expect(XMLValidator.validate(atom)).toBe(true);
    expect(atom).toContain('Tom &amp; &lt;Jerry&gt;');
  });
});

describe('committed artifact', () => {
  // The exact file Cloudflare Pages serves when the vault is absent.
  const committedFeed = JSON.parse(
    readFileSync(new URL('../public/feed/feed.json', import.meta.url), 'utf8'),
  );

  it('is valid JSON Feed 1.1', () => {
    expect(jsonFeedProblems(committedFeed)).toEqual([]);
  });

  it('is sorted newest first', () => {
    const dates = committedFeed.items.map((entry) => Date.parse(entry.date_published));
    expect(dates).toEqual([...dates].sort((a, b) => b - a));
  });

  it('has clean summaries', () => {
    for (const entry of committedFeed.items) {
      expect(entry.summary ?? '', entry.id).not.toMatch(/^(<|&|-->)|<!--|&#x?[0-9a-f]+;|&[a-z]+;/i);
    }
  });

  it('lists each post exactly once', () => {
    const urls = committedFeed.items.map((entry) => normaliseUrl(entry.url));
    const titles = committedFeed.items.map((entry) => titleSlug(entry.title));
    expect(new Set(urls).size).toBe(urls.length);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it('agrees with the Atom mirror and the index', () => {
    const atom = readFileSync(new URL('../public/feed/atom.xml', import.meta.url), 'utf8');
    const index = JSON.parse(readFileSync(new URL('../public/feed/index.json', import.meta.url), 'utf8'));
    expect(XMLValidator.validate(atom)).toBe(true);
    expect(atom.match(/<entry>/g)).toHaveLength(committedFeed.items.length);
    expect(index.totals.items).toBe(committedFeed.items.length);
  });
});

// Runs the real script against a throwaway vault, so the gates are proven at
// the boundary where vault files turn into published output.
describe('running the script against a fixture vault', () => {
  let workDir;
  let vaultDir;
  let outDir;

  const run = (args = ['--no-net'], vault = vaultDir) =>
    spawnSync('node', [SCRIPT, ...args], {
      encoding: 'utf8',
      env: { ...process.env, VAULT_DIR: vault, FEED_OUT_DIR: outDir },
    });
  const writeLog = (name, frontmatter) =>
    writeFileSync(path.join(vaultDir, 'Social/Published', `${name}.md`), `---\n${frontmatter}\n---\n\nLog body.\n`);
  const platformsFor = (name) =>
    `platforms:\n  - platform: substack\n    form: article\n    url: https://x.test/p/${name}\n    date: 2026-10-01`;
  const publishedIds = () =>
    JSON.parse(readFileSync(path.join(outDir, 'feed.json'), 'utf8')).items.map((entry) => entry.id);

  beforeEach(() => {
    workDir = mkdtempSync(path.join(tmpdir(), 'feed-build-'));
    vaultDir = path.join(workDir, 'vault');
    outDir = path.join(workDir, 'out');
    mkdirSync(path.join(vaultDir, 'Social/Published'), { recursive: true });
    mkdirSync(path.join(vaultDir, 'Social/Drafts'), { recursive: true });
    mkdirSync(outDir);
  });

  afterEach(() => {
    rmSync(workDir, { recursive: true, force: true });
  });

  it('publishes only entries whose audience includes public', () => {
    writeLog('declared', `title: Declared\naudience: public\n${platformsFor('declared')}`);
    writeLog('undeclared', `title: Undeclared\n${platformsFor('undeclared')}`);
    writeLog('free-text', `title: Free Text\naudience: "business owners"\n${platformsFor('free-text')}`);
    writeLog('friends', `title: Friends\naudience: friends\n${platformsFor('friends')}`);
    expect(run().status).toBe(0);
    expect(publishedIds()).toEqual(['declared']);
  });

  it('blocks confidential entries even when they claim to be public', () => {
    writeLog('secret', `title: Secret\naudience: public\nconfidential: internal\n${platformsFor('secret')}`);
    expect(run().status).toBe(0);
    expect(publishedIds()).toEqual([]);
  });

  it('blocks an entry whose source draft is confidential', () => {
    writeFileSync(path.join(vaultDir, 'Social/Drafts/secret-draft.md'), '---\nconfidential: ghn\n---\n\nSecret text.\n');
    writeLog('secret', `title: Secret\naudience: public\nsource_draft: "[[Social/Drafts/secret-draft]]"\n${platformsFor('secret')}`);
    expect(run().status).toBe(0);
    expect(publishedIds()).toEqual([]);
  });

  it('still honours confidential when the frontmatter fails strict YAML parsing', () => {
    writeLog('broken', `title: Broken\ntitle: Duplicate Key\naudience: public\nconfidential: internal\n${platformsFor('broken')}`);
    expect(run().status).toBe(0);
    expect(publishedIds()).toEqual([]);
  });

  it('leaves the vault untouched', () => {
    writeLog('declared', `title: Declared\naudience: public\n${platformsFor('declared')}`);
    const snapshot = () => {
      const dir = path.join(vaultDir, 'Social/Published');
      return readdirSync(dir).map((name) => [name, readFileSync(path.join(dir, name), 'utf8')]);
    };
    const before = snapshot();
    expect(run().status).toBe(0);
    expect(snapshot()).toEqual(before);
    expect(readdirSync(path.join(vaultDir, 'Social/Drafts'))).toEqual([]);
  });

  it('keeps existing output and exits 0 when the vault is absent', () => {
    writeFileSync(path.join(outDir, 'feed.json'), 'committed');
    const result = run(['--no-net'], path.join(workDir, 'no-such-vault'));
    expect(result.status).toBe(0);
    expect(readFileSync(path.join(outDir, 'feed.json'), 'utf8')).toBe('committed');
    expect(readdirSync(outDir)).toEqual(['feed.json']);
  });

  it('writes nothing on a dry run', () => {
    writeLog('declared', `title: Declared\naudience: public\n${platformsFor('declared')}`);
    expect(run(['--no-net', '--dry']).status).toBe(0);
    expect(readdirSync(outDir)).toEqual([]);
  });

  it('does not run the build when the module is merely imported', () => {
    // Importing runs in this test process; if main() fired it would log here
    // and overwrite real output, so assert on a child that imports and exits.
    const result = spawnSync(
      'node',
      ['--input-type=module', '-e', `await import(${JSON.stringify(SCRIPT)}); console.log('imported');`],
      { encoding: 'utf8', env: { ...process.env, VAULT_DIR: vaultDir, FEED_OUT_DIR: outDir } },
    );
    expect(result.stdout.trim()).toBe('imported');
    expect(readdirSync(outDir)).toEqual([]);
  });
});
