#!/usr/bin/env node
/**
 * Publish case studies: copies content-drafts/case-studies/publish/<slug>.md
 * into src/content/case-studies/ and refuses the copy when a required section
 * heading is missing (or Sources has no items). Field-level checks happen at
 * build time via the collection schema in src/content.config.ts. The script
 * does not read or rewrite prose: the copy is frozen in the drafts.
 *
 * Usage: node scripts/publish-case-studies.mjs [slug ...]   (no args = all)
 * Env:   CASE_DRAFTS_DIR to point at a different drafts dir (tests/demos);
 *        canonical default is the publish path in the flow spec.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const drafts = process.env.CASE_DRAFTS_DIR ?? path.resolve(siteRoot, "..", "content-drafts/case-studies/publish");
const outDir = path.join(siteRoot, "src", "content", "case-studies");
const REQUIRED = ["The problem", "What was actually blocking use", "What I designed", "What I'd change", "Growth read", "Sources"];
const files = process.argv.slice(2).map((s) => `${s}.md`);
if (files.length === 0) files.push(...readdirSync(drafts).filter((f) => f.endsWith(".md")));

mkdirSync(outDir, { recursive: true });
for (const file of files) {
  const src = path.join(drafts, file);
  if (!existsSync(src)) { console.error(`refused: ${drafts}/${file} does not exist`); process.exitCode = 1; continue; }
  const text = readFileSync(src, "utf8");
  const body = text.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n*/, "");
  const headings = [...body.matchAll(/^## (?!#)(.+)$/gm)].map((m) => m[1].trim());
  const missing = REQUIRED.filter((h) => headings.includes(h) === false);
  const fmSlug = (text.match(/^slug:\s*"?([a-z0-9-]+)"?\s*$/m)?.[1] ?? file.replace(/\.md$/, ""));
  const sourceItems = (body.split(/^## ?#* ?Sources\s*$/m)[1] ?? "").split("\n").filter((l) => l.trim().startsWith("- ")).length;
  if (missing.length) {
    console.error(`refused: ${file} is missing required section ${missing.length > 1 ? "headings" : "heading"}: ${missing.join(", ")}`);
    process.exitCode = 1; continue;
  }
  if (sourceItems === 0) { console.error(`refused: ${file} has a Sources section with no list items`); process.exitCode = 1; continue; }
  if (fmSlug !== file.replace(/\.md$/, "")) {
    console.error(`refused: ${file} frontmatter slug "${fmSlug}" does not match its filename`);
    process.exitCode = 1; continue;
  }
  writeFileSync(path.join(outDir, file), text);
  console.log(`published ${file} (${headings.length} sections, ${sourceItems} sources)`);
}