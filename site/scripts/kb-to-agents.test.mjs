import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { spawnSync } from 'node:child_process';
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  utimesSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT = fileURLToPath(new URL('./kb-to-agents.mjs', import.meta.url));

const PROSE = 'The pipeline ships one reviewed piece at a time and every surface is approved by a person before it goes out.';
const page = ({ title = 'Alpha', updated = '2026-10-01', frontmatter = 'public: yes\nconfidential: none', body = '' } = {}) =>
  `---\ntitle: ${title}\nupdated: ${updated}\n${frontmatter}\n---\n\n${PROSE}\n\n## Details\n\nDetails of how the thing works, written long enough to clear the minimum chunk size.\n${body}`;

describe('kb-to-agents', () => {
  let workDir;
  let kbDir;
  let outDir;
  let llmsPath;

  const run = (args = [], extraEnv = {}) =>
    spawnSync('node', [SCRIPT, ...args], {
      encoding: 'utf8',
      env: { ...process.env, KB_DIR: kbDir, KB_OUT_DIR: outDir, LLMS_OUT: llmsPath, ...extraEnv },
    });
  const digest = () => {
    const result = run(['--digest', '--json']);
    expect(result.status, result.stderr).toBe(0);
    return JSON.parse(result.stdout);
  };
  const writePage = (rel, text) => {
    const full = path.join(kbDir, rel);
    mkdirSync(path.dirname(full), { recursive: true });
    writeFileSync(full, text);
    return full;
  };

  beforeEach(() => {
    workDir = mkdtempSync(path.join(tmpdir(), 'kb-agents-'));
    kbDir = path.join(workDir, 'KB');
    outDir = path.join(workDir, 'public/agents/kb');
    llmsPath = path.join(workDir, 'public/llms.txt');
    mkdirSync(kbDir);
    writePage('pipelines/alpha.md', page());
    writePage('pipelines/beta.md', page({ title: 'Beta' }));
    writePage('SCHEMA.md', page({ title: 'Schema' }));
    writePage('private/draft.md', page({ title: 'Private', frontmatter: 'public: no' }));
    writePage('private/client.md', page({ title: 'Client', frontmatter: 'public: yes\nconfidential: ghn' }));
  });

  afterEach(() => {
    rmSync(workDir, { recursive: true, force: true });
  });

  describe('--digest', () => {
    it('prints one JSON object in the contract shape and writes nothing', () => {
      const view = digest();
      expect(Object.keys(view).sort()).toEqual(['generated_at', 'orphans', 'pages']);
      expect(Object.keys(view.pages)).toEqual(['kb-pipelines-alpha', 'kb-pipelines-beta']);
      const entry = view.pages['kb-pipelines-alpha'];
      expect(Object.keys(entry).sort()).toEqual(['digest', 'files', 'updated']);
      expect(entry.digest).toMatch(/^sha256:[0-9a-f]{64}$/);
      expect(entry.updated).toBe('2026-10-01');
      expect(entry.files).toEqual(['kb-pipelines-alpha.md']);
      expect(existsSync(outDir)).toBe(false);
      expect(existsSync(llmsPath)).toBe(false);
    });

    it('never lists a confidential or default-deny page', () => {
      const raw = run(['--digest', '--json']).stdout;
      expect(raw).not.toMatch(/client|draft|schema/i);
    });

    it('is stable across runs against an unchanged KB', () => {
      const first = digest().pages;
      const second = digest().pages;
      for (const id of Object.keys(first)) expect(second[id].digest).toBe(first[id].digest);
    });

    it('does not move for mtime, updated:, History lines, or a writer stamp', () => {
      const before = digest().pages;
      const alpha = path.join(kbDir, 'pipelines/alpha.md');
      utimesSync(alpha, new Date('2030-01-01'), new Date('2030-01-01'));
      expect(digest().pages['kb-pipelines-alpha'].digest).toBe(before['kb-pipelines-alpha'].digest);

      writeFileSync(alpha, page({ updated: '2026-10-30' }));
      const afterUpdated = digest().pages['kb-pipelines-alpha'];
      expect(afterUpdated.digest).toBe(before['kb-pipelines-alpha'].digest);
      expect(afterUpdated.updated).toBe('2026-10-30');

      appendFileSync(alpha, '\n## History\n\n- 2026-10-30 — nightly pass rewrote this page.\n');
      expect(digest().pages['kb-pipelines-alpha'].digest).toBe(before['kb-pipelines-alpha'].digest);

      appendFileSync(alpha, '\n<!-- writer: kb-nightly 2026-10-30T03:01 -->\n');
      expect(digest().pages['kb-pipelines-alpha'].digest).toBe(before['kb-pipelines-alpha'].digest);
    });

    it('moves on exactly one page when one word of prose changes', () => {
      const before = digest().pages;
      const alpha = path.join(kbDir, 'pipelines/alpha.md');
      writeFileSync(alpha, readFileSync(alpha, 'utf8').replace('reviewed', 'approved'));
      const after = digest().pages;
      const moved = Object.keys(before).filter((id) => before[id].digest !== after[id].digest);
      expect(moved).toEqual(['kb-pipelines-alpha']);
    });

    it('does not let a stamp pad a short section past the minimum chunk size', () => {
      const short = '\n## Short\n\nToo short to publish.\n';
      writePage('pipelines/alpha.md', page({ body: short }));
      const before = digest().pages['kb-pipelines-alpha'].digest;
      writePage('pipelines/alpha.md', page({ body: `${short}<!-- writer: kb-nightly 2026-10-30T03:01 and a long enough note to cross the limit -->\n` }));
      expect(digest().pages['kb-pipelines-alpha'].digest).toBe(before);
    });

    it('reports unreferenced .md files without removing them', () => {
      mkdirSync(outDir, { recursive: true });
      writeFileSync(path.join(outDir, 'kb-gone.md'), 'old');
      expect(digest().orphans).toEqual(['kb-gone.md']);
      expect(existsSync(path.join(outDir, 'kb-gone.md'))).toBe(true);
    });

    it('reports kb_absent and exits 2 when the KB is missing', () => {
      const result = run(['--digest', '--json'], { KB_DIR: path.join(workDir, 'nope') });
      expect(result.status).toBe(2);
      expect(JSON.parse(result.stdout)).toEqual({ error: 'kb_absent' });
      expect(existsSync(outDir)).toBe(false);
    });
  });

  describe('a normal run', () => {
    it('writes the export, llms.txt, and a digest.json matching --digest', () => {
      expect(run().status).toBe(0);
      expect(readdirSync(outDir).sort()).toEqual([
        'digest.json',
        'index.json',
        'kb-pipelines-alpha.md',
        'kb-pipelines-beta.md',
        'search-index.json',
      ]);
      expect(existsSync(llmsPath)).toBe(true);
      const written = JSON.parse(readFileSync(path.join(outDir, 'digest.json'), 'utf8'));
      expect(written.orphans).toEqual([]);
      expect(written.pages).toEqual(digest().pages);
    });

    it('derives llms.txt from an agents/kb tree when only KB_OUT_DIR is set', () => {
      expect(run([], { LLMS_OUT: '' }).status).toBe(0);
      expect(existsSync(path.join(workDir, 'public/llms.txt'))).toBe(true);
      expect(existsSync(path.join(workDir, 'public/agents/llms.txt'))).toBe(false);
    });

    it('strips comments, multi-line and unterminated, from every emitted file', () => {
      writePage('pipelines/alpha.md', page({ body: '<!-- writer: kb-nightly\nspans lines -->\n\n## Tail\n\nKept section long enough to clear the minimum chunk size for an emitted part.\n\n<!-- never closed\n\n## Hidden\n\nHidden section long enough to clear the minimum chunk size for an emitted part.\n' }));
      expect(run().status).toBe(0);
      const emitted = readdirSync(outDir).map((name) => readFileSync(path.join(outDir, name), 'utf8')).join('\n');
      expect(emitted).not.toMatch(/writer:|spans lines|<!--|Hidden|never closed/);
      expect(emitted).toContain('Kept section');
    });

    it('removes orphans, keeps the sidecar files, and writes the digest of what is left', () => {
      expect(run().status).toBe(0);
      const clean = readFileSync(path.join(outDir, 'digest.json'), 'utf8');
      writeFileSync(path.join(outDir, 'kb-gone.md'), 'old');
      const result = run();
      expect(result.status).toBe(0);
      expect(result.stdout).toContain('removed orphan: kb-gone.md');
      expect(existsSync(path.join(outDir, 'kb-gone.md'))).toBe(false);
      // Naming it here would make the next identical run rewrite this file.
      expect(readFileSync(path.join(outDir, 'digest.json'), 'utf8')).toBe(clean);
      for (const kept of ['index.json', 'search-index.json', 'digest.json']) {
        expect(existsSync(path.join(outDir, kept))).toBe(true);
      }
    });

    describe('determinism', () => {
      const exported = () =>
        Object.fromEntries(
          [...readdirSync(outDir).map((name) => path.join(outDir, name)), llmsPath].map((file) => [path.basename(file), readFileSync(file, 'utf8')]),
        );
      const changedFiles = (before, after) =>
        Object.keys({ ...before, ...after }).filter((name) => before[name] !== after[name]).sort();

      it('writes byte-identical output for identical input, whatever the clock or mtimes say', () => {
        expect(run().status).toBe(0);
        const first = exported();
        utimesSync(path.join(kbDir, 'pipelines/alpha.md'), new Date('2030-01-01'), new Date('2030-01-01'));
        expect(run().status).toBe(0);
        expect(exported()).toEqual(first);
      });

      it('stamps every generated file with the newest published updated:, ignoring private pages', () => {
        writePage('pipelines/beta.md', page({ title: 'Beta', updated: '2026-10-20' }));
        writePage('private/draft.md', page({ title: 'Private', updated: '2026-12-25', frontmatter: 'public: no' }));
        expect(run().status).toBe(0);
        for (const [name, field] of [['index.json', 'generatedAt'], ['search-index.json', 'generatedAt'], ['digest.json', 'generated_at']]) {
          expect(JSON.parse(readFileSync(path.join(outDir, name), 'utf8'))[field], name).toBe('2026-10-20T00:00:00.000Z');
        }
      });

      it('has no stamp to report when no page carries a date', () => {
        writePage('pipelines/alpha.md', page().replace(/^updated: .*\n/m, ''));
        writePage('pipelines/beta.md', page({ title: 'Beta' }).replace(/^updated: .*\n/m, ''));
        expect(run().status).toBe(0);
        expect(JSON.parse(readFileSync(path.join(outDir, 'index.json'), 'utf8')).generatedAt).toBeNull();
      });

      it('changes exactly the affected files when one page\'s prose changes', () => {
        expect(run().status).toBe(0);
        const before = exported();
        const alpha = path.join(kbDir, 'pipelines/alpha.md');
        writeFileSync(alpha, readFileSync(alpha, 'utf8').replace('Details of how the thing works', 'Details of how the thing runs'));
        expect(run().status).toBe(0);
        // Section text, not the page summary, so index.json and llms.txt do not move.
        expect(changedFiles(before, exported())).toEqual(['digest.json', 'kb-pipelines-alpha.md', 'search-index.json']);
      });
    });

    it('keeps -part files of a split page and points index.json at one that exists', () => {
      const sections = Array.from({ length: 4 }, (_, n) => `\n## Section ${n}\n\n${'A long sentence for the split. '.repeat(160)}\n`).join('');
      writePage('pipelines/alpha.md', page({ body: sections }));
      expect(run().status).toBe(0);
      const index = JSON.parse(readFileSync(path.join(outDir, 'index.json'), 'utf8'));
      const alpha = index.pages.find((entry) => entry.id === 'kb-pipelines-alpha');
      expect(alpha.files.length).toBeGreaterThan(1);
      for (const name of alpha.files) expect(existsSync(path.join(outDir, name))).toBe(true);
      expect(existsSync(path.join(outDir, path.basename(alpha.path)))).toBe(true);
    });

    it('--json keeps stdout to a single object', () => {
      const result = run(['--json']);
      expect(result.status).toBe(0);
      expect(JSON.parse(result.stdout).included).toBe(2);
    });

    it('keeps the fallback when the KB is absent: exit 0, nothing written', () => {
      const result = run([], { KB_DIR: path.join(workDir, 'nope') });
      expect(result.status).toBe(0);
      expect(existsSync(outDir)).toBe(false);
    });
  });

  describe('confidentiality', () => {
    it('aborts with exit 3 when a token survives redaction, and writes nothing', () => {
      writePage('pipelines/alpha.md', page({ body: '\n## The GHN engagement\n\nA section long enough to clear the minimum chunk size so that it is emitted here.\n' }));
      const result = run();
      expect(result.status).toBe(3);
      expect(result.stderr).toContain('ABORT');
      expect(existsSync(outDir)).toBe(false);
    });

    it('redacts a confidential line even when a comment sat on it', () => {
      writePage('pipelines/alpha.md', page({ body: '\nThis line names GHN outright. <!-- stamp -->\n' }));
      expect(run().status).toBe(0);
      expect(readFileSync(path.join(outDir, 'kb-pipelines-alpha.md'), 'utf8')).not.toContain('names');
    });

    it('blocks bare, quoted, and unknown confidential values, not just ghn and internal', () => {
      for (const [index, value] of ['', '"ghn"', 'client-x', 'internal # note'].entries()) {
        writePage(`private/case-${index}.md`, page({ title: `Case ${index}`, frontmatter: `public: yes\nconfidential: ${value}` }));
      }
      expect(Object.keys(digest().pages)).toEqual(['kb-pipelines-alpha', 'kb-pipelines-beta']);
    });
  });
});

describe('committed export', () => {
  const dir = fileURLToPath(new URL('../public/agents/kb/', import.meta.url));

  // Live since 2026-10-30 23:17: the held export shipped (commit 4c7d500) —
  // the automation registry left the public export on Mike's ruling
  // (public: no at the source), the last four writer stamps were stripped,
  // and digest.json is the committed baseline again. These two guards keep
  // /agents/kb honest: regenerate drifts and stray stamps get caught in CI.
  it('publishes no writer stamp or comment, and no file its index omits', () => {
    const index = JSON.parse(readFileSync(path.join(dir, 'index.json'), 'utf8'));
    const listed = new Set(index.pages.flatMap((entry) => entry.files));
    for (const name of readdirSync(dir)) {
      expect(readFileSync(path.join(dir, name), 'utf8'), name).not.toMatch(/writer: kb-nightly|<!--/);
      if (name.endsWith('.md')) expect(listed.has(name), name).toBe(true);
    }
  });

  it('carries a digest.json covering every indexed page', () => {
    const index = JSON.parse(readFileSync(path.join(dir, 'index.json'), 'utf8'));
    const digest = JSON.parse(readFileSync(path.join(dir, 'digest.json'), 'utf8'));
    expect(Object.keys(digest.pages).sort()).toEqual(index.pages.map((entry) => entry.id).sort());
  });
});
