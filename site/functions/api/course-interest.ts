/**
 * Cloudflare Pages Function — POST /api/course-interest
 *
 * GHN AI Fluency Lab course-catalog vote. Each respondent picks up to 10
 * candidate sessions and rates each 1–5.
 *
 * Storage is deliberately two-tier so this works with zero new config:
 *   1. Always — emails the submission via Resend (same env vars as /api/contact),
 *      with a readable table plus a machine-readable JSON block for tallying.
 *   2. If a D1 binding named SURVEY_DB exists, also inserts a row. Bind it in
 *      Cloudflare Pages → Settings → Functions → D1 bindings, after running:
 *
 *      CREATE TABLE IF NOT EXISTS course_interest (
 *        id         INTEGER PRIMARY KEY AUTOINCREMENT,
 *        created_at TEXT NOT NULL,
 *        name       TEXT,
 *        email      TEXT,
 *        other      TEXT,
 *        picks      TEXT NOT NULL   -- JSON: [{id,title,rating}]
 *      );
 *
 * Env vars (already set for the existing forms):
 *   RESEND_API_KEY, CONTACT_TO, CONTACT_FROM
 */

interface Env {
  RESEND_API_KEY: string;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
  SURVEY_DB?: D1Database;
}

interface Pick {
  id: string;
  title: string;
  rating: number;
}

const MAX_PICKS = 10;
const ID_RE = /^[a-z0-9-]{1,60}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function clamp(value: string, max: number): string {
  return value.length > max ? value.slice(0, max) : value;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let data: Record<string, unknown> = {};
  try {
    data = await request.json();
  } catch {
    return json(400, { ok: false, error: "Could not read your submission." });
  }

  // Honeypot: pretend success, store nothing
  if (typeof data._honey === "string" && data._honey.trim()) {
    return json(200, { ok: true });
  }

  const rawPicks = Array.isArray(data.picks) ? data.picks : [];
  if (rawPicks.length > MAX_PICKS) {
    return json(422, { ok: false, error: `Please pick no more than ${MAX_PICKS}.` });
  }

  const picks: Pick[] = [];
  const seen = new Set<string>();
  for (const raw of rawPicks) {
    if (!raw || typeof raw !== "object") continue;
    const item = raw as Record<string, unknown>;
    const id = typeof item.id === "string" ? item.id.trim() : "";
    const rating = Number(item.rating);
    if (!ID_RE.test(id) || seen.has(id)) continue;
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) continue;
    seen.add(id);
    picks.push({
      id,
      title: clamp(typeof item.title === "string" ? item.title : id, 160),
      rating,
    });
  }

  const other = clamp(typeof data.other === "string" ? data.other.trim() : "", 800);
  const name = clamp(typeof data.name === "string" ? data.name.trim() : "", 120);
  const emailRaw = clamp(typeof data.email === "string" ? data.email.trim() : "", 160);
  const email = EMAIL_RE.test(emailRaw) ? emailRaw : "";

  if (!picks.length && !other) {
    return json(422, { ok: false, error: "Pick at least one course, or tell me what's missing." });
  }

  const createdAt = new Date().toISOString();
  const who = name || email || "Anonymous";

  // ---- Tier 2: D1, only if bound. Never block the response on it.
  if (env.SURVEY_DB) {
    try {
      await env.SURVEY_DB.prepare(
        "INSERT INTO course_interest (created_at, name, email, other, picks) VALUES (?, ?, ?, ?, ?)"
      )
        .bind(createdAt, name || null, email || null, other || null, JSON.stringify(picks))
        .run();
    } catch (err) {
      console.error("D1 insert failed (continuing to email):", err);
    }
  }

  // ---- Tier 1: email, always
  if (!env.RESEND_API_KEY) {
    return json(500, { ok: false, error: "The form isn't configured yet. Please email me directly." });
  }

  const ranked = [...picks].sort((a, b) => b.rating - a.rating);
  const rows = ranked
    .map(
      (p) =>
        `<tr><td style="padding:4px 12px 4px 0;">${escapeHtml(p.title)}</td>` +
        `<td style="padding:4px 0;"><strong>${p.rating}</strong>/5</td></tr>`
    )
    .join("");

  const html = `
    <h2>AI Fluency Lab — course interest vote</h2>
    <p><strong>From:</strong> ${escapeHtml(who)}${email ? ` &lt;${escapeHtml(email)}&gt;` : ""}</p>
    <p><strong>Picked ${picks.length}</strong> of ${MAX_PICKS} · ${escapeHtml(createdAt)}</p>
    ${rows ? `<table>${rows}</table>` : "<p><em>No courses picked.</em></p>"}
    ${other ? `<h3>What I missed</h3><p>${escapeHtml(other)}</p>` : ""}
    <hr>
    <p style="font-size:12px;color:#666;">Machine-readable — paste into the tally script:</p>
    <pre style="font-size:12px;background:#f5f5f5;padding:10px;white-space:pre-wrap;">${escapeHtml(
      JSON.stringify({ created_at: createdAt, name, email, other, picks })
    )}</pre>
  `;

  const to = env.CONTACT_TO || "mike@mikejones.online";
  const from = env.CONTACT_FROM || "Mike Jones <onboarding@resend.dev>";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        ...(email ? { reply_to: email } : {}),
        subject: `AI Fluency course vote — ${who} (${picks.length} picks)`,
        html,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("Resend error:", res.status, detail);
      return json(502, { ok: false, error: "Couldn't send right now. Please email me directly." });
    }
  } catch (err) {
    console.error("Resend request failed:", err);
    return json(502, { ok: false, error: "Couldn't send right now. Please email me directly." });
  }

  return json(200, { ok: true });
};

function json(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
