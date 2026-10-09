import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { tokenize, scoreEntries } from './scorer.mjs';

// Real index — the exact artifact the endpoint serves in production.
const index = JSON.parse(
  readFileSync(new URL('../../public/agents/kb/search-index.json', import.meta.url), 'utf8')
);

describe('tokenize', () => {
  it('strips stopwords and punctuation, keeps meaningful terms', () => {
    expect(tokenize("What is Mike's Xbox patent experience?")).toEqual(['mike', 'xbox', 'patent', 'experience']);
  });
  it('returns [] for pure-stopword or empty queries', () => {
    expect(tokenize('what is this')).toEqual([]);
    expect(tokenize('')).toEqual([]);
    expect(tokenize(null)).toEqual([]);
  });
});

describe('scoreEntries (real published index)', () => {
  it('finds the patent in career/history content with a real md path', () => {
    const { results } = scoreEntries(index.entries, 'Xbox SDK patent', 5);
    expect(results.length).toBeGreaterThan(0);
    const top = results[0];
    expect((top.title + ' ' + (top.section || '') + ' ' + top.text).toLowerCase()).toContain('patent');
    expect(top.path).toMatch(/^\/agents\/kb\/kb-.*\.md$/);
  });

  it('ranked OR: distills query surfaces Distills pages before unrelated ones', () => {
    const { results } = scoreEntries(index.entries, 'how does the Distills registry work', 5);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].text + (results[0].section || '')).toMatch(/distills|registry/i);
  });

  it('handles natural-language questions via OR scoring (no keyword syntax needed)', () => {
    const { results } = scoreEntries(index.entries, 'Who can I hire Mike to work with and what does it cost?', 3);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].text.toLowerCase()).toMatch(/velocity|engage|retainer|audit|work/i);
  });

  it('is deterministic: identical query → identical output', () => {
    const a = scoreEntries(index.entries, 'resilient tomorrow publishing metrics', 5);
    const b = scoreEntries(index.entries, 'resilient tomorrow publishing metrics', 5);
    expect(a).toEqual(b);
  });

  it('respects the limit and never returns more entries than exist', () => {
    const { results } = scoreEntries(index.entries, 'mike', 3);
    expect(results.length).toBeLessThanOrEqual(3);
  });

  it('returns empty results (not a crash) for no-match queries', () => {
    const { results } = scoreEntries(index.entries, 'zzzqqqxyzzy', 5);
    expect(results).toEqual([]);
  });
});