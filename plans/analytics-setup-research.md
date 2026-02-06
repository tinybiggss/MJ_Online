# Analytics Setup Research & Implementation Guide

**Date:** 2026-01-28
**Phase:** 2.5 - Analytics Configuration
**Status:** Research Complete - Ready for Implementation

---

## Executive Summary

**Recommendation:** Use Ghost's Built-in Analytics (included with Ghost Pro)

**Rationale:**
- Included free with Publisher plan and higher on Ghost(Pro)
- Privacy-first, GDPR-compliant, cookie-free tracking
- First-party data collection (no external dependencies)
- Real-time analytics with audience segmentation
- Zero additional setup required
- EU-hosted data storage

**For Event Tracking:** Add custom events using Ghost's built-in capabilities + minimal custom JavaScript if needed for resume downloads.

---

## Analytics Options Research

### Option 1: Ghost Built-in Analytics (Recommended)

**Overview:**
Ghost 6.0 introduced native analytics powered by Tinybird and ClickHouse, providing a comprehensive, privacy-first analytics platform directly integrated into the Ghost admin dashboard.

**Key Features:**
- **Privacy-First Design:**
  - Cookie-free tracking (no consent banners required)
  - First-party data collection
  - All data served through your own domain
  - EU data storage for Ghost(Pro) sites
  - GDPR compliant out of the box

- **Core Metrics:**
  - Unique visitors (24-hour window deduplication)
  - Total page views
  - Real-time monitoring
  - Audience segmentation (public, free members, paid members)
  - Post performance tracking
  - Newsletter analytics

- **Cost:** Free (included with Ghost(Pro) Publisher plan and higher)

- **Technical Implementation:**
  - Automatic tracking script injection
  - No manual code required
  - Powered by ClickHouse database via Tinybird partnership

**Pros:**
- Zero additional cost
- Zero setup time
- Native integration with Ghost dashboard
- Privacy-compliant by default
- No external dependencies
- Real-time data
- Audience segmentation built-in

**Cons:**
- Less granular than dedicated analytics platforms
- Limited event tracking capabilities (can be extended with custom code)
- No funnel analysis or advanced user journey tracking
- Tied to Ghost platform

**Sources:**
- [Ghost 6.0 Changelog](https://ghost.org/changelog/6/)
- [Native Analytics in Ghost](https://ghost.org/help/native-analytics/)
- [Tinybird Partnership Announcement](https://www.tinybird.co/blog-posts/tinybird-is-the-analytics-platform-for-ghost-6-0)

---

### Option 2: Plausible Analytics

**Overview:**
Lightweight, open-source, privacy-focused analytics platform with excellent Ghost integration.

**Key Features:**
- Ultra-lightweight script (<1 KB)
- GDPR, CCPA, ePrivacy, PECR, COPPA compliant
- Open source (can be self-hosted)
- Custom event tracking
- Goal conversions
- API access
- Slack notifications for traffic spikes
- Organic search query reports

**Pricing:**
- Starts at $9/month (up to 10K monthly page views)
- Scales with traffic volume
- Self-hosted option available (free, but requires infrastructure)

**Integration:**
- Simple script injection via Ghost admin → Settings → Code injection
- Official Ghost integration available

**Pros:**
- Very fast loading (minimal site performance impact)
- Beautiful, simple dashboard
- Can be self-hosted for complete data control
- Strong API for custom reporting
- Active development and community

**Cons:**
- Additional monthly cost
- Requires manual script injection
- External dependency (unless self-hosted)
- Self-hosting requires technical setup and maintenance

**Sources:**
- [Ghost Forum Discussion](https://forum.ghost.org/t/fathom-plausible-simple-analytics-which-is-the-best-privacy-focused-google-analytics-alternative/22223)
- [Privacy-Friendly Analytics Comparison](https://layeredcraft.com/blog/5-privacy-friendly-analytics-platforms-for-ghost/)
- [DEV Community Comparison](https://dev.to/hmhrex/a-comparison-of-the-top-3-privacy-focused-analytics-platforms-209m)

---

### Option 3: Fathom Analytics

**Overview:**
Privacy-first analytics with beautiful dashboard and unique features like uptime monitoring.

**Key Features:**
- Cookie-free tracking
- GDPR, CCPA, ePrivacy, PECR, COPPA compliant
- Uptime monitoring built-in
- Custom events and goals
- Public dashboard option
- Email reports
- Multiple sites support

**Pricing:**
- Starts at $14/month (up to 100K page views)
- More expensive than Plausible
- 7-day free trial

**Integration:**
- Script injection via Ghost code injection
- Official Ghost integration

**Pros:**
- Beautiful, intuitive dashboard
- Built-in uptime monitoring (bonus feature)
- Current visitor details, average time on site, bounce rate
- Can make dashboard public
- Excellent customer support

**Cons:**
- Higher cost than Plausible
- No Google Search Keywords integration
- No custom domain support (increases ad blocker interference)
- External dependency

**Sources:**
- [Ghost Forum Discussion](https://forum.ghost.org/t/fathom-plausible-simple-analytics-which-is-the-best-privacy-focused-google-analytics-alternative/22223)
- [Analytics Platform Comparison](https://allisonseboldt.com/replacing-universal-analytics-plausible-vs-fathom-vs-simple-analytics/)

---

### Option 4: Simple Analytics

**Overview:**
Privacy-first analytics with custom domain support to reduce ad blocker interference.

**Key Features:**
- GDPR compliant
- Custom domain support
- Event tracking
- API access
- Automated reports

**Pricing:**
- Most expensive of the three main competitors
- Starts at $19/month

**Integration:**
- Script injection via Ghost code injection

**Pros:**
- Custom domain support (helps with ad blockers)
- Simple, clean interface
- Privacy-compliant

**Cons:**
- Highest cost
- No unique visitor tracking (only total views)
- Less feature-rich than competitors
- External dependency

**Sources:**
- [Ghost Forum Discussion](https://forum.ghost.org/t/fathom-plausible-simple-analytics-which-is-the-best-privacy-focused-google-analytics-alternative/22223)

---

### Option 5: Matomo (Self-Hosted)

**Overview:**
Open-source analytics platform with complete data control.

**Key Features:**
- GDPR compliant
- Self-hosted or cloud options
- Complete data ownership
- Advanced features (heatmaps, session recording, A/B testing)

**Pricing:**
- Free (self-hosted)
- Cloud hosting starts at $19/month

**Integration:**
- Requires server setup (if self-hosted)
- Script injection

**Pros:**
- Complete data control
- Very feature-rich
- No data sharing with third parties
- On-premise hosting option

**Cons:**
- Complex setup and maintenance (self-hosted)
- Requires additional infrastructure
- Heavier script than privacy-focused alternatives
- Overkill for a personal portfolio site

**Sources:**
- [GDPR Compliant Analytics Tools 2026](https://www.mitzu.io/post/best-privacy-compliant-analytics-tools-for-2026)
- [GDPR Analytics Comparison](https://improvado.io/blog/gdpr-compliant-analytics-tools)

---

## Recommendation Matrix

| Feature | Ghost Built-in | Plausible | Fathom | Simple Analytics | Matomo |
|---------|----------------|-----------|--------|------------------|---------|
| **Cost** | Free | $9/mo | $14/mo | $19/mo | Free/€19/mo |
| **Setup Time** | 0 min | 5 min | 5 min | 5 min | 60+ min |
| **Privacy/GDPR** | ✅ Excellent | ✅ Excellent | ✅ Excellent | ✅ Good | ✅ Excellent |
| **Performance** | ✅ Native | ✅ <1KB | ✅ Light | ✅ Light | ⚠️ Heavier |
| **Event Tracking** | ⚠️ Limited | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Advanced |
| **Real-time** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Maintenance** | None | None | None | None | High (self-hosted) |
| **Dashboard** | Ghost Admin | External | External | External | Self-hosted |
| **Best For** | Portfolio sites | Growth-focused | Business sites | Privacy purists | Enterprises |

---

## Final Recommendation: Ghost Built-in Analytics

**Why Ghost Built-in Analytics is the Best Choice:**

1. **Zero Cost:** Already included in your Ghost Pro plan
2. **Zero Setup:** Automatically enabled and collecting data
3. **Privacy-First:** GDPR compliant, cookie-free, EU-hosted data
4. **Native Integration:** Built into Ghost admin dashboard
5. **Sufficient Features:** Covers all your stated needs:
   - Page views and popular content ✅
   - Traffic sources ✅
   - Member tracking ✅
   - Real-time monitoring ✅
6. **No External Dependencies:** Everything stays within Ghost ecosystem
7. **Zero Maintenance:** Ghost handles all updates and infrastructure

**For Your Use Case (Career Portfolio):**
- You need to track resume downloads → Custom event (small JS addition)
- You need popular content metrics → Built-in
- You need traffic sources → Built-in
- You need to see which projects get most views → Built-in

**When to Reconsider:**
- If you need advanced funnel analysis → Consider Plausible
- If you need detailed user journey tracking → Consider Plausible or Matomo
- If you need A/B testing → Consider Matomo
- If you need detailed conversion tracking → Consider Plausible or Fathom

---

## Implementation Plan

### Phase 1: Verify Ghost Analytics is Active (5 minutes)

1. Log into Ghost Admin dashboard
2. Navigate to **Settings → Analytics** (or check left sidebar for Analytics)
3. Verify that Ghost Analytics is enabled
4. Review available metrics
5. Confirm data is being collected

**Expected Output:**
- Analytics dashboard showing current visitors, page views, top posts
- Real-time data collection visible

### Phase 2: Configure Event Tracking for Resume Downloads (30 minutes)

**Goal:** Track when users download your resume PDF

**Implementation Options:**

**Option A: Simple Link Tracking (No Code)**
1. Host resume as a Ghost page with a download button
2. Track page views in Ghost Analytics
3. Infer downloads from page views to `/resume-download` page

**Option B: Custom Event Tracking (Recommended)**
1. Add tracking script to Ghost code injection
2. Capture resume download button clicks
3. Send custom event to analytics

**Implementation Steps:**

1. Navigate to Ghost Admin → **Settings → Code injection**
2. Add to **Site Footer** section:

```html
<script>
// Resume download tracking
document.addEventListener('DOMContentLoaded', function() {
    // Track resume download button clicks
    const resumeButtons = document.querySelectorAll('a[href*="resume"], a[href*="cv"], .resume-download');

    resumeButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            const fileName = this.href.split('/').pop();

            // Send event to analytics (if custom analytics API available)
            if (typeof plausible !== 'undefined') {
                plausible('Resume Download', {props: {file: fileName}});
            } else if (typeof fathom !== 'undefined') {
                fathom.trackGoal('RESUME_DOWNLOAD', 0);
            }

            // Also log to console for verification
            console.log('Resume downloaded:', fileName);
        });
    });
});
</script>
```

3. If using Ghost built-in analytics only (no external service), track via page views:
   - Create dedicated resume download page: `/resume-download`
   - Button redirects to download page before serving file
   - Track page views in Ghost Analytics

**Simpler Approach for Ghost Analytics:**

```html
<script>
// Simple resume download tracking for Ghost
document.addEventListener('DOMContentLoaded', function() {
    const resumeButtons = document.querySelectorAll('a[href*="resume.pdf"], a[href*="cv.pdf"]');

    resumeButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            // Log to console for debugging
            console.log('Resume download initiated');

            // Could also send to a backend endpoint for tracking
            // fetch('/api/track-download', {method: 'POST', body: JSON.stringify({type: 'resume'})});
        });
    });
});
</script>
```

### Phase 3: Configure Event Tracking for Contact Form (15 minutes)

**Goal:** Track contact form submissions

**Implementation:**

1. If using Ghost's native forms → automatic tracking in Ghost Analytics
2. If using external form (Formspree, Tally) → add tracking code:

```html
<script>
// Contact form submission tracking
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('form[action*="contact"], .contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            console.log('Contact form submitted');

            // Track with external analytics if available
            if (typeof plausible !== 'undefined') {
                plausible('Contact Form Submitted');
            }
        });
    }
});
</script>
```

### Phase 4: Configure Project Case Study Tracking (10 minutes)

**Goal:** Track which project case studies are most popular

**Implementation:**

1. Tag all project posts with `#projects` tag in Ghost
2. View analytics filtered by tag: Settings → Analytics → Filter by tag: projects
3. Sort by page views to see most popular projects

**No Additional Code Required** - Ghost Analytics automatically tracks page views per post.

### Phase 5: Test Analytics (15 minutes)

**Testing Checklist:**

1. **Basic Tracking:**
   - [ ] Visit your site in incognito/private window
   - [ ] Navigate to several pages
   - [ ] Check Ghost Admin → Analytics → Real-time visitors shows your activity
   - [ ] Verify page view counts increment

2. **Resume Download Tracking:**
   - [ ] Click resume download button
   - [ ] Check browser console for "Resume download initiated" log
   - [ ] Verify tracking (if using external analytics)
   - [ ] Check Ghost Analytics for `/resume-download` page views

3. **Contact Form Tracking:**
   - [ ] Submit test contact form
   - [ ] Verify console log shows submission
   - [ ] Check analytics for contact page views

4. **Project Views:**
   - [ ] Visit project case study pages
   - [ ] Check Analytics → Posts to see view counts
   - [ ] Filter by #projects tag

### Phase 6: Document Analytics Access (5 minutes)

**How to Access Analytics:**

1. Log into Ghost Admin: `https://yourdomain.com/ghost`
2. Click **Analytics** in left sidebar (or Settings → Analytics)
3. Available views:
   - **Overview:** Overall site traffic, top posts
   - **Posts:** Individual post performance
   - **Members:** Subscriber growth and engagement
   - **Newsletter:** Email open rates, click rates

**Key Metrics to Monitor:**

- **Unique Visitors:** Total unique people visiting your site
- **Page Views:** Total views (including repeat visits)
- **Top Posts:** Most popular content
- **Traffic Sources:** Where visitors come from (search, direct, referral, social)
- **Member Signups:** Newsletter subscriber growth
- **Newsletter Performance:** Open rates, click rates

**Setting Up Regular Reports:**

Ghost Analytics provides real-time data in the dashboard. For regular monitoring:
1. Check Analytics dashboard weekly
2. Review top-performing content monthly
3. Track resume download page views
4. Monitor contact form page engagement

---

## Alternative: Add Plausible Later (Optional)

If you find Ghost Analytics insufficient after launch, you can easily add Plausible later:

**Steps to Add Plausible:**
1. Sign up at plausible.io
2. Get your tracking script
3. Add to Ghost: Settings → Code injection → Site header:
```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```
4. Configure custom events for resume downloads:
```javascript
plausible('Resume Download', {props: {file: 'resume.pdf'}});
```

**Cost:** $9/month for up to 10K monthly page views

---

## Privacy & GDPR Compliance

**Ghost Analytics Privacy Features:**
- **Cookie-free:** No consent banners required
- **First-party tracking:** All data served from your domain
- **EU data storage:** Compliant with GDPR
- **Anonymous tracking:** No personal data collected
- **24-hour visitor windows:** Privacy-preserving deduplication

**No Additional Privacy Policy Changes Needed** for Ghost built-in analytics.

If you add external analytics (Plausible, Fathom, etc.), update your privacy policy to mention the third-party service.

---

## Success Metrics

**Phase 2 Analytics Setup Success Criteria:**

- [ ] Ghost Analytics verified as active and collecting data
- [ ] Real-time visitor tracking working
- [ ] Resume download tracking implemented (via page views or custom events)
- [ ] Contact form engagement trackable via page views
- [ ] Project case study views visible in Analytics dashboard
- [ ] Analytics access documented
- [ ] Test visits confirmed in dashboard
- [ ] Privacy compliance verified (GDPR)

---

## Next Steps After Analytics Setup

1. **Monitor for 2 weeks:** Collect baseline data
2. **Identify top content:** See which projects/posts get most views
3. **Optimize popular content:** Improve high-traffic pages
4. **Track resume downloads:** Monitor career interest
5. **Iterate on content strategy:** Create more of what resonates

---

## Resources

**Documentation:**
- [Ghost Native Analytics Guide](https://ghost.org/help/native-analytics/)
- [Ghost 6.0 Release Notes](https://ghost.org/changelog/6/)
- [Ghost GDPR Compliance](https://ghost.org/help/ghost-gdpr-compliance/)

**Alternative Analytics Platforms:**
- [Plausible Analytics](https://plausible.io)
- [Fathom Analytics](https://usefathom.com)
- [Simple Analytics](https://simpleanalytics.com)
- [Matomo](https://matomo.org)

**Comparison Articles:**
- [Ghost Forum: Privacy-Focused Analytics Discussion](https://forum.ghost.org/t/fathom-plausible-simple-analytics-which-is-the-best-privacy-focused-google-analytics-alternative/22223)
- [LayeredCraft: 5 Privacy-Friendly Analytics for Ghost](https://layeredcraft.com/blog/5-privacy-friendly-analytics-platforms-for-ghost/)
- [DEV: Top 3 Privacy-Focused Analytics Comparison](https://dev.to/hmhrex/a-comparison-of-the-top-3-privacy-focused-analytics-platforms-209m)

---

**Status:** Ready for implementation
**Next Action:** Verify Ghost Analytics in admin dashboard
**Estimated Time:** 1.5 hours total (mostly testing)
