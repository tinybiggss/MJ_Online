# Phase 3.0.3 - Publishing Handoff: Doc Brown → Alice

**Date:** 2026-02-09 21:06
**From:** Doc Brown (Mobiledoc Assembler)
**To:** Alice (Web Content Builder)
**Coordinator:** Morgan (Project Manager)

---

## Doc Brown's Deliverable ✅ COMPLETE

**File Location:**
```
/Users/michaeljones/Dev/MJ_Online/content-drafts/about-page-mobiledoc.json
```

**File Details:**
- Size: 7.6KB
- Format: Valid Mobiledoc JSON
- Version: 0.3.2 (verified)
- Status: Ready for publishing
- Created: 2026-02-09 21:06

**Quality Verification:**
- ✅ Mobiledoc version exactly "0.3.2"
- ✅ JSON syntactically valid
- ✅ Contains cards array with content
- ✅ Includes Ghost-hosted image URLs (not local paths)
- ✅ Ready to POST to Ghost Admin API

---

## Alice's Task: Publish to Ghost

### Task Details

**Objective:** Publish About page to Ghost Pro using Admin API

**Input:**
- Mobiledoc JSON file: `/content-drafts/about-page-mobiledoc.json`

**Method:**
```bash
POST /ghost/api/admin/pages/
```

**Authentication:**
- Use GHOST_ADMIN_API_KEY from `.env` file
- Generate JWT token for Ghost Admin API

**Page Configuration:**
- Title: "About"
- Slug: "about"
- Status: "published" (not draft)
- Featured: false
- Meta title: (optional)
- Meta description: (optional)

**Expected Output:**
- Live page at: `https://mikejones.online/about`
- Ghost Admin URL: `https://mikejones-online.ghost.io/ghost/#/editor/page/[page-id]`

---

## Publishing Steps

1. **Load Mobiledoc JSON:**
   ```python
   import json
   with open('/Users/michaeljones/Dev/MJ_Online/content-drafts/about-page-mobiledoc.json', 'r') as f:
       mobiledoc = json.load(f)
   ```

2. **Prepare Ghost API Request:**
   ```python
   page_data = {
       "pages": [{
           "title": "About",
           "slug": "about",
           "mobiledoc": json.dumps(mobiledoc),
           "status": "published"
       }]
   }
   ```

3. **Authenticate with Ghost:**
   - Load GHOST_ADMIN_API_KEY from .env
   - Generate JWT token
   - Include in Authorization header

4. **POST to Ghost Admin API:**
   - Endpoint: `{GHOST_API_URL}/ghost/api/admin/pages/`
   - Headers: `Authorization: Ghost {jwt_token}`
   - Body: JSON with page data

5. **Verify Publication:**
   - Check response status (200/201)
   - Extract page URL from response
   - Verify page accessible at https://mikejones.online/about

6. **Report Completion:**
   - Send coordination message with page URL
   - Update workflow status document
   - Notify Morgan (PM) of completion

---

## Success Criteria

- ✅ Page published successfully (HTTP 200/201)
- ✅ Page accessible at https://mikejones.online/about
- ✅ Content matches Debbie's design intent
- ✅ Images display correctly
- ✅ No errors or broken elements
- ✅ Mobile responsive (verify on different screen sizes)

---

## If Publishing Fails

**Common Issues:**
1. JWT token expired → Regenerate token
2. Slug conflict → Check if /about page already exists
3. Mobiledoc format error → Validate JSON structure
4. Image URLs not accessible → Verify Ghost-hosted URLs work

**Troubleshooting:**
- Check Ghost Admin API response for error messages
- Verify .env file has correct GHOST_ADMIN_API_KEY
- Test API connection: GET /ghost/api/admin/site/
- Check Ghost API version compatibility

**Report Errors:**
Send to coordination channel with:
- Error message
- HTTP status code
- Request details
- What you've tried

---

## Deliverable to Mike

**When complete, provide:**
1. Live page URL: https://mikejones.online/about
2. Ghost Admin edit URL
3. Confirmation that page matches design intent
4. Any issues or adjustments made

**Morgan will:**
- Update Task #3 status to complete
- Update roadmap.md (Phase 3.0.3 complete)
- Document workflow learnings
- Prepare for Phase 3.1+ rollout

---

## Workflow Status

**Current:** Step 4 of 4 (Publishing)

```
Debbie ✅ → Alice ✅ → Doc Brown ✅ → Alice ⏳
```

**You are the final step!** Once you publish, Phase 3.0.3 pilot test is complete.

---

**Questions?** Send to coordination channel or reply to Morgan's message.

**File Path Again:**
```
/Users/michaeljones/Dev/MJ_Online/content-drafts/about-page-mobiledoc.json
```

**You can proceed immediately. Good luck! 🚀**
