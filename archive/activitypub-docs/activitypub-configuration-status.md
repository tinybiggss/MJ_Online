# ActivityPub Configuration Status

**Date:** 2026-01-28
**Time:** Configuration Check Completed
**Site:** https://mikejones.online

---

## Current Status: ✅ ENABLED (Needs Profile Update)

ActivityPub is **already enabled** on mikejones.online, but the profile configuration needs to be updated.

---

## Current Configuration

### WebFinger Discovery
- **Endpoint:** `https://mikejones.online/.well-known/webfinger`
- **Status:** ✅ Working
- **Current Handle:** `@index@mikejones.online`
- **Target Handle:** `@mike@mikejones.online`

### ActivityPub Profile
- **Profile URL:** `https://www.mikejones.online/.ghost/activitypub/users/index`
- **Status:** ✅ Active
- **Type:** Person
- **Current Name:** "MikeJones.online"
- **Current Username:** "index"
- **Current Bio:** "Thoughts, stories and ideas."

---

## ⚠️ Required Updates

The following profile settings need to be updated in Ghost admin:

### 1. Username/Handle
- **Current:** `index`
- **Target:** `mike`
- **Impact:** Changes handle from `@index@mikejones.online` to `@mike@mikejones.online`

### 2. Display Name
- **Current:** "MikeJones.online"
- **Target:** "Mike Jones"
- **Impact:** Shows your personal name instead of domain name

### 3. Bio/Summary
- **Current:** "Thoughts, stories and ideas."
- **Target:** "AI/ML engineer, builder of intelligent systems. Sharing projects and insights on artificial intelligence, self-hosted infrastructure, and practical AI implementation."
- **Impact:** Better describes expertise and content focus

### 4. Avatar
- **Current:** Unknown (likely default or none)
- **Target:** Professional headshot
- **Impact:** More professional appearance in Fediverse

---

## How to Update Profile

### Step 1: Access Ghost Admin
1. Navigate to: https://mikejones.online/ghost
2. Log in with your credentials

### Step 2: Update Author Profile
The username is typically set in your author profile:

**Path:** Settings → Staff → [Your Profile] → Author Settings

Update these fields:
- **Slug/Username:** Change from "index" to "mike"
- **Full Name:** Change to "Mike Jones"
- **Bio:** Update to AI/ML focused bio (see above)
- **Profile Picture:** Upload professional headshot

### Step 3: Update Site Description (Optional)
**Path:** Settings → General → Description

This may also feed into the ActivityPub bio:
- Update site description to match professional focus

### Step 4: Verify ActivityPub Settings
**Path:** Settings → Membership → Fediverse (or similar)

Confirm:
- ✅ ActivityPub is enabled/active
- ✅ Automatic federation is on
- ✅ Engagement display is enabled

### Step 5: Save and Wait
1. Save all changes
2. Wait 2-5 minutes for changes to propagate
3. Run verification script again: `python3 verify_activitypub.py`

---

## Verification Tests

### Test Results (Current State)

**WebFinger Endpoint:** ✅ PASS
```bash
curl https://mikejones.online/.well-known/webfinger?resource=acct:index@mikejones.online
```
- Returns valid JSON with ActivityPub links
- Subject: acct:index@mikejones.online
- Profile URL: https://www.mikejones.online/.ghost/activitypub/users/index

**ActivityPub Profile:** ✅ PASS
```bash
curl -H "Accept: application/activity+json" https://www.mikejones.online/.ghost/activitypub/users/index
```
- Returns valid ActivityPub Person object
- Type: Person
- Name: MikeJones.online
- PreferredUsername: index

**Mastodon Discovery:** ⏳ PENDING UPDATE
- Current handle: @index@mikejones.online (searchable but not ideal)
- Target handle: @mike@mikejones.online (after username update)

---

## Post-Update Verification

After updating the profile, run these tests:

### 1. Verify Updated WebFinger
```bash
python3 verify_activitypub.py
```

Expected changes:
- Subject: `acct:mike@mikejones.online`
- PreferredUsername: `mike`
- Name: `Mike Jones`
- Summary: Updated bio

### 2. Test Mastodon Search
If you have a Mastodon account:
1. Search for: `@mike@mikejones.online`
2. Profile should appear with updated name and bio
3. Follow the account

### 3. Publish Test Post
1. Create new post in Ghost admin
2. Title: "Testing ActivityPub Federation"
3. Content: Brief introduction
4. Publish
5. Check Mastodon timeline (if following)

---

## Technical Details

### Discovered Endpoints

**WebFinger:**
- `https://mikejones.online/.well-known/webfinger?resource=acct:{username}@mikejones.online`

**ActivityPub Profile:**
- `https://www.mikejones.online/.ghost/activitypub/users/{username}`

**Profile Page:**
- `https://www.mikejones.online/`

### Response Structure

The ActivityPub profile returns a standard Person object with:
- `@context`: ActivityPub context
- `type`: "Person"
- `id`: Profile URL
- `inbox`: For receiving ActivityPub messages
- `outbox`: For published content
- `followers`: Follower collection URL
- `following`: Following collection URL
- `preferredUsername`: Handle username
- `name`: Display name
- `summary`: Bio/description
- `icon`: Avatar image
- `image`: Header/banner image

---

## Next Steps

### Immediate Actions
1. ✅ ~~Enable ActivityPub~~ (Already done)
2. ⏳ Update username from "index" to "mike"
3. ⏳ Update display name to "Mike Jones"
4. ⏳ Update bio to AI/ML focused description
5. ⏳ Upload professional avatar
6. ⏳ Save changes and verify

### Post-Configuration
7. ⏳ Run verification script to confirm changes
8. ⏳ Test Mastodon discoverability
9. ⏳ Create introduction post
10. ⏳ Share handle on other platforms

### Content Strategy (Week 1)
- Draft 2-3 initial posts about AI/ML projects
- Create introduction/announcement post
- Identify and follow key accounts in AI/ML space
- Engage with early followers

---

## Important Notes

### Username Change Considerations
- Changing username from "index" to "mike" will break existing follows
- However, since the site is new, this is the ideal time to make the change
- Do this BEFORE promoting your Fediverse handle
- Once promoted, avoid changing username

### Ghost Pro Benefits
- Zero infrastructure management (no Nginx, Docker, etc.)
- Unlimited ActivityPub interactions
- Automatic updates and maintenance
- Managed federation

### Federation Behavior
- New posts automatically federate to followers
- Edits may not federate to all instances
- Deletions propagate but may not remove from all caches
- All federated content is public

---

## Support Resources

If you encounter issues:

**Ghost Support:**
- Email: support@ghost.org
- Forum: https://forum.ghost.org

**ActivityPub Questions:**
- Ghost Forum: https://forum.ghost.org/c/integrations-api/

**Documentation:**
- Configuration Guide: `/Users/michaeljones/Dev/MJ_Online/plans/activitypub-configuration-guide.md`
- Research: `/Users/michaejones/Dev/MJ_Online/plans/activitypub-research.md`

---

## Conclusion

**Good News:** ActivityPub is working and discoverable!

**Action Required:** Update profile settings (username, name, bio, avatar) to create professional Fediverse presence at `@mike@mikejones.online`.

**Estimated Time:** 10-15 minutes for profile updates

**Ready for Launch:** Once profile is updated, you can immediately start publishing and promoting your Fediverse handle.

---

**Status:** Ready for profile configuration ✅
**Blocking Issues:** None
**Next Action:** Manual profile update in Ghost admin
