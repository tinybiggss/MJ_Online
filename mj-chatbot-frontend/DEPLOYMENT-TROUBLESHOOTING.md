# Chatbot Widget Deployment Troubleshooting

**Issue:** Widget doesn't appear on mikejones.online after adding code injection

---

## Step-by-Step Diagnosis

### Step 1: Check Browser Console for Errors

1. **Open mikejones.online**
2. **Open Developer Tools** (F12 or Cmd+Option+I)
3. **Go to Console tab**
4. **Look for errors**

**Common errors you might see:**

**Error 1: "Failed to load resource"**
```
Failed to load resource: https://mikejones.online/assets/js/chatbot-widget.js
net::ERR_FILE_NOT_FOUND (404)
```
**This means:** Widget file is NOT uploaded to Ghost theme yet
**Fix:** Upload chatbot-widget.js to Ghost theme (see Step 2 below)

**Error 2: No errors, but no widget**
**This means:** Code injection might not be active or script path is wrong
**Fix:** Check Code Injection is saved (see Step 3 below)

**Error 3: "MJChatbot is not defined"**
**This means:** Widget file loaded but didn't initialize correctly
**Fix:** Check API_URL in code injection matches your backend

---

### Step 2: Upload Widget File to Ghost Theme

**The widget file (`chatbot-widget.js`) must be part of your Ghost theme.**

#### Option A: Add to Existing Kyoto Theme

1. **Download your current theme:**
   - Ghost Admin → Settings → Design → "Change Theme"
   - Click on current theme (Kyoto)
   - Download theme ZIP

2. **Extract the ZIP file**

3. **Add widget to theme:**
   ```
   kyoto-theme/
   ├── assets/
   │   ├── css/
   │   ├── js/
   │   │   └── chatbot-widget.js  ← ADD THIS FILE HERE
   ```
   - Copy `/Users/michaeljones/Dev/MJ_Online/mj-chatbot-frontend/chatbot-widget.js`
   - Paste into `kyoto-theme/assets/js/` folder

4. **Create `js` folder if it doesn't exist:**
   ```bash
   cd kyoto-theme/assets
   mkdir -p js
   cp /Users/michaeljones/Dev/MJ_Online/mj-chatbot-frontend/chatbot-widget.js js/
   ```

5. **Re-ZIP the theme:**
   ```bash
   cd kyoto-theme
   zip -r kyoto-with-chatbot.zip .
   ```

6. **Upload to Ghost:**
   - Ghost Admin → Settings → Design
   - Click "Change Theme"
   - Click "Upload theme"
   - Select `kyoto-with-chatbot.zip`
   - Click "Activate"

#### Option B: Use External CDN (Quick Test)

If you want to test without uploading to theme:

1. **Upload widget to a CDN** (GitHub Pages, Cloudflare Pages, etc.)

2. **Change code injection to use CDN URL:**
   ```html
   <script>
   (function() {
     const script = document.createElement('script');
     script.src = 'https://YOUR-CDN-URL/chatbot-widget.js';
     // ... rest of code
   })();
   </script>
   ```

#### Option C: Inline the Widget (Not Recommended, but works)

1. **Copy entire chatbot-widget.js contents**
2. **Paste directly in Code Injection:**
   ```html
   <script>
   // Paste entire chatbot-widget.js contents here
   (function() {
     'use strict';

     const CONFIG = {
       API_URL: 'https://mj-chatbot-backend.mejones73.workers.dev',
       // ... rest of config
     };

     // ... entire widget code ...

   })();
   </script>
   ```

**Warning:** This makes Code Injection very large (~800 lines). Only use for quick testing.

---

### Step 3: Verify Code Injection is Active

1. **Go to Ghost Admin → Settings → Code Injection**
2. **Check "Site Footer" section has your code**
3. **Click "Save"** (even if it looks saved)
4. **Hard refresh site** (Cmd+Shift+R or Ctrl+Shift+R)

---

### Step 4: Check API URL is Correct

In your code injection, verify the API_URL:

```javascript
API_URL: 'https://mj-chatbot-backend.mejones73.workers.dev',
```

**Test backend is running:**
```bash
curl https://mj-chatbot-backend.mejones73.workers.dev/health
```

Should return: `{"status":"healthy"}`

If it returns an error, backend isn't deployed or URL is wrong.

---

### Step 5: Verify Script Path Syntax

Ghost uses Handlebars syntax for asset paths:

**Correct:**
```javascript
script.src = '{{asset "js/chatbot-widget.js"}}';
```

**Common mistakes:**
```javascript
script.src = '{asset "js/chatbot-widget.js"}';  // Missing double braces
script.src = '{{asset "/js/chatbot-widget.js"}}';  // Extra leading slash
script.src = 'assets/js/chatbot-widget.js';  // Missing {{asset}} helper
```

---

## Quick Test: Inline Widget Method

**To test if everything else works, try this:**

1. **Go to Ghost Admin → Settings → Code Injection → Site Footer**

2. **Replace ENTIRE footer code with this test version:**

```html
<script>
(function() {
  'use strict';

  // INLINE TEST VERSION - Contains full widget code
  const CONFIG = {
    API_URL: 'https://mj-chatbot-backend.mejones73.workers.dev',
    RATE_LIMIT_COOLDOWN: 60000,
    position: 'bottom-right',
    spacing: 20,
    bubbleSize: 60,
    primaryColor: '#2563eb',
    secondaryColor: '#1e40af',
    textColor: '#374151',
    borderRadius: '12px',
    fontSize: '14px'
  };

  let state = {
    isOpen: false,
    messages: [],
    sessionId: null,
    isLoading: false,
    rateLimited: false,
    rateLimitEnd: null
  };

  // Minimal version for testing
  function init() {
    console.log('[MJ Chatbot] Test version initializing...');

    const container = document.createElement('div');
    container.className = 'mj-chatbot-widget';
    container.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 2147483647;
    `;

    const bubble = document.createElement('button');
    bubble.style.cssText = `
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #2563eb;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    bubble.textContent = '💬';
    bubble.onclick = () => alert('Chatbot works! Now upload full widget.');

    container.appendChild(bubble);
    document.body.appendChild(container);

    console.log('[MJ Chatbot] Test bubble added to page');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
</script>
```

3. **Click "Save"**
4. **Refresh mikejones.online**
5. **Look for blue bubble with 💬 emoji**

**If you see the bubble:** Code injection works! Problem is just the widget file upload.
**If no bubble:** There's an issue with Ghost Code Injection or JavaScript is blocked.

---

## Most Likely Issue

Based on your screenshot and the fact that nothing changed, the most likely issue is:

**✋ The `chatbot-widget.js` file has NOT been uploaded to your Ghost theme yet.**

The code injection references `{{asset "js/chatbot-widget.js"}}`, but that file doesn't exist in your theme, so the script never loads.

**Solution:** Follow Step 2 above to add the widget file to your Kyoto theme.

---

## Quick Diagnostic Commands

```bash
# Check if widget file exists in your theme
# (You'll need to download theme first)
unzip kyoto-theme.zip -d kyoto-temp
ls -la kyoto-temp/assets/js/
# Should show chatbot-widget.js if it's there

# Test backend is working
curl https://mj-chatbot-backend.mejones73.workers.dev/health

# Check widget file size
ls -lh /Users/michaeljones/Dev/MJ_Online/mj-chatbot-frontend/chatbot-widget.js
# Should show ~25-30KB
```

---

## Expected Result After Fix

After uploading the widget file and saving code injection, you should see:

1. **Blue circular chat bubble** in bottom-right corner
2. **Above the Subscribe button** (or Subscribe button moved up)
3. **Browser console shows:**
   ```
   [MJ Chatbot] Document ready, initializing widget
   [MJ Chatbot] Initializing chatbot widget
   [MJ Chatbot] Initialization complete
   ```

---

## Next Steps

1. **Try the inline test version above** to verify Code Injection works
2. **If test works:** Upload chatbot-widget.js to Ghost theme (Step 2)
3. **If test doesn't work:** Check browser console for JavaScript errors

Let me know what you see!
