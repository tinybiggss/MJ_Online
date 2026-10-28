import { describe, expect, it } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseCaseBody, renderSourceLine, REQUIRED_SECTIONS } from "./case-format";

/**
 * Frozen-copy guard: the rendered output of the case-study formatter must
 * carry the publish files' text verbatim. No prose rewrite can pass through
 * this layer unnoticed.
 */
const publishDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../content-drafts/case-studies/publish");
const SLUGS = ["neighborhoodshare", "distills", "add-friendly-agent"];

/** HTML back to text. */
const decode = (html: string) =>
  html
    .replace(/<(script|style)[\s\S]*?<\/\1>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();

/** Markdown inline markers (code spans, bold, italics) out: the formatter renders them as tags, never as text. */
const stripMd = (s: string) =>
  s
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, "$1");

const norm = (s: string) => s.replace(/\s+/g, " ").trim();

describe("frozen case-study prose renders verbatim", () => {
  for (const slug of SLUGS) {
    const file = path.join(publishDir, `${slug}.md`);

    it(`every paragraph, source line, and the title of ${slug} round-trips through the formatter`, () => {
      expect(existsSync(file)).toBe(true);
      const raw = readFileSync(file, "utf8");
      const body = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n*/, "");
      const fmTitle = (raw.match(/^title:\s*"?([^"\n]+)"?\s*$/m)?.[1] ?? "").trim();

      // Section chunks in order: [0] = H1 header, then one chunk per "## " heading.
      const chunks = body.split(/^## (?!#)/m);
      expect((chunks[chunks.length - 1].split("\n")[0] ?? "").trim()).toBe("Sources");
      expect(chunks.slice(1).map((c) => (c.split("\n")[0] ?? "").trim())).toEqual([...REQUIRED_SECTIONS]);

      const parsed = parseCaseBody(body);
      expect(parsed.title).toBe(fmTitle);
      expect(fmTitle).toBeTruthy();
      expect(parsed.sections.map((s) => s.heading)).toEqual(REQUIRED_SECTIONS.slice(0, 5));
      expect(parsed.sections.length).toBe(chunks.length - 2);

      // Each section's paragraphs match the frozen text, tags stripped.
      parsed.sections.forEach((section, i) => {
        const chunk = chunks[i + 1];
        const heading = (chunk.split("\n")[0] ?? "").trim();
        expect(heading).toBe(section.heading);
        const rest = chunk.slice(heading.length).trim();
        const sourceParas = rest.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
        expect(section.paragraphs.length, `${section.heading} paragraph count`).toBe(sourceParas.length);
        section.paragraphs.forEach((p, j) => {
          expect(decode(p), `${section.heading} paragraph ${j + 1}`).toBe(norm(stripMd(sourceParas[j])));
        });
      });

      // Sources verbatim, in order.
      const sourcesChunk = chunks[chunks.length - 1];
      const sourceBody = sourcesChunk.slice("Sources".length).trim();
      const expectedSources = sourceBody
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.startsWith("- "))
        .map((l) => stripMd(l.slice(2).trim()));
      expect(parsed.sources.map((s) => norm(stripMd(s)))).toEqual(expectedSources.map(norm));
      for (const source of parsed.sources) {
        expect(decode(renderSourceLine(source)), "source line").toBe(norm(stripMd(source)));
      }
    });

    it(`${slug} carries no em dashes`, () => {
      const raw = readFileSync(file, "utf8");
      expect(raw.includes("\u2014")).toBe(false);
      const parsed = parseCaseBody(raw);
      for (const section of parsed.sections) {
        for (const p of section.paragraphs) {
          expect(p.includes("\u2014")).toBe(false);
        }
      }
    });
  }
});

describe("formatter presentation rules", () => {
  // Presentation rules are tested against fixtures, not the publish files: the
  // prose is allowed to change, the rules are not.
  const FIXTURE = `# Fixture case

## The problem

Intro paragraph with a prose aside (like this one) that stays plain.

## What was actually blocking use

Section intro paragraph that is not itself a finding (content-drafts/fixture.md).

Acquisition worked. Signups were cheap (content-drafts/fixture.md).

A lead that runs long enough to stop being scannable, because this sentence keeps going well past the ninety character limit. It also ends with a receipt (issue #3).

## What I designed

**A progress device that ends the interview early.** Strength meter fills, a code span \`9\u219249\`, and a status marker (shipped).

## What I'd change

Nothing to change here (site/src/lib/content.ts:173).

## Growth read

The loop is the product.

## Sources

- Fixture source (content-drafts/fixture.md)
`;
  const fixture = parseCaseBody(FIXTURE);
  const section = (heading: string) => fixture.sections.find((s) => s.heading === heading)!;

  it("receipt parentheticals become receipts; prose parentheticals stay plain", () => {
    const blocking = section("What was actually blocking use");
    expect(blocking.paragraphs[0]).toContain('<span class="receipt">(content-drafts/fixture.md)</span>');
    const problem = section("The problem");
    expect(problem.paragraphs[0]).toContain("(like this one)");
    expect(problem.paragraphs[0].includes('class="receipt"')).toBe(false);
    const change = section("What I'd change");
    expect(change.paragraphs[0]).toContain('<span class="receipt">(site/src/lib/content.ts:173)</span>');
  });

  it("lead findings are strong; the section intro paragraph is not", () => {
    const blocking = section("What was actually blocking use");
    expect(blocking.paragraphs[0].startsWith("<strong>")).toBe(false);
    expect(blocking.paragraphs[1].startsWith("<strong>Acquisition worked.</strong>")).toBe(true);
  });

  it("a lead too long to scan is left plain", () => {
    const blocking = section("What was actually blocking use");
    expect(blocking.paragraphs[2].startsWith("<strong>")).toBe(false);
    expect(blocking.paragraphs[2]).toContain('<span class="receipt">(issue #3)</span>');
  });

  it("no lead treatment outside the blocking section", () => {
    expect(section("The problem").paragraphs.every((p) => !p.startsWith("<strong>"))).toBe(true);
    expect(section("Growth read").paragraphs.every((p) => !p.startsWith("<strong>"))).toBe(true);
  });

  it("code spans render as code; 'shipped' stays plain", () => {
    const designed = section("What I designed");
    expect(designed.paragraphs[0]).toContain("<code>9\u219249</code>");
    expect(designed.paragraphs[0]).toContain("<strong>A progress device that ends the interview early.</strong>");
    expect(designed.paragraphs[0]).toContain("(shipped)");
    expect(designed.paragraphs[0].includes('class="receipt"')).toBe(false);
  });
});