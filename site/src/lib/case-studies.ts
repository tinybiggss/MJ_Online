import { getCollection } from "astro:content";

/**
 * The published case studies, in the portfolio's deliberate reading order:
 * NeighborhoodShare leads (it is the strongest piece, and gets the lead plate
 * on /work), then Distills, then ADD-Friendly Agent. Fails the build loudly
 * when a copied file has no order slot, so the index and the routes can never
 * drift apart.
 */
export const CASE_ORDER = [
  "neighborhoodshare",
  "distills",
  "add-friendly-agent",
] as const;

type CaseEntry = Awaited<ReturnType<typeof getCollection>>[number];

export async function publishedCases(): Promise<CaseEntry[]> {
  const all = await getCollection("caseStudies");
  const byId = new Map(all.map((entry) => [entry.id, entry]));
  const missing = CASE_ORDER.filter((slug) => !byId.has(slug));
  if (missing.length) {
    throw new Error(`case study never published into src/content/case-studies: ${missing.join(", ")}`);
  }
  const unordered = all.filter((entry) => !CASE_ORDER.includes(entry.id as (typeof CASE_ORDER)[number]));
  if (unordered.length) {
    throw new Error(`published case file has no slot in CASE_ORDER: ${unordered.map((u) => u.id).join(", ")}`);
  }
  return CASE_ORDER.map((slug) => byId.get(slug)!);
}