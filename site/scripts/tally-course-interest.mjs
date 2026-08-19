#!/usr/bin/env node
/**
 * Tally the AI Fluency Lab course-interest votes.
 *
 *   node scripts/tally-course-interest.mjs responses.jsonl
 *
 * Input: one JSON object per line — the block at the bottom of each vote email
 * (or `SELECT picks ... FROM course_interest` exported from D1). Blank lines and
 * anything unparseable are skipped and counted at the end.
 *
 * Reports three numbers per topic, because no single one tells the whole story:
 *
 *   VOTES   how many people picked it at all          -> breadth of appeal
 *   AVG     mean 1-5 rating among those who picked it -> intensity
 *   SCORE   sum of each voter's normalized rating     -> breadth x intensity
 *
 * Normalizing matters: a voter who rates all ten picks a 5 would otherwise
 * outweigh one who rated honestly. Dividing each rating by that voter's own
 * total gives every respondent exactly 1.0 of influence to spend.
 */
import { readFileSync } from "node:fs";

const file = process.argv[2];
if (!file) {
  console.error("usage: node scripts/tally-course-interest.mjs <responses.jsonl>");
  process.exit(1);
}

const lines = readFileSync(file, "utf8").split("\n");
const responses = [];
let skipped = 0;

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed) continue;
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed?.picks)) responses.push(parsed);
    else skipped++;
  } catch {
    skipped++;
  }
}

if (!responses.length) {
  console.error("No parseable responses found.");
  process.exit(1);
}

const stats = new Map(); // id -> {title, votes, sum, norm}

for (const r of responses) {
  const total = r.picks.reduce((acc, p) => acc + (Number(p.rating) || 0), 0);
  for (const p of r.picks) {
    const rating = Number(p.rating) || 0;
    if (!rating) continue;
    const entry = stats.get(p.id) || { title: p.title || p.id, votes: 0, sum: 0, norm: 0 };
    entry.votes += 1;
    entry.sum += rating;
    entry.norm += total > 0 ? rating / total : 0;
    stats.set(p.id, entry);
  }
}

const ranked = [...stats.entries()]
  .map(([id, s]) => ({ id, title: s.title, votes: s.votes, avg: s.sum / s.votes, score: s.norm }))
  .sort((a, b) => b.score - a.score || b.votes - a.votes);

const pad = (s, n) => String(s).padEnd(n).slice(0, n);
console.log(`\n${responses.length} responses${skipped ? ` (${skipped} lines skipped)` : ""}\n`);
console.log(`${pad("#", 4)}${pad("TOPIC", 52)}${pad("VOTES", 7)}${pad("AVG", 6)}SCORE`);
console.log("-".repeat(80));
ranked.forEach((r, i) => {
  console.log(
    `${pad(i + 1, 4)}${pad(r.title, 52)}${pad(r.votes, 7)}${pad(r.avg.toFixed(1), 6)}${r.score.toFixed(3)}`
  );
});

const others = responses.map((r) => r.other).filter(Boolean);
if (others.length) {
  console.log(`\n\nWRITE-INS (${others.length})`);
  console.log("-".repeat(80));
  others.forEach((o, i) => console.log(`${i + 1}. ${o}`));
}
console.log();
