# MikeJones.online - Site Maintenance Guide

**Last Updated:** 2026-01-28
**Ghost Version:** 6.x
**Theme:** Kyoto v1.11.1
**Platform:** Ghost Pro

---

## Quick Access Links

- **Live Site:** https://mikejones.online
- **Ghost Admin:** https://mikejones-online.ghost.io/ghost/
- **Analytics Dashboard:** https://mikejones-online.ghost.io/ghost/#/analytics
- **Design Settings:** https://mikejones-online.ghost.io/ghost/#/settings/design
- **Code Injection:** https://mikejones-online.ghost.io/ghost/#/settings/code-injection

---

## Site Configuration Summary

### Theme Setup
- **Active Theme:** Kyoto v1.11.1
- **Color Preset:** Onyx (dark mode)
- **Accent Color:** #4F46E5 (Indigo)
- **Typography:** Theme defaults (optimized for portfolios)

### Navigation Structure
**Primary Menu:**
1. Home (/)
2. Projects (/tag/projects/)
3. Writing (/tag/writing/)
4. About (/about/)
5. Resume (/resume/)

**Secondary Menu (Footer):**
1. Contact (/contact/)
2. RSS Feed (/rss/)

### Custom Features Installed
✅ Enhanced code blocks with copy buttons
✅ AI/ML project badge system (11 badge types)
✅ Resume download tracking
✅ Beautiful resume download button styling

---

## How to Use Custom Features

### 1. AI/ML Project Badges

**Purpose:** Visually highlight technologies used in projects to help employers quickly identify your expertise.

**Available Badges:**
- `badge-ai` - AI Agent (purple gradient)
- `badge-ml` - Machine Learning (pink gradient)
- `badge-llm` - LLM (blue gradient)
- `badge-python` - Python (green gradient)
- `badge-langchain` - LangChain (pink-yellow gradient)
- `badge-openai` - OpenAI (blue-purple gradient)
- `badge-claude` - Claude (light gradient)
- `badge-production` - Production (red gradient)
- `badge-experimental` - Experimental (yellow gradient)
- `badge-automation` - Automation (blue gradient)
- `badge-rag` - RAG (purple gradient)

**How to Add Badges to a Post:**

1. Open post in Ghost editor
2. Add an HTML card
3. Paste this code:

```html
<div class="project-badges">
    <span class="badge badge-ai">AI Agent</span>
    <span class="badge badge-python">Python</span>
    <span class="badge badge-langchain">LangChain</span>
    <span class="badge badge-production">Production</span>
</div>
```

4. Customize which badges to show

**Example Use Cases:**
- **AI Memory System:** `badge-ai`, `badge-python`, `badge-langchain`, `badge-openai`, `badge-production`
- **Local LLM Setup:** `badge-llm`, `badge-python`, `badge-automation`, `badge-production`
- **Experimental Projects:** `badge-experimental`, `badge-python`, `badge-ai`

### 2. Enhanced Code Blocks

**Features:**
- Dark theme with syntax highlighting
- Automatic copy buttons on hover
- Professional styling

**How to Use:**
1. In Ghost editor, add a Markdown card or Code block
2. Paste your code
3. Copy button appears automatically on hover

**Supported Languages:**
- Python, JavaScript, Bash, JSON, HTML, CSS, etc.
- No special configuration needed

### 3. Resume Download Button

**How to Create:**
1. Upload your resume PDF to Ghost: Settings → Labs → Upload redirects file
2. Or host it externally
3. In your Resume page, add HTML card:

```html
<a href="/content/files/resume.pdf" class="resume-download-btn" download>
    Download Resume (PDF)
</a>
```

**Features:**
- Gradient purple button with hover effects
- Automatically tracked in analytics
- Mobile-friendly

**Tracking:**
- Downloads are logged in browser console
- Viewable in Ghost Analytics (if integrated with Plausible/similar)

---

## Common Tasks

### Publishing a New Blog Post

1. Go to Ghost Admin → Posts
2. Click "New post"
3. Write your content
4. Add project badges if it's a technical post (see above)
5. Add tags (e.g., "projects", "ai", "python")
6. Set featured image
7. Click "Publish"

**Best Practices:**
- Use "projects" tag for portfolio work
- Add meta description for SEO
- Include project badges for AI/ML posts
- Add code examples with enhanced code blocks

### Creating a New Page

1. Ghost Admin → Pages
2. Click "New page"
3. Write content
4. Publish
5. Add to navigation if needed (Settings → Navigation)

### Updating Navigation

1. Settings → Navigation
2. Drag to reorder items
3. Click item to edit URL/label
4. Add new items with "Add item" button
5. Save changes

**Current Structure:**
- Keep "Projects" in 2nd position (employer visibility)
- Max 5 primary items for clean design
- Footer items for utility links

### Accessing Analytics

1. Ghost Admin → Analytics
2. View:
   - Total visitors
   - Page views
   - Popular content
   - Resume page views (track employer interest!)
3. Check weekly for trends

**Key Metrics to Monitor:**
- Resume page views = recruiter interest
- Project post views = portfolio engagement
- Traffic sources = where visitors find you

### Updating Theme Settings

1. Settings → Design → Customize
2. **Brand tab:**
   - Accent color: #4F46E5 (current)
   - Upload icon/logo
   - Upload cover images
3. **Theme tab:**
   - Color combinations: Onyx (current)
   - Profile photo
   - Homepage hero text
   - Featured sections
4. Save changes

**Don't Change:**
- Color preset (Onyx is optimized for tech/AI aesthetic)
- Accent color (unless rebranding)

---

## ActivityPub / Fediverse

**Your Fediverse Handle:** `@index@mikejones.online`
*(Note: Username is "index" due to Ghost limitations - changing it requires disabling/re-enabling ActivityPub)*

**How to Share on Fediverse:**
1. Publish a post in Ghost
2. It automatically federates to followers on Mastodon/Threads/etc.
3. Followers see it in their timeline

**Managing ActivityPub:**
- Settings → Membership → Network
- Toggle on/off
- Update profile bio

**Finding Your Profile:**
- Search `@index@mikejones.online` on Mastodon
- Or visit: https://www.mikejones.online/.ghost/activitypub/users/index

---

## Code Injection Reference

**Location:** Settings → Code Injection

**Current Code Installed:**

### Site Header (CSS)
- Enhanced code block styling
- AI/ML project badge system
- Resume download button styling

### Site Footer (JavaScript)
- Copy button functionality for code blocks
- Resume download tracking
- Analytics integration

**If You Need to Update Code:**
1. Settings → Code Injection → Open
2. Modify Site Header (CSS) or Site Footer (JavaScript)
3. Save changes
4. Test on live site

**⚠️ Important:**
- Don't delete existing code unless you know what it does
- Test changes on a draft post first
- Keep backups of custom code

**Backup of Current Code:** `/Users/michaeljones/Dev/MJ_Online/devlog/phase-2-6-code-injection-evaluation.md`

---

## Troubleshooting

### Code Copy Buttons Not Working
1. Check Site Footer JavaScript is saved
2. Clear browser cache
3. Test in incognito window

### Badges Not Showing
1. Verify Site Header CSS is saved
2. Check HTML syntax in post
3. Inspect element to see if styles are loading

### Resume Downloads Not Tracking
1. Check JavaScript console for errors
2. Verify resume link has correct class/attributes
3. Ensure Site Footer code is saved

### Theme Looks Wrong
1. Settings → Design → Customize
2. Verify "Onyx" color preset is selected
3. Check accent color is #4F46E5
4. Clear cache and reload

### Analytics Not Showing Data
1. Ghost Admin → Settings → Analytics
2. Verify "Web analytics" is enabled
3. Wait 5-10 minutes for data to populate
4. Test with incognito window visit

---

## Content Strategy Tips

### For Employer Visibility
1. **Feature AI/ML projects prominently**
   - Use project badges to highlight tech stack
   - Include code examples with enhanced blocks
   - Tag posts with "projects", "ai", "ml"

2. **Keep Resume updated**
   - Update quarterly
   - Track downloads in Analytics
   - Make download button prominent

3. **Optimize for search**
   - Use meta descriptions
   - Include keywords: "AI engineer", "ML", "Python"
   - Link between related projects

### For Engagement
1. **Publish regularly**
   - 1-2 posts per month minimum
   - Mix project showcases with insights
   - Share on Fediverse

2. **Use visuals**
   - Project screenshots
   - Architecture diagrams
   - Demo videos

3. **Add CTAs**
   - Resume download
   - Contact form
   - GitHub links

---

## Backup & Maintenance

### Regular Backups
**Ghost Pro handles automatic backups**, but you can also:
1. Settings → Import/Export → Export
2. Download JSON file of all content
3. Store in `/Users/michaeljones/Dev/MJ_Online/backups/`

**Recommended Schedule:**
- Export before major changes
- Monthly exports as insurance

### Theme Updates
**Kyoto theme updates:**
1. Check https://themex.studio/kyoto/ for updates
2. Download new version
3. Settings → Theme → Upload theme
4. Test on preview before activating

### Monitoring
**Weekly:**
- Check Analytics dashboard
- Review resume page views
- Check for broken links

**Monthly:**
- Export content backup
- Review and update projects
- Check theme for updates

---

## Support Resources

### Ghost Documentation
- **General:** https://ghost.org/help/
- **Publishing:** https://ghost.org/help/writing-posts/
- **Themes:** https://ghost.org/help/themes/
- **ActivityPub:** https://ghost.org/help/activitypub/

### Kyoto Theme
- **Documentation:** https://themex.studio/docs/kyoto/
- **Support:** https://themex.studio/support/
- **Changelog:** https://themex.studio/kyoto/changelog/

### Custom Code
- **Backup Location:** `/Users/michaeljones/Dev/MJ_Online/devlog/phase-2-6-code-injection-evaluation.md`
- **Original Implementation:** Phase 2.6 documentation

---

## Quick Reference Commands

### Add a Project Badge
```html
<span class="badge badge-ai">AI Agent</span>
```

### Add Resume Download Button
```html
<a href="/path/to/resume.pdf" class="resume-download-btn" download>Download Resume</a>
```

### Add Multiple Badges
```html
<div class="project-badges">
    <span class="badge badge-python">Python</span>
    <span class="badge badge-ai">AI</span>
    <span class="badge badge-production">Production</span>
</div>
```

---

## Change Log

### 2026-01-28 - Initial Setup
- Installed Kyoto theme v1.11.1
- Configured Onyx dark mode preset
- Set accent color to #4F46E5
- Added custom code injection (enhanced code blocks, badges, resume tracking)
- Configured navigation structure
- Enabled ActivityPub
- Verified Ghost Analytics working

---

**Need help?** Check the troubleshooting section or refer to Ghost documentation links above.

**Making changes?** Always test in preview mode first, and keep backups of custom code!
