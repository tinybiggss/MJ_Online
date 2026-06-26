/**
 * Cloudflare Pages Function — POST /api/contact
 *
 * First-party contact handler. Validates input, blocks honeypot spam, and
 * emails the submission via Resend (https://resend.com).
 *
 * Required environment variables (set in Cloudflare Pages → Settings → Variables):
 *   RESEND_API_KEY  — Resend API key
 *   CONTACT_TO      — destination inbox (e.g. mike@mikejones.online)
 *   CONTACT_FROM    — verified sender (e.g. "MikeJones.online <noreply@mikejones.online>")
 *
 * Accepts JSON (from the enhanced form fetch) or urlencoded (no-JS fallback).
 * JSON requests get a JSON response; form posts get a 303 redirect to /thanks.
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
  const contentType = request.headers.get("content-type") || "";
  const wantsJson = contentType.includes("application/json");

  // --- Parse body (JSON or form-encoded) ---
  let data: Record<string, string> = {};
  try {
    if (wantsJson) {
      data = await request.json();
    } else {
      const form = await request.formData();
      for (const [key, value] of form.entries()) data[key] = String(value);
    }
  } catch {
    return respond(wantsJson, 400, { ok: false, error: "Could not read your submission." });
  }

  const name = (data.name || "").trim();
  const email = (data.email || "").trim();
  const company = (data.company || "").trim();
  const message = (data.message || "").trim();
  const honey = (data._honey || "").trim();

  // --- Honeypot: pretend success, send nothing ---
  if (honey) return respond(wantsJson, 200, { ok: true });

  // --- Validate ---
  const errors: Record<string, string> = {};
  if (!name) errors.name = "Please add your name.";
  if (!email) errors.email = "Please add your email.";
  else if (!EMAIL_RE.test(email)) errors.email = "That email doesn't look right.";
  if (!message) errors.message = "Please add a message.";
  if (Object.keys(errors).length > 0) {
    return respond(wantsJson, 422, { ok: false, error: "Please check the highlighted fields.", errors });
  }

  if (!env.RESEND_API_KEY) {
    return respond(wantsJson, 500, { ok: false, error: "The form isn't configured yet. Please email me directly." });
  }

  const to = env.CONTACT_TO || "mike@mikejones.online";
  // Default uses Resend's no-DNS test sender so the form works immediately.
  // Once mikejones.online is verified in Resend, set CONTACT_FROM to e.g.
  // "MikeJones.online <noreply@mikejones.online>".
  const from = env.CONTACT_FROM || "Mike Jones <onboarding@resend.dev>";

  const html = `
    <h2>New message from mikejones.online</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    ${company ? `<p><strong>Company:</strong> ${escapeHtml(company)}</p>` : ""}
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
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
        subject: `New inquiry from ${name}${company ? ` (${company})` : ""}`,
        html,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("Resend error:", res.status, detail);
      return respond(wantsJson, 502, { ok: false, error: "Couldn't send right now. Please email me directly." });
    }
  } catch (err) {
    console.error("Resend request failed:", err);
    return respond(wantsJson, 502, { ok: false, error: "Couldn't send right now. Please email me directly." });
  }

  if (wantsJson) return respond(true, 200, { ok: true });
  // No-JS fallback: redirect to the thank-you page
  return new Response(null, { status: 303, headers: { Location: "/thanks" } });
};

function respond(json: boolean, status: number, body: Record<string, unknown>): Response {
  if (!json) {
    const location = body.ok ? "/thanks" : "/contact?error=1";
    return new Response(null, { status: 303, headers: { Location: location } });
  }
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
