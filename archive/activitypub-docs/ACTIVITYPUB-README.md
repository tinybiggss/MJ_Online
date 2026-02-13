# ActivityPub Configuration - README

**Site:** mikejones.online
**Status:** ✅ ENABLED - Profile Updates Needed
**Last Updated:** 2026-01-28

---

## TL;DR

ActivityPub is **already working** on your Ghost Pro site! Just need to update your profile:

1. Go to https://mikejones.online/ghost
2. Settings → Staff → Your Profile
3. Change username from "index" to "mike"
4. Update name, bio, and avatar
5. Done! You'll be `@mike@mikejones.online`

**Quick Reference:** See `ACTIVITYPUB_QUICK_UPDATE.md`

---

## Current Status

### ✅ What's Working
- ActivityPub enabled and active
- WebFinger endpoint responding
- Profile accessible at `@index@mikejones.online`
- Ready for followers and federation
- All infrastructure configured correctly

### ⏳ What Needs Updating
- Username (index → mike)
- Display name (MikeJones.online → Mike Jones)
- Bio (generic → AI/ML focused)
- Avatar (add professional headshot)

---

## Documentation Map

### Start Here
- **ACTIVITYPUB_QUICK_UPDATE.md** - Quick checklist for profile updates (5 min read)

### Detailed Guides
- **activitypub-configuration-status.md** - Complete status and update instructions
- **activitypub-configuration-report.md** - Full technical report and verification results
- **activitypub-setup-instructions.md** - Manual setup guide

### Reference
- **plans/activitypub-configuration-guide.md** - Comprehensive guide with content strategy
- **plans/activitypub-research.md** - Research and decision documentation

### Tools
- **verify_activitypub.py** - Automated testing script

---

## Quick Commands

### Verify Configuration
```bash
cd /Users/michaeljones/Dev/MJ_Online
python3 verify_activitypub.py
```

### Test WebFinger Manually
```bash
curl https://mikejones.online/.well-known/webfinger?resource=acct:mike@mikejones.online
```

### Test ActivityPub Profile
```bash
curl -H "Accept: application/activity+json" https://www.mikejones.online/.ghost/activitypub/users/index
```

---

## Your Fediverse Handle

**Current:** `@index@mikejones.online`
**After Update:** `@mike@mikejones.online`

Anyone on Mastodon, Threads, Pixelfed, or other Fediverse platforms can search for and follow this handle.

---

## Next Steps

1. **Update Profile** (10 min)
   - Use ACTIVITYPUB_QUICK_UPDATE.md as guide
   - Change username, name, bio, avatar
   - Save changes

2. **Verify** (2 min)
   - Run: `python3 verify_activitypub.py`
   - Confirm new handle works

3. **Test Discovery** (5 min if you have Mastodon)
   - Search for `@mike@mikejones.online` on Mastodon
   - Follow your Ghost site
   - Publish test post

4. **Launch** (ongoing)
   - Create 2-3 initial posts
   - Publish introduction post
   - Share handle on other platforms
   - Start engaging with AI/ML community

---

## Support

**Issues?** Check troubleshooting in `activitypub-configuration-status.md`

**Questions?** See comprehensive guide in `plans/activitypub-configuration-guide.md`

**Ghost Support:** support@ghost.org

---

## File Organization

```
MJ_Online/
├── ACTIVITYPUB-README.md              ← You are here (overview)
├── ACTIVITYPUB_QUICK_UPDATE.md        ← Quick checklist
├── activitypub-configuration-report.md ← Full technical report
├── activitypub-configuration-status.md ← Detailed status
├── activitypub-setup-instructions.md   ← Setup guide
├── verify_activitypub.py              ← Testing script
└── plans/
    ├── activitypub-configuration-guide.md  ← Comprehensive guide
    └── activitypub-research.md             ← Research notes
```

---

**Status:** Ready for profile updates ✅
**Blocking Issues:** None
**Time to Complete:** ~15 minutes
**Ready for Launch:** After profile updates

---

*Last verified: 2026-01-28*
*Phase 2.4: ActivityPub Configuration*
