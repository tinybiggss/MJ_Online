# MJ Chatbot Widget - Deployment Guide

**Version:** 1.0
**Date:** 2026-02-25
**Target Platform:** Ghost Pro (mikejones.online)
**Backend:** Cloudflare Workers

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Deployment Steps](#deployment-steps)
4. [Configuration](#configuration)
5. [Testing After Deployment](#testing-after-deployment)
6. [Troubleshooting](#troubleshooting)
7. [Rollback Procedure](#rollback-procedure)
8. [Maintenance](#maintenance)

---

## Overview

The MJ Chatbot Widget is a lightweight, self-contained chat widget that integrates with your Ghost Pro site. It provides visitors with an AI-powered conversational interface to learn about Mike Jones, his work, and his services.

### Key Features
- **Zero dependencies:** Self-contained JavaScript (no external libraries)
- **Lightweight:** ~25KB unminified JavaScript + inline CSS
- **Accessible:** WCAG 2.1 AA compliant
- **Responsive:** Mobile-first design with full-screen mobile takeover
- **Fast:** Instant load time, smooth 60fps animations
- **Compatible:** Works in Chrome, Firefox, Safari, Edge

### Architecture
```
┌─────────────────────────────────────┐
│   Ghost Pro (mikejones.online)      │
│   ┌──────────────────────────────┐  │
│   │  HTML Page                   │  │
│   │  ┌────────────────────────┐  │  │
│   │  │ MJ Chatbot Widget      │  │  │
│   │  │ (chatbot-widget.js)    │  │  │
│   │  └───────────┬────────────┘  │  │
│   └──────────────┼───────────────┘  │
└──────────────────┼──────────────────┘
                   │
                   │ HTTPS API calls
                   ↓
┌──────────────────────────────────────┐
│   Cloudflare Workers                 │
│   (mj-chatbot-backend)               │
│   - Session management               │
│   - Rate limiting                    │
│   - Anthropic Claude API integration │
└──────────────────────────────────────┘
```

---

## Prerequisites

### Required Access
- [x] Ghost Pro admin access (mikejones.online)
- [x] Ability to inject code into site header/footer
- [x] Cloudflare Workers backend deployed and running

### Backend Requirements
**The backend MUST be deployed before frontend deployment.**

**Backend URL:** `https://mj-chatbot-backend.YOUR_SUBDOMAIN.workers.dev`
**Verify backend is running:**
```bash
curl https://mj-chatbot-backend.YOUR_SUBDOMAIN.workers.dev/health
# Should return: {"status":"ok","timestamp":"..."}
```

If backend is not deployed, see: `/mj-chatbot-backend/DEPLOYMENT.md`

### Files Needed
- `chatbot-widget.js` - Main widget file (located in `/mj-chatbot-frontend/`)

---

## Deployment Steps

### Step 1: Prepare Widget File

**1.1 Review Configuration**

Open `chatbot-widget.js` and verify the API endpoint:

```javascript
// Line ~11-13 in chatbot-widget.js
const CONFIG = {
  API_URL: 'https://mj-chatbot-backend.YOUR_SUBDOMAIN.workers.dev',
  RATE_LIMIT_COOLDOWN: 60000
};
```

**IMPORTANT:** Replace `YOUR_SUBDOMAIN` with your actual Cloudflare Workers subdomain.

**1.2 (Optional) Minify Widget**

For production, you may want to minify the JavaScript:

```bash
# Using online tools (recommended):
# 1. Go to https://javascript-minifier.com/
# 2. Paste chatbot-widget.js contents
# 3. Copy minified output

# Or using terser (if installed):
npm install -g terser
terser chatbot-widget.js -o chatbot-widget.min.js -c -m
```

**Note:** Minification is optional. The unminified file is only ~25KB and loads instantly.

---

### Step 2: Deploy to Ghost Pro

**2.1 Access Ghost Admin**

1. Go to: `https://mikejones-online.ghost.io/ghost`
2. Log in with your credentials
3. Navigate to: **Settings** → **Code Injection**

**2.2 Add Widget to Site Footer**

In the **Site Footer** section, add the following code:

```html
<!-- MJ Chatbot Widget -->
<script>
(function() {
  // Widget configuration
  const CHATBOT_CONFIG = {
    API_URL: 'https://mj-chatbot-backend.YOUR_SUBDOMAIN.workers.dev',
    RATE_LIMIT_COOLDOWN: 60000,
    WIDGET_POSITION: 'bottom-right', // Options: 'bottom-right', 'bottom-left'
    MOBILE_BREAKPOINT: 768 // px width for mobile full-screen
  };

  // Load widget script
  const script = document.createElement('script');
  script.src = '{{asset "js/chatbot-widget.js"}}';
  script.async = true;
  script.onload = function() {
    if (window.MJChatbot) {
      window.MJChatbot.init(CHATBOT_CONFIG);
    }
  };
  document.body.appendChild(script);
})();
</script>
```

**IMPORTANT:** Replace `YOUR_SUBDOMAIN` with your Cloudflare Workers subdomain.

**2.3 Upload Widget File**

Ghost Pro requires the widget file to be uploaded as a theme asset:

**Option A: Add to Theme (Recommended)**
1. Download your current Kyoto theme
2. Unzip the theme folder
3. Place `chatbot-widget.js` in `assets/js/` folder
4. Re-zip the theme
5. Upload via **Settings** → **Design** → **Upload Theme**

**Option B: Use External Hosting**
If you prefer to host the widget externally:
1. Upload `chatbot-widget.js` to a CDN or static host
2. Update the script src in the footer code:
   ```javascript
   script.src = 'https://your-cdn.com/chatbot-widget.js';
   ```

**2.4 Save Changes**

1. Click **Save** in Code Injection settings
2. Ghost will reload the site with the new code

---

### Step 3: Verify Deployment

**3.1 Visit Your Site**

1. Open: `https://mikejones.online` (in incognito/private window)
2. Look for blue chat bubble in bottom-right corner
3. Click to open chat window

**3.2 Test Basic Functionality**

- [ ] Chat bubble appears
- [ ] Bubble opens chat window
- [ ] Greeting message displays
- [ ] Suggestion chips appear
- [ ] Can send a message
- [ ] Bot responds
- [ ] Close button works

**3.3 Check Browser Console**

1. Open Developer Tools (F12 or Cmd+Option+I)
2. Go to Console tab
3. Look for widget initialization logs:
   ```
   [MJ Chatbot] Document ready, initializing widget
   [MJ Chatbot] Initializing chatbot widget
   [MJ Chatbot] Initialization complete
   ```
4. Verify no error messages

**3.4 Test Mobile**

1. Resize browser to mobile width (< 768px)
   OR use Chrome DevTools device emulation
2. Verify full-screen takeover
3. Test virtual keyboard doesn't cover input

---

## Configuration

### Widget Configuration Options

The widget accepts the following configuration options:

```javascript
const CHATBOT_CONFIG = {
  // REQUIRED: Backend API URL
  API_URL: 'https://mj-chatbot-backend.YOUR_SUBDOMAIN.workers.dev',

  // Optional: Rate limit cooldown (milliseconds)
  RATE_LIMIT_COOLDOWN: 60000, // 60 seconds

  // Optional: Widget position
  WIDGET_POSITION: 'bottom-right', // or 'bottom-left'

  // Optional: Mobile breakpoint (pixels)
  MOBILE_BREAKPOINT: 768,

  // Optional: Enable debug logging
  DEBUG: false // Set to true for verbose console logs
};
```

### Customization

**Colors:**
The widget uses CSS-in-JS for styling. To customize colors, edit `chatbot-widget.js`:

```javascript
// Line ~180-190 (approximate)
const styles = `
  .mj-chatbot-bubble {
    background: #2563eb; /* Primary blue - change this */
  }

  .mj-chatbot-header {
    background: #2563eb; /* Header blue - change this */
    color: #FFFFFF;      /* Header text - change this */
  }

  .mj-chatbot-user-message {
    background: #2563eb; /* User message bubble - change this */
    color: #FFFFFF;      /* User message text - change this */
  }
`;
```

**Position:**
To move the widget to bottom-left:
```javascript
WIDGET_POSITION: 'bottom-left'
```

**Mobile Breakpoint:**
To change when mobile full-screen kicks in:
```javascript
MOBILE_BREAKPOINT: 600 // Full-screen below 600px instead of 768px
```

---

## Testing After Deployment

### Test Checklist

#### Desktop Testing
- [ ] Widget loads on all pages
- [ ] Chat opens and closes smoothly
- [ ] Messages send and receive correctly
- [ ] Animations are smooth
- [ ] No console errors
- [ ] Rate limiting works (try sending 6+ messages quickly)
- [ ] Session persists across page reloads

#### Mobile Testing (< 768px)
- [ ] Full-screen takeover works
- [ ] Virtual keyboard doesn't cover input
- [ ] Touch targets are large enough
- [ ] Scroll works correctly
- [ ] Animations are smooth
- [ ] Close button accessible

#### Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari Desktop (latest)
- [ ] Safari iOS (latest)
- [ ] Edge (latest)

#### Accessibility Testing
- [ ] Keyboard navigation works (Tab, Enter, ESC)
- [ ] Screen reader announces messages (test with VoiceOver/NVDA)
- [ ] Focus indicators visible
- [ ] Color contrast sufficient

### Performance Benchmarks

**Expected Performance:**
- **Load Time:** < 1 second (instant)
- **Animation Frame Rate:** 60fps
- **File Size:** ~25KB unminified
- **Lighthouse Score:** 90+ across all metrics

**Run Lighthouse Audit:**
1. Open site in Chrome
2. Open DevTools (F12)
3. Go to "Lighthouse" tab
4. Select: Performance, Accessibility, Best Practices
5. Click "Analyze page load"

---

## Troubleshooting

### Widget Doesn't Appear

**Problem:** No chat bubble visible on page

**Solutions:**
1. Check browser console for errors
2. Verify script is loading:
   ```javascript
   // In console:
   console.log(window.MJChatbot);
   // Should show: {init: function, ...}
   ```
3. Check Ghost Code Injection is saved
4. Clear browser cache (Cmd+Shift+R or Ctrl+Shift+R)
5. Try incognito/private window
6. Verify theme uploaded correctly (if using theme assets)

---

### Chat Opens But Can't Send Messages

**Problem:** Messages don't send or get stuck

**Solutions:**
1. Check backend is running:
   ```bash
   curl https://mj-chatbot-backend.YOUR_SUBDOMAIN.workers.dev/health
   ```
2. Check browser console for API errors
3. Verify API_URL in config is correct (no typos)
4. Check network tab in DevTools for failed requests
5. Verify CORS is enabled on backend

---

### "Rate limit exceeded" Error

**Problem:** Yellow banner shows rate limit error

**This is expected behavior:**
- Backend limits to 5 messages per minute per session
- Prevents abuse and controls API costs
- User must wait 60 seconds before sending more messages

**To adjust:**
- Backend rate limit: Edit `mj-chatbot-backend/src/index.ts`
- Frontend cooldown display: Edit `RATE_LIMIT_COOLDOWN` in config

---

### Widget Looks Different on Mobile

**Problem:** Mobile layout broken or input field covered by keyboard

**Solutions:**
1. Verify mobile breakpoint is correct (default: 768px)
2. Check if `100dvh` is supported in browser:
   ```javascript
   // In console:
   document.body.style.height = '100dvh';
   console.log(document.body.style.height);
   // Should show: "100dvh"
   ```
3. If `dvh` not supported, add fallback:
   ```css
   height: 100vh; /* Fallback */
   height: 100dvh; /* Preferred */
   ```
4. Test on real device (simulator may not catch all issues)

---

### Animations Are Choppy

**Problem:** Animations lag or stutter

**Solutions:**
1. Check browser version (update to latest)
2. Close other tabs/applications
3. Enable hardware acceleration in browser
4. Check CPU usage (other processes may be consuming resources)
5. Test on different device

---

### Messages Not Persisting

**Problem:** Chat resets when page reloads

**Expected behavior:**
- Messages are NOT persisted across page loads
- Widget clears conversation on close/reload
- Session ID persists in localStorage for backend tracking

**To change:**
- Would require storing messages in localStorage
- Not recommended (privacy concerns)

---

## Rollback Procedure

### If Something Goes Wrong

**Quick Rollback:**
1. Go to Ghost Admin → Settings → Code Injection
2. Remove widget code from Site Footer
3. Click Save
4. Site immediately reverts to no-widget state

**Restore from Backup:**
If you need to restore a previous theme version:
1. Go to Settings → Design
2. Click "Change theme"
3. Upload previous theme version
4. Activate previous theme

**Disable Backend:**
If backend needs to be disabled:
```bash
# In mj-chatbot-backend directory:
wrangler publish --env production --var ENABLED=false
```

---

## Maintenance

### Regular Checks

**Weekly:**
- [ ] Verify widget loads on homepage
- [ ] Send test message, verify response
- [ ] Check browser console for errors

**Monthly:**
- [ ] Review Cloudflare Workers analytics
- [ ] Check API usage and costs
- [ ] Review any user feedback
- [ ] Test on latest browser versions

**Quarterly:**
- [ ] Review and update knowledge base (if backend uses RAG)
- [ ] Test accessibility with screen readers
- [ ] Run full cross-browser compatibility tests
- [ ] Review and update documentation

### Updating the Widget

**To deploy widget updates:**

1. **Test locally:**
   ```bash
   cd mj-chatbot-frontend
   python3 -m http.server 8000
   # Open http://localhost:8000/test.html
   ```

2. **Update version number** in widget file (comment at top)

3. **Upload new version:**
   - If using theme assets: Re-upload theme with new file
   - If using external hosting: Upload new file to CDN
   - Ghost Code Injection: Copy-paste new code

4. **Clear cache:**
   - Users may need to hard-refresh (Cmd+Shift+R)
   - Or wait for browser cache to expire

5. **Verify deployment:**
   - Test on live site
   - Check console for new version logs
   - Test core functionality

### Monitoring

**Key Metrics to Watch:**

1. **Backend Health:**
   - Cloudflare Workers dashboard
   - Request count, error rate
   - Response times

2. **User Engagement:**
   - How many visitors open chat?
   - How many send messages?
   - What questions are asked most?

3. **Error Monitoring:**
   - Browser console errors (if you add error reporting)
   - Backend error logs
   - Rate limit triggers

**Set up Error Reporting (Optional):**

Add error tracking to widget:
```javascript
window.addEventListener('error', function(e) {
  // Log to your error tracking service
  console.error('Widget error:', e.error);
  // Could send to Sentry, LogRocket, etc.
});
```

---

## Support and Resources

### Documentation Files
- **ARCHITECTURE.md** - Technical architecture details
- **README.md** - Development setup and overview
- **ACCESSIBILITY-AUDIT.md** - WCAG 2.1 AA compliance report
- **CROSS-BROWSER-TESTING-GUIDE.md** - Browser compatibility testing

### Testing Resources
- **test.html** - Local testing page
- **browser-compatibility-test.html** - Automated browser feature tests

### Backend Documentation
- **mj-chatbot-backend/DEPLOYMENT.md** - Backend deployment guide
- **mj-chatbot-backend/README.md** - Backend overview

### External Resources
- Ghost Pro Docs: https://ghost.org/docs/
- Cloudflare Workers Docs: https://developers.cloudflare.com/workers/
- WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/

---

## Deployment Checklist

Use this checklist for each deployment:

### Pre-Deployment
- [ ] Backend is deployed and healthy
- [ ] Widget tested locally (test.html)
- [ ] API_URL configured correctly
- [ ] Cross-browser testing complete
- [ ] Accessibility testing complete

### Deployment
- [ ] Widget file uploaded (theme or CDN)
- [ ] Code injection added to Ghost footer
- [ ] Configuration saved in Ghost
- [ ] Changes published

### Post-Deployment
- [ ] Widget appears on homepage
- [ ] Test message sends successfully
- [ ] No console errors
- [ ] Mobile layout works
- [ ] Desktop layout works
- [ ] Keyboard navigation works
- [ ] Rate limiting works

### Verification
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test on mobile device
- [ ] Lighthouse score 90+

---

**Deployment Guide Version:** 1.0
**Last Updated:** 2026-02-25
**Status:** Production Ready ✅

For questions or issues, refer to troubleshooting section or review test results in documentation.
