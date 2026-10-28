import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * Case studies: frozen prose copied from content-drafts/case-studies/publish/
 * by scripts/publish-case-studies.mjs. Prose is never edited here; frontmatter
 * carries the UI metadata the templates need. Validated at build time: a
 * missing field (or an em dash anywhere in a string) fails the build.
 */
const noEmDash = (s: string) => !s.includes("\u2014");
const str = z.string().refine(noEmDash, "em dashes are not allowed in site copy");

const caseStudies = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/case-studies" }),
  schema: z.object({
    title: str,
    slug: z.string().regex(/^[a-z0-9][a-z0-9-]*$/),
    kind: z.literal("case-study"),
    short: str,
    tag: str,
    status: str,
    rowTitle: str,
    diag: str,
    navMark: str,
    position: str.min(1),
    ledger: z.array(str).min(2).max(4),
    plate: z
      .object({ src: str, alt: str, caption: str })
      .optional(),
    appendix: str.optional(),
  }),
});

export const collections = {
  caseStudies,
};