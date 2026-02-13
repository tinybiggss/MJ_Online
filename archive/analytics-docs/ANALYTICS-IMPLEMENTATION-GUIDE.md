# Analytics Implementation Guide

**Project:** MJ_Online
**Domain:** mikejones.online
**Date:** 2026-01-28
**Status:** Ready for execution
**Estimated Time:** 30-45 minutes

---

## Overview

This guide provides step-by-step instructions for implementing analytics on the mikejones.online Ghost Pro site. Ghost Pro includes built-in analytics (no additional services needed), making implementation straightforward.

**Approach:** Use Ghost's native analytics with simple page view tracking for resume downloads (no custom code required for MVP).

---

## Prerequisites

- Access to Ghost Admin dashboard at `https://mikejones.online/ghost`
- Ghost Pro subscription (already active)
- Admin/Owner role in Ghost

---

## Implementation Steps

### Phase 1: Verify Ghost Analytics (5 minutes)

Ghost Pro includes analytics by default. Let's verify it's working:

1. **Access Ghost Admin:**
   - Navigate to: `https://mikejones.online/ghost`
   - Log in with your credentials

2. **Open Analytics Dashboard:**
   - Look for "Analytics" in the left sidebar
   - Click to open the analytics overview

3. **Verify Dashboard is Active:**
   - You should see analytics dashboard with metrics
   - Check for: Visitors, Page Views, Top Posts sections
   - Real-time visitor count (if any visitors present)

4. **Confirm Data Collection:**
   - If site has had visitors, data should be visible
   - If brand new, it may show zero metrics (normal)
   - Analytics starts collecting immediately upon site creation

**Expected Result:** Analytics dashboard visible and showing current site metrics (or zeros if no traffic yet).

**Screenshot Location:** Save a screenshot as `analytics-dashboard-initial.png` for documentation.

---

### Phase 2: Configure Resume Download Tracking (10 minutes)

**Recommendation:** Use simple page view tracking (Option A) for MVP. No custom code needed.

#### Option A: Page View Tracking (Recommended)

This approach tracks resume downloads by monitoring page views of the resume page.

**Setup Steps:**

1. **Verify Resume Page Exists:**
   - Navigate to: Posts or Pages section
   - Confirm you have a resume page (URL: `/resume/` or `/resume-download/`)
   - If not created yet, create a new page titled "Resume" with slug "resume"

2. **Add Resume Download Link:**
   - On any page where you want a resume download button/link:
   - Link to: `/resume/` (internal Ghost page)
   - The page can contain a PDF embed or download link

3. **Track via Ghost Analytics:**
   - Ghost automatically tracks all page views
   - Navigate to: Analytics → Posts/Pages
   - Find your "Resume" page in the list
   - Page views = resume download interest (proxy metric)

**Alternative: Direct PDF Tracking**

If you prefer to link directly to a PDF:

1. **Upload Resume PDF:**
   - Navigate to: Settings → Labs → Migration
   - Or use a dedicated page with embedded PDF
   - Upload your resume PDF file

2. **Create Dedicated Landing Page:**
   - Create page: `/resume-download/`
   - Add PDF download button/link on this page
   - Track page views as download intent

**No Custom Code Required** for basic tracking.

---

#### Option B: Custom Event Tracking (Advanced - Optional)

Only use this if you need detailed click-level tracking.

**Implementation:**

1. **Navigate to Code Injection:**
   - Go to: Settings → Code injection
   - Scroll to "Site Footer" section

2. **Add Tracking Script:**

```html
<script>
// Resume download tracking
document.addEventListener('DOMContentLoaded', function() {
    // Select all resume download links
    const resumeButtons = document.querySelectorAll('a[href*="resume.pdf"], a[href*="cv.pdf"], .resume-download');

    resumeButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            // Log to browser console
            console.log('Resume download initiated:', this.href);

            // Optional: Send to backend for tracking
            // Uncomment if you set up a custom tracking endpoint
            /*
            fetch('/api/track-event', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    event: 'resume_download',
                    url: this.href,
                    timestamp: new Date().toISOString()
                })
            }).catch(function(err) {
                console.error('Tracking failed:', err);
            });
            */
        });
    });
});
</script>
```

3. **Save Changes:**
   - Click "Save" in Code Injection settings

4. **Test Tracking:**
   - Open your site in a new browser window
   - Open browser console (F12 → Console tab)
   - Click resume download button
   - Verify console log message appears

**Note:** This advanced option requires custom backend API if you want server-side tracking.

---

### Phase 3: Configure Contact Form Tracking (5 minutes)

**Ghost Native Forms:**
- If using Ghost's native forms, submissions are automatically tracked
- Check: Settings → Analytics → Members (or similar section)

**External Form Services:**
- If using Formspree, Tally, or similar: track contact page views as proxy
- Navigate to: Analytics → Pages
- Monitor views of `/contact/` page

**No Additional Setup Required** for basic contact page tracking.

---

### Phase 4: Configure Project Case Study Tracking (5 minutes)

Ghost automatically tracks individual post views.

**Setup:**

1. **Tag Your Projects:**
   - Navigate to: Posts section
   - For each project case study, add tag: `projects`
   - This helps filter projects in analytics

2. **View Project Analytics:**
   - Go to: Analytics → Posts
   - Sort by: Page views (descending)
   - Filter by tag: `projects` (if available in your Ghost version)

3. **Bookmark This View:**
   - Create browser bookmark for quick access
   - Title: "Project Analytics - Ghost"

**No Custom Code Required** - Ghost handles this automatically.

---

### Phase 5: Test Analytics (15 minutes)

Verify that analytics is collecting data correctly.

#### Test 1: Basic Page View Tracking

1. **Open Incognito/Private Window:**
   - Open new private/incognito browser window
   - This ensures you're not logged in as admin

2. **Visit Multiple Pages:**
   - Navigate to: `https://mikejones.online`
   - Visit 2-3 different pages (About, Projects, etc.)
   - Spend 5-10 seconds on each page

3. **Check Analytics Dashboard:**
   - Return to Ghost Admin → Analytics
   - Wait 1-2 minutes for data to sync
   - Verify real-time visitor count increased
   - Check that page views incremented

#### Test 2: Resume Download Tracking

1. **Visit Resume Page:**
   - In incognito window, navigate to resume page
   - Click resume download button/link (if applicable)

2. **Check Browser Console (if using Option B):**
   - Press F12 to open developer tools
   - Go to Console tab
   - Verify log message appears when clicking download

3. **Check Analytics:**
   - Go to: Analytics → Pages
   - Find resume page in list
   - Verify page view was recorded

#### Test 3: Contact Page Tracking

1. **Visit Contact Page:**
   - Navigate to contact page in incognito window
   - Stay on page for 10-15 seconds

2. **Check Analytics:**
   - Go to: Analytics → Pages
   - Find contact page
   - Verify page view recorded

#### Test 4: Project Case Study Tracking

1. **Visit Project Pages:**
   - Navigate to 2-3 project case study pages
   - Spend time reading each one

2. **Check Project Analytics:**
   - Go to: Analytics → Posts
   - Sort by page views
   - Verify project pages showing view counts

**Wait Time:** Analytics may take 1-5 minutes to update. If data doesn't appear immediately, wait and refresh.

---

## Phase 6: Document Analytics Access (5 minutes)

Create quick reference for ongoing analytics monitoring.

### How to Access Analytics

**URL:** `https://mikejones.online/ghost` → Click "Analytics" in left sidebar

**Available Sections:**
- **Overview:** Site-wide traffic metrics (visitors, views, trends)
- **Posts:** Individual post/page performance
- **Members:** Subscriber growth and engagement (if using memberships)
- **Newsletter:** Email newsletter performance (if sending newsletters)

### Key Metrics to Monitor

**Weekly Monitoring:**
- Unique visitors (total site traffic)
- Page views (engagement level)
- Top performing posts/pages
- Traffic sources (where visitors come from)

**Resume Specific:**
- Resume page views (proxy for download interest)
- Time on page (engagement level)

**Contact Engagement:**
- Contact page views
- Form submissions (if using Ghost forms)

**Project Performance:**
- Which project case studies get most views
- Engagement time on project pages
- Traffic sources to projects

### Recommended Monitoring Schedule

- **Daily (First Week):** Check to ensure tracking is working
- **Weekly (Ongoing):** Review overview metrics, top content
- **Bi-weekly:** Analyze trends, identify popular content
- **Monthly:** Deep dive into traffic sources, content strategy adjustments

---

## Verification Checklist

After implementation, verify these items:

- [ ] Ghost Analytics dashboard accessible
- [ ] Real-time visitor tracking working
- [ ] Page view tracking accurate
- [ ] Resume page views visible in Analytics → Pages
- [ ] Contact page views trackable
- [ ] Project case study views visible in Analytics → Posts
- [ ] Top content reports available
- [ ] Traffic sources visible (if available)
- [ ] Test visits confirmed in dashboard
- [ ] Analytics access documented
- [ ] Monitoring schedule established

---

## Configuration Summary

**Analytics Platform:** Ghost Built-in Analytics (native)
**Cost:** $0 (included with Ghost Pro)
**Setup Time:** 30-45 minutes
**Privacy Compliance:** GDPR compliant, cookie-free, EU-hosted
**Data Location:** EU servers (Ghost Pro)
**Tracking Method:** First-party, cookie-free
**Dashboard Access:** Ghost Admin → Analytics

**Custom Tracking Implemented:**
- Resume downloads: Page view tracking (simple)
- Contact forms: Page view tracking
- Project case studies: Automatic post view tracking

**No External Services Required:** Everything runs on Ghost Pro infrastructure.

---

## Troubleshooting

### Issue: Analytics dashboard not showing data

**Possible Causes:**
- Site is brand new with no traffic yet
- Admin visits are filtered out
- Data collection delay (1-5 minutes)

**Solutions:**
1. Wait 10-15 minutes after site launch for initial data
2. Test with incognito window to generate non-admin traffic
3. Verify you're on Ghost Pro (analytics included)
4. Check Settings → Analytics to ensure it's enabled

### Issue: Real-time visitors not updating

**Solutions:**
1. Clear browser cache and refresh
2. Wait 1-2 minutes for real-time sync
3. Verify you're not blocking analytics (ad blockers, privacy extensions)
4. Use incognito window for testing

### Issue: Resume download tracking not working

**Solutions:**
1. Verify resume page exists and is published (not draft)
2. Check page slug is correct (`/resume/`)
3. If using Option B (custom code):
   - Check browser console for JavaScript errors
   - Verify script is in Site Footer (not Header)
   - Check CSS selectors match your links

### Issue: Project views not appearing

**Solutions:**
1. Ensure posts are published (not drafts)
2. Check posts have `#projects` tag
3. Wait for page views to accumulate (may take hours)
4. Verify posts are accessible to non-logged-in users

### Issue: Analytics showing "0" for everything

**Normal Conditions:**
- Brand new site with no visitors yet
- Site just launched (no historical data)

**Action:**
- Generate test traffic (incognito window)
- Wait 24-48 hours for organic traffic
- Share site to generate initial visitors

---

## Privacy Compliance

**Ghost Pro Analytics:**
- GDPR compliant by default
- No cookies used for tracking
- Anonymous visitor data only
- EU-hosted data (privacy-friendly)
- No personal information collected

**Cookie Consent:**
- Not required for Ghost native analytics
- If you add external analytics later (Google Analytics, etc.), you may need cookie consent banner

**Privacy Policy:**
- Ghost's cookie-free tracking typically doesn't require privacy policy updates
- If adding external services, update privacy policy accordingly

---

## Next Steps After Analytics Setup

### Week 1-2: Baseline Data Collection
- Monitor daily to ensure tracking works
- Identify any tracking gaps
- Note which content gets early traction
- Don't make changes yet (collect baseline data)

### Week 3-4: First Analysis
- Review top performing content
- Identify traffic sources
- Check resume download engagement
- Analyze project case study popularity
- Look for patterns in visitor behavior

### Month 2: Optimize Based on Data
- Improve popular content (add more detail, better CTAs)
- Create similar content to top performers
- Optimize resume download placement if engagement low
- Enhance underperforming projects with better descriptions
- Adjust content strategy based on what resonates

### Month 3+: Advanced Analytics (Optional)

If Ghost Analytics proves insufficient, consider:

1. **Plausible Analytics ($9/mo):**
   - More granular event tracking
   - Custom goals and conversions
   - API access for custom reports

2. **Fathom Analytics ($14/mo):**
   - Uptime monitoring + analytics
   - Email reports
   - Multiple sites

3. **Custom Analytics Backend:**
   - Track custom events via API
   - Store in database
   - Create custom dashboards
   - Full control over data

**Recommendation:** Start with Ghost built-in analytics. Only add external services if you need features Ghost doesn't provide.

---

## Success Criteria

**Phase 2.5 Complete When:**

- [x] Analytics implementation guide created
- [ ] Ghost Analytics verified and active
- [ ] Resume download tracking implemented
- [ ] Contact form tracking configured
- [ ] Project view tracking confirmed
- [ ] Test visits recorded successfully
- [ ] Analytics dashboard access documented
- [ ] Privacy compliance verified
- [ ] Ready for content publishing (Phase 3)

---

## Additional Resources

**Ghost Analytics Documentation:**
- https://ghost.org/docs/analytics/

**Ghost Pro Support:**
- Contact via Ghost Pro admin dashboard
- Support response typically within 24 hours

**Related Project Documents:**
- Full research: `/plans/analytics-setup-research.md`
- Implementation checklist: `/plans/analytics-implementation-checklist.md`
- Ghost Pro setup: `/plans/ghost-pro-setup-guide.md`
- Project roadmap: `/plans/roadmap-ghost-pro.md`

---

## Execution Notes

**Manual Steps Required:**
1. Log into Ghost Admin (browser automation unavailable)
2. Navigate through analytics dashboard
3. Configure resume tracking (choose Option A or B)
4. Run test visits
5. Verify data collection

**Time Estimate:**
- Phase 1 (Verify): 5 minutes
- Phase 2 (Resume tracking): 10 minutes
- Phase 3 (Contact tracking): 5 minutes
- Phase 4 (Project tracking): 5 minutes
- Phase 5 (Testing): 15 minutes
- Phase 6 (Documentation): 5 minutes
- **Total: 45 minutes**

**Status:** Ready for execution. Guide complete and comprehensive.

---

**Last Updated:** 2026-01-28
**Author:** Analytics Implementation Agent
**For:** MJ_Online Project (mikejones.online)
