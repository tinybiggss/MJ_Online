# ActivityPub Profile Update - Quick Reference

## ✅ Status: ActivityPub is ENABLED and working!

**Current Handle:** `@index@mikejones.online`
**Target Handle:** `@mike@mikejones.online`

---

## 🎯 Quick Update Checklist

### 1. Access Ghost Admin
Go to: **https://mikejones.online/ghost**

### 2. Update Author Profile
**Location:** Settings → Staff → [Your Profile] → Author Settings

| Field | Change From | Change To |
|-------|------------|-----------|
| **Slug/Username** | `index` | `mike` |
| **Full Name** | `MikeJones.online` | `Mike Jones` |
| **Bio** | `Thoughts, stories and ideas.` | `AI/ML engineer, builder of intelligent systems. Sharing projects and insights on artificial intelligence, self-hosted infrastructure, and practical AI implementation.` |
| **Profile Picture** | (current/none) | Upload professional headshot |

### 3. Save Changes
Click **Save** and wait 2-5 minutes for propagation.

### 4. Verify Update
Run in terminal:
```bash
cd /Users/michaeljones/Dev/MJ_Online
python3 verify_activitypub.py
```

Should now show:
- Subject: `acct:mike@mikejones.online`
- Name: `Mike Jones`
- PreferredUsername: `mike`
- Summary: AI/ML bio

---

## 🧪 Test on Mastodon
1. Search for: `@mike@mikejones.online`
2. Profile should appear with updated info
3. Click Follow

---

## ✅ Done!
Once updated, your Fediverse profile is ready for launch.

Next: Create introduction post and start publishing! 🚀
