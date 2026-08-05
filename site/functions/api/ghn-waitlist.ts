/**
 * Cloudflare Pages Function — POST /api/ghn-waitlist
 *
 * GHN AI Fluency Lab page — "send me the recap" email capture. Validates
 * input, blocks honeypot spam, and emails the submission via Resend
 * (https://resend.com). Reuses the same env vars as /api/contact.
 *
 * Required environment variables (set in Cloudflare Pages → Settings → Variables):
 *   RESEND_API_KEY  — Resend API key
 *   CONTACT_TO      — destination inbox (e.g. mike@mikejones.online)
 *   CONTACT_FROM    — verified sender (e.g. "MikeJones.online <noreply@mikejones.online>")
 */

interface Env {
  RESEND_API_KEY: string;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let data: Record<string, string> = {};
  try {
    data = await request.json();
  } catch {
    return json(400, { ok: false, error: "Could not read your submission." });
  }

  const email = (data.email || "").trim();
  const honey = (data._honey || "").trim();

  // Honeypot: pretend success, send nothing
  if (honey) return json(200, { ok: true });

  if (!email || !EMAIL_RE.test(email)) {
    return json(422, { ok: false, error: "That email doesn't look right." });
  }

  if (!env.RESEND_API_KEY) {
    return json(500, { ok: false, error: "The form isn't configured yet. Please email me directly." });
  }

  const to = env.CONTACT_TO || "mike@mikejones.online";
  const from = env.CONTACT_FROM || "Mike Jones <onboarding@resend.dev>";

  const html = `
    <h2>GHN AI Fluency Lab — recap request</h2>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p>Wants today's session recap + the Requirements / Context / Intent cheat sheet.</p>
  `;

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
        reply_to: email,
        subject: `GHN AI Fluency Lab — recap request from ${email}`,
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
