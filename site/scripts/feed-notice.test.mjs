import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { spawnSync } from 'node:child_process';
import {
  appendFileSync,
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { NOTICE_SINCE, runNotice } from './feed-notice.mjs';

const NOTICE = fileURLToPath(new URL('./feed-notice.mjs', import.meta.url));
const FEED_BUILD = fileURLToPath(new URL('./feed-build.mjs', import.meta.url));
const KB_EXPORT = fileURLToPath(new URL('./kb-to-agents.mjs', import.meta.url));

const LOGGED_URL = 'https://resilienttomorrow.substack.com/p/logged-piece';
const LOG_NOTE = `---
piece: 2026-10-30-logged-piece
title: "Logged Piece"
status: published
audience: [public]
first_published: 2026-10-30
platforms:
  - platform: substack
    form: article
    url: ${LOGGED_URL}
    date: 2026-10-30
---

# 2026-10-30-logged-piece — publication log

- **2026-10-30** — Substack article published, live at ${LOGGED_URL}.
- **2026-10-30** — Embeds [a class video](https://www.youtube.com/watch?v=abc), not a surface of this article.
`;
const PAGE_PROSE = 'The pipeline ships one reviewed piece at a time and every surface is approved by a person.';
const kbPage = (title, frontmatter = 'public: yes\nconfidential: none', updated = '2026-10-01') =>
  `---\ntitle: ${title}\nupdated: ${updated}\n${frontmatter}\n---\n\n${PAGE_PROSE}\n`;
const rssItem = (title, url, pubDate = 'Fri, 30 Oct 2026 18:46:57 GMT') =>
  `<item><title>${title}</title><link>${url}</link><pubDate>${pubDate}</pubDate><description>Summary.</description></item>`;
const rss = (...items) => `<?xml version="1.0"?><rss version="2.0"><channel><title>RT</title>${items.join('')}</channel></rss>`;
const OLD_POST = rssItem('Old Post', 'https://resilienttomorrow.substack.com/p/old-post', 'Thu, 08 Oct 2026 21:31:17 GMT');

const snapshot = (root) =>
  readdirSync(root, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => {
      const full = path.join(entry.parentPath, entry.name);
      return [path.relative(root, full), statSync(full).mtimeMs];
    })
    .sort();

describe('feed-notice', () => {
  let workDir;
  let vaultDir;
  let publicDir;
  let stagingRoot;
  let publishedDir;

  const generateBaseline = () => {
    const kb = spawnSync('node', [KB_EXPORT], {
      encoding: 'utf8',
      env: {
        ...process.env,
        KB_DIR: path.join(vaultDir, 'KB'),
        KB_OUT_DIR: path.join(publicDir, 'agents/kb'),
        LLMS_OUT: path.join(publicDir, 'llms.txt'),
      },
    });
    expect(kb.status, kb.stderr).toBe(0);
    const feed = spawnSync('node', [FEED_BUILD, '--no-net'], {
      encoding: 'utf8',
      env: { ...process.env, VAULT_DIR: vaultDir, FEED_OUT_DIR: path.join(publicDir, 'feed') },
    });
    expect(feed.status, feed.stderr).toBe(0);
  };

  // Clean baseline + no network: both feed runs are --no-net and the RSS is a string.
  const notice = (overrides = {}) =>
    runNotice({
      vaultDir,
      publicDir,
      stagingRoot,
      rssXml: rss(OLD_POST),
      feedArgs: ['--no-net'],
      gitStatus: () => '',
      card: { disabled: true },
      ...overrides,
    });
  const idsOfKind = (result, kind) => result.output.findings.filter((f) => f.kind === kind).map((f) => f.id);
  const stagedText = () => {
    if (!existsSync(stagingRoot)) return '';
    return readdirSync(stagingRoot, { recursive: true, withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => readFileSync(path.join(entry.parentPath, entry.name), 'utf8'))
      .join('\n');
  };
  const runDirs = () => readdirSync(stagingRoot).filter((name) => /^\d{4}-/.test(name));

  beforeEach(() => {
    workDir = mkdtempSync(path.join(tmpdir(), 'feed-notice-test-'));
    vaultDir = path.join(workDir, 'vault');
    publicDir = path.join(workDir, 'public');
    stagingRoot = path.join(workDir, 'staging');
    publishedDir = path.join(vaultDir, 'Social/Published');
    mkdirSync(publishedDir, { recursive: true });
    mkdirSync(path.join(vaultDir, 'Social/Drafts'), { recursive: true });
    mkdirSync(path.join(vaultDir, 'KB/pipelines'), { recursive: true });
    writeFileSync(path.join(publishedDir, '2026-10-30-logged-piece.md'), LOG_NOTE);
    writeFileSync(path.join(publishedDir, 'README.md'), '---\nconfidential: internal\n---\n\nSchema example https://bsky.app/profile/x/post/readme\n');
    writeFileSync(path.join(vaultDir, 'KB/pipelines/alpha.md'), kbPage('Alpha Page'));
    writeFileSync(path.join(vaultDir, 'KB/pipelines/beta.md'), kbPage('Beta Page'));
    generateBaseline();
  });

  afterEach(() => {
    rmSync(workDir, { recursive: true, force: true });
  });

  it('is silent on a clean fixture: exit 0, and nothing at all is written', async () => {
    const result = await notice();
    expect(result.exitCode).toBe(0);
    expect(result.output.findings).toEqual([]);
    // A rebuild of unchanged input is byte-identical, so not even bookkeeping moved.
    expect(result.output.bookkeeping).toEqual([]);
    expect(existsSync(stagingRoot)).toBe(false);
  });

  describe('F1 unlogged_publication', () => {
    const newPost = rssItem('A Brand New Post', 'https://resilienttomorrow.substack.com/p/a-brand-new-post');

    it('finds one post the log lacks and stages a parsable, schema-valid note', async () => {
      const result = await notice({ rssXml: rss(newPost, OLD_POST) });
      expect(result.exitCode).toBe(10);
      expect(idsOfKind(result, 'unlogged_publication')).toEqual(['unlogged:2026-10-30-a-brand-new-post']);

      const [runDir] = runDirs();
      const proposal = readFileSync(path.join(stagingRoot, runDir, 'proposals/2026-10-30-a-brand-new-post.md'), 'utf8');
      const frontmatter = yaml.load(proposal.split(/^---$/m)[1]);
      expect(frontmatter).toMatchObject({
        piece: '2026-10-30-a-brand-new-post',
        title: 'A Brand New Post',
        status: 'published',
        audience: ['public'],
      });
      expect(frontmatter.platforms).toEqual([
        { platform: 'substack', form: 'article', url: 'https://resilienttomorrow.substack.com/p/a-brand-new-post', date: new Date('2026-10-30') },
      ]);
    });

    it('keeps a title with YAML-significant characters parsable', async () => {
      const result = await notice({ rssXml: rss(rssItem('Colons: "quotes" &amp; more', 'https://x.test/p/odd')) });
      const proposal = result.output.findings.find((f) => f.kind === 'unlogged_publication').proposal.content;
      expect(yaml.load(proposal.split(/^---$/m)[1]).title).toBe('Colons: "quotes" & more');
    });

    it.each([
      ['a trailing slash', `${LOGGED_URL}/`],
      ['www.', LOGGED_URL.replace('https://', 'https://www.')],
      ['an uppercase host', LOGGED_URL.replace('resilienttomorrow.substack.com', 'ResilientTomorrow.SUBSTACK.com')],
      ['a query string', `${LOGGED_URL}?utm_source=rss`],
    ])('matches a logged post whose RSS URL has %s', async (_label, url) => {
      const result = await notice({ rssXml: rss(rssItem('A Different Headline', url)) });
      expect(idsOfKind(result, 'unlogged_publication')).toEqual([]);
    });

    it('matches a logged post by title when the URL differs', async () => {
      const result = await notice({ rssXml: rss(rssItem('Logged Piece!', 'https://x.test/p/elsewhere')) });
      expect(idsOfKind(result, 'unlogged_publication')).toEqual([]);
    });

    it('ignores pre-horizon posts and says so, with the fetched count', async () => {
      const result = await notice({ rssXml: rss(newPost, OLD_POST) });
      expect(result.output.rss).toMatchObject({ fetched: 2, pre_horizon: 1, horizon: NOTICE_SINCE });
      expect(result.report).toContain(`Watching since ${NOTICE_SINCE}; fetched 2 RSS item(s), of which 1 are pre-horizon and intentionally unrecorded.`);
    });

    it('does not ask to log a post the log marks confidential, and never names it', async () => {
      writeFileSync(
        path.join(publishedDir, 'secret-note.md'),
        `---\npiece: secret-note\ntitle: Secret Thing\nconfidential: ghn\nplatforms:\n  - platform: substack\n    url: https://x.test/p/secret\n---\n\nhttps://bsky.app/profile/x/post/secret\n`,
      );
      const result = await notice({ rssXml: rss(rssItem('Secret Thing', 'https://x.test/p/secret')) });
      expect(result.output.findings).toEqual([]);
      expect(stagedText()).not.toMatch(/secret/i);
    });

    describe('naming the proposal for its draft', () => {
      const POST_URL = 'https://resilienttomorrow.substack.com/p/three-ways-to-own';
      const STEM = '2026-10-29-agentic-web-owning-discovery';
      const DRAFT_BODY = 'Draft body prose that must never reach the log.';
      const post = rssItem('Three Ways to Own Your Corner', POST_URL);
      const writeDraft = (stem, frontmatter) =>
        writeFileSync(path.join(vaultDir, 'Social/Drafts', `${stem}.md`), `---\n${frontmatter}\n---\n\n${DRAFT_BODY}\n`);
      const f1 = (result) => result.output.findings.filter((f) => f.kind === 'unlogged_publication');
      const frontmatterOf = (proposal) => yaml.load(proposal.content.split(/^---$/m)[1]);
      const expectNamedForDraft = (finding, title) => {
        expect(finding.id).toBe(`unlogged:${STEM}`);
        expect(finding.proposal.path).toBe(`proposals/${STEM}.md`);
        expect(frontmatterOf(finding.proposal)).toMatchObject({
          piece: STEM,
          title,
          first_published: new Date('2026-10-30'),
          source_draft: `[[Social/Drafts/${STEM}]]`,
          platforms: [{ platform: 'substack', form: 'article', url: POST_URL, date: new Date('2026-10-30') }],
        });
        expect(finding.proposal.content).toMatch(/^first_published: 2026-10-30\nsource_draft: /m);
        expect(finding.proposal.content).not.toContain(DRAFT_BODY);
        expect(finding.proposal.content).not.toContain('No Social/Drafts note matched');
      };
      const expectUnmatched = (finding) => {
        expect(finding.id).toBe('unlogged:2026-10-30-three-ways-to-own');
        expect(finding.proposal.path).toBe('proposals/2026-10-30-three-ways-to-own.md');
        expect(frontmatterOf(finding.proposal).piece).toBe('2026-10-30-three-ways-to-own');
        expect(frontmatterOf(finding.proposal).title).toBe('Three Ways to Own Your Corner');
        expect(frontmatterOf(finding.proposal)).not.toHaveProperty('source_draft');
        expect(finding.proposal.content).toMatch(/## Log\n\n.*\n- No Social\/Drafts note matched this post — rename this file to the draft's stem if one exists\.\n$/);
      };

      it("names it for a draft with the same title, using the draft's title", async () => {
        writeDraft(STEM, 'title: "Three Ways to Own: Your Corner"');
        const [finding] = f1(await notice({ rssXml: rss(post) }));
        expectNamedForDraft(finding, 'Three Ways to Own: Your Corner');
        const [runDir] = runDirs();
        expect(existsSync(path.join(stagingRoot, runDir, `proposals/${STEM}.md`))).toBe(true);
        expect(stagedText()).not.toContain(DRAFT_BODY);
      });

      it('names it for a draft whose url: matches when the title does not, and URL beats title', async () => {
        writeDraft(STEM, `title: "Own Your Discovery"\nurl: "${POST_URL}/?utm_source=rss"`);
        writeDraft('2026-10-28-another-piece', 'title: "Three Ways to Own Your Corner"');
        const [finding] = f1(await notice({ rssXml: rss(post) }));
        expectNamedForDraft(finding, 'Own Your Discovery');
      });

      it('names it for a draft whose published_log names this post, and for no other published draft', async () => {
        writeDraft(STEM, 'title: "Own Your Discovery"\npublished_log: "[[Social/Published/2026-10-29-three-ways-to-own]]"');
        writeDraft('2026-10-01-other-piece', 'title: "Other Piece"\npublished_log: "[[Social/Published/2026-10-01-other-piece]]"');
        const [finding] = f1(await notice({ rssXml: rss(post) }));
        expectNamedForDraft(finding, 'Own Your Discovery');
      });

      it('falls back to the RSS title when the url-matched draft has none', async () => {
        writeDraft(STEM, `url: ${POST_URL}`);
        const [finding] = f1(await notice({ rssXml: rss(post) }));
        expectNamedForDraft(finding, 'Three Ways to Own Your Corner');
      });

      it('keeps the RSS slug and says so in the body when no draft matches', async () => {
        writeDraft('2026-10-28-another-piece', 'title: "Something Else"');
        const [finding] = f1(await notice({ rssXml: rss(post) }));
        expectUnmatched(finding);
      });

      it('does not guess between two drafts sharing a title, as a piece and its packaging note do', async () => {
        writeDraft(STEM, 'title: "Three Ways to Own Your Corner"');
        writeDraft(`${STEM}-packaging`, 'title: "Three Ways to Own Your Corner"');
        expectUnmatched(f1(await notice({ rssXml: rss(post) }))[0]);
      });

      it('treats a draft that will not parse as no match, never an error', async () => {
        writeDraft(STEM, 'title: "Three Ways to Own Your Corner"\ntitle: Duplicate');
        const result = await notice({ rssXml: rss(post) });
        expectUnmatched(f1(result)[0]);
        expect(stagedText()).not.toContain(STEM);
      });

      it('does not propose a second note over a piece the log already has', async () => {
        writeDraft(STEM, 'title: "Three Ways to Own Your Corner"');
        writeFileSync(
          path.join(publishedDir, `${STEM}.md`),
          `---\npiece: ${STEM}\ntitle: "Own Your Discovery"\naudience: [public]\nfirst_published: 2026-10-29\nplatforms:\n  - platform: linkedin\n    url: https://www.linkedin.com/posts/own\n---\n`,
        );
        expect(f1(await notice({ rssXml: rss(post) }))).toEqual([]);
      });

      it('still matches a draft when an unrelated confidential note links to no draft', async () => {
        writeDraft(STEM, 'title: "Own Your Discovery"\nurl: ' + POST_URL);
        writeFileSync(path.join(publishedDir, '2026-10-29-sealed-note.md'), '---\npiece: 2026-10-29-sealed-note\ntitle: Sealed\nconfidential: ghn\n---\n');
        expectNamedForDraft(f1(await notice({ rssXml: rss(post) }))[0], 'Own Your Discovery');
      });

      describe('confidential drafts are never named', () => {
        const SECRET_STEM = '2026-10-29-zebra-engagement';
        const expectNotNamed = (result) => {
          expectUnmatched(f1(result)[0]);
          expect(JSON.stringify(result.output)).not.toMatch(/zebra/i);
          expect(stagedText()).not.toMatch(/zebra/i);
        };

        it('when it is the only title match', async () => {
          writeDraft(SECRET_STEM, 'title: "Three Ways to Own Your Corner"\nconfidential: ghn');
          expectNotNamed(await notice({ rssXml: rss(post) }));
        });

        it('when it matches on url:, and a weaker title match does not step in', async () => {
          writeDraft(SECRET_STEM, `title: "Other"\nurl: ${POST_URL}\nconfidential: ghn`);
          writeDraft('2026-10-28-another-piece', 'title: "Three Ways to Own Your Corner"');
          const result = await notice({ rssXml: rss(post) });
          expectNotNamed(result);
          expect(stagedText()).not.toContain('2026-10-28-another-piece');
        });

        it.each([
          ['its source_draft', `source_draft: "[[Social/Drafts/${SECRET_STEM}]]"`, 'title: "Three Ways to Own Your Corner"'],
          ['the draft published_log', '', `title: "Three Ways to Own Your Corner"\npublished_log: "[[Social/Published/2026-10-29-sealed-note]]"`],
        ])('when a confidential log note is linked through %s', async (_label, noteLine, draftFrontmatter) => {
          writeDraft(SECRET_STEM, draftFrontmatter);
          writeFileSync(
            path.join(publishedDir, '2026-10-29-sealed-note.md'),
            `---\npiece: 2026-10-29-sealed-note\ntitle: Sealed\nconfidential: ghn\n${noteLine}\n---\n`,
          );
          expectNotNamed(await notice({ rssXml: rss(post) }));
        });
      });
    });
  });

  describe('F2 unrecorded_surface', () => {
    const addBluesky = () =>
      appendFileSync(path.join(publishedDir, '2026-10-30-logged-piece.md'), '- **2026-10-31 09:00 PDT** — Bluesky post published: https://bsky.app/profile/x/post/abc.\n');

    it('finds a prose-only Bluesky URL, and nothing for the YouTube URL in the same note', async () => {
      addBluesky();
      const result = await notice();
      expect(idsOfKind(result, 'unrecorded_surface')).toEqual(['surface:2026-10-30-logged-piece:bluesky']);
      expect(JSON.stringify(result.output.findings)).not.toContain('youtube');
    });

    it('stages a YAML patch that parses and pastes under platforms:', async () => {
      addBluesky();
      await notice();
      const [runDir] = runDirs();
      const patch = readFileSync(path.join(stagingRoot, runDir, 'patches/2026-10-30-logged-piece.platforms.yaml'), 'utf8');
      expect(yaml.load(`platforms:\n${patch}`).platforms).toEqual([
        { platform: 'bluesky', form: 'post', url: 'https://bsky.app/profile/x/post/abc', date: new Date('2026-10-31') },
      ]);
    });

    it('dates a surface from its log entry when the URL wraps to the next line', async () => {
      appendFileSync(path.join(publishedDir, '2026-10-30-logged-piece.md'), '- **2026-11-02 13:46 PDT** — Bluesky post published and read back live:\n  https://bsky.app/profile/x/post/wrapped\n');
      const result = await notice();
      const finding = result.output.findings.find((f) => f.kind === 'unrecorded_surface');
      expect(finding.proposal.content).toContain('date: 2026-11-02');
    });

    it('finds nothing once frontmatter records the surface under a differently-normalised URL', async () => {
      const note = LOG_NOTE.replace('---\n\n#', '  - platform: linkedin\n    form: post\n    url: https://www.linkedin.com/posts/abc/\n    date: 2026-10-31\n---\n\n#');
      writeFileSync(path.join(publishedDir, '2026-10-30-logged-piece.md'), `${note}\nSee https://linkedin.com/posts/abc\n`);
      generateBaseline();
      expect((await notice()).exitCode).toBe(0);
    });

    it('matches subdomains of an allowed host, but not a lookalike', async () => {
      appendFileSync(path.join(publishedDir, '2026-10-30-logged-piece.md'), 'https://m.facebook.com/post/1 https://notfacebook.com/post/2\n');
      const result = await notice();
      expect(idsOfKind(result, 'unrecorded_surface')).toEqual(['surface:2026-10-30-logged-piece:facebook']);
      expect(JSON.stringify(result.output.findings)).not.toContain('notfacebook');
    });
  });

  describe('F3 kb_drift', () => {
    const alpha = () => path.join(vaultDir, 'KB/pipelines/alpha.md');

    it('finds exactly one page whose prose differs, with its title and public URL', async () => {
      writeFileSync(alpha(), readFileSync(alpha(), 'utf8').replace('reviewed', 'approved'));
      const result = await notice();
      expect(idsOfKind(result, 'kb_drift')).toEqual(['kb:kb-pipelines-alpha']);
      const finding = result.output.findings.find((f) => f.kind === 'kb_drift');
      expect(finding.title).toContain('Alpha Page');
      expect(finding.evidence).toContain('/agents/kb/kb-pipelines-alpha.md');
    });

    it('has no finding at all when only updated: and a writer stamp changed', async () => {
      writeFileSync(alpha(), `${kbPage('Alpha Page', 'public: yes\nconfidential: none', '2026-10-30')}\n<!-- writer: kb-nightly 2026-10-30T03:01 -->\n`);
      const result = await notice();
      expect(result.exitCode).toBe(0);
      expect(result.output.findings).toEqual([]);
      // Quiet, not hidden: the churn is still on the record.
      expect(result.output.bookkeeping.length).toBeGreaterThan(0);
      expect(existsSync(stagingRoot)).toBe(false);
    });

    it('folds a committed orphan into the same class', async () => {
      writeFileSync(path.join(publicDir, 'agents/kb/kb-pipelines-alpha-part9.md'), 'stale');
      const result = await notice();
      expect(idsOfKind(result, 'kb_drift')).toEqual(['drift:site/public/agents/kb/kb-pipelines-alpha-part9.md']);
    });

    it('reports a missing committed digest as F5, not as silence', async () => {
      rmSync(path.join(publicDir, 'agents/kb/digest.json'));
      const result = await notice();
      expect(idsOfKind(result, 'source_unreachable')).toEqual(['source:kb-digest']);
      expect(idsOfKind(result, 'kb_drift')).toEqual([]);
    });
  });

  describe('confidential pages', () => {
    const SECRET = 'Zebra Engagement';

    it('never names a confidential page in any staged file', async () => {
      writeFileSync(path.join(vaultDir, 'KB/pipelines/zebra-engagement.md'), kbPage(SECRET, 'public: yes\nconfidential: ghn'));
      writeFileSync(path.join(vaultDir, 'KB/pipelines/alpha.md'), readFileSync(path.join(vaultDir, 'KB/pipelines/alpha.md'), 'utf8').replace('reviewed', 'approved'));
      const result = await notice();
      expect(result.exitCode).toBe(10);
      expect(JSON.stringify(result.output)).not.toMatch(/zebra/i);
      expect(stagedText()).not.toMatch(/zebra/i);
    });

    it('does not name a published page that has since gone confidential, only counts it', async () => {
      writeFileSync(path.join(vaultDir, 'KB/pipelines/zebra-engagement.md'), kbPage(SECRET));
      generateBaseline();
      writeFileSync(path.join(vaultDir, 'KB/pipelines/zebra-engagement.md'), kbPage(SECRET, 'public: yes\nconfidential: ghn'));
      const result = await notice({ gitStatus: () => ' D site/public/agents/kb/kb-pipelines-zebra-engagement.md\n' });
      expect(result.exitCode).toBe(10);
      expect(idsOfKind(result, 'kb_drift')).toEqual(['kb:withdrawn']);
      expect(idsOfKind(result, 'rebuild_would_change_output')).toContain('drift:site/public/agents/kb');
      expect(JSON.stringify(result.output)).not.toMatch(/zebra/i);
      expect(stagedText()).not.toMatch(/zebra/i);
    });
  });

  describe('F4 rebuild_would_change_output', () => {
    it('summarises a KB change as a page delta and names the artifacts', async () => {
      writeFileSync(path.join(vaultDir, 'KB/pipelines/gamma.md'), kbPage('Gamma Page'));
      const result = await notice();
      const finding = result.output.findings.find((f) => f.id === 'drift:site/public/agents/kb');
      expect(finding.severity).toBe('high');
      expect(finding.detail).toContain('2→3 pages');
      expect(finding.evidence).toEqual(expect.arrayContaining(['/agents/kb/kb-pipelines-gamma.md', '/llms.txt']));
    });

    it('summarises a feed change as an item delta', async () => {
      writeFileSync(
        path.join(publishedDir, '2026-10-31-second.md'),
        `---\npiece: 2026-10-31-second\ntitle: Second\naudience: [public]\nfirst_published: 2026-10-31\nplatforms:\n  - platform: substack\n    url: https://x.test/p/second\n---\n`,
      );
      const result = await notice();
      const finding = result.output.findings.find((f) => f.id === 'drift:site/public/feed');
      expect(finding.severity).toBe('high');
      expect(finding.detail).toBe('+1 item');
    });

    it('reports a dirty baseline as low', async () => {
      const result = await notice({ gitStatus: () => ' M site/public/feed/feed.json\n' });
      const finding = result.output.findings.find((f) => f.id === 'drift:site/public:uncommitted');
      expect(finding.severity).toBe('low');
      expect(finding.title).toBe('the baseline on disk is not what shipped');
    });
  });

  describe('F5 source_unreachable', () => {
    it('--no-net skips F1 and the feed half of F4, and says so', async () => {
      // A log change that the feed half would otherwise see.
      writeFileSync(
        path.join(publishedDir, '2026-10-31-second.md'),
        `---\npiece: 2026-10-31-second\ntitle: Second\naudience: [public]\nfirst_published: 2026-10-31\nplatforms:\n  - platform: substack\n    url: https://x.test/p/second\n---\n`,
      );
      const result = await notice({ noNet: true, rssXml: undefined });
      expect(result.exitCode).toBe(10);
      expect(result.output.findings.map((f) => f.id)).toEqual(['source:substack']);
      expect(result.output.findings[0].severity).toBe('low');
      expect(result.output.findings[0].title).toContain('not evaluated (network skipped)');
    });

    it.each([
      ['unusable RSS', '<html>Rate limited</html>'],
      ['RSS with no valid items', rss('<item><title>No link</title></item>')],
    ])('does not read %s as editorial silence', async (_label, rssXml) => {
      const result = await notice({ rssXml });
      expect(result.exitCode).toBe(10);
      expect(idsOfKind(result, 'source_unreachable')).toEqual(['source:substack']);
      expect(result.report).not.toMatch(/no new post/i);
      // Comparing against nothing would manufacture drift.
      expect(result.output.findings.find((f) => f.id === 'drift:site/public/feed')).toBeUndefined();
    });

    it('stages a persisting source failure every run, but cards it only once', async () => {
      const home = workDir;
      mkdirSync(path.join(home, '.hermes/profiles/content'), { recursive: true });
      const { bin, creates } = fakeHermes();
      const card = { hermesBin: bin, home, assignee: 'content', board: 'default', priority: '40' };
      expect((await notice({ noNet: true, card, now: new Date('2026-10-30T20:00:00Z') })).exitCode).toBe(10);
      expect((await notice({ noNet: true, card, now: new Date('2026-10-31T20:00:00Z') })).exitCode).toBe(10);
      expect(creates()).toHaveLength(1);
    });
  });

  // A stand-in binary, so the card contract is exercised with no real board anywhere near it.
  // Keeps the real CLI's contract: `create` on a known key returns that card's id and leaves
  // its body alone, `show --json` nests the body under task, and `comment` takes positional text.
  function fakeHermes({ exitCode = 0, existingBody = null, failOn = null, noId = false, dropComments = false } = {}) {
    const logFile = path.join(workDir, 'hermes-calls.log');
    const stateFile = path.join(workDir, 'hermes-cards.json');
    const bin = path.join(workDir, 'fake-hermes');
    writeFileSync(
      bin,
      `#!${process.execPath}
const fs = require('node:fs');
const [logFile, stateFile] = ${JSON.stringify([logFile, stateFile])};
const options = ${JSON.stringify({ exitCode, existingBody, failOn, noId, dropComments })};
const args = process.argv.slice(2);
fs.appendFileSync(logFile, args.join('\\u001f') + '\\u001e');
const verb = args[3];
if (options.exitCode || options.failOn === verb) process.exit(options.exitCode || 1);
const cards = fs.existsSync(stateFile) ? JSON.parse(fs.readFileSync(stateFile, 'utf8')) : {};
const save = () => fs.writeFileSync(stateFile, JSON.stringify(cards));
const byId = (id) => Object.values(cards).find((card) => card.id === id);
if (verb === 'create') {
  const key = args[args.indexOf('--idempotency-key') + 1];
  const count = Object.keys(cards).length;
  const body = count === 0 && options.existingBody !== null ? options.existingBody : fs.readFileSync(args[args.indexOf('--body-file') + 1], 'utf8');
  cards[key] ??= { id: count === 0 ? 't_fake' : 't_fake' + count, body, comments: [] };
  save();
  console.log(JSON.stringify(options.noId ? {} : { id: cards[key].id, body: cards[key].body }));
} else if (verb === 'show') {
  const card = byId(args[4]);
  console.log(JSON.stringify({ task: { id: card.id, body: card.body }, comments: card.comments.map((body) => ({ author: 'x', body })) }));
} else if (verb === 'comment') {
  if (!options.dropComments) byId(args[4]).comments.push(args[5]);
  save();
}
`,
    );
    chmodSync(bin, 0o755);
    const calls = () =>
      existsSync(logFile)
        ? readFileSync(logFile, 'utf8').split('\u001e').filter(Boolean).map((line) => line.split('\u001f').filter(Boolean))
        : [];
    const callsOf = (verb) => calls().filter((args) => args[3] === verb);
    return { bin, calls, creates: () => callsOf('create'), comments: () => callsOf('comment') };
  }

  describe('delivery', () => {
    const makeFinding = () => writeFileSync(path.join(vaultDir, 'KB/pipelines/alpha.md'), kbPage('Alpha Page').replace('reviewed', 'approved'));
    const cardOptions = (bin, assignee = 'content') => ({ hermesBin: bin, home: workDir, assignee, board: 'default', priority: '40' });
    const ledger = () => JSON.parse(readFileSync(path.join(stagingRoot, 'ledger.json'), 'utf8'));
    const day = (d) => new Date(`2026-${d}T20:00:00Z`);

    beforeEach(() => {
      mkdirSync(path.join(workDir, '.hermes/profiles/content'), { recursive: true });
      makeFinding();
    });

    it('invokes hermes with the exact contract, carrying the report and its absolute path', async () => {
      const { bin, creates } = fakeHermes();
      const result = await notice({ card: cardOptions(bin), now: day('10-30') });
      expect(result.exitCode).toBe(10);
      expect(result.output.delivered).toMatchObject({ ok: true, id: 't_fake', shown_in: 'body' });

      const [args] = creates();
      const reportFile = args[args.indexOf('--body-file') + 1];
      expect(args.slice(0, 9)).toEqual(['kanban', '--board', 'default', 'create', '--assignee', 'content', '--priority', '40', '--idempotency-key']);
      expect(args[9]).toBe(result.output.delivered.key);
      expect(args[9]).toMatch(/^feed-notice-2026-10-30-[0-9a-f]{8}$/);
      expect(args).toContain('--json');
      expect(args.at(-1)).toBe('feed notice 2026-10-30 — 2 finding(s) [drift, kb]');
      expect(path.isAbsolute(reportFile)).toBe(true);
      expect(readFileSync(reportFile, 'utf8')).toContain(`Staged at ${path.dirname(reportFile)}.`);
    });

    it('writes at most one card a day, and delivers a late finding the next day', async () => {
      const { bin, creates } = fakeHermes();
      await notice({ card: cardOptions(bin), now: day('10-30') });
      writeFileSync(path.join(vaultDir, 'KB/pipelines/beta.md'), kbPage('Beta Page').replace('reviewed', 'approved'));
      const later = await notice({ card: cardOptions(bin), now: new Date('2026-10-30T21:00:00Z') });
      expect(later.exitCode).toBe(10);
      expect(later.output.delivered.reason).toBe('already_carded_today');
      expect(creates()).toHaveLength(1);

      await notice({ card: cardOptions(bin), now: day('10-31') });
      expect(creates()).toHaveLength(2);
      expect(creates()[1][9]).toMatch(/^feed-notice-2026-10-31-/);
    });

    describe('the idempotency key', () => {
      const keyFor = async () => (await notice({ card: { disabled: true }, dry: false, now: day('10-30') })).output.delivered.key;

      it('stays the same for the same findings and moves when they change', async () => {
        const first = await keyFor();
        rmSync(stagingRoot, { recursive: true });
        expect(await keyFor()).toBe(first);
        rmSync(stagingRoot, { recursive: true });
        writeFileSync(path.join(vaultDir, 'KB/pipelines/beta.md'), kbPage('Beta Page').replace('reviewed', 'approved'));
        expect(await keyFor()).not.toBe(first);
      });
    });

    describe('confirming what the card shows', () => {
      const STALE = '### F3 kb_drift (medium) — kb:some-other-page\n';

      it('comments the report onto a card whose body is stale, and only then reports ok', async () => {
        const { bin, creates, comments } = fakeHermes({ existingBody: STALE });
        const result = await notice({ card: cardOptions(bin), now: day('10-30') });
        expect(creates()).toHaveLength(1);
        expect(comments()).toHaveLength(1);
        const [args] = comments();
        expect(args.slice(0, 5)).toEqual(['kanban', '--board', 'default', 'comment', 't_fake']);
        expect(args[5]).toContain('kb:kb-pipelines-alpha');
        // The real CLI has no --body-file on comment, and would exit 2 on one.
        expect(args).not.toContain('--body-file');
        expect(result.output.delivered).toMatchObject({ ok: true, id: 't_fake', shown_in: 'comment' });
        expect(ledger().seen['kb_drift:kb:kb-pipelines-alpha'].last_carded).toBe('2026-10-30');
      });

      it('does not comment when the body already shows every finding', async () => {
        const { bin, comments } = fakeHermes();
        await notice({ card: cardOptions(bin), now: day('10-30') });
        expect(comments()).toEqual([]);
      });

      it('does not take a longer id in the body for the id it is looking for', async () => {
        const { bin, comments } = fakeHermes({ existingBody: '— kb:kb-pipelines-alpha-two\n— drift:site/public/agents/kb\n' });
        await notice({ card: cardOptions(bin), now: day('10-30') });
        expect(comments()).toHaveLength(1);
      });

      it('does not repeat a comment an earlier run already left', async () => {
        const { bin, comments } = fakeHermes({ existingBody: STALE });
        await notice({ card: cardOptions(bin), now: day('10-30') });
        rmSync(path.join(stagingRoot, 'ledger.json'));
        const again = await notice({ card: cardOptions(bin), now: new Date('2026-10-30T21:00:00Z') });
        expect(comments()).toHaveLength(1);
        expect(again.output.delivered).toMatchObject({ ok: true, shown_in: 'comment' });
      });

      it.each([
        ['the read back fails', { failOn: 'show' }, 'readback_failed'],
        ['the comment fails', { existingBody: STALE, failOn: 'comment' }, 'comment_failed'],
        ['the comment does not land', { existingBody: STALE, dropComments: true }, 'comment_unconfirmed'],
        ['create returns no id', { noId: true }, 'card_id_unknown'],
      ])('reports failure and keeps the card owed when %s', async (_label, options, reason) => {
        const { bin } = fakeHermes(options);
        const result = await notice({ card: cardOptions(bin), now: day('10-30') });
        expect(result.exitCode).toBe(10);
        expect(result.output.delivered).toMatchObject({ attempted: true, ok: false, reason });
        expect(ledger().seen['kb_drift:kb:kb-pipelines-alpha']).toMatchObject({ last_carded: null, card_owed: true });
        expect(runDirs()).toHaveLength(1);
      });
    });

    it('warns and keeps exit 10 for a phantom assignee, and does not call hermes', async () => {
      const { bin, calls } = fakeHermes();
      const result = await notice({ card: cardOptions(bin, 'bogus') });
      expect(result.exitCode).toBe(10);
      expect(result.output.delivered.reason).toBe('assignee_absent');
      expect(calls()).toEqual([]);
      expect(runDirs()).toHaveLength(1);
    });

    it('warns and keeps exit 10 when the hermes binary is absent', async () => {
      const result = await notice({ card: cardOptions(path.join(workDir, 'no-such-hermes')) });
      expect(result.exitCode).toBe(10);
      expect(result.output.delivered.reason).toBe('hermes_absent');
      expect(runDirs()).toHaveLength(1);
    });

    it('never loses a finding to a failed card: exit 10, staged, retried next run', async () => {
      const failing = fakeHermes({ exitCode: 1 });
      const result = await notice({ card: cardOptions(failing.bin), now: day('10-30') });
      expect(result.exitCode).toBe(10);
      expect(result.output.delivered).toMatchObject({ attempted: true, ok: false });
      expect(ledger().seen['kb_drift:kb:kb-pipelines-alpha']).toMatchObject({ last_carded: null, card_owed: true });
      expect(runDirs()).toHaveLength(1);

      const again = await notice({ card: cardOptions(failing.bin), now: day('10-31') });
      expect(again.exitCode).toBe(10);
      expect(failing.calls()).toHaveLength(2);
    });

    it('FEED_NOTICE_NO_CARD stages and exits 10 without calling hermes', async () => {
      const { bin, calls } = fakeHermes();
      const result = await notice({ card: { ...cardOptions(bin), disabled: true } });
      expect(result.exitCode).toBe(10);
      expect(result.output.delivered.attempted).toBe(false);
      expect(calls()).toEqual([]);
    });

    describe('a finding that vanishes and returns', () => {
      const clearFinding = () => writeFileSync(path.join(vaultDir, 'KB/pipelines/alpha.md'), kbPage('Alpha Page'));
      const at = (hour) => new Date(`2026-10-30T${hour}:00:00Z`);

      it('keeps last_carded through the run where it is gone', async () => {
        const { bin } = fakeHermes();
        await notice({ card: cardOptions(bin), now: at('20') });
        clearFinding();
        expect((await notice({ card: cardOptions(bin), now: at('21') })).exitCode).toBe(0);
        expect(ledger().seen['kb_drift:kb:kb-pipelines-alpha']).toMatchObject({ last_carded: '2026-10-30', gone_since: '2026-10-30' });
      });

      it('is not carded again the same day', async () => {
        const { bin, creates } = fakeHermes();
        await notice({ card: cardOptions(bin), now: at('20') });
        clearFinding();
        await notice({ card: cardOptions(bin), now: at('21') });
        makeFinding();
        const back = await notice({ card: cardOptions(bin), now: at('22') });
        expect(back.exitCode).toBe(0);
        expect(creates()).toHaveLength(1);
        expect(back.output.still_open).toContain('kb:kb-pipelines-alpha');
        expect(ledger().seen['kb_drift:kb:kb-pipelines-alpha'].gone_since).toBeUndefined();
      });

      it('is still recognised the next day, inside the seven-day window', async () => {
        const { bin, creates } = fakeHermes();
        await notice({ card: cardOptions(bin), now: day('10-30') });
        clearFinding();
        await notice({ card: cardOptions(bin), now: new Date('2026-10-30T21:00:00Z') });
        makeFinding();
        expect((await notice({ card: cardOptions(bin), now: day('10-31') })).exitCode).toBe(0);
        expect(creates()).toHaveLength(1);
      });

      it('still counts today\'s card against the one-a-day limit once its findings are gone', async () => {
        const { bin, creates } = fakeHermes();
        await notice({ card: cardOptions(bin), now: at('20') });
        clearFinding();
        writeFileSync(path.join(vaultDir, 'KB/pipelines/beta.md'), kbPage('Beta Page').replace('reviewed', 'approved'));
        const other = await notice({ card: cardOptions(bin), now: at('21') });
        expect(other.output.delivered.reason).toBe('already_carded_today');
        expect(creates()).toHaveLength(1);
      });

      it('fires again once the window has passed, and is forgotten if it never returns', async () => {
        const { bin, creates } = fakeHermes();
        await notice({ card: cardOptions(bin), now: day('10-01') });
        clearFinding();
        await notice({ card: cardOptions(bin), now: day('10-02') });
        makeFinding();
        expect((await notice({ card: cardOptions(bin), now: day('10-09') })).exitCode).toBe(10);
        expect(creates()).toHaveLength(2);

        clearFinding();
        await notice({ card: cardOptions(bin), now: day('10-10') });
        await notice({ card: cardOptions(bin), now: day('10-17') });
        expect(ledger().seen).toEqual({});
      });
    });

    describe('ledger', () => {
      it('records a finding, then stays silent, leaving the ledger as the only thing moved', async () => {
        const { bin, creates } = fakeHermes();
        expect((await notice({ card: cardOptions(bin), now: day('10-30') })).exitCode).toBe(10);
        expect(ledger().version).toBe(1);
        expect(ledger().seen['kb_drift:kb:kb-pipelines-alpha']).toEqual({ first_seen: '2026-10-30', last_seen: '2026-10-30', last_carded: '2026-10-30', runs: 1 });

        const quiet = await notice({ card: cardOptions(bin), now: day('10-31') });
        expect(quiet.exitCode).toBe(0);
        expect(quiet.output.findings).toEqual([]);
        expect(quiet.output.still_open).toContain('kb:kb-pipelines-alpha');
        expect(runDirs()).toHaveLength(1);
        expect(creates()).toHaveLength(1);
        expect(ledger().seen['kb_drift:kb:kb-pipelines-alpha']).toMatchObject({ last_seen: '2026-10-31', last_carded: '2026-10-30', runs: 2 });
      });

      it('nags a high finding after seven days, but never a medium one', async () => {
        const { bin, creates } = fakeHermes();
        await notice({ card: cardOptions(bin), now: day('10-01') });
        expect((await notice({ card: cardOptions(bin), now: day('10-07') })).exitCode).toBe(0);
        const nag = await notice({ card: cardOptions(bin), now: day('10-08') });
        expect(nag.exitCode).toBe(10);
        expect(creates()).toHaveLength(2);
        expect(nag.output.findings.map((f) => f.id)).toEqual(['drift:site/public/agents/kb']);
        expect(nag.output.still_open).toEqual(['kb:kb-pipelines-alpha']);
      });

      it('removes a finding that disappears uncarded, so that it fires again if it returns', async () => {
        await notice();
        writeFileSync(path.join(vaultDir, 'KB/pipelines/alpha.md'), kbPage('Alpha Page'));
        expect((await notice()).exitCode).toBe(0);
        expect(ledger().seen).toEqual({});
        makeFinding();
        expect((await notice()).exitCode).toBe(10);
      });
    });

    it('keeps the 14 newest dated directories, and nothing but those is pruned', async () => {
      mkdirSync(stagingRoot, { recursive: true });
      for (let n = 1; n <= 15; n += 1) mkdirSync(path.join(stagingRoot, `2026-09-${String(n).padStart(2, '0')}T07-10`));
      mkdirSync(path.join(stagingRoot, 'not-a-run'));
      await notice();
      const dirs = runDirs().sort();
      expect(dirs).toHaveLength(14);
      expect(dirs).not.toContain('2026-09-02T07-10');
      expect(existsSync(path.join(stagingRoot, 'not-a-run'))).toBe(true);
    });
  });

  describe('report.md', () => {
    it('has the fixed shape', async () => {
      writeFileSync(path.join(vaultDir, 'KB/pipelines/alpha.md'), kbPage('Alpha Page').replace('reviewed', 'approved'));
      await notice({ now: new Date('2026-10-30T21:20:00Z') });
      const report = readFileSync(path.join(stagingRoot, '2026-10-30T14-20/report.md'), 'utf8');
      const lines = report.split('\n');
      expect(lines[0]).toBe('# feed notice — 2026-10-30 14:20 PT');
      expect(lines[1]).toBe('2 finding(s): 1 high, 1 medium.');
      expect(lines[2]).toBe('');
      expect(lines[3]).toMatch(/^Rebuild would change what is published: /);
      expect(lines[4]).toBe('');
      expect(lines[5]).toBe('## Do this');
      expect(lines[6]).toMatch(/^1\. Rebuild \+ commit both public\/feed and public\/agents together/);
      expect(report).toContain('## Findings');
      expect(report).toContain('### F3 kb_drift (medium) — kb:kb-pipelines-alpha');
      expect(report).toContain('### F4 rebuild_would_change_output (high) — drift:site/public/agents/kb');
      expect(JSON.parse(readFileSync(path.join(stagingRoot, '2026-10-30T14-20/notice.json'), 'utf8')).counts).toEqual({ high: 1, medium: 1, low: 0 });
    });
  });

  describe('what it may touch', () => {
    const dirty = () => {
      appendFileSync(path.join(publishedDir, '2026-10-30-logged-piece.md'), 'https://bsky.app/profile/x/post/abc\n');
      writeFileSync(path.join(vaultDir, 'KB/pipelines/alpha.md'), kbPage('Alpha Page').replace('reviewed', 'approved'));
    };

    it('leaves the vault and the baseline untouched, writing only under the staging root', async () => {
      dirty();
      const vaultBefore = snapshot(vaultDir);
      const publicBefore = snapshot(publicDir);
      const topLevelBefore = readdirSync(workDir).sort();
      const newPost = rssItem('A Brand New Post', 'https://x.test/p/new');
      expect((await notice({ rssXml: rss(newPost) })).exitCode).toBe(10);
      expect(snapshot(vaultDir)).toEqual(vaultBefore);
      expect(snapshot(publicDir)).toEqual(publicBefore);
      expect(readdirSync(workDir).sort()).toEqual([...topLevelBefore, 'staging'].sort());
    });

    it('--dry writes nothing at all and still reports what it found', async () => {
      dirty();
      const vaultBefore = snapshot(vaultDir);
      const publicBefore = snapshot(publicDir);
      const { bin, calls } = fakeHermes();
      const result = await notice({ dry: true, card: { hermesBin: bin, home: workDir, assignee: 'content', board: 'default', priority: '40' } });
      expect(result.exitCode).toBe(10);
      expect(result.output.findings.length).toBeGreaterThan(0);
      expect(result.report).toContain('Dry run: nothing was staged.');
      expect(existsSync(stagingRoot)).toBe(false);
      expect(calls()).toEqual([]);
      expect(snapshot(vaultDir)).toEqual(vaultBefore);
      expect(snapshot(publicDir)).toEqual(publicBefore);
    });

    it('leaves the real public/ alone when it is the baseline, on a run that renders both exports', async () => {
      dirty();
      const repoPublic = fileURLToPath(new URL('../public/', import.meta.url));
      const repoArtifacts = () => [snapshot(path.join(repoPublic, 'agents')), snapshot(path.join(repoPublic, 'feed')), statSync(path.join(repoPublic, 'llms.txt')).mtimeMs];
      const before = repoArtifacts();
      const result = await runNotice({ vaultDir, stagingRoot, rssXml: rss(OLD_POST), feedArgs: ['--no-net'], gitStatus: () => '', card: { disabled: true } });
      expect(result.output.findings.map((f) => f.id)).toContain('drift:site/public/feed');
      expect(repoArtifacts()).toEqual(before);
    });
  });

  describe('the command line', () => {
    const cli = (args, env = {}) =>
      spawnSync('node', [NOTICE, ...args], {
        encoding: 'utf8',
        env: { ...process.env, VAULT_DIR: vaultDir, FEED_NOTICE_STAGING: stagingRoot, FEED_NOTICE_NO_CARD: '1', ...env },
      });

    it.each(['--help', '-h'])('%s prints every flag and touches nothing', (flag) => {
      mkdirSync(path.join(workDir, '.hermes/profiles/content'), { recursive: true });
      const { bin, calls } = fakeHermes();
      const vaultBefore = snapshot(vaultDir);
      const result = cli([flag], { FEED_NOTICE_NO_CARD: '', HERMES_BIN: bin, HOME: workDir });
      expect(result.status).toBe(0);
      for (const option of ['--dry', '--no-net', '--json', '--help']) expect(result.stdout).toContain(option);
      expect(existsSync(stagingRoot)).toBe(false);
      expect(calls()).toEqual([]);
      expect(snapshot(vaultDir)).toEqual(vaultBefore);
    });

    it('refuses an unknown flag rather than falling through to a live run', () => {
      mkdirSync(path.join(workDir, '.hermes/profiles/content'), { recursive: true });
      const { bin, calls } = fakeHermes();
      const result = cli(['--hlep'], { FEED_NOTICE_NO_CARD: '', HERMES_BIN: bin, HOME: workDir });
      expect(result.status).toBe(1);
      expect(result.stderr).toContain('--hlep');
      expect(existsSync(stagingRoot)).toBe(false);
      expect(calls()).toEqual([]);
    });

    it('exits 2, quietly, when the vault is absent', () => {
      const result = cli([], { VAULT_DIR: path.join(workDir, 'no-such-vault') });
      expect(result.status).toBe(2);
      expect(result.stdout).toBe('');
      expect(existsSync(stagingRoot)).toBe(false);
    });

    it('exits 1 on a log note that will not parse', () => {
      writeFileSync(path.join(publishedDir, 'broken.md'), '---\ntitle: Broken\ntitle: Duplicate\n---\n');
      const result = cli(['--no-net', '--dry', '--json']);
      expect(result.status).toBe(1);
      expect(result.stderr).toContain('broken.md');
      expect(JSON.parse(result.stdout).status).toBe('error');
    });

    it('exits 1 when the vault has no KB', () => {
      rmSync(path.join(vaultDir, 'KB'), { recursive: true });
      expect(cli(['--no-net', '--dry']).status).toBe(1);
    });

    it('exits 10 with --no-net --dry --json: one JSON object, and no staging', () => {
      const result = cli(['--no-net', '--dry', '--json']);
      expect(result.status).toBe(10);
      const output = JSON.parse(result.stdout);
      expect(output.exit).toBe(10);
      expect(output.findings.map((f) => f.id)).toContain('source:substack');
      expect(existsSync(stagingRoot)).toBe(false);
    });

    it('with FEED_NOTICE_NO_CARD, stages under FEED_NOTICE_STAGING and exits 10', () => {
      const result = cli(['--no-net', '--json']);
      expect(result.status).toBe(10);
      const output = JSON.parse(result.stdout);
      expect(output.delivered.reason).toBe('FEED_NOTICE_NO_CARD');
      expect(output.staged.startsWith(stagingRoot)).toBe(true);
      expect(existsSync(path.join(output.staged, 'report.md'))).toBe(true);
    });
  });
});
