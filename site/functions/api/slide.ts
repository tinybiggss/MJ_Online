/** GET /api/slide — public totals + recent chip-ins for the thermometer. */
import { getPublicView, type KVLike } from "../lib/slideStore";

interface Env {
  SLIDE_KV?: KVLike;
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  if (!env.SLIDE_KV) {
    // KV not bound yet — return an empty-but-valid shape so the page still renders.
    return json(200, { goal: 708.49, raisedSelfReported: 0, raisedConfirmed: 0, count: 0, recent: [] });
  }
  const view = await getPublicView(env.SLIDE_KV);
  return json(200, view);
};

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
