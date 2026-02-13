# Fediverse/ActivityPub Setup Guide for MikeJones.online

**Your Fediverse Handle:** @mike@mikejones.online

---

## Current Status (From Project Records)

According to Phase 2.4 (completed 2026-01-30):
- ✅ ActivityPub enabled on Ghost Pro
- ✅ Username configured: @mike@mikejones.online
- ✅ Profile bio and images uploaded
- ✅ Federation settings configured

**However**, Task #4 was created to **optimize** the profile for launch, suggesting it may need enhancement.

---

## What You Need to Check (5 minutes)

### Step 1: Verify Current Fediverse Settings

1. Go to Ghost Admin: https://mikejones-online.ghost.io/ghost/
2. Navigate to: **Settings → Membership → Fediverse**
3. Check what's currently configured:
   - [ ] Is ActivityPub enabled? (Toggle should be ON)
   - [ ] Profile bio - is it complete and compelling?
   - [ ] Avatar - is there a professional headshot?
   - [ ] Header image - is there a banner image?
   - [ ] Username confirmation: @mike@mikejones.online

---

## What You Need to Provide (If Missing)

### Required Assets:

**1. Profile Avatar (Required)**
- **Format:** JPG or PNG
- **Size:** 400x400px minimum (square)
- **Content:** Professional headshot
- **Where it's used:** Your profile icon across the Fediverse

**2. Header Image (Optional but Recommended)**
- **Format:** JPG or PNG
- **Size:** 1500x500px recommended
- **Content:** Professional banner (could be branded, minimalist, or tech-themed)
- **Where it's used:** Profile banner on Mastodon and other Fediverse platforms

**3. Bio Text (Required)**
- **Length:** 500 characters max (Mastodon standard)
- **Content:** Who you are, what you do, key expertise
- **Example draft:**
  ```
  AI Implementation Expert & LLM Integration Specialist with 29 years in tech.
  Former Microsoft Xbox, Kabam, Livescribe. Building practical AI solutions,
  self-hosted LLM infrastructure, and intelligent automation.

  📍 Portland, OR
  💼 Velocity Partners (fractional PMO + AI implementation)
  ✍️ Resilient Tomorrow (community resilience)

  #AI #MachineLearning #LLM #SelfHosted #ProductManagement
  ```

---

## Option A: You Set It Up (Manual - 10 minutes)

**If you want to do it yourself:**

1. **Access Ghost Admin Fediverse Settings:**
   - Go to: https://mikejones-online.ghost.io/ghost/
   - Settings → Membership → Fediverse

2. **Enable ActivityPub** (if not already on):
   - Toggle "Enable ActivityPub" to ON
   - This activates @mike@mikejones.online

3. **Upload Avatar:**
   - Click "Change image" under Profile Picture
   - Upload 400x400px+ headshot
   - Save

4. **Upload Header Image:**
   - Click "Change image" under Cover Image
   - Upload 1500x500px banner
   - Save

5. **Write/Update Bio:**
   - Fill in "Bio" field (500 chars max)
   - Include key expertise, links, hashtags
   - Save

6. **Set Discoverable:**
   - Ensure "List in directories" or "Discoverable" is checked
   - This makes your profile searchable on Mastodon
   - Save changes

7. **Test Your Profile:**
   - Open Mastodon (any instance, e.g., mastodon.social)
   - Search for: @mike@mikejones.online
   - Your profile should appear
   - Click Follow to test (can unfollow after)

---

## Option B: Agent Does It (Automated - Provide Assets)

**If you want an agent to handle it:**

**What you provide:**
1. Avatar image file path (e.g., `/assets/headshot.jpg`)
2. Header image file path (e.g., `/assets/header-banner.png`)
3. Approval of bio text (or draft your own)

**What the agent will do:**
1. Upload avatar via Ghost API
2. Upload header image via Ghost API
3. Update bio with RAG-verified information about you
4. Configure discoverability settings
5. Test WebFinger (@mike@mikejones.online)
6. Verify profile appears in Mastodon search
7. Draft introduction post for launch day
8. Create hashtag strategy document

**To start:**
```bash
# Put your images in the assets folder:
/Users/michaeljones/Dev/MJ_Online/assets/avatar.jpg
/Users/michaeljones/Dev/MJ_Online/assets/header.png

# Then let me know and I'll have Doc Brown or Alice handle it
```

---

## What Happens After Setup

### Your Fediverse Identity

Once set up, your Fediverse presence works like this:

**Profile URL:** https://mikejones.online/@mike (or similar, depends on Ghost implementation)
**Fediverse Handle:** @mike@mikejones.online
**How people find you:** Search on Mastodon, follow you, see your posts

### Content Publishing

**Automatic:** When you publish posts/pages on Ghost, they automatically appear in the Fediverse feed for your followers.

**Manual:** You can also post directly via Ghost (if Ghost supports direct ActivityPub posting in newer versions).

### Who Can Follow You

Anyone on the Fediverse can follow @mike@mikejones.online:
- Mastodon users
- Pixelfed users
- PeerTube users
- Any ActivityPub-compatible platform

### Your Posts Appear

When people follow you, your Ghost content appears in their Fediverse timeline:
- New blog posts
- Case studies
- Project updates
- Any public content you publish

---

## Hashtag Strategy (For Launch)

**Content Type → Hashtags:**

**AI/ML Projects:**
- #AI #MachineLearning #LLM #PromptEngineering #ContextEngineering

**Self-Hosted Tech:**
- #SelfHosted #OpenSource #LocalLLM #PrivacyFirst

**Web Development:**
- #WebDev #Python #IndieWeb #GhostCMS

**Professional/PM:**
- #ProductManagement #TechLeadership #AgileTransformation #AAPD

**Community/Resilience:**
- #CommunityResilience #MutualAid #Resilience #SystemsThinking

**General:**
- #TechLife #Building #IndieDev #SideProject

---

## Introduction Post Draft (For Launch Day)

```
👋 Hi Fediverse! I'm Mike Jones.

I'm an AI Implementation Expert and LLM Integration Specialist with 29 years
in tech. I've shipped products at Microsoft (Xbox), Kabam, Livescribe, and
founded several startups.

🔧 What I build:
• Self-hosted LLM infrastructure (Local AI Memory System)
• AI-augmented process design for product teams
• Tools for community resilience (NeighborhoodShare)

✍️ What I write about:
• Resilient Tomorrow - Community resilience & mutual aid
• Organizational Intelligence - AI implementation & product management

🌐 Portfolio & projects: https://mikejones.online

Looking forward to connecting with builders, AI enthusiasts, and community
organizers!

#AI #MachineLearning #LLM #SelfHosted #ProductManagement #Introduction
```

**How to post this:**
- Draft it in Ghost as a regular post
- Schedule for launch day
- It will automatically federate to your followers

---

## Testing Your Fediverse Setup

### Test 1: WebFinger Discovery
1. Open https://mastodon.social (or any Mastodon instance)
2. Search for: @mike@mikejones.online
3. Your profile should appear in search results
4. You should see your avatar, bio, header

### Test 2: Follow Yourself
1. From another Mastodon account (or create test account)
2. Search and follow @mike@mikejones.online
3. Publish a test post on Ghost
4. Check if it appears in the test account's timeline

### Test 3: Profile Completeness
1. Visit your profile on Mastodon
2. Check:
   - Avatar displays correctly
   - Header image displays correctly
   - Bio is formatted well
   - Website link works
   - Posts are visible (if you've published any)

---

## Current Assets Check

Let me check what assets you already have:

**Avatar candidates:**
- Check: `/assets/` folder for existing headshots
- Check: `/assets/brand/` for logos (if using logo as avatar)

**Header candidates:**
- Check: `/assets/brand/` for banners
- Could create: Branded header with your name + tagline

---

## What Do You Want To Do?

**Option A: "I'll do it myself"**
→ Follow the manual steps above (10 minutes)
→ Let me know when done so I can test it

**Option B: "Agent should do it"**
→ Provide avatar and header image file paths
→ Approve bio text
→ Agent completes Task #4 (2-3 hours automated)

**Option C: "Let me check what's already there first"**
→ Go to Ghost Admin → Settings → Membership → Fediverse
→ See what's configured
→ Report back what's missing

---

## Quick Answer

**What you need:**
1. Professional headshot (400x400px+)
2. Header banner (1500x500px) - optional
3. Bio text (500 chars max)
4. 10 minutes to set it up in Ghost Admin

**Where to set it up:**
Ghost Admin → Settings → Membership → Fediverse

**Your handle will be:**
@mike@mikejones.online

**Want me to check what's already configured?**
I can't access Ghost Admin directly, but you can tell me what you see there and I'll guide you through any missing pieces!

---

**Next Step:** Let me know which option you prefer, or tell me what you see in Ghost Admin → Settings → Membership → Fediverse right now!
