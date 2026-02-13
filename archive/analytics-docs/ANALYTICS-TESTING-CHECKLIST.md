# Analytics Testing Checklist

**Use this checklist after completing the Ghost Analytics setup to verify everything works.**

---

## Pre-Test Preparation

- [ ] Ghost Analytics dashboard accessed at: https://mikejones.online/ghost → Analytics
- [ ] Resume page confirmed published at: /resume/
- [ ] About page confirmed published
- [ ] At least 1-2 project posts published

---

## Test 1: Basic Analytics Dashboard (2 minutes)

**Verify dashboard accessibility and basic functionality**

- [ ] Analytics section visible in Ghost Admin left sidebar
- [ ] Analytics overview page loads without errors
- [ ] Dashboard shows sections for: Visitors, Page Views, Top Content
- [ ] Real-time visitor count visible (may show 0 if no current visitors)
- [ ] Date range selector working (if available)

**Expected Result:** Dashboard fully functional and displaying metrics (or zeros if new site)

---

## Test 2: Page View Tracking (5 minutes)

**Verify that Ghost tracks page views correctly**

### Step 1: Generate Test Traffic
1. Open **new incognito/private browser window**
2. Navigate to: https://mikejones.online
3. Stay on homepage for 10 seconds
4. Navigate to About page
5. Stay for 10 seconds
6. Navigate to Resume page
7. Stay for 10 seconds
8. Close incognito window

### Step 2: Verify Tracking
Wait 2-3 minutes for data to sync, then check:

- [ ] Analytics → Overview shows visitor count increased by 1
- [ ] Total page views increased by 3 (homepage, about, resume)
- [ ] Analytics → Pages section shows individual page views
- [ ] Homepage view count increased
- [ ] About page view count increased
- [ ] Resume page view count increased

**Expected Result:** All visited pages show increased view counts

---

## Test 3: Resume Download Tracking (3 minutes)

**Verify resume page views are trackable as download interest proxy**

### Step 1: Access Resume Analytics
- [ ] Go to: Analytics → Pages
- [ ] Locate "Resume" page in the list
- [ ] View count is visible

### Step 2: Generate Resume Views
1. Open new incognito window
2. Navigate directly to: https://mikejones.online/resume/
3. Stay for 10-15 seconds
4. Close window
5. Wait 2 minutes

### Step 3: Verify Resume Tracking
- [ ] Resume page view count increased by 1
- [ ] View is recorded in Analytics → Pages

**Expected Result:** Resume page views increment correctly, serving as proxy for download interest

---

## Test 4: Project Post Tracking (3 minutes)

**Verify project case study views are tracked**

### Step 1: Visit Project Posts
1. Open incognito window
2. Navigate to a project post/page
3. Stay for 10-15 seconds
4. Navigate to another project post
5. Stay for 10-15 seconds
6. Close window

### Step 2: Verify Project Tracking
Wait 2 minutes, then check:

- [ ] Go to: Analytics → Posts
- [ ] Sort by page views (if option available)
- [ ] Visited project posts show increased view counts
- [ ] Can identify which projects are being viewed

**Expected Result:** Project posts track views individually

---

## Test 5: Real-Time Tracking (3 minutes)

**Verify real-time visitor detection**

### Step 1: Create Active Visitor
1. Open incognito window
2. Navigate to: https://mikejones.online
3. Keep window open

### Step 2: Check Real-Time Count
- [ ] Go to Analytics dashboard in Ghost Admin
- [ ] Check real-time visitor count section
- [ ] Count should show "1" or higher

### Step 3: Verify Visitor Leaves
1. Close incognito window
2. Wait 1-2 minutes
3. Refresh Analytics dashboard

- [ ] Real-time visitor count decreased

**Expected Result:** Real-time visitor count reflects active visitors accurately

---

## Test 6: Contact Page Tracking (2 minutes)

**Verify contact page views are tracked**

### Step 1: Visit Contact Page
1. Open incognito window
2. Navigate to: https://mikejones.online/contact/ (or your contact page URL)
3. Stay for 10 seconds
4. Close window

### Step 2: Verify Contact Tracking
Wait 2 minutes, then:

- [ ] Go to: Analytics → Pages
- [ ] Locate contact page
- [ ] View count increased

**Expected Result:** Contact page views tracked (proxy for contact interest)

---

## Test 7: Multi-Page Session (5 minutes)

**Verify session tracking with multiple page views**

### Step 1: Simulate Real User Session
1. Open incognito window
2. Navigate to: https://mikejones.online
3. Browse naturally:
   - Homepage (10 seconds)
   - About page (15 seconds)
   - Project post 1 (20 seconds)
   - Project post 2 (20 seconds)
   - Resume page (15 seconds)
   - Contact page (10 seconds)
4. Close window

### Step 2: Verify Session Tracking
Wait 3 minutes, then check:

- [ ] Analytics shows 1 visitor (not 6)
- [ ] Total page views increased by 6
- [ ] Individual pages show correct view counts
- [ ] Session duration appears reasonable (if available)

**Expected Result:** Ghost tracks as single session with multiple page views

---

## Test 8: Traffic Sources (Optional - 2 minutes)

**Check if traffic source tracking is available**

- [ ] Go to: Analytics → Sources (or similar section)
- [ ] Check if referral sources are shown
- [ ] Note available traffic source data

**Expected Result:** Traffic sources visible (if feature available in Ghost version)

---

## Test 9: Time-Based Data (2 minutes)

**Verify analytics data persists over time**

### If Testing Same Day:
- [ ] Check "Today" metrics show test visits
- [ ] Verify data is accumulating

### If Testing Next Day:
- [ ] Check "Yesterday" metrics show previous test visits
- [ ] Verify "All time" metrics include all historical data
- [ ] Confirm data persists and isn't lost

**Expected Result:** Data persists correctly across time periods

---

## Test 10: Dashboard Bookmarking (1 minute)

**Ensure easy access for ongoing monitoring**

- [ ] Bookmark: https://mikejones.online/ghost (Analytics section)
- [ ] Verify bookmark works
- [ ] Consider bookmarking specific sections:
  - Analytics overview
  - Analytics → Pages (for resume tracking)
  - Analytics → Posts (for project tracking)

**Expected Result:** Quick access established for regular monitoring

---

## Verification Summary

After completing all tests, verify:

### Core Functionality
- [ ] Analytics dashboard fully accessible
- [ ] Page views tracked accurately
- [ ] Real-time visitors detected
- [ ] Data persists over time
- [ ] All major pages tracking correctly

### Resume Tracking (Primary Goal)
- [ ] Resume page views visible in Analytics → Pages
- [ ] View counts increment correctly
- [ ] Easy to locate and monitor

### Project Tracking
- [ ] Project posts tracked individually
- [ ] Can sort/filter by views
- [ ] Engagement visible

### Contact Tracking
- [ ] Contact page views visible
- [ ] Tracking accurately

### Usability
- [ ] Dashboard easy to navigate
- [ ] Key metrics easy to find
- [ ] Bookmarks created for quick access

---

## Known Limitations (Normal Behavior)

### Data Sync Delay
- Real-time: 1-2 minutes delay
- Historical: May take 5-10 minutes to appear
- **Solution:** Wait a few minutes after generating test traffic

### Admin Visits May Be Filtered
- Ghost may filter out your logged-in visits
- **Solution:** Always test in incognito/private window

### Zero Metrics on New Site
- Brand new sites show zeros until traffic arrives
- **Solution:** Generate test traffic (tests above) to verify tracking works

### Limited Traffic Source Detail
- Some Ghost versions have limited source tracking
- **Solution:** Focus on page view metrics for MVP

---

## Troubleshooting

### Issue: No data appearing after tests

**Check:**
- [ ] Wait 5-10 minutes (data sync delay)
- [ ] Used incognito window (not logged-in admin)
- [ ] Pages are published (not drafts)
- [ ] Clear browser cache and refresh Analytics dashboard

### Issue: Real-time count not updating

**Check:**
- [ ] Refresh dashboard page
- [ ] Wait 2-3 minutes
- [ ] Verify visitor still on site
- [ ] Check if ad blocker or privacy extension blocking

### Issue: Resume page not showing in Pages list

**Check:**
- [ ] Resume page is published (not draft)
- [ ] Page slug is correct (/resume/)
- [ ] Page has received at least 1 view
- [ ] Look in "All pages" not just "Top pages"

### Issue: Project posts not tracking

**Check:**
- [ ] Posts are published (not drafts)
- [ ] Posts are accessible to non-logged-in users
- [ ] Check Analytics → Posts (not Pages)
- [ ] Wait for views to accumulate

---

## Success Criteria

**Analytics Implementation is Complete When:**

- [x] All 10 tests passed
- [x] Page views tracking accurately
- [x] Resume page views visible and incrementing
- [x] Project posts tracking correctly
- [x] Contact page tracking working
- [x] Real-time visitor detection functional
- [x] Data persists over time
- [x] Dashboard bookmarked for easy access
- [x] No blocking issues or errors

---

## Next Steps After Testing

### Immediate (Week 1)
1. Monitor daily to ensure continued tracking
2. Note baseline metrics
3. Don't make changes yet (let data accumulate)

### Short-term (Week 2-4)
1. Review weekly metrics
2. Identify top performing content
3. Check resume page engagement
4. Note traffic patterns

### Long-term (Month 2+)
1. Analyze trends
2. Optimize based on data
3. Enhance popular content
4. Adjust strategy

---

## Testing Complete Checklist

- [ ] All 10 tests completed
- [ ] All verification items checked
- [ ] Dashboard bookmarked
- [ ] Monitoring schedule established
- [ ] Analytics implementation documented as complete
- [ ] Ready for content publishing and monitoring

---

**Testing Time:** 30-35 minutes total
**Status:** Use this checklist after manual Ghost Analytics setup
**Result:** Verified, functional analytics tracking for mikejones.online
