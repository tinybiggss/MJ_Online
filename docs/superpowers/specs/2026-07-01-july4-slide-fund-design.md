# July 4th Slide Fund — Design Spec

**Date:** 2026-07-01
**Author:** Claude + Mike
**Status:** Approved (design), pending implementation
**Route:** `mikejones.online/july4` (unlisted — not in site nav)

## Purpose

A standalone, festive donation page for a rented 4th-of-July inflatable dolphin
slide that cost **$708.49**. Friends and family scan a printed QR code, land on
the page, see how much has been chipped in vs. the goal, and donate via Venmo.
The page's job is **motivation and tracking**, not payment processing.

## The one hard constraint

**Venmo cannot be read programmatically.** There is no public API for a personal
Venmo account to see incoming payments. Therefore:

- **Money moves in Venmo**, untouched by this site (button/QR → `venmo.com/u/tinybiggs`).
- **Tracking is separate and self-reported.** After paying, a donor taps
  "I chipped in $X", which is what drives the running total.
- **Hybrid control:** Mike reconciles self-reported entries against real Venmo
  activity via a private admin page (confirm / delete / add manual entries).

## Architecture

Fits the existing site with no new services or framework changes:

- **1 Astro page** — `site/src/pages/july4.astro` (static shell + SEO + story copy).
- **1 React island** — the interactive "Dolphin Donation-o-Meter" widget
  (`@astrojs/react` is already a dependency; only this widget hydrates).
- **1 admin Astro page** — `site/src/pages/july4/admin.astro` (unlisted, gated).
- **Cloudflare Pages Functions** (same pattern as existing `functions/api/contact.ts`):
  - `GET  /api/slide` — returns totals + recent chip-ins.
  - `POST /api/slide/donate` — records a self-reported chip-in.
  - `POST /api/slide/admin` — admin actions (confirm / delete / add), token-gated.
- **Cloudflare KV** namespace, bound as `SLIDE_KV`, for persistence.

## Data model (KV)

Single key `donations` holding a JSON array. At friends-and-family scale,
concurrent writes are a non-issue (read-modify-write on one key is acceptable).

```jsonc
// KV key: "donations"
[
  {
    "id": "d_<timestamp>_<rand>",  // unique id
    "amount": 20.00,                // number, dollars
    "name": "Sarah",               // optional; omitted/empty => "Anonymous"
    "note": "for the kids!",       // optional short note
    "ts": 1751385600000,            // epoch ms (server-stamped)
    "confirmed": false              // Mike flips true when reconciled in Venmo
  }
]
```

Config constants (in the functions / page):

- `GOAL = 708.49`
- `MIN = 10`, `MAX = 300`
- `STOPS = [10,20,30,40,50,60,80,100,120,140,160,180,200,220,240,260,280,300]`
- `VENMO_HANDLE = "tinybiggs"` → link `https://venmo.com/u/tinybiggs`

## Endpoints

### `GET /api/slide`
Returns:
```json
{
  "goal": 708.49,
  "raisedSelfReported": 420.00,
  "raisedConfirmed": 380.00,
  "count": 14,
  "recent": [ { "amount": 20, "name": "Sarah", "note": "for the kids!", "ts": 1751385600000 } ]
}
```
- `recent` = last ~15 entries, newest first, **amounts + names/notes only** (no ids).
- Public page polls this every ~10s to animate the shared thermometer.

### `POST /api/slide/donate`
Body (JSON): `{ amount, name?, note?, _honey? }`
- **Validate:** `amount` is a finite number, `0 < amount <= 5000` (sane ceiling),
  rounded to cents. `name`/`note` trimmed, length-capped (name ≤ 40, note ≤ 140),
  HTML-escaped on output.
- **Honeypot:** if `_honey` is non-empty, return `200 {ok:true}` and store nothing.
- Append entry `{confirmed:false, source:"self"}`, server-stamp `ts` + `id`.
- Return updated totals (same shape as `GET`).

### `POST /api/slide/admin`
Auth: `key` (query or header `x-admin-key`) must equal env `SLIDE_ADMIN_KEY`.
Actions (JSON `{action, ...}`):
- `confirm` `{id}` → set `confirmed:true`
- `unconfirm` `{id}` → set `confirmed:false`
- `delete` `{id}` → remove entry
- `add` `{amount, name?, note?, confirmed?}` → manual entry (e.g. cash, or a Venmo
  payment with no self-report)
Returns updated full list (with ids) for the admin UI. On bad/missing key → `401`.

## The Dolphin Donation-o-Meter (React island)

**Amount selection**
- The **dolphin SVG is the slider thumb**, dragged along a horizontal "wave" track.
- Snaps to the 18 `STOPS`. Range $10–$300.
- **Custom amount box** beside the track, two-way synced:
  - Dragging the dolphin fills the box with the snapped value.
  - Typing a number moves the dolphin to the **nearest stop**; any positive amount
    is allowed, including `> $300` (dolphin parks at the far-right / "off the chart").
- Keyboard accessible: track is focusable, arrow keys step through stops; the box
  is a normal number input. (Pointer + touch + keyboard all work.)

**Dolphin animation**
- As it's dragged, the dolphin **porpoises** — leaps up and arcs back toward the
  water between stops, with a small splash on landing. Livelier with faster drags.
- Implemented with CSS transforms/keyframes (respects `prefers-reduced-motion`:
  falls back to a plain sliding thumb, no jumping/fireworks).

**Live thermometer preview**
- Thermometer shows the **real** total raised so far (from `GET /api/slide`).
- While sliding, a glowing translucent segment extends the fill by **your** selected
  amount — labeled e.g. "your $120 would bring it to here." This is a **preview
  only**; it commits to the real total only after the donor self-reports.
- When any donor self-reports (or polling picks up others' chip-ins), the real fill
  animates upward smoothly.

**Fireworks**
- A `<canvas>` layer bursts fireworks as the dolphin climbs; **higher amount = bigger,
  more frequent bursts**, with a full "finale" near $300.
- Disabled under `prefers-reduced-motion`.

**Donate + self-report flow**
1. Big **"Donate $X via Venmo"** button → opens `https://venmo.com/u/tinybiggs`
   (note pre-filled where supported; **amount is NOT reliably pre-fillable** on
   personal accounts, so the donor types it in Venmo). QR to `/july4` is also shown.
2. After paying, the donor taps **"I chipped in $X"** → optional name + note
   (default **Anonymous**) → `POST /api/slide/donate` → thermometer commits & a
   celebratory burst fires.

## Page content (`/july4`)

- Festive hero: "We rented a giant dolphin slide for the 4th 🐬🎆" + the story and
  the honest ask ("it ran me $708.49 — chip in if you can").
- The Dolphin Donation-o-Meter widget.
- **Recent chip-ins** list for social proof (name/Anonymous — amount — note).
- Unlisted; excluded from nav and sitemap.

## Admin page (`/july4/admin`)

- Unlisted. Reads `?key=SECRET` from the URL, sends it to `/api/slide/admin`.
- Lists all entries with **confirm / unconfirm / delete** buttons and an **add manual
  entry** form. Shows self-reported vs confirmed totals.
- No key / wrong key → the API returns 401 and the page shows a locked state.

## QR code

- Generated at build/dev time as a printable asset pointing to
  `https://mikejones.online/july4` (**not** straight to Venmo — every scan must go
  through the tracker).
- Deliverables: `site/public/july4-qr.png` (and/or SVG) + a simple printable sheet
  (`july4-qr-print.html`) with the QR, the URL, and a one-line caption.

## Error handling

- Function input validation returns friendly JSON errors (mirrors `contact.ts`).
- If `SLIDE_KV` is unbound or `GET` fails, the page still renders (thermometer shows
  "—" / goal only) and the Venmo button still works — donating never depends on KV.
- Self-report failures show an inline retry message; the Venmo payment itself is
  unaffected.
- Admin without a valid key → 401, locked UI.

## Setup Mike does once (exact steps written in the plan)

1. Create a KV namespace in Cloudflare and bind it to the Pages project as `SLIDE_KV`.
2. Set env var `SLIDE_ADMIN_KEY` (a secret string) in Pages → Settings → Variables.
3. Venmo handle is `tinybiggs` (already captured; hardcoded as a config constant).

## Testing

- Integration-first (per project convention): exercise the Functions with
  `wrangler pages dev` against a **real local KV** (no mocks) — donate, read totals,
  admin confirm/delete/add, honeypot, validation bounds.
- Manually verify the widget in-browser: drag snapping, box↔dolphin sync, custom
  amounts incl. >$300, preview fill, fireworks scaling, reduced-motion fallback,
  keyboard + touch.

## Out of scope (YAGNI)

- Real Venmo API / webhooks (not possible for personal accounts).
- Accounts, auth beyond the single admin key, receipts/emails.
- Multi-event support — this is a one-weekend page.
```