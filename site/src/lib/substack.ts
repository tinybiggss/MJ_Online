import { XMLParser } from "fast-xml-parser";

export interface Essay {
  title: string;
  link: string;
  date: Date | null;
  dateLabel: string;
  excerpt: string;
}

const FEED_URL = "https://resilienttomorrow.substack.com/feed";

/** Strip HTML tags + collapse whitespace, then truncate for a clean excerpt. */
function toExcerpt(html: string, max = 180): string {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

function formatDate(raw?: string): { date: Date | null; label: string } {
  if (!raw) return { date: null, label: "" };
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return { date: null, label: "" };
  return {
    date,
    label: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  };
}

/**
 * Fetch the latest Resilient Tomorrow essays from the Substack RSS feed.
 * Runs at build time. Returns [] on any error so the build never fails on a
 * flaky network — pages should render a graceful fallback when empty.
 */
export async function getLatestEssays(limit = 6): Promise<Essay[]> {
  try {
    const res = await fetch(FEED_URL, {
      headers: { "User-Agent": "MikeJones.online build (+https://mikejones.online)" },
    });
    if (!res.ok) throw new Error(`Feed responded ${res.status}`);
    const xml = await res.text();

    const parser = new XMLParser({ ignoreAttributes: false, trimValues: true });
    const parsed = parser.parse(xml);
    const rawItems = parsed?.rss?.channel?.item;
    const items = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : [];

    return items.slice(0, limit).map((item: Record<string, unknown>): Essay => {
      const { date, label } = formatDate(item.pubDate as string | undefined);
      const description =
        (item.description as string) || (item["content:encoded"] as string) || "";
      return {
        title: String(item.title ?? "Untitled"),
        link: String(item.link ?? "https://resilient-tomorrow.com"),
        date,
        dateLabel: label,
        excerpt: toExcerpt(description),
      };
    });
  } catch (error) {
    console.warn(
      `[substack] Could not fetch Resilient Tomorrow feed at build time: ${
        error instanceof Error ? error.message : error
      }`,
    );
    return [];
  }
}
