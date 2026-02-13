# Navigation Quick Reference Card

**Quick guide for configuring Ghost Pro navigation (Phase 2.3)**

---

## Access Navigation Settings

1. Go to Ghost Admin: `https://mikejones-online.ghost.io/ghost/`
2. Click **Settings** → **Design** → Scroll to **Navigation**

---

## PRIMARY NAVIGATION (Top Menu)

Add these 5 items **in this exact order:**

| # | Label      | URL              | Notes                           |
|---|------------|------------------|---------------------------------|
| 1 | Home       | `/`              | Homepage                        |
| 2 | Projects   | `/tag/projects/` | ⭐ CRITICAL: Employer visibility |
| 3 | About      | `/about/`        | Professional bio                |
| 4 | Resume     | `/resume/`       | Career details                  |
| 5 | Contact    | `/contact/`      | Contact form/info               |

---

## SECONDARY NAVIGATION (Footer)

Add these 2 items:

| # | Label        | URL            | Notes                    |
|---|--------------|----------------|--------------------------|
| 1 | RSS Feed     | `/rss/`        | Automatic feed           |
| 2 | ActivityPub  | `/activitypub/`| Fediverse (verify URL)   |

---

## Testing Checklist

### Desktop
- [ ] All 5 primary items visible
- [ ] Projects in 2nd position
- [ ] All links clickable
- [ ] Footer nav at bottom

### Mobile
- [ ] Hamburger menu appears
- [ ] Menu opens/closes
- [ ] All items visible
- [ ] Touch targets large enough

---

## Expected Results

**Working Now:**
- ✅ Home (homepage)
- ✅ Projects (tag feed, may be empty)
- ✅ RSS Feed (XML feed)

**404 Expected (until Phase 3):**
- ⚠️ About (page not created yet)
- ⚠️ Resume (page not created yet)
- ⚠️ Contact (page not created yet)

**Pending:**
- ⚠️ ActivityPub (configured in Task 2.4)

---

## Save & Verify

1. Click **Save** in Ghost Admin
2. Visit `https://MikeJones.online/`
3. Check navigation appears correctly
4. Test on mobile (narrow browser window)

---

## Done?

Mark complete in STATUS.md:
- ✅ Task 2.3: Navigation & Menu Configuration

**Time:** ~30 minutes

**Full Guide:** `/Users/michaeljones/Dev/MJ_Online/plans/navigation-configuration-guide.md`
