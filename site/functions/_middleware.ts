/**
 * Pages Functions middleware — runs on every request.
 * Canonicalizes the host: redirects www.mikejones.online → mikejones.online
 * (301, preserving path + query). Apex requests pass straight through.
 */
export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  if (url.hostname === "www.mikejones.online") {
    url.hostname = "mikejones.online";
    return Response.redirect(url.toString(), 301);
  }
  return context.next();
};
