# ActivityPub Configuration - Manual Steps

**Date:** 2026-01-28
**Status:** Awaiting manual configuration
**Site:** https://mikejones.online

---

## Quick Setup Guide

Since the browser automation isn't available, please follow these steps to enable ActivityPub:

### Step 1: Access Ghost Admin
1. Open browser and navigate to: **https://mikejones.online/ghost**
2. Log in with your Ghost Pro credentials

### Step 2: Locate ActivityPub Settings
Look for ActivityPub settings in one of these locations:
- **Settings → Membership → Fediverse** (most likely)
- Settings → Growth → Network
- Settings → Labs → ActivityPub
- Settings → Beta Features → Fediverse

### Step 3: Enable ActivityPub
1. Toggle the ActivityPub/Fediverse switch to **ON**
2. Wait for confirmation message (30-60 seconds)
3. Should see: "Your site is now connected to the Fediverse" or similar

### Step 4: Configure Profile
Set up your Fediverse profile with these settings:

**Display Name:**
```
Mike Jones
```

**Username:**
```
mike
```
This creates your handle: **@mike@mikejones.online**

**Bio/Description:**
```
AI/ML engineer, builder of intelligent systems. Sharing projects and insights on artificial intelligence, self-hosted infrastructure, and practical AI implementation.
```

**Avatar:**
- Upload professional headshot if available
- Skip if not available for now

**Engagement Settings (if available):**
- ✅ Enable automatic federation
- ✅ Show likes
- ✅ Show boosts
- ✅ Show replies
- ✅ Allow replies

### Step 5: Save Configuration
1. Click **Save** or **Save settings**
2. Verify no error messages appear
3. Confirm status shows "Active" or "Connected"

---

## Testing & Verification

After enabling, run these tests:

### Test 1: WebFinger Discovery
Open Terminal and run:
```bash
curl https://mikejones.online/.well-known/webfinger?resource=acct:mike@mikejones.online
```

**Expected:** JSON response with ActivityPub links

### Test 2: Mastodon Search
If you have a Mastodon account:
1. Go to your Mastodon instance
2. Search for: **@mike@mikejones.online**
3. Your Ghost profile should appear
4. Click Follow

### Test 3: Publish Test Post
1. Create new post in Ghost
2. Title: "Testing ActivityPub Federation"
3. Brief content
4. Publish
5. Check if it appears in Mastodon followers' timelines

---

## Troubleshooting

**If "Not Properly Configured" error appears:**
1. Disable ActivityPub toggle
2. Clear browser cache (Cmd+Shift+Delete)
3. Close and reopen browser
4. Log back into Ghost admin
5. Re-enable ActivityPub toggle
6. Wait 1-2 minutes

**If profile not searchable from Mastodon:**
1. Wait 10-15 minutes after activation
2. Try searching from different Mastodon instances
3. Verify username in Ghost settings
4. Try search variations: @mike@mikejones.online or mike@mikejones.online

---

## After Configuration

Once ActivityPub is enabled:
1. Run verification script: `python verify_activitypub.py`
2. Update this file with configuration status
3. Proceed with content strategy (see activitypub-configuration-guide.md)

---

**Next Steps:**
- [ ] Complete manual configuration above
- [ ] Run verification tests
- [ ] Report back with status
