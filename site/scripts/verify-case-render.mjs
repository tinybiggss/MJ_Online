#!/usr/bin/env node
/**
 * End-to-end frozen-copy check on the BUILT site. For each publish draft,
 * the built /work/<slug>/ page must render: the frozen H1 title, the five
 * section headings, every paragraph (whitespace-normalized), every Sources
 * line, and the position line. Also checks the /work table (row titles,
 * diagnoses, statuses, links), the pinned paper theme vs the dark default
 * elsewhere, and the newsletter boundary (Resilient Tomorrow only as the
 * ways-to-engage row on /work). Run after `npm run build`. Exits 1 on any
 * mismatch.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const drafts = process.env.CASE_DRAFTS_DIR ?? path.resolve(siteRoot, "..", "content-drafts/case-studies/publish");

const decode = (html) =>
  html
    .replace(/<(script|style)[\s\S]*?<\/\1>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
// Inline markers render as tags, never as text, so a fair baseline strips them.
const stripMd = (s) =>
  s.replace(/`([^`]+)`/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1").replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, "$1");
const norm = (s) => s.replace(/\s+/g, " ").trim();

const mainText = (rawHtml) => norm(decode((rawHtml.match(/<main[\s\S]*?<\/main>/) ?? [""])[0]));
let checks = 0;
const fail = (msg) => { console.error(`MISSING: ${msg}`); process.exitCode = 1; };
const check = (haystack, needle, label) => {
  checks++;
  if (!haystack.includes(needle)) fail(`${label}: "${needle.slice(0, 90)}"`);
};

const workRaw = readFileSync(path.join(siteRoot, "dist", "work", "index.html"), "utf8");
const workPage = mainText(workRaw);

const slugs = readdirSync(drafts).filter((f) => f.endsWith(".md"));
if (slugs.length === 0) { fail("no publish drafts found"); }
for (const file of slugs) {
  const raw = readFileSync(path.join(drafts, file), "utf8");
  const fmTitle = (raw.match(/^title:\s*"?([^"\n]+)"?\s*$/m)?.[1] ?? "").trim();
  const position = (raw.match(/^position:\s*"(.+)"\s*$/m)?.[1] ?? "").trim();
  const body = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n*/, "");
  const slug = file.replace(/\.md$/, "");
  const distFile = path.join(siteRoot, "dist", "work", slug, "index.html");
  if (!existsSync(distFile)) { fail(`no built page for /work/${slug}`); continue; }
  const rawHtml = readFileSync(distFile, "utf8");
  const page = mainText(rawHtml);

  if (!/data-theme="light"/.test(rawHtml.split("<body")[0])) fail(`${slug}: document page is not pinned to the paper theme`);
  check(page, fmTitle, `${slug} H1`);
  check(page, position, `${slug} position line`);
  for (const m of body.matchAll(/^## (?!#)(.+)$/gm)) {
    check(page, m[1].trim(), `${slug} heading`);
  }

  // Paragraphs: heading lines and Sources list items are dropped (sources are
  // checked separately below); each remaining prose block must appear whole.
  const proseBlocks = (body.split(/^## Sources\s*$/m)[0] ?? body)
    .split("\n")
    .filter((l) => !/^#/.test(l))
    .join("\n")
    .split(/\n\s*\n/)
    .map((p) => norm(stripMd(p)))
    .filter((p) => p.length > 24);
  for (const p of proseBlocks) {
    check(page, p, `${slug} paragraph`);
  }

  const sourcesText = (body.split(/^## Sources\s*$/m)[1] ?? "").trim();
  for (const line of sourcesText.split("\n")) {
    const item = norm(stripMd(line.replace(/^- /, "")));
    if (item) check(page, item, `${slug} source`);
  }
}

// The /work table: every case's row title, diagnosis, status, and link.
for (const file of slugs) {
  const raw = readFileSync(path.join(drafts, file), "utf8");
  const rowTitle = (raw.match(/^rowTitle:\s*"?([^"\n]+)"?\s*$/m)?.[1] ?? "").trim();
  const diag = (raw.match(/^diag:\s*"?([^"\n]+)"?\s*$/m)?.[1] ?? "").trim();
  const status = (raw.match(/^status:\s*"(.+)"\s*$/m)?.[1] ?? "").trim();
  const slug = file.replace(/\.md$/, "");
  check(workPage, rowTitle, `/work row title ${slug}`);
  check(workPage, diag, `/work row diagnosis ${slug}`);
  check(workPage, status, `/work row status ${slug}`);
  checks++;
  if (!workRaw.includes(`href="/work/${slug}"`)) fail(`/work has no link to /work/${slug}`);
}
for (const label of ["Case studies", "Ways to engage", "Systems index", "Working on something like this?"]) {
  check(workPage, label, "/work section");
}
{
  // The resume link, the footer's twin, lives in the /work opening.
  check(workPage, "The formal file:", "/work resume lead-in");
  check(workPage, "Résumé (PDF)", "/work resume link");
  checks++;
  if (!workRaw.includes('href="/Mike-Jones-Resume.pdf"')) fail("/work has no resume PDF link");
}
{
  // Resilient Tomorrow stays out of the /work body except its ways-to-engage
  // row: exactly one mention above the footer. (Case pages' frozen prose may
  // still cite the newsletter; the rule is about promo placement, not
  // citations.)
  const occurrences = workPage.split("Resilient Tomorrow").length - 1;
  checks++;
  if (occurrences !== 1) fail(`/work body mentions Resilient Tomorrow ${occurrences} times (expected exactly 1, the ways-to-engage row)`);
}
{
  // Document pages pin paper; every other route keeps the dark desk default.
  for (const route of ["index", "about", "resume", "contact"]) {
    const rel = route === "index" ? "index.html" : `${route}/index.html`;
    const html = readFileSync(path.join(siteRoot, "dist", rel), "utf8");
    checks++;
    if (/data-theme=/.test(html.split("<body")[0])) fail(`/${route} should keep the dark default (no data-theme pin)`);
  }
}

console.log(`verify-case-render: ${checks} assertions checked, exit ${process.exitCode ?? 0}`);
if (process.exitCode) { console.log("FAILED"); process.exit(process.exitCode); }
console.log("OK: all frozen copy renders verbatim.");