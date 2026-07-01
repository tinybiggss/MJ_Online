/** GET/POST /api/slide/admin — token-gated reconciliation. */
import { adminList, adminAction, type KVLike, type AdminActionInput } from "../../lib/slideStore";

interface Env {
  SLIDE_KV?: KVLike;
  SLIDE_ADMIN_KEY?: string;
}

function authorized(request: Request, env: Env): boolean {
  if (!env.SLIDE_ADMIN_KEY) return false;
  const key = request.headers.get("x-admin-key") || "";
  return key === env.SLIDE_ADMIN_KEY;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!authorized(request, env)) return json(401, { ok: false, error: "Unauthorized" });
  if (!env.SLIDE_KV) return json(200, { ok: true, entries: [] });
  return json(200, { ok: true, entries: await adminList(env.SLIDE_KV) });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!authorized(request, env)) return json(401, { ok: false, error: "Unauthorized" });
  if (!env.SLIDE_KV) return json(503, { ok: false, error: "KV not bound." });
  let body: AdminActionInput;
  try {
    body = (await request.json()) as AdminActionInput;
  } catch {
    return json(400, { ok: false, error: "Bad request body." });
  }
  try {
    const entries = await adminAction(
      env.SLIDE_KV,
      body,
      Date.now(),
      () => `d_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`,
    );
    return json(200, { ok: true, entries });
  } catch (err) {
    return json(422, { ok: false, error: err instanceof Error ? err.message : "Action failed." });
  }
};

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
