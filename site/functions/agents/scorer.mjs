/**
 * Deterministic passage scorer for mikejones.online /agents/query (T-2026-10-09-871).
 * Shared by the Pages Function (query.js) and local node tests — single source
 * of truth so scores cannot drift between the endpoint and its tests.
 *
 * Scoring: OR over tokens. Title hit +4, section hit +3, body occurrences
 * +2 for the first hit then +1 each (capped at +5 per word for frequency).
 * Rank by score, then by number of distinct matched terms.
 */

const STOP = new Set([
  'the', 'a', 'an', 'of', 'for', 'to', 'in', 'on', 'is', 'are', 'and', 'or',
  'what', 'who', 'whom', 'do', 'does', 'did', 'with', 'my', 'me', 'i', 'how',
  'why', 'when', 'where', 'that', 'this', 'it', 'its', 'his', 'her', 'can',
  'could', 'should', 'would', 'was', 'were', 'be', 'been', 'at', 'by', 'from',
  'as', 'tell', 'give', 'list', 'show', 'find', 'need', 'want', 'about',
]);

export function tokenize(q) {
  return (q || '')
    .toLowerCase()
    .split(/[^a-z0-9+]+/)
    .filter((w) => w.length > 1 && !STOP.has(w));
}

export function scoreEntries(entries, q, limit = 5) {
  const words = tokenize(q);
  if (!words.length) return { words, results: [] };

  const scored = [];
  for (const e of entries || []) {
    const title = (e.title || '').toLowerCase();
    const section = (e.section || '').toLowerCase();
    const body = (e.text || '').toLowerCase();
    let score = 0;
    let matched = 0;
    for (const w of words) {
      let wordScore = 0;
      if (title.includes(w)) wordScore += 4;
      if (section.includes(w)) wordScore += 3;
      const freq = body.split(w).length - 1;
      if (freq > 0) wordScore += 2 + Math.min(freq - 1, 3);
      if (wordScore > 0) matched += 1;
      score += wordScore;
    }
    if (score > 0) scored.push({ entry: e, score, matched });
  }

  scored.sort((a, b) => b.score - a.score || b.matched - a.matched);

  return {
    words,
    results: scored.slice(0, limit).map(({ entry, score, matched }) => ({
      id: entry.id,
      title: entry.title,
      section: entry.section,
      updated: entry.updated,
      path: entry.path,
      text: entry.text,
      score,
      matchedTerms: matched,
    })),
  };
}