/**
 * Formats the frozen case-study prose into template-ready HTML.
 *
 * The publish files are frozen: this module decides presentation only, and
 * every transform here preserves text content exactly (asserted verbatim
 * against the publish files by case-format.test.ts). The rules it applies,
 * all from the template spec:
 *
 *  - "(...)" parentheticals that name a receipt (a file path, file:line,
 *    migration, TASKS item, DEC id, or issue number) render as mono receipt
 *    pills. Text unchanged. Prose parentheticals ("(shipped)", the Kolberg
 *    and Nadeau edition note) stay plain, so only receipts read as data.
 *  - In "What was actually blocking use", every paragraph after the first
 *    (which is the section's intro) opens with its lead finding sentence set
 *    strong, when that sentence is short enough to carry it.
 *  - Inline code spans render as <code>; bold and italics pass through.
 *  - Source lines render with code spans but never with receipt pills: they
 *    are already receipts.
 */

export interface CaseSection {
  heading: string;
  /** Paragraph html, in source order; text content is the frozen prose. */
  paragraphs: string[];
  /** "What I designed" items render as ruled sub-rows. */
  designed: boolean;
  /** "What I'd change" carries the red evidence mark under its heading. */
  honest: boolean;
}

export interface CaseBody {
  title: string;
  sections: CaseSection[];
  /** Sources list items, verbatim. */
  sources: string[];
}

export const REQUIRED_SECTIONS = [
  "The problem",
  "What was actually blocking use",
  "What I designed",
  "What I'd change",
  "Growth read",
  "Sources",
] as const;

/** A paragraph lead this long stops being a scannable finding. */
const LEAD_MAX_CHARS = 90;

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** "(...)" content is a receipt when it names where the evidence lives. */
function isReceipt(inner: string): boolean {
  return (
    /\.(md|sql|ts|js|mjs|json|html|toml)\b/.test(inner) ||
    /\w\/\w/.test(inner) ||
    /:\d/.test(inner) ||
    /\b(issue|migration|TASKS|DEC-|PROJECT-MEMORY)\b/.test(inner)
  );
}

/** Protect code spans from later patterns, then restore them as <code>. */
function protectCode(html: string, transform: (held: string) => string): string {
  const codeSpans: string[] = [];
  const held = html.replace(/`([^`]+)`/g, (_m, inner: string) => {
    codeSpans.push(inner);
    return `\u0000${codeSpans.length - 1}\u0000`;
  });
  const transformed = transform(held);
  return transformed.replace(/\u0000(\d+)\u0000/g, (_m, i) => `<code>${codeSpans[Number(i)]}</code>`);
}

function renderInline(source: string, opts: { receipt: boolean; lead: boolean }): string {
  let html = escapeHtml(source);

  // Lead finding sentence: everything up to and including its first period.
  if (opts.lead) {
    const dot = html.search(/\.(?=\s|$)/);
    if (dot !== -1 && dot + 1 <= LEAD_MAX_CHARS) {
      html = `<strong>${html.slice(0, dot + 1)}</strong>${html.slice(dot + 1)}`;
    }
  }

  return protectCode(html, (held) =>
    held
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/(?<!\*)\*(?!\s)([^*]+?)(?<!\s)\*(?!\*)/g, "<em>$1</em>")
      .replace(
        opts.receipt ? /\(([^()\n]{1,200})\)/g : /$^/,
        (m: string, inner: string) =>
          opts.receipt && isReceipt(inner) ? `<span class="receipt">(${inner})</span>` : m,
      ),
  );
}

/** Sources lines: code spans only, no receipts (they are already receipts). */
function renderSourceLine(source: string): string {
  return protectCode(escapeHtml(source), (held) => held);
}

function stripFrontmatter(markdown: string): string {
  return markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n*/, "");
}

export function parseCaseBody(markdown: string): CaseBody {
  const text = stripFrontmatter(markdown).replace(/\r\n/g, "\n");
  const title = (text.match(/^# (.+)$/m)?.[1] ?? "").trim();
  if (!title) {
    throw new Error("case body has no H1 title");
  }

  const blocks: { heading: string; body: string[] }[] = [];
  let current: { heading: string; body: string[] } | null = null;
  for (const line of text.split("\n")) {
    if (/^## (?!#)/.test(line)) {
      if (current) blocks.push(current);
      current = { heading: line.slice(3).trim(), body: [] };
    } else if (current) {
      current.body.push(line);
    }
  }
  if (current) blocks.push(current);

  const sections: CaseSection[] = [];
  const sources: string[] = [];
  for (const block of blocks) {
    if (block.heading === "Sources") {
      for (const line of block.body) {
        const item = line.trim();
        if (item.startsWith("- ")) sources.push(item.slice(2).trim());
      }
      if (sources.length === 0) {
        throw new Error("case body has a Sources section with no list items");
      }
      continue;
    }
    const paragraphs = block.body
      .join("\n")
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p, index) =>
        renderInline(p, {
          receipt: true,
          lead: block.heading === "What was actually blocking use" && index > 0,
        }),
      );
    sections.push({
      heading: block.heading,
      paragraphs,
      designed: block.heading === "What I designed",
      honest: block.heading === "What I'd change",
    });
  }
  return { title, sections, sources };
}

export { renderSourceLine };