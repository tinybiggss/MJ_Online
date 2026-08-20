#!/usr/bin/env node
/**
 * Extract AI Fluency course-interest votes from saved vote emails into JSONL.
 *
 *   node scripts/extract-votes.mjs <file-or-dir> [...] > responses.jsonl
 *   node scripts/extract-votes.mjs ./emails --out responses.jsonl
 *
 * Input: raw email bodies saved as files (.html, .eml, or .txt — any format that
 * still contains the machine-readable block). Directories are walked one level.
 *
 * Each vote email from POST /api/course-interest ends with:
 *
 *   <p ...>Machine-readable — paste into the tally script:</p>
 *   <pre ...>{&quot;created_at&quot;:&quot;...&quot;,&quot;picks&quot;:[...]}</pre>
 *
 * The payload is HTML-escaped by the function before embedding, so it CANNOT be
 * fed to JSON.parse directly — `"` arrives as `&quot;` and `&` as `&amp;`
 * (e.g. the topic "Privacy & Sovereignty"). This script decodes entities in the
 * correct order (&amp; last, or you double-decode and corrupt quoted strings),
 * validates shape, drops duplicates, and emits one clean object per line.
 *
 * Output is exactly what tally-course-interest.mjs expects.
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, extname } from "node:path";

const args = process.argv.slice(2);
let outFile = null;
const inputs = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--out") outFile = args[++i];
  else inputs.push(args[i]);
}

if (!inputs.length) {
  console.error("usage: node scripts/extract-votes.mjs <file-or-dir> [...] [--out responses.jsonl]");
  process.exit(1);
}

const OK_EXT = new Set([".html", ".htm", ".eml", ".txt", ".md", ""]);

function collectFiles(target) {
  const st = statSync(target);
  if (st.isFile()) return [target];
  return readdirSync(target)
    .map((f) => join(target, f))
    .filter((f) => statSync(f).isFile() && OK_EXT.has(extname(f).toLowerCase()));
}

/** Reverse of the function's escapeHtml. Order matters: &amp; must be LAST. */
function decodeEntities(s) {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

/**
 * Pull candidate payloads out of one email body. Tries the <pre> block first,
 * then falls back to any brace-delimited run containing "created_at" — which
 * survives clients that strip tags or rewrap plain text.
 */
function findPayloads(raw) {
  const out = [];
  for (const m of raw.matchAll(/<pre[^>]*>([\s\S]*?)<\/pre>/gi)) out.push(m[1]);
  if (!out.length) {
    for (const m of raw.matchAll(/\{[^{}]*(?:&quot;|")created_at(?:&quot;|")[\s\S]*?\}\s*(?=$|\n|<)/g)) {
      out.push(m[0]);
    }
  }
  return out;
}

function parsePayload(chunk) {
  const cleaned = decodeEntities(chunk.replace(/<[^>]+>/g, "")).trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  try {
    const obj = JSON.parse(cleaned.slice(start, end + 1));
    if (!Array.isArray(obj.picks)) return null;
    const picks = obj.picks.filter(
      (p) => p && typeof p.id === "string" && Number.isInteger(p.rating) && p.rating >= 1 && p.rating <= 5
    );
    if (!picks.length && !obj.other) return null;
    return { created_at: obj.created_at ?? null, name: obj.name ?? "", email: obj.email ?? "", other: obj.other ?? "", picks };
  } catch {
    return null;
  }
}

const files = inputs.flatMap(collectFiles);
const records = [];
const seen = new Set();
let filesWithNone = 0;
let unparseable = 0;
let duplicates = 0;

for (const f of files) {
  const payloads = findPayloads(readFileSync(f, "utf8"));
  if (!payloads.length) {
    filesWithNone++;
    console.error(`  no payload found: ${f}`);
    continue;
  }
  let got = 0;
  let dupHere = 0;
  let badHere = 0;
  for (const chunk of payloads) {
    const rec = parsePayload(chunk);
    if (!rec) { unparseable++; badHere++; continue; }
    const key = `${rec.created_at}|${rec.name}|${rec.email}|${rec.picks.length}`;
    if (seen.has(key)) { duplicates++; dupHere++; continue; }
    seen.add(key);
    records.push(rec);
    got++;
  }
  // Distinguish "already counted from another copy" from "failed to parse" —
  // a forwarded duplicate is expected and fine; a parse failure needs a look.
  if (!got) {
    if (dupHere && !badHere) console.error(`  duplicate of an already-counted vote: ${f}`);
    else console.error(`  payload present but unparseable: ${f}`);
  }
}

records.sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)));
const jsonl = records.map((r) => JSON.stringify(r)).join("\n") + (records.length ? "\n" : "");

if (outFile) {
  writeFileSync(outFile, jsonl);
  console.error(`\nwrote ${records.length} responses -> ${outFile}`);
} else {
  process.stdout.write(jsonl);
}

console.error(
  [
    `\nfiles scanned:      ${files.length}`,
    `responses extracted: ${records.length}`,
    `files with no block: ${filesWithNone}`,
    `unparseable blocks:  ${unparseable}`,
    `duplicates dropped:  ${duplicates}`,
  ].join("\n")
);
if (!records.length) process.exit(1);
