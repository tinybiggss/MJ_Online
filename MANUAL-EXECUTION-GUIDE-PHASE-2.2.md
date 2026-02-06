# Manual Execution Guide: Phase 2.2 Kyoto Theme Customization

**Date:** 2026-01-28
**Status:** Ready for manual execution
**Reason:** Browser automation unavailable (extension not connected)

---

## Quick Start

**Admin URL:** https://mikejones-online.ghost.io/ghost/
**Public Site:** https://mikejones.online
**Estimated Time:** 15-20 minutes

---

## Step-by-Step Execution

### Step 1: Access Ghost Admin
1. Open browser and navigate to: https://mikejones-online.ghost.io/ghost/
2. Log in with your credentials
3. You should land on the Dashboard

### Step 2: Navigate to Design Settings
1. Click **Settings** in left sidebar
2. Click **Design** in the settings menu
3. You should now see the Design customization panel

---

## Core Customization Tasks

### Task 1: Dark Mode Configuration (Onyx Preset)

**Location:** Settings → Design → Kyoto Theme Settings (or Color Scheme section)

**Actions:**
1. Look for "Dark Mode", "Color Scheme", or "Theme Preset" section
2. You should see 8 preset options:
   - Default
   - Pure
   - **Onyx** ← SELECT THIS
   - Rust
   - Fossil
   - Mint
   - Ice
   - Ember
3. Click on **"Onyx"** preset
4. Preview should update to show dark charcoal background
5. **DO NOT SAVE YET** - we'll save all changes together at the end

**Why Onyx?**
- Professional tech aesthetic
- Excellent readability for code/technical content
- Modern AI/ML portfolio appearance
- Reduces eye strain

---

### Task 2: Accent Color Configuration

**Location:** Settings → Design → Branding section

**Actions:**
1. Scroll to find "Accent color" setting
2. Click on the color picker or text input
3. Enter exactly: `#4F46E5`
4. Verify the color appears as indigo/purple-blue
5. Preview how it looks on buttons and links
6. **DO NOT SAVE YET**

**This color appears on:**
- Call-to-action buttons
- Link hover states
- Navigation active states
- Subscribe buttons

---

### Task 3: Typography (Keep Defaults)

**Location:** Settings → Design → Typography (if available)

**Actions:**
1. If you see a Typography section, review the current settings
2. **RECOMMENDATION:** Keep all typography defaults
3. Kyoto is already optimized for dev portfolios
4. If you want to customize:
   - Headings: Inter or Poppins
   - Body: Inter or Source Sans Pro
   - Code: JetBrains Mono or Fira Code

**Decision:** Keep Kyoto defaults unless you have specific branding requirements

---

### Task 4: Homepage Layout Configuration

**Location:** Settings → Design → Homepage (or Site Design section)

**Actions:**

**4a. Hero Section:**
1. Find "Hero section" or "Homepage header" settings
2. Enable hero section if disabled
3. Configure:
   - **Title/Headline:** "AI/ML Engineer & Researcher"
   - **Subtitle/Description:** "Building intelligent systems that solve real problems"
   - **CTA Button Text:** "View Projects"
   - **CTA Button Link:** `/tag/projects/` or `/projects/`

**4b. Featured Projects Section:**
1. Enable "Featured posts" or "Featured content" section
2. Configure:
   - **Layout:** Grid or cards layout (choose visually appealing option)
   - **Number of items:** 3 or 4
   - **Filter:** Use #featured or #projects tag
   - **Display style:** Image + title + short description

**4c. Recent Writing Section:**
1. Enable "Latest posts" or "Recent articles" section
2. Configure:
   - **Layout:** List or minimal cards
   - **Number of posts:** 3
   - **Filter:** All posts or #writing tag
   - **Display style:** Title + excerpt + date

**DO NOT SAVE YET**

---

### Task 5: Navigation Menu Configuration

**Location:** Settings → Design → Navigation (usually at top of Design settings)

**5a. Primary Navigation:**
1. Find "Primary navigation" section
2. Configure these menu items (in order):
   - **Home** → `/`
   - **Projects** → `/tag/projects/`
   - **Writing** → `/tag/writing/`
   - **About** → `/about/`
   - **Resume** → `/resume/`

**5b. Secondary Navigation (Footer):**
1. Find "Secondary navigation" section
2. Configure:
   - **Contact** → `/contact/`
   - **RSS** → `/rss/`

**Notes:**
- You can drag to reorder items
- Click "Add item" to create new menu entries
- Delete any default items you don't need

**DO NOT SAVE YET**

---

### Task 6: Logo/Branding Configuration

**Location:** Settings → Design → Branding

**Actions:**
1. Find "Site title" field
2. Enter: **"Michael Jones"** (or keep existing if already set)
3. Find "Logo" or "Logo image" section
4. **Leave logo image empty** (text-based logo for now)
5. The theme will use your site title as a text logo
6. Verify "Site description" is set to:
   - "AI researcher, software engineer, and builder of intelligent systems"

**DO NOT SAVE YET**

---

### Task 7: Social Links Configuration

**Location:** Settings → Design → Social accounts

**Actions:**
1. Find "Social accounts" section
2. Add/verify these links:
   - **GitHub:** https://github.com/[your-username]
   - **LinkedIn:** https://linkedin.com/in/[your-username]
   - **Email:** hello@mikejones.online
   - **Twitter/X:** (optional) @[your-handle]

**DO NOT SAVE YET**

---

## Preview Before Saving

### Task 8: Preview Homepage

**Actions:**
1. Look for "Preview" button in top-right of Design settings
2. Click "Preview" to open preview in new tab
3. Verify:
   - ✓ Dark mode (Onyx) is active
   - ✓ Background is dark charcoal (not pure black)
   - ✓ Accent color (#4F46E5 indigo) appears on buttons
   - ✓ Hero section displays with your headline
   - ✓ Featured projects section visible (may be empty if no posts yet)
   - ✓ Recent writing section visible
   - ✓ Navigation menu shows all 5 primary items
   - ✓ Text "Michael Jones" appears as logo

**If something looks wrong:**
- Go back and adjust settings
- Don't save until you're happy with preview

---

### Task 9: Preview on Mobile

**Actions:**
1. In preview tab, open browser DevTools (F12 or Right-click → Inspect)
2. Click "Toggle device toolbar" icon (or Ctrl+Shift+M / Cmd+Shift+M)
3. Select a mobile device (iPhone 12/13 or similar)
4. Verify:
   - ✓ Navigation collapses to hamburger menu
   - ✓ Hero section stacks vertically
   - ✓ Projects/writing cards stack properly
   - ✓ Buttons are touch-friendly size
   - ✓ Dark mode still looks good

---

## Save All Changes

### Task 10: Final Save

**Actions:**
1. Close preview tab and return to Design settings
2. Review all your changes one more time:
   - Dark mode: Onyx ✓
   - Accent color: #4F46E5 ✓
   - Typography: Defaults ✓
   - Homepage: Configured ✓
   - Navigation: Set up ✓
   - Logo: Text-based ✓
   - Social links: Added ✓

3. Click **"Save"** button (usually top-right)
4. Wait for "Saved" or "Settings updated" confirmation message
5. If any errors appear, fix them and try saving again

---

## Verify Live Site

### Task 11: Check Published Site

**Actions:**
1. Open new tab and navigate to: https://mikejones.online
2. Hard refresh to clear cache: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
3. Verify all changes are live:
   - ✓ Dark mode (Onyx) is active
   - ✓ Accent color visible on buttons/links
   - ✓ Hero section displays correctly
   - ✓ Navigation menu works
   - ✓ Logo shows "Michael Jones"

**If changes not visible:**
- Clear browser cache completely
- Try incognito/private browsing window
- Wait 1-2 minutes for CDN cache to clear
- Check if you actually clicked "Save" in admin

---

## Documentation Tasks

### Task 12: Take Screenshots

**Take these screenshots and save to:**
`/Users/michaeljones/Dev/MJ_Online/screenshots/kyoto-theme-customization/`

**Required Screenshots:**

1. **homepage-desktop-full.png**
   - Full homepage scrolled from top to bottom
   - Shows hero, projects, writing sections

2. **homepage-mobile.png**
   - Mobile view of homepage
   - Shows responsive layout

3. **design-settings-panel.png**
   - Screenshot of Ghost Design settings with your configurations
   - Shows dark mode, accent color, etc.

4. **navigation-menu-desktop.png**
   - Shows primary navigation menu

5. **navigation-menu-mobile.png**
   - Shows hamburger menu expanded on mobile

6. **accent-color-examples.png**
   - Shows buttons/links with #4F46E5 color

**Optional but Recommended:**

7. **sample-post-typography.png**
   - Create test post to show typography
   - Shows headings, paragraphs, links

8. **dark-mode-comparison.png**
   - Side-by-side or comparison of dark mode

---

### Task 13: Update Checklist

**Actions:**
1. Open: `/Users/michaeljones/Dev/MJ_Online/plans/phase-2.2-implementation-checklist.md`
2. Mark all checkboxes as complete: `- [x]`
3. Fill in Configuration Summary at bottom:

```
Theme: Kyoto
Dark Mode: Onyx ☑
Accent Color: #4F46E5 ☑
Typography: Defaults ☑
Homepage Layout: Portfolio ☑
Logo: Text-based ☑
Navigation: Configured ☑
Social Links: Added ☑

Completion Date: 2026-01-28
Total Time: [your actual time]
Issues: [any problems encountered]
Status: ☑ Success
```

---

## Troubleshooting

### Problem: Theme Settings Not Appearing

**Solution:**
- Verify Kyoto theme is actually installed and activated
- Go to Settings → Design → Advanced → Change theme
- If Kyoto not active, upload and activate it first

---

### Problem: Dark Mode Not Working

**Solution:**
- Check if you selected Onyx in the correct section
- Some themes have dark mode in different locations:
  - Settings → Design → Color scheme
  - Settings → Design → Site design → Theme settings
  - Settings → Design → Kyoto settings
- Clear cache and hard reload (Cmd+Shift+R)

---

### Problem: Accent Color Not Showing

**Solution:**
- Verify hex code format: `#4F46E5` (must include #)
- Check if you saved changes
- Clear browser cache
- Try a different browser to rule out caching

---

### Problem: Homepage Layout Not Changing

**Solution:**
- Some themes require specific pages/templates for homepage
- Check Kyoto documentation for homepage setup
- Verify you're editing the correct homepage settings
- May need to set a specific page as homepage

---

### Problem: Navigation Menu Not Updating

**Solution:**
- Verify you saved navigation changes
- Check for duplicate URLs
- Navigation sometimes in separate section: Settings → Navigation
- Some themes cache navigation - may need to clear cache

---

## Post-Completion Next Steps

### Immediate Actions:
1. ✓ Browse entire site to verify design consistency
2. ✓ Test all navigation links work
3. ✓ Run Lighthouse audit (aim for 90+ scores)
4. ✓ Check WCAG accessibility compliance

### Phase 2.3: Content Publishing
1. Import About page: `/content-drafts/about-page.md`
2. Import Resume: `/content-drafts/resume-cv.md`
3. Create first project case study
4. Publish welcome/intro post

### Phase 2.4: Analytics Setup
1. Configure Ghost built-in analytics
2. Set up conversion tracking

### Phase 2.5: ActivityPub Configuration
1. Review ActivityPub research
2. Enable federation
3. Test with Mastodon

---

## Success Criteria

**Your Phase 2.2 is complete when:**
- ✓ Kyoto theme active with Onyx dark mode
- ✓ Accent color #4F46E5 visible throughout site
- ✓ Homepage has hero + projects + writing sections
- ✓ Navigation menu configured (5 primary + 2 secondary)
- ✓ Logo shows "Michael Jones"
- ✓ Social links added
- ✓ All changes saved and live on https://mikejones.online
- ✓ Screenshots documented
- ✓ Checklist marked complete

---

## Need Help?

**Kyoto Theme Support:**
- Website: https://themex.studio/kyoto/
- Email: contact@themex.studio

**Ghost Support:**
- Help: https://ghost.org/help/
- Docs: https://ghost.org/docs/

**Color/Accessibility Tools:**
- Contrast Checker: https://webaim.org/resources/contrastchecker/
- WCAG Guide: https://www.w3.org/WAI/WCAG21/quickref/

---

**Guide Status:** Ready for manual execution
**Last Updated:** 2026-01-28
**Execution Mode:** Manual (browser automation unavailable)
