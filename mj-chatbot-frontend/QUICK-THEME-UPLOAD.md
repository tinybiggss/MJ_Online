# Quick Guide: Upload Chatbot to Ghost Theme

## Problem
Code Injection has conflicts with other footer scripts. Solution: Upload widget as theme asset.

## Steps

### 1. Download Your Current Theme
1. Go to Ghost Admin → Settings → Design
2. Click "Change theme"
3. Find your active theme (Kyoto)
4. Click "Download" to get the ZIP file

### 2. Add Chatbot to Theme
```bash
# Unzip the theme
unzip kyoto-theme.zip -d kyoto-theme

# Create js folder if it doesn't exist
mkdir -p kyoto-theme/assets/js

# Copy chatbot widget
cp /Users/michaeljones/Dev/MJ_Online/mj-chatbot-frontend/chatbot-widget.js kyoto-theme/assets/js/

# Re-zip with new file
cd kyoto-theme
zip -r ../kyoto-with-chatbot.zip .
cd ..
```

### 3. Upload Modified Theme
1. Ghost Admin → Settings → Design → "Change theme"
2. Click "Upload theme"
3. Select `kyoto-with-chatbot.zip`
4. Click "Activate"

### 4. Update Code Injection (SIMPLE VERSION)
Ghost Admin → Settings → Code Injection → Site Footer:

```html
<style>
  #ghost-portal-root { bottom: 120px !important; }
</style>

<script>
  (function() {
    var script = document.createElement('script');
    script.src = '{{asset "js/chatbot-widget.js"}}';
    script.async = true;
    script.onload = function() {
      if (typeof MJChatbot !== 'undefined') {
        MJChatbot.init({
          apiEndpoint: 'https://mj-chatbot-backend.mejones73.workers.dev/chat'
        });
      }
    };
    document.body.appendChild(script);
  })();
</script>
```

This is MUCH simpler and won't conflict with other footer scripts.

## Why This Is Better
✅ Chatbot loads as separate file (no conflicts)
✅ {{asset}} helper generates correct URL
✅ Theme versioning and caching work properly
✅ Easy to update chatbot independently
✅ No Code Injection size limits

## Troubleshooting
If {{asset}} syntax gets corrupted:
- Check that you're using the Ghost editor's "Raw HTML" mode
- Verify theme was uploaded successfully
- Check browser network tab to see if js/chatbot-widget.js loads
