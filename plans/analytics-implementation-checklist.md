# Analytics Implementation Checklist

**Phase:** 2.5 - Analytics Configuration
**Date:** 2026-01-28
**Estimated Time:** 1.5 hours
**Recommendation:** Ghost Built-in Analytics (included with Ghost Pro)

---

## Quick Start Checklist

### ✅ Phase 1: Verify Ghost Analytics (5 minutes)

- [ ] Log into Ghost Admin dashboard at `https://yourdomain.com/ghost`
- [ ] Navigate to **Analytics** in left sidebar
- [ ] Verify analytics dashboard is visible and showing data
- [ ] Check for real-time visitor count
- [ ] Review available metrics: visitors, page views, top posts
- [ ] Confirm Ghost Analytics is enabled by default

**Expected Result:** Analytics dashboard showing current site metrics

---

### ✅ Phase 2: Configure Resume Download Tracking (30 minutes)

**Option A: Simple Page View Tracking (Recommended for MVP)**

- [ ] Create a dedicated page at `/resume-download` that serves the PDF
- [ ] Add download button/link that navigates to this page
- [ ] Track page views in Ghost Analytics
- [ ] Test by clicking button and verifying page view in Analytics

**Option B: Custom Event Tracking (Advanced)**

- [ ] Navigate to **Settings → Code injection**
- [ ] Add tracking script to **Site Footer**:

```html
<script>
// Resume download tracking
document.addEventListener('DOMContentLoaded', function() {
    const resumeButtons = document.querySelectorAll('a[href*="resume.pdf"], a[href*="cv.pdf"], .resume-download');

    resumeButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            console.log('Resume download initiated:', this.href);

            // Optional: Send to backend for tracking
            // fetch('/api/track-event', {
            //     method: 'POST',
            //     headers: {'Content-Type': 'application/json'},
            //     body: JSON.stringify({event: 'resume_download', url: this.href})
            // });
        });
    });
});
</script>
```

- [ ] Save code injection
- [ ] Test resume download button
- [ ] Check browser console for log message
- [ ] Verify tracking working

---

### ✅ Phase 3: Configure Contact Form Tracking (15 minutes)

**If Using Ghost Native Forms:**
- [ ] Verify form submissions automatically tracked in Ghost Analytics
- [ ] Check **Settings → Analytics → Members** for form submissions

**If Using External Form Service (Formspree, Tally):**
- [ ] Add tracking script to **Settings → Code injection → Site Footer**:

```html
<script>
// Contact form tracking
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('form[action*="contact"], .contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            console.log('Contact form submitted');
        });
    }
});
</script>
```

- [ ] Test form submission
- [ ] Verify console log appears
- [ ] Track contact page views in Analytics as proxy metric

---

### ✅ Phase 4: Configure Project Case Study Tracking (10 minutes)

- [ ] Ensure all project posts are tagged with `#projects` tag in Ghost
- [ ] Navigate to **Analytics → Posts**
- [ ] Filter by tag: `projects` (if available)
- [ ] Sort by page views to see most popular projects
- [ ] Bookmark this view for regular monitoring

**No additional code required** - Ghost automatically tracks individual post views.

---

### ✅ Phase 5: Test All Analytics (15 minutes)

**Basic Tracking Test:**
- [ ] Open site in incognito/private browser window
- [ ] Navigate to homepage
- [ ] Visit 2-3 different pages
- [ ] Visit a project case study
- [ ] Check Ghost Admin → Analytics → Overview
- [ ] Verify real-time visitor count increased
- [ ] Verify page views recorded

**Resume Download Test:**
- [ ] Click resume download button/link
- [ ] Check browser console (F12) for log message
- [ ] Check Analytics for `/resume` or `/resume-download` page views
- [ ] Verify tracking working

**Contact Form Test:**
- [ ] Navigate to contact page
- [ ] Check Analytics for contact page views
- [ ] (Optional) Submit test contact form
- [ ] Verify console log if custom tracking added

**Project Views Test:**
- [ ] Visit 2-3 project pages
- [ ] Check Analytics → Posts
- [ ] Verify project page views incrementing
- [ ] Check that sorting by views works

---

### ✅ Phase 6: Document Analytics Access (5 minutes)

Create quick reference guide:

**How to Access Analytics:**
1. Go to `https://yourdomain.com/ghost`
2. Click **Analytics** in left sidebar
3. Available sections:
   - **Overview:** Site-wide traffic metrics
   - **Posts:** Individual post performance
   - **Members:** Subscriber growth
   - **Newsletter:** Email performance

**Key Metrics Dashboard:**
- [ ] Bookmark Analytics dashboard
- [ ] Note key metrics to monitor weekly:
  - Unique visitors
  - Top performing posts
  - Resume page views (as proxy for downloads)
  - Contact page views
  - Project case study engagement

**Regular Monitoring Schedule:**
- [ ] Weekly: Check overview metrics
- [ ] Bi-weekly: Review top posts
- [ ] Monthly: Analyze trends and adjust content strategy

---

## Verification Checklist

After implementation, verify all these are working:

- [ ] ✅ Ghost Analytics dashboard accessible
- [ ] ✅ Real-time visitor tracking working
- [ ] ✅ Page view tracking accurate
- [ ] ✅ Resume download tracking configured
- [ ] ✅ Contact form engagement trackable
- [ ] ✅ Project case study views visible
- [ ] ✅ Top content reports available
- [ ] ✅ Traffic sources visible
- [ ] ✅ Member/subscriber tracking enabled (if using memberships)
- [ ] ✅ Privacy compliance verified (GDPR)
- [ ] ✅ No cookie consent banner needed (cookie-free tracking)
- [ ] ✅ Analytics access documented
- [ ] ✅ Test visits confirmed in dashboard

---

## Configuration Summary

**Analytics Platform:** Ghost Built-in Analytics (native)
**Cost:** $0 (included with Ghost Pro)
**Setup Time:** ~1.5 hours
**Privacy Compliance:** GDPR compliant, cookie-free, EU-hosted
**Data Location:** EU servers (Ghost Pro)
**Tracking Method:** First-party, cookie-free
**Dashboard Access:** Ghost Admin → Analytics

**Custom Tracking Implemented:**
- Resume downloads (via page views or custom events)
- Contact form submissions (via page views)
- Project case study views (automatic)

---

## Troubleshooting

**Issue: Analytics dashboard not showing data**
- Solution: Wait 10-15 minutes for data collection to start
- Solution: Verify you're on Publisher plan or higher
- Solution: Check if Ghost Analytics is enabled in Settings

**Issue: Real-time visitors not updating**
- Solution: Clear browser cache and refresh
- Solution: Wait 1-2 minutes for real-time sync
- Solution: Verify you're not blocking your own visits (check if Ghost is filtering your IP)

**Issue: Resume download tracking not working**
- Solution: Check browser console for JavaScript errors
- Solution: Verify script is in Site Footer (not Site Header)
- Solution: Check that resume button has correct class/href selector
- Solution: Use page view tracking as fallback

**Issue: Project views not appearing**
- Solution: Ensure posts are published (not drafts)
- Solution: Check that posts have correct `#projects` tag
- Solution: Wait for page views to accumulate (may take hours)

---

## Next Steps After Analytics Setup

1. **Collect Baseline Data (Week 1-2):**
   - Monitor daily to ensure tracking is working
   - Identify any tracking gaps
   - Note which content gets early traction

2. **First Analysis (Week 3-4):**
   - Review top performing content
   - Identify traffic sources
   - Check resume download engagement
   - Analyze project case study popularity

3. **Optimize Based on Data (Month 2):**
   - Improve popular content (add more detail, better CTAs)
   - Create similar content to top performers
   - Optimize resume download placement if engagement low
   - Enhance underperforming projects with better descriptions

4. **Consider Advanced Analytics (Month 3+):**
   - If Ghost Analytics proves insufficient, evaluate:
     - Plausible Analytics ($9/mo) for more granular event tracking
     - Fathom Analytics ($14/mo) for uptime monitoring + analytics
     - Custom analytics backend for complete control

---

## Future Enhancements (Optional)

**If you need more advanced tracking later:**

1. **Add Plausible Analytics ($9/mo):**
   - More granular event tracking
   - Custom goals and conversions
   - API access for custom reports
   - Integration: Settings → Code injection → Site header

2. **Build Custom Analytics Backend:**
   - Track custom events via API endpoint
   - Store in database (PostgreSQL, MongoDB)
   - Create custom dashboards
   - Full control over data

3. **Add Heatmap Tracking:**
   - Use Hotjar or Microsoft Clarity (free)
   - Understand user behavior visually
   - Optimize page layouts based on clicks

4. **Implement A/B Testing:**
   - Test different resume CTA placements
   - Optimize project case study layouts
   - Improve conversion rates

---

## Privacy Policy Update (If Needed)

**For Ghost Built-in Analytics:** No privacy policy update needed (first-party, anonymous tracking)

**If Adding External Analytics (Plausible, Fathom):** Add to privacy policy:

> **Analytics**
>
> We use privacy-friendly analytics to understand how visitors interact with our site. We collect anonymized data including page views, referral sources, and device types. No personal information is collected, and we do not use cookies for tracking. Analytics data is processed by [Analytics Provider] and stored in the EU in compliance with GDPR.
>
> You can opt out of analytics tracking by enabling "Do Not Track" in your browser settings.

---

## Success Criteria

**Phase 2.5 Complete When:**

- [x] Analytics research completed
- [x] Implementation guide created (ANALYTICS-IMPLEMENTATION-GUIDE.md)
- [x] Quick-start checklist created (ANALYTICS-QUICKSTART.md)
- [ ] Ghost Analytics verified and active (requires manual login)
- [ ] Resume download tracking implemented (page view method)
- [ ] Contact form tracking configured (automatic)
- [ ] Project view tracking confirmed (automatic)
- [ ] Test visits recorded successfully
- [ ] Analytics dashboard access verified
- [ ] Privacy compliance verified (Ghost Pro is GDPR compliant)
- [ ] Ready for content publishing (Phase 3)

---

## Time Estimate Breakdown

| Task | Estimated Time | Actual Time |
|------|----------------|-------------|
| Research analytics options | 45 min | _____ |
| Verify Ghost Analytics | 5 min | _____ |
| Configure resume tracking | 30 min | _____ |
| Configure contact tracking | 15 min | _____ |
| Configure project tracking | 10 min | _____ |
| Test all analytics | 15 min | _____ |
| Document access & usage | 5 min | _____ |
| **Total** | **2 hours 5 min** | **_____** |

---

**Status:** Ready for implementation
**Assignee:** Can be executed by user or browser automation agent
**Prerequisites:** Ghost Pro admin access
**Dependencies:** None (can run in parallel with theme selection)
**Blocks:** None (analytics independent of other Phase 2 tasks)

---

## Related Documents

- Full research: `/plans/analytics-setup-research.md`
- Ghost Pro setup: `/plans/ghost-pro-setup-guide.md`
- Project roadmap: `/plans/roadmap-ghost-pro.md`
