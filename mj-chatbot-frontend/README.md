# MJ Chatbot Widget - Frontend

**RAG-Powered AI Assistant for MikeJones.online**

A lightweight, vanilla JavaScript chatbot widget that integrates with the Cloudflare Workers backend and 190-entry knowledge base to answer questions about Mike's experience, projects, and services.

## Status

**Phase 7.6.2 - Frontend Development**

- ✅ Task #1: Architecture designed
- 🟡 Task #2: Minimized bubble UI (IN PROGRESS)
- ⏸️ Task #3: Expanded window UI
- ⏸️ Task #4: Message display and conversation logic
- ⏸️ Task #5: API integration
- ⏸️ Tasks #6-10: Responsive design, accessibility, polish, testing, documentation

## Quick Start

### Local Testing

```bash
# Navigate to frontend directory
cd /Users/michaeljones/Dev/MJ_Online/mj-chatbot-frontend

# Open test page in browser
open test.html
# OR on Linux: xdg-open test.html
# OR just drag test.html into your browser
```

**What you should see:**
- Blue chat bubble in bottom-right corner (60px circle)
- Hover effect (darkens and grows slightly)
- Click opens widget (currently shows placeholder)
- Console logs if debug mode is enabled

### Test Checklist

- [ ] Bubble appears in bottom-right corner
- [ ] Hover effect works (darkens, scales up)
- [ ] Click handler fires (check console)
- [ ] Keyboard accessible (Tab to focus, Enter/Space to activate)
- [ ] Focus outline visible (blue ring)
- [ ] Bubble stays in corner on window resize
- [ ] No console errors

## Project Structure

```
mj-chatbot-frontend/
├── README.md               ← You are here
├── ARCHITECTURE.md         ← Complete architecture documentation
├── CONFIG.js               ← Configuration options reference
├── chatbot-widget.js       ← Main widget code (in development)
├── chatbot-widget.min.js   ← Minified version (generated later)
├── test.html               ← Local testing page
├── DEPLOYMENT-GUIDE.md     ← Ghost integration steps (coming soon)
└── CONFIGURATION.md        ← Customization guide (coming soon)
```

## Technology

**Stack:**
- Vanilla JavaScript (ES6+)
- No dependencies
- No build step (optional minification)
- Single-file deployment

**Browser Support:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS 14+, Android)

## Configuration

Edit `window.MJ_CHATBOT_CONFIG` before loading the script:

```html
<script>
  window.MJ_CHATBOT_CONFIG = {
    apiEndpoint: 'https://mj-chatbot-backend.mejones73.workers.dev/chat',
    position: 'bottom-right',
    primaryColor: '#2563eb',
    debug: true  // Enable console logging
  };
</script>
<script src="chatbot-widget.js"></script>
```

See `CONFIG.js` for all available options.

## Current Implementation

### ✅ Minimized Bubble (Task #2 - IN PROGRESS)

**Features implemented:**
- 60px circular button
- Professional blue color (#2563eb)
- Chat icon (SVG)
- Hover effects (darker blue, scale 1.05)
- Active state (scale 0.95)
- Focus outline (3px blue ring)
- Click handler (currently shows placeholder)
- Keyboard accessible (Tab, Enter, Space)
- ARIA labels for screen readers
- Fixed positioning (bottom-right, 20px spacing)

**What's next:**
- Expanded window UI (Task #3)
- Message display (Task #4)
- API integration (Task #5)

## Development

### Making Changes

```bash
# 1. Edit chatbot-widget.js
# 2. Refresh test.html in browser
# 3. Check browser console for debug logs
```

### Debug Mode

Enable debug mode in `test.html` (already enabled) or add to your page:

```javascript
window.MJ_CHATBOT_CONFIG = { debug: true };
```

**Debug features:**
- Console logging of state changes
- Access to `window.MJ_CHATBOT` object
- Manual control methods: `MJ_CHATBOT.open()`, `MJ_CHATBOT.close()`, `MJ_CHATBOT.getState()`

### Testing Controls

The `test.html` page includes manual controls:
- **Open Widget** button - Programmatically opens the widget
- **Close Widget** button - Programmatically closes the widget
- **Show State** button - Displays current internal state

## Architecture

See `ARCHITECTURE.md` for complete architecture documentation including:
- Technology decisions and rationale
- Component structure
- State management pattern
- Styling strategy (CSS-in-JS)
- API integration approach
- Accessibility compliance (WCAG 2.1 AA)
- Performance optimizations
- Security considerations

## API Integration

**Backend Endpoint:**
```
https://mj-chatbot-backend.mejones73.workers.dev/chat
```

**Documentation:**
See `/mj-chatbot-backend/API-DOCUMENTATION.md` for complete API reference.

**Quick example:**
```javascript
const response = await fetch('https://mj-chatbot-backend.mejones73.workers.dev/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Session-ID': sessionId
  },
  body: JSON.stringify({ message: "What has Mike worked on?" })
});

const data = await response.json();
console.log(data.message);      // AI response
console.log(data.suggestions);  // Follow-up questions
```

## Troubleshooting

### Bubble doesn't appear

1. Check browser console for errors
2. Verify `chatbot-widget.js` loaded successfully
3. Check that `<body>` element exists when script runs
4. Enable debug mode and check console logs

### Click doesn't work

1. Open browser console
2. Look for "Opening widget" log message
3. Check that event listener attached (look for logs)
4. Try keyboard access (Tab then Enter)

### Styles look wrong

1. Check for CSS conflicts (unlikely with `mj-chatbot-` prefix)
2. Verify styles injected (check `<head>` for `<style id="mj-chatbot-styles">`)
3. Check browser DevTools Elements tab

### Console errors

Common issues:
- **localStorage blocked:** Some browsers block localStorage in file:// protocol. Use a local server or test in regular browser mode.
- **Module errors:** Make sure you're not using ES6 modules (`type="module"`) as we use IIFE pattern
- **Missing dependencies:** This widget has no dependencies, so this shouldn't happen

## Next Steps

**Task #3: Expanded Window UI**
- Header with title and close button
- Scrollable message container
- Input area with textarea and send button
- Suggested questions chips
- Typing indicator animation

**Task #5: API Integration**
- Connect to backend endpoint
- Send/receive messages
- Handle rate limiting (429 responses)
- Error handling and retry logic

**Task #9: Testing**
- Cross-browser testing
- Mobile responsive testing
- Accessibility audit
- Performance testing

## Support

Questions or issues?
- Review `ARCHITECTURE.md` for design decisions
- Check backend API docs: `/mj-chatbot-backend/API-DOCUMENTATION.md`
- Contact: mike@mikejones.online

## License

MIT License - See main project repository

---

**Version:** 1.0.0-dev
**Last Updated:** 2026-02-24
**Status:** In Development (Task #2 - Minimized Bubble UI)
