# modern-web-guidance `legacy-scan` — mikejones.online (`~/Dev/MJ_Online`, Astro, site root `site/`)

- **Scan date:** 2026-11-14 (America/Los_Angeles)
- **Tool:** `modern-web-guidance@1.0.0` via `npx` (skill: `~/.hermes/skills/modern-web-guidance`,
  the fleet-shared GoogleChrome guidance skill). No dependency was added to this repo — `npx` only.
- **Command used (re-runnable):**
  ```
  cd site && npm run web-guidance:scan
  ```
  (the `npm` script wraps `npx -y modern-web-guidance@latest legacy-scan .. --json` —
  the scan path is the repository root, not the package dir; run the script from `site/`).
- **Scope of this scan:** whole repository: 18 findings over 5 rules at the first scan. `legacy-scan` only checks the ~20% of the guidance
  corpus that has deterministic legacy rules (33 guides / 35 rules); everything else needs a
  `search` → `retrieve` per capability.
- **Counts:** **18** at the first scan (2026-11-14) → **12** after the one safe fix. 6 of the 18 were on surfaces that ship; the other 12 are unshipped paths (design comps, the archived coordination prototype) or declined design calls.
- **Verdict:** one rule fixed (IME-safe Enter), four rule-groups declined with reasons; everything still reported is intentional.

Findings are ranked: live/shipped surfaces first, unbuilt paths last. A `fix now` item is a
platform swap that changes neither the design nor the copy. Anything that would move layout,
change what a user sees, or remove a deliberate design value is **declined with a reason** and
belongs here as a note, not in a commit.

## Triage — 18 findings, ranked

| # | Guide | Finding | Verdict | Why |
|---|-------|---------|---------|-----|
| 1 | `ime-safe-enter-submit` | `site/public/distill-chatbot-widget.js:490`, `distills/distill-chatbot-widget.js:467`, `mj-chatbot-frontend/ghost-inline-widget.html:489`, `ghost-inline-widget-v2.html:319`, `ghost-inline-widget-fixed.html:445`, `ghost-inline-footer-backup.html:591` — `keydown` Enter sends without checking `event.isComposing` | **fixed** | A real bug: the Enter that confirms an IME composition (Japanese/Chinese/Korean) sent a half-typed message. Guard is `if (e.isComposing \|\| e.keyCode === 229) return;` after `preventDefault()` — the `keyCode === 229` half is required because Safari delivers `compositionend` before the confirming keydown (WebKit 165004), so `isComposing` alone is already `false` there. No visual change; non-IME typing is untouched. Applied to all six copies so they cannot drift. |
| 2 | `animate-to-intrinsic-sizes` | `site/src/pages/GHN/AIFluency/week-2/index.astro:202` (420px), `week-3/index.astro:200` (560px), `week-4/index.astro:196` (560px) — `.t-details` transitions `max-height` as an intrinsic-height proxy | **declined — design decision** | The swap (`interpolate-size: allow-keywords` + transition `height`) removes the clamp: a card whose detail is taller than 420/560px would expand past it where it currently clips, and browsers without `interpolate-size` get a jump cut instead of a transition. That is a layout change to a shipped course page, and the clamp is a deliberate value. Mike's call, not a safe swap. |
| 3 | `form-fields-automatically-fit-contents` | `site/public/distill-chatbot-widget.js:486`, `distills/...:463`, `ghost-inline-widget.html:497`, `-v2.html:327`, `-fixed.html:453` — `input.style.height = Math.min(scrollHeight, 120)+'px'` | **declined** | The replacement is `field-sizing: content`, which is not Baseline widely available. Deleting the JS stops the input growing in Firefox/Safari; keeping both conflicts with the measured inline height. Needs an explicit browser-support policy first. |
| 4 | `custom-text-decorations` | `content-drafts/design/comps/comps.css:125` — `.site-nav a` underline via `border-bottom` | **declined — unshipped** | `content-drafts/` is a design-comp directory; the Astro input is `site/src`, so this is neither built nor served. Nothing a user sees. |
| 5 | `customize-scrollbar-color-and-thickness` | `agent_coordination/static/messages.html:237,245,250` — `::-webkit-scrollbar*` without `scrollbar-color`/`scrollbar-width` | **declined — unshipped** | `agent_coordination/` is the January-era NATS coordination experiment that `AGENTS.md` calls "not standing policy"; the page is not built or served. Styling a dead prototype buys nothing. |

**Changed:** 6 files, one rule each (the IME guard). **Before:** 18 findings. **After:** 12 — the
6 IME findings are gone and every remaining finding is a declined item above (12 = rows 2–5).

## Raw output (post-fix scan, verbatim `--json`)

```json
{
  "targetDir": "..",
  "totalFindings": 12,
  "guides": [
    {
      "guideId": "animate-to-intrinsic-sizes",
      "retrieveCommand": "npx modern-web-guidance retrieve animate-to-intrinsic-sizes",
      "count": 3,
      "rules": [
        {
          "ruleId": "animate-to-intrinsic-sizes",
          "summary": "CSS transition on max-height simulates intrinsic size animation; modernize with interpolate-size: allow-keywords or calc-size().",
          "verifierRubric": {
            "keepWhen": [
              "The CSS rule animates or transitions max-height (or transitions all alongside a max-height declaration) to simulate accordion, dropdown, drawer, or modal expansion/collapse.",
              "The element uses max-height as a proxy for natural content height because pure height cannot transition to auto without interpolate-size."
            ],
            "dropWhen": [
              "The container is a scrollable panel with overflow: scroll or overflow: auto where max-height defines a legitimate scrolling boundary.",
              "The stylesheet already specifies interpolate-size: allow-keywords or uses calc-size().",
              "The transition property is none or explicitly excludes height/max-height.",
              "The max-height property is none or an unconstrained reset."
            ]
          },
          "count": 3,
          "findings": [
            {
              "file": "site/src/pages/GHN/AIFluency/week-2/index.astro",
              "line": 202,
              "message": "CSS rule transitions max-height to animate dimensions; use interpolate-size: allow-keywords and animate height or block-size directly (keeping max-height fallback for cross-browser support).",
              "lineContent": ".t-details{"
            },
            {
              "file": "site/src/pages/GHN/AIFluency/week-3/index.astro",
              "line": 200,
              "message": "CSS rule transitions max-height to animate dimensions; use interpolate-size: allow-keywords and animate height or block-size directly (keeping max-height fallback for cross-browser support).",
              "lineContent": ".t-details{max-height:0;opacity:0;overflow:hidden;transition:max-height .35s ease, opacity .25s ease, margin-top .35s ease;}"
            },
            {
              "file": "site/src/pages/GHN/AIFluency/week-4/index.astro",
              "line": 196,
              "message": "CSS rule transitions max-height to animate dimensions; use interpolate-size: allow-keywords and animate height or block-size directly (keeping max-height fallback for cross-browser support).",
              "lineContent": ".t-details{max-height:0;opacity:0;overflow:hidden;transition:max-height .35s ease, opacity .25s ease, margin-top .35s ease;}"
            }
          ]
        }
      ]
    },
    {
      "guideId": "custom-text-decorations",
      "retrieveCommand": "npx modern-web-guidance retrieve custom-text-decorations",
      "count": 1,
      "rules": [
        {
          "ruleId": "custom-text-decorations",
          "summary": "Use native CSS text-decoration shorthand, text-decoration-thickness, and text-underline-offset instead of border-bottom and padding-bottom underline hacks.",
          "verifierRubric": {
            "keepWhen": [
              "CSS border-bottom and padding-bottom underline simulation on inline text or link selectors paired with text-decoration: none",
              "CSS linear-gradient underline background hacks on inline text or link elements paired with text-decoration: none"
            ],
            "dropWhen": [
              "Block-level container borders (cards, tables, panels, modals, headers, footers)",
              "Tab navigation component active state indicators (.tab, [role=\"tab\"])",
              "Rule declaring display: block, flex, or grid",
              "Rule already declaring text-underline-offset or text-decoration-thickness"
            ]
          },
          "count": 1,
          "findings": [
            {
              "file": "content-drafts/design/comps/comps.css",
              "line": 125,
              "message": "Simulating text underline with border-bottom; native text-decoration with text-underline-offset and text-decoration-thickness avoids box-model side-effects and follows text wrapping.",
              "lineContent": ".site-nav a {"
            }
          ]
        }
      ]
    },
    {
      "guideId": "customize-scrollbar-color-and-thickness",
      "retrieveCommand": "npx modern-web-guidance retrieve customize-scrollbar-color-and-thickness",
      "count": 3,
      "rules": [
        {
          "ruleId": "customize-scrollbar-color-and-thickness",
          "summary": "Vendor ::-webkit-scrollbar pseudo-elements customize or hide scrollbars; use standard scrollbar-color and scrollbar-width (including scrollbar-width: none) instead.",
          "verifierRubric": {
            "keepWhen": [
              "The CSS rule uses vendor pseudo-elements (::-webkit-scrollbar or ::-webkit-scrollbar-thumb) to customize scrollbar dimensions/thumb colors or to hide scrollbars (display: none, width: 0, height: 0).",
              "The custom or hidden scrollbar styling is implemented without declaring standard scrollbar-color or scrollbar-width (such as scrollbar-width: none) CSS properties."
            ],
            "dropWhen": [
              "The stylesheet already defines standard scrollbar-width or scrollbar-color properties.",
              "The rule only resets scrollbar properties using CSS cascade keywords (auto, inherit, initial, unset, revert) or sets transparent thumb backgrounds without hiding ::-webkit-scrollbar.",
              "The rule sets a CSS gradient (linear-gradient, radial-gradient, -webkit-gradient), image, or box-shadow (-webkit-box-shadow) on ::-webkit-scrollbar-thumb or ::-webkit-scrollbar-track, styles visible ::-webkit-scrollbar-button arrows, or styles ::-webkit-scrollbar thickness when the accompanying ::-webkit-scrollbar-thumb uses gradients, images, box-shadow, backdrop-filter, or transparent backgrounds.",
              "The rule targets ::-webkit-scrollbar for non-zero sizing without custom thumb styling, or only sets border-radius without color, thickness, or hiding.",
              "The rule is inside a CSS reset stylesheet, targets a third-party custom JS scrollbar widget container that hides native scrollbars to render synthetic DOM scrollbars, or is inside an @supports not (scrollbar-width: ...) / @supports not (scrollbar-color: ...) fallback block."
            ]
          },
          "count": 3,
          "findings": [
            {
              "file": "agent_coordination/static/messages.html",
              "line": 237,
              "message": "CSS rule uses vendor ::-webkit-scrollbar pseudo-elements to customize scrollbar appearance; add standard scrollbar-color and scrollbar-width (and wrap ::-webkit-scrollbar in @supports not (scrollbar-color: auto)).",
              "lineContent": ".message-feed::-webkit-scrollbar {"
            },
            {
              "file": "agent_coordination/static/messages.html",
              "line": 245,
              "message": "CSS rule uses vendor ::-webkit-scrollbar pseudo-elements to customize scrollbar appearance; add standard scrollbar-color and scrollbar-width (and wrap ::-webkit-scrollbar in @supports not (scrollbar-color: auto)).",
              "lineContent": ".message-feed::-webkit-scrollbar-thumb {"
            },
            {
              "file": "agent_coordination/static/messages.html",
              "line": 250,
              "message": "CSS rule uses vendor ::-webkit-scrollbar pseudo-elements to customize scrollbar appearance; add standard scrollbar-color and scrollbar-width (and wrap ::-webkit-scrollbar in @supports not (scrollbar-color: auto)).",
              "lineContent": ".message-feed::-webkit-scrollbar-thumb:hover {"
            }
          ]
        }
      ]
    },
    {
      "guideId": "form-fields-automatically-fit-contents",
      "retrieveCommand": "npx modern-web-guidance retrieve form-fields-automatically-fit-contents",
      "count": 5,
      "rules": [
        {
          "ruleId": "form-fields-automatically-fit-contents",
          "summary": "Imperative JavaScript auto-resizing of textareas and inputs using scrollHeight or autosize() should be replaced with CSS field-sizing: content.",
          "verifierRubric": {
            "keepWhen": [
              "A keyup, input, change, or keydown event listener dynamically recalculates a textarea or text input height/width using scrollHeight or scrollWidth to auto-expand the field as the user types.",
              "A helper function resets .style.height to \"auto\", \"0px\", or \"1px\" and sets it to scrollHeight to fit contents.",
              "The application invokes the autosize() library on a textarea or input collection."
            ],
            "dropWhen": [
              "The code is guarded by a feature query checking CSS.supports(\"field-sizing\", \"content\") or field-sizing support.",
              "The scrollHeight measurement calculates scrollbar thumb sizes, virtual scroll windowing, or scroll progress in a long document/dialog.",
              "The element being resized is a canvas, iframe, or modal container rather than a form input or textarea."
            ]
          },
          "count": 5,
          "findings": [
            {
              "file": "distills/distill-chatbot-widget.js",
              "line": 463,
              "message": "JavaScript dynamic scrollHeight calculation resizes form field; replace with declarative CSS field-sizing: content.",
              "lineContent": "input.style.height = Math.min(input.scrollHeight, 120) + 'px';"
            },
            {
              "file": "mj-chatbot-frontend/ghost-inline-widget-fixed.html",
              "line": 455,
              "message": "JavaScript dynamic scrollHeight calculation resizes form field; replace with declarative CSS field-sizing: content.",
              "lineContent": "input.style.height = Math.min(input.scrollHeight, 120) + 'px';"
            },
            {
              "file": "mj-chatbot-frontend/ghost-inline-widget-v2.html",
              "line": 329,
              "message": "JavaScript dynamic scrollHeight calculation resizes form field; replace with declarative CSS field-sizing: content.",
              "lineContent": "input.style.height = Math.min(input.scrollHeight, 120) + 'px';"
            },
            {
              "file": "mj-chatbot-frontend/ghost-inline-widget.html",
              "line": 499,
              "message": "JavaScript dynamic scrollHeight calculation resizes form field; replace with declarative CSS field-sizing: content.",
              "lineContent": "input.style.height = Math.min(input.scrollHeight, 120) + 'px';"
            },
            {
              "file": "site/public/distill-chatbot-widget.js",
              "line": 486,
              "message": "JavaScript dynamic scrollHeight calculation resizes form field; replace with declarative CSS field-sizing: content.",
              "lineContent": "input.style.height = Math.min(input.scrollHeight, 120) + 'px';"
            }
          ]
        }
      ]
    }
  ],
  "activeRuleCount": 35,
  "activeGuideCount": 33,
  "note": "Checked 33 guides (35 deterministic rules; ~20% of the guidance corpus). Finding 12 items here only reflects deterministic legacy patterns; use 'search <topic>' for the rest of the catalog.",
  "skippedDocsAndTestsCount": 9
}
```
