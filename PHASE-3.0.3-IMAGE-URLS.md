# Phase 3.0.3 - About Page Image URLs

**Status:** ✅ Images uploaded to Ghost by Alice (2026-02-09 20:17)

## Ghost-Hosted Image URLs

### Professional Headshot
- **URL:** `https://www.mikejones.online/content/images/2026/02/headshot-professional.png`
- **Status:** ✅ Uploaded and verified (HTTP 200)
- **Size:** 1.2MB PNG
- **Source:** `/Users/michaeljones/Dev/MJ_Online/assets/photos/headshot-professional.png`
- **Usage:** Hero section or professional bio section

---

## For Doc Brown (Mobiledoc Assembler)

Use the above URL when creating image cards in the Mobiledoc JSON for the About page.

Example Mobiledoc image card:
```json
["image", {
  "src": "https://www.mikejones.online/content/images/2026/02/headshot-professional.png",
  "alt": "Mike Jones - AI Implementation Expert",
  "width": 1200,
  "height": 1200
}]
```

---

## Workflow Status

- ✅ **Debbie:** PAGE_SPEC complete
- ✅ **Alice:** Images uploaded to Ghost
- ⏳ **Doc Brown:** Convert PAGE_SPEC → Mobiledoc JSON (CURRENT STEP)
- ⏳ **Alice:** Publish Mobiledoc via Admin API

**Next:** Doc Brown should read Debbie's PAGE_SPEC and use this image URL to create the Mobiledoc JSON.
