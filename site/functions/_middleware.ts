/**
 * Pages Functions middleware — runs on every request.
 * Canonicalizes the host: redirects www.mikejones.online → mikejones.online
 * (301, preserving path + query). Apex requests pass straight through.
 *
 * Also answers 410 Gone for agent-export files that were published and then
 * withdrawn. This runs ahead of the zone cache, so it takes effect on the
 * first request after a deploy — a deleted file would otherwise keep serving
 * from Cloudflare's edge cache for the rest of its s-maxage.
 */
const REMOVED_EXPORTS = new Set([
  "/agents/kb/kb-pipelines-generator-registry.md",
  "/agents/kb/kb-pipelines-generator-registry-part1.md",
  "/agents/kb/kb-pipelines-generator-registry-part2.md",
  "/agents/kb/kb-pipelines-generator-registry-part3.md",
]);

/** The automation registry left the public export on Mike's ruling, 2026-10-30 (kanban t_c1a52c37). */
const GONE_BODY =
  "410 Gone — this page was withdrawn from the public knowledge-base export.\n";

export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  if (url.hostname === "www.mikejones.online") {
    url.hostname = "mikejones.online";
    return Response.redirect(url.toString(), 301);
  }
  if (REMOVED_EXPORTS.has(url.pathname)) {
    return new Response(GONE_BODY, {
      status: 410,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=0, must-revalidate, s-maxage=60",
        "X-Robots-Tag": "noindex",
      },
    });
  }
  return context.next();
};
