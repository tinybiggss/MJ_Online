/** POST /api/slide/donate — record a self-reported chip-in. */
import { addDonation, type KVLike } from "../../lib/slideStore";

interface Env {
  SLIDE_KV?: KVLike;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let data: Record<string, unknown> = {};
  try {
    data = await request.json();
  } catch {
    return json(400, { ok: false, error: "Could not read your submission." });
  }

  // Honeypot: silently succeed, store nothing.
  if (typeof data._honey === "string" && data._honey.trim() !== "") {
    return json(200, { ok: true });
  }

  if (!env.SLIDE_KV) {
    return json(503, { ok: false, error: "Tracking isn't set up yet — your Venmo payment still counts!" });
  }

  try {
    const view = await addDonation(
      env.SLIDE_KV,
      {
        amount: (data.amount as string | number) ?? "",
        name: typeof data.name === "string" ? data.name : "",
        note: typeof data.note === "string" ? data.note : "",
      },
      Date.now(),
      () => `d_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`,
    );
    return json(200, { ok: true, view });
  } catch (err) {
    return json(422, { ok: false, error: err instanceof Error ? err.message : "Invalid donation." });
  }
};

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
