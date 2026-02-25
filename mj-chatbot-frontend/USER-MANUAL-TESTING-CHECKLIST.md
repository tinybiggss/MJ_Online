# Manual Browser Testing - User Checklist

**Task #9 Status:** Chrome complete (automated), remaining browsers require manual testing
**Your Action:** Test widget in Firefox, Safari, and Edge when you have access to those browsers

---

## Quick Start

### 1. Start Local Server
```bash
cd /Users/michaeljones/Dev/MJ_Online/mj-chatbot-frontend
python3 -m http.server 8000
```

### 2. Open Test Pages

**Automated Testing:**
- Open: `http://localhost:8000/browser-compatibility-test.html`
- Click "Run All Tests"
- Click "Export Results" to save JSON file

**Manual Functional Testing:**
- Open: `http://localhost:8000/test.html`
- Test widget functionality per checklist below

---

## Browsers to Test

### ☐ Firefox
**Instructions:** See CROSS-BROWSER-TESTING-GUIDE.md → Firefox section
**Quick checklist:**
- [ ] Open browser-compatibility-test.html, run tests, export results
- [ ] Open test.html, verify widget loads and works
- [ ] Check console for errors (F12)
- [ ] Test keyboard navigation (Tab, Enter, ESC)
- [ ] Verify animations are smooth
- [ ] Take screenshot of chat window

**Expected:** 90%+ compatibility score, all features working

---

### ☐ Safari (Desktop)
**Instructions:** See CROSS-BROWSER-TESTING-GUIDE.md → Safari section
**Quick checklist:**
- [ ] Open browser-compatibility-test.html, run tests, export results
- [ ] Open test.html, verify widget loads and works
- [ ] Check Web Inspector console for errors
- [ ] Test keyboard navigation
- [ ] Verify animations are smooth
- [ ] Take screenshot of chat window

**Watch for:** dvh unit support (may show fallback warning), -webkit- prefixes

---

### ☐ Safari (iOS) - CRITICAL for Mobile
**Instructions:** See CROSS-BROWSER-TESTING-GUIDE.md → Safari iOS section
**Quick checklist:**
- [ ] Open test.html on iPhone/iPad
- [ ] Verify full-screen takeover (100% width/height)
- [ ] Test with virtual keyboard (type message)
- [ ] Verify keyboard doesn't cover input field
- [ ] Test touch targets (should be easy to tap)
- [ ] Test scroll behavior
- [ ] Take screenshots (with and without keyboard)

**Critical:** Must test on real device, simulator may not catch all issues

---

### ☐ Microsoft Edge
**Instructions:** See CROSS-BROWSER-TESTING-GUIDE.md → Edge section
**Quick checklist:**
- [ ] Open browser-compatibility-test.html, run tests, export results
- [ ] Open test.html, verify widget loads and works
- [ ] Should match Chrome exactly (same engine)

**Expected:** 97% compatibility score (same as Chrome)

---

## Functional Test Checklist (All Browsers)

For each browser, verify:
- [ ] Widget bubble appears in bottom-right corner
- [ ] Bubble opens chat window on click
- [ ] Greeting message displays with suggestion chips
- [ ] Clicking suggestion chip sends message
- [ ] Typing in input field works
- [ ] Send button works
- [ ] Messages display (user and bot)
- [ ] Typing indicator shows during API response
- [ ] Close button closes window
- [ ] Minimize button minimizes window
- [ ] ESC key closes window
- [ ] Tab key navigates through elements
- [ ] Enter key activates buttons
- [ ] No console errors

---

## When You Find Issues

**If something doesn't work:**

1. **Check browser console** (F12 or Cmd+Option+I)
   - Copy any error messages

2. **Take screenshots**
   - What you see vs. what you expected
   - Especially visual differences

3. **Document in new file:** `[BROWSER]-ISSUES-FOUND.md`
   - Browser version
   - Issue description
   - Steps to reproduce
   - Screenshots
   - Console errors

4. **We'll fix together** when you report findings

---

## When All Browsers Pass

**Create:** `CROSS-BROWSER-SUMMARY.md` with:
- All browser versions tested
- Compatibility scores (from exported JSON)
- Any minor visual differences noted
- Overall verdict: Production ready ✅

**Mark Task #9 as complete** in roadmap

---

## Questions?

Refer to **CROSS-BROWSER-TESTING-GUIDE.md** for detailed instructions on each browser.

**Chrome baseline:** 97% compatibility, all features working perfectly

---

**Your Goal:** Verify widget works in all major browsers before production deployment
**Estimated Time:** ~2-3 hours total (across all browsers)
