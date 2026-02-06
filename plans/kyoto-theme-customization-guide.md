# Kyoto Theme Customization Guide (Phase 2.2)

**Purpose:** Step-by-step guide for customizing the Kyoto theme in Ghost Pro
**Status:** Ready for manual execution
**Estimated Time:** 15-20 minutes

---

## Prerequisites

- [x] Ghost Pro account active
- [x] Kyoto theme purchased ($89) and downloaded
- [x] Ghost Pro admin access via browser
- [x] Domain configured (mikejones.online)

---

## Part 1: Theme Installation (If Not Already Installed)

### Step 1: Access Design Settings
1. Navigate to: `https://mikejones.ghost.io/ghost/#/settings/design`
2. Or: Ghost Admin → Settings → Design

### Step 2: Install Kyoto Theme
1. Scroll to "Advanced" section
2. Click "Change theme"
3. Click "Upload theme"
4. Select the downloaded Kyoto theme zip file
5. Click "Activate" once uploaded
6. Confirm activation

**Expected Result:** Kyoto theme now active on your Ghost site

---

## Part 2: Dark Mode Configuration

### Recommended Setting: Onyx Preset

**Why Onyx?**
- Professional tech aesthetic (dark charcoal with subtle warmth)
- Excellent readability for technical content
- Modern AI implementation portfolio appearance
- Reduces eye strain for code-heavy content

### Steps:
1. In Settings → Design → Kyoto Theme Settings
2. Look for "Dark Mode" or "Color Scheme" section
3. Select **"Onyx"** from the 8 available presets:
   - Default
   - Pure
   - **Onyx** ← SELECT THIS
   - Rust
   - Fossil
   - Mint
   - Ice
   - Ember

4. Click "Save" or preview changes

**Alternative Options:**
- **Pure:** If you prefer true black background (better for OLED screens)
- **Fossil:** If you prefer warmer, earth-toned dark mode
- **Ice:** If you prefer cooler, blue-tinted dark mode

---

## Part 3: Accent Color Configuration

### Recommended Color: #4F46E5 (Indigo)

**Why This Color?**
- Professional tech industry standard
- Excellent contrast on dark backgrounds
- Used by modern AI implementation companies
- Stands out for CTAs without being aggressive
- Accessible (WCAG AA compliant on dark backgrounds)

### Steps:
1. In Settings → Design → Branding section
2. Find "Accent color" setting
3. Enter: `#4F46E5`
4. Preview the color on buttons, links, and CTAs
5. Save changes

**Alternative Color Options:**
- **#6366F1:** Slightly lighter indigo (if #4F46E5 too dark)
- **#3B82F6:** Tech blue (more traditional)
- **#8B5CF6:** Purple (creative/AI aesthetic)
- **#10B981:** Green (growth/success theme)

**Testing Accent Color:**
- Check homepage CTAs (subscribe, contact buttons)
- Check link hover states in posts
- Check navigation active states
- Ensure sufficient contrast on both light/dark modes

---

## Part 4: Typography Configuration

### Recommendation: Keep Kyoto Defaults

**Why Keep Defaults?**
- Kyoto theme is already optimized for readability
- Professional sans-serif + monospace combination
- Designed specifically for developer/tech portfolios
- No need to change unless specific branding requirement

### If Customization Needed:
1. Settings → Design → Typography (if available in Kyoto)
2. **Headings:** Keep default or use Inter/Poppins
3. **Body Text:** Keep default or use Inter/Source Sans Pro
4. **Code/Monospace:** Keep default or use JetBrains Mono/Fira Code

**Typography Testing:**
- Preview long-form blog posts
- Check code snippet readability
- Test heading hierarchy (H1 → H6)
- Verify mobile responsiveness

---

## Part 5: Homepage Layout Configuration

### Recommended Layout: Portfolio Focus

**Hero Section:**
- **Style:** Minimal with strong headline
- **Headline:** "AI Implementation Expert and LLM Integration Specialist"
- **Subheadline:** "Building intelligent systems that solve real problems"
- **CTA:** "View Projects" (links to /tag/projects/)

**Featured Projects Section:**
- **Layout:** Grid or cards layout
- **Display:** 3-4 featured projects
- **Tags:** Filter for #featured or #projects
- **Style:** Image + title + short description

**Recent Writing Section:**
- **Layout:** List or minimal cards
- **Display:** 3 latest posts
- **Filter:** All posts or #writing tag
- **Style:** Title + excerpt + date

### Steps:
1. Settings → Design → Homepage
2. Configure homepage sections:
   - Enable "Hero section"
   - Set hero title and description
   - Enable "Featured posts" section
   - Set featured post count (3-4)
   - Enable "Latest posts" section
   - Set layout preference (grid vs. list)

3. Navigation Configuration:
   - Primary Nav:
     - Home (/)
     - Projects (/tag/projects/)
     - Writing (/tag/writing/)
     - About (/about/)
     - Resume (/resume/)
   - Secondary Nav (footer):
     - Contact (/contact/)
     - RSS (/rss/)

4. Save all homepage settings

---

## Part 6: Logo/Branding Configuration

### Recommendation: Text-Based "Michael Jones"

**Options:**

**Option A: Text-Only Logo (Recommended for Now)**
1. Settings → Design → Branding
2. Site title: "Michael Jones" or "MJ"
3. Leave logo image empty
4. Theme will use site title as text logo
5. Clean, professional appearance

**Option B: Custom Logo (If Available)**
1. Upload logo image (PNG with transparency)
2. Recommended size: 600x200px or similar
3. Ensure logo works on dark background
4. Consider providing both light/dark logo variants

**Option C: Icon + Text**
1. Upload small icon/favicon
2. Use text for main logo
3. Icon appears in browser tab and mobile

**For Initial Launch:**
Use Option A (text-based). Can upgrade to custom logo later.

---

## Part 7: Additional Theme Settings

### Social Links
**Settings → Design → Social accounts**

Configure (if not already set):
- GitHub: https://github.com/[your-username]
- LinkedIn: https://linkedin.com/in/[your-username]
- Twitter/X: @[your-handle] (optional)
- Email: hello@mikejones.online

### Publication Info
**Settings → General → Publication info**

Verify:
- Site title: "Michael Jones"
- Site description: "AI researcher, software engineer, and builder of intelligent systems"
- Timezone: America/Los_Angeles (or your timezone)
- Language: English

### Footer Configuration
**Settings → Design → Footer (if available in Kyoto)**

Configure:
- Copyright text: "© 2026 Michael Jones"
- Footer navigation (see Part 5)
- Social icon display
- Newsletter signup form (if desired)

---

## Part 8: Preview and Verification

### Before Saving Final Changes:

1. **Preview Homepage:**
   - Click "Preview" in Ghost admin
   - Check hero section appearance
   - Verify accent color on CTAs
   - Test dark mode rendering
   - Check navigation menu

2. **Preview Post/Page:**
   - Create test post or view existing page
   - Check typography readability
   - Verify code syntax highlighting (if applicable)
   - Test image display
   - Check accent color on links

3. **Mobile Preview:**
   - Use browser dev tools or phone
   - Check responsive behavior
   - Verify navigation menu (hamburger)
   - Test touch targets for buttons

4. **Dark Mode Verification:**
   - Ensure Onyx preset looks professional
   - Check contrast ratios
   - Verify images display well on dark background
   - Test link visibility

### Cross-Browser Testing (Optional but Recommended):
- Chrome/Edge (Chromium)
- Firefox
- Safari (macOS/iOS)

---

## Part 9: Save All Changes

### Final Save Checklist:
- [ ] Dark mode: Onyx preset selected
- [ ] Accent color: #4F46E5 configured
- [ ] Typography: Defaults kept (or custom configured)
- [ ] Homepage layout: Portfolio focus configured
- [ ] Navigation: Primary and secondary menus set
- [ ] Logo/branding: Text-based "Michael Jones" set
- [ ] Social links: Added
- [ ] Preview verified: Looks professional

### Save Steps:
1. Click "Save" in Settings → Design
2. Wait for confirmation message
3. Clear browser cache if needed
4. Visit live site: https://mikejones.online
5. Verify changes are live

---

## Part 10: Documentation and Screenshots

### Take Screenshots for Documentation:

1. **Homepage (Full Page):**
   - Hero section with dark mode
   - Featured projects section
   - Recent writing section
   - Footer

2. **Post/Page Example:**
   - Full post with typography
   - Code blocks (if applicable)
   - Images
   - Link styling with accent color

3. **Design Settings Panel:**
   - Screenshot of Kyoto settings
   - Color configuration
   - Homepage layout settings

4. **Mobile View:**
   - Homepage on mobile
   - Navigation menu
   - Post/page on mobile

### Save Screenshots To:
`/Users/michaeljones/Dev/MJ_Online/screenshots/kyoto-theme-customization/`

---

## Configuration Summary (Copy This After Completion)

```yaml
Theme Customization Summary:
  Theme: Kyoto (v1.x)
  Dark Mode: Onyx preset
  Accent Color: #4F46E5 (Indigo)
  Typography: Kyoto defaults (professional sans-serif + monospace)

Homepage Layout:
  Hero: Minimal with AI implementation headline
  Featured Projects: Grid/cards layout (3-4 projects)
  Recent Writing: List/minimal cards (3 posts)

Branding:
  Logo: Text-based "Michael Jones"
  Favicon: [To be added]

Navigation:
  Primary: Home, Projects, Writing, About, Resume
  Secondary: Contact, RSS

Social Links:
  GitHub: [configured]
  LinkedIn: [configured]
  Email: hello@mikejones.online

Publication:
  Title: Michael Jones
  Description: AI researcher, software engineer, and builder of intelligent systems
  Timezone: America/Los_Angeles
  Language: English
```

---

## Common Issues & Troubleshooting

### Issue 1: Theme Not Activating
**Solution:**
- Ensure you downloaded correct Kyoto theme version
- Check Ghost version compatibility (need Ghost 6.x)
- Try re-uploading theme zip file
- Check for error messages in Ghost admin

### Issue 2: Dark Mode Not Appearing
**Solution:**
- Verify Kyoto theme supports dark mode (it does - 8 presets)
- Check Settings → Design → Kyoto settings for color scheme
- Clear browser cache and hard reload (Cmd+Shift+R)
- Verify JavaScript not blocked

### Issue 3: Accent Color Not Showing
**Solution:**
- Double-check hex code format: #4F46E5 (include #)
- Save settings and clear cache
- Check if theme overrides accent color (unlikely with Kyoto)
- Try alternative color to test

### Issue 4: Homepage Layout Not Changing
**Solution:**
- Ensure you're editing correct homepage settings
- Some themes require custom homepage page template
- Check Kyoto documentation for homepage configuration
- May need to create custom homepage page with specific template

### Issue 5: Mobile Navigation Issues
**Solution:**
- Test on actual mobile device, not just browser resize
- Check Kyoto responsive breakpoints
- Verify navigation menu items not too long
- Consider reducing primary nav items if overflow

---

## Next Steps After Customization

### Immediate:
1. **Test Full Site:** Browse all pages and verify design consistency
2. **Create Test Content:** Add sample project post to test project showcase
3. **Performance Check:** Run Lighthouse audit (aim for 90+ scores)
4. **Accessibility Check:** Verify WCAG AA compliance with dark mode + accent color

### Phase 2.3: Content Publishing
1. Import About page content (`/content-drafts/about-page.md`)
2. Import Resume content (`/content-drafts/resume-cv.md`)
3. Create first project case study
4. Publish welcome post

### Phase 2.4: Analytics Integration
1. Configure Ghost built-in analytics
2. Review analytics implementation guide
3. Set up conversion tracking (newsletter signups)

### Phase 2.5: ActivityPub Configuration
1. Review ActivityPub research (`/plans/activitypub-research.md`)
2. Enable ActivityPub federation
3. Configure Fediverse profile
4. Test federation with Mastodon instance

---

## Resources

### Kyoto Theme Documentation:
- Homepage: https://themex.studio/kyoto/
- Demo: https://kyoto.themex.studio/
- Support: contact@themex.studio

### Ghost Documentation:
- Design Settings: https://ghost.org/docs/themes/
- Custom Templates: https://ghost.org/docs/themes/structure/
- Handlebars Helpers: https://ghost.org/docs/themes/helpers/

### Color Tools:
- Contrast Checker: https://webaim.org/resources/contrastchecker/
- Color Palette Generator: https://coolors.co/
- WCAG Compliance: https://www.w3.org/WAI/WCAG21/quickref/

### Testing Tools:
- Lighthouse: Chrome DevTools → Lighthouse tab
- Mobile Testing: Chrome DevTools → Device Mode
- Cross-Browser: BrowserStack or actual devices

---

## Status Tracking

**Customization Started:** [Date/Time]
**Customization Completed:** [Date/Time]
**Total Time:** [Duration]
**Issues Encountered:** [List any problems]
**Final Result:** [Success/Partial/Needs Revision]

---

**Guide Version:** 1.0
**Last Updated:** 2026-01-28
**Created By:** AI Agent for MJ_Online Project
