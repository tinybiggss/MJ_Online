# Chatbot Frontend Architecture

**Project:** MJ_Online RAG Chatbot Widget
**Version:** 1.0.0
**Date:** 2026-02-24
**Status:** Architecture Approved

## Executive Summary

Lightweight, vanilla JavaScript chatbot widget designed for Ghost Pro code injection. No build step, no dependencies, single-file deployment for maximum simplicity and performance.

---

## Architecture Decisions

### 1. Technology Stack

**Decision: Vanilla JavaScript (ES6+) - No Framework**

**Rationale:**
- ✅ **Ghost Code Injection Compatibility:** Single file deployment via Site Footer
- ✅ **Zero Dependencies:** No npm packages, no vulnerabilities, no maintenance
- ✅ **Fast Load Time:** ~15-20KB minified (vs 40KB+ for React)
- ✅ **Browser Support:** ES6 widely supported (95%+ browsers)
- ✅ **Simple Deployment:** Copy/paste into Ghost Admin
- ✅ **No Build Step:** Edit and deploy instantly

**Alternatives Considered:**
- ❌ React: Too heavy for a widget (~40KB+), requires build step
- ❌ Vue: Still requires bundling, overkill for this use case
- ❌ Svelte: Best framework option but adds complexity
- ❌ Web Components: Good option but limited browser support for Shadow DOM styling

**Technology Choice:**
```javascript
// Pure ES6+ JavaScript
// HTML template literals for rendering
// CSS-in-JS for scoped styling
// No transpilation, no bundling (optional minification only)
```

---

### 2. Deployment Strategy

**Decision: Single Self-Contained File**

**File Structure:**
```
chatbot-widget.js (single file)
├── Configuration (API endpoint, colors, etc.)
├── HTML Templates (template literals)
├── CSS Styles (template literals, injected into <style> tag)
├── State Management (closure-based)
├── API Integration (fetch)
├── DOM Manipulation (vanilla JS)
└── Initialization (self-executing)
```

**Ghost Code Injection Method:**
```html
<!-- Settings → Code Injection → Site Footer -->
<script src="https://cdn.jsdelivr.net/gh/YOUR-REPO/chatbot-widget.min.js"></script>

<!-- OR inline (if file is small enough) -->
<script>
  // Entire chatbot widget code here
</script>
```

**CDN Option (Recommended):**
- Host on GitHub Pages, jsDelivr, or Cloudflare Pages
- Enables versioning and caching
- Easy updates without touching Ghost Admin

**Inline Option:**
- Paste entire script into Ghost code injection
- No external dependencies
- Harder to update (must edit in Ghost Admin each time)

**Recommendation:** Start with CDN for easier iteration, can move to inline after stable.

---

### 3. Component Architecture

**Decision: Functional Components Pattern (No Classes)**

**Component Structure:**
```javascript
// State (closure)
const state = {
  isOpen: false,
  messages: [],
  sessionId: null,
  isLoading: false,
  rateLimited: false,
  retryAfter: 0
};

// Components (pure functions returning HTML strings)
function MinimizedBubble() { return `<div>...</div>`; }
function ExpandedWindow() { return `<div>...</div>`; }
function MessageList() { return `<div>...</div>`; }
function Message(msg) { return `<div>...</div>`; }
function InputArea() { return `<div>...</div>`; }
function SuggestedQuestions(suggestions) { return `<div>...</div>`; }
function TypingIndicator() { return `<div>...</div>`; }

// Event Handlers
function handleOpen() { /* ... */ }
function handleClose() { /* ... */ }
function handleSendMessage(text) { /* ... */ }
function handleSuggestionClick(suggestion) { /* ... */ }

// Rendering
function render() {
  const widget = document.getElementById('mj-chatbot-widget');
  widget.innerHTML = state.isOpen ? ExpandedWindow() : MinimizedBubble();
  attachEventListeners();
}
```

**Why This Pattern:**
- ✅ Simple and predictable
- ✅ Easy to test
- ✅ No "this" binding issues
- ✅ Minimal cognitive overhead
- ✅ Fast rendering (template literal concatenation)

---

### 4. State Management

**Decision: Closure-Based State (No External Library)**

**Implementation:**
```javascript
const ChatbotWidget = (function() {
  // Private state
  let state = {
    isOpen: false,
    messages: [],
    sessionId: getOrCreateSessionId(),
    isLoading: false,
    rateLimited: false,
    retryAfter: 0
  };

  // Private methods
  function setState(updates) {
    state = { ...state, ...updates };
    render();
  }

  function addMessage(message) {
    setState({ messages: [...state.messages, message] });
  }

  // Public API
  return {
    open: () => setState({ isOpen: true }),
    close: () => setState({ isOpen: false }),
    sendMessage: async (text) => { /* ... */ }
  };
})();
```

**Why Closure Pattern:**
- ✅ Encapsulation (no global state pollution)
- ✅ Private state (can't be modified externally)
- ✅ Simple and lightweight
- ✅ No dependencies

---

### 5. Styling Strategy

**Decision: CSS-in-JS (Injected `<style>` Tag)**

**Why CSS-in-JS:**
- ✅ **Scoped Styles:** Won't conflict with Ghost theme
- ✅ **Single File:** Everything in one JavaScript file
- ✅ **Dynamic Theming:** Can adjust colors programmatically
- ✅ **No External Stylesheet:** Simpler deployment

**Implementation:**
```javascript
function injectStyles() {
  const styleId = 'mj-chatbot-styles';
  if (document.getElementById(styleId)) return; // Already injected

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    /* Scoped with unique prefix */
    .mj-chatbot-widget { /* ... */ }
    .mj-chatbot-bubble { /* ... */ }
    .mj-chatbot-window { /* ... */ }
    /* ... all styles ... */
  `;
  document.head.appendChild(style);
}
```

**Naming Convention:**
- Prefix all classes with `mj-chatbot-` to avoid conflicts
- Use BEM methodology for clarity: `.mj-chatbot-message--user`

**Responsive Design:**
```css
/* Desktop */
.mj-chatbot-window {
  width: 400px;
  height: 600px;
}

/* Mobile */
@media (max-width: 768px) {
  .mj-chatbot-window {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
  }
}
```

---

### 6. API Integration

**Endpoint:** `https://mj-chatbot-backend.mejones73.workers.dev/chat`

**Integration Pattern:**
```javascript
async function sendMessage(messageText) {
  try {
    setState({ isLoading: true });

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': state.sessionId
      },
      body: JSON.stringify({ message: messageText }),
      signal: AbortSignal.timeout(10000) // 10s timeout
    });

    if (response.status === 429) {
      const data = await response.json();
      handleRateLimit(data.retryAfter);
      return;
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    addMessage({ sender: 'bot', text: data.message });
    updateSuggestions(data.suggestions);

  } catch (error) {
    handleError(error);
  } finally {
    setState({ isLoading: false });
  }
}
```

**Error Handling:**
- Rate limits (429): Show friendly message with countdown
- Network errors: Retry with exponential backoff
- Timeout: User-friendly "Taking longer than expected" message
- 500 errors: Fallback contact information

---

### 7. Accessibility (WCAG 2.1 AA)

**Keyboard Navigation:**
```javascript
function initKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.isOpen) {
      ChatbotWidget.close();
    }
  });
}
```

**ARIA Labels:**
```html
<button
  class="mj-chatbot-bubble"
  aria-label="Open chat with Mike Jones"
  aria-expanded="${state.isOpen}"
  role="button"
  tabindex="0"
>
```

**Screen Reader Support:**
```html
<div
  class="mj-chatbot-messages"
  role="log"
  aria-live="polite"
  aria-atomic="false"
>
  <!-- Messages announced as they appear -->
</div>
```

**Focus Management:**
- Trap focus within widget when open
- Return focus to trigger when closed
- Clear tab order

---

### 8. Performance Optimizations

**Lazy Rendering:**
```javascript
// Only render when widget opens (not on page load)
function handleOpen() {
  if (!state.initialized) {
    injectStyles();
    createDOMContainer();
    setState({ initialized: true });
  }
  setState({ isOpen: true });
}
```

**Debounced Scroll:**
```javascript
let scrollTimeout;
function scrollToBottom() {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    const container = document.querySelector('.mj-chatbot-messages');
    container.scrollTop = container.scrollHeight;
  }, 100);
}
```

**Request Deduplication:**
```javascript
let pendingRequest = null;

async function sendMessage(text) {
  if (pendingRequest) return pendingRequest; // Don't send duplicate

  pendingRequest = fetch(/* ... */)
    .finally(() => { pendingRequest = null; });

  return pendingRequest;
}
```

---

### 9. File Structure

```
mj-chatbot-frontend/
├── ARCHITECTURE.md (this file)
├── chatbot-widget.js (main file - all code)
├── chatbot-widget.min.js (minified for production)
├── README.md (usage instructions)
├── DEPLOYMENT-GUIDE.md (Ghost integration steps)
├── CONFIGURATION.md (customization options)
└── test.html (local testing page)
```

**Single File Contents (`chatbot-widget.js`):**
```javascript
// Configuration
const CONFIG = { /* ... */ };

// Styles
function injectStyles() { /* ... */ }

// Templates
function MinimizedBubble() { /* ... */ }
function ExpandedWindow() { /* ... */ }
// ... all components ...

// State Management
const ChatbotWidget = (function() { /* ... */ })();

// Initialization
(function init() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})();
```

---

### 10. Configuration Options

**Exposed Configuration:**
```javascript
// Users can customize by setting global config before loading script
window.MJ_CHATBOT_CONFIG = {
  apiEndpoint: 'https://mj-chatbot-backend.mejones73.workers.dev/chat',
  position: 'bottom-right', // bottom-right | bottom-left
  primaryColor: '#2563eb', // Matches site theme
  greeting: 'Hi! Ask me about Mike\'s experience and projects.',
  suggestedQuestions: [
    "What has Mike worked on?",
    "Tell me about the AI Memory System",
    "What services does Mike offer?"
  ],
  showMetadata: false, // Show response times (debug mode)
  enableSounds: false // Notification sounds (off by default)
};
```

---

### 11. Browser Support

**Target Browsers:**
- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅
- Mobile Safari iOS 14+ ✅
- Chrome Android 90+ ✅

**ES6 Features Used:**
- `async/await` (supported since 2017)
- Template literals (supported since 2015)
- Arrow functions (supported since 2015)
- `fetch` API (supported since 2017)
- Spread operator (supported since 2018)

**Fallbacks:**
- No polyfills needed for target browsers
- Graceful degradation for older browsers (show contact link instead)

---

## Development Workflow

### Local Development

```bash
# 1. Create test.html
# 2. Open in browser (file:// protocol works)
# 3. Edit chatbot-widget.js
# 4. Refresh browser to see changes
```

### Production Build

```bash
# Minify (optional)
npx terser chatbot-widget.js -o chatbot-widget.min.js -c -m

# Or use online tool: https://www.toptal.com/developers/javascript-minifier
```

### Deployment

```bash
# Option 1: Ghost Code Injection (inline)
# Copy chatbot-widget.min.js → paste into Ghost Admin → Code Injection → Site Footer

# Option 2: CDN (recommended)
# 1. Push to GitHub
# 2. Use jsDelivr: https://cdn.jsdelivr.net/gh/username/repo/chatbot-widget.min.js
# 3. Add <script src="..."> to Ghost Code Injection
```

---

## Security Considerations

1. **XSS Prevention:**
   - Sanitize all user input before display
   - Use `textContent` instead of `innerHTML` for user messages
   - Escape HTML in AI responses

2. **Rate Limiting:**
   - Handled by backend (10/hour, 100/day)
   - Frontend shows friendly message when limited

3. **Session Management:**
   - Session ID in localStorage (not cookies)
   - No PII stored client-side
   - Session resets on page refresh (stateless)

4. **API Security:**
   - CORS enforced on backend
   - No API keys in frontend code
   - HTTPS only (enforced by Ghost Pro)

---

## Testing Strategy

### Manual Testing Checklist

- [ ] Open/close widget works
- [ ] Messages send and display correctly
- [ ] Suggested questions clickable
- [ ] Rate limiting shows friendly message
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] Screen reader announces messages
- [ ] Mobile responsive (full-screen on mobile)
- [ ] Works in all target browsers
- [ ] No console errors
- [ ] Performance acceptable (< 100ms render time)

### Automated Testing

**Not required for MVP** (manual testing sufficient for single-file widget)

**Future consideration:** Playwright for E2E testing if widget becomes complex

---

## Success Metrics

### Technical Metrics

- ✅ Load time: < 100ms (widget initialization)
- ✅ File size: < 20KB minified
- ✅ API response time: < 2s (P95)
- ✅ Render time: < 100ms (component updates)
- ✅ Mobile-friendly: 100% responsive
- ✅ Accessibility: WCAG 2.1 AA compliant

### User Experience Metrics

- 🎯 10-20% of visitors interact with chatbot
- 🎯 Average 3-5 messages per conversation
- 🎯 Low bounce rate from widget (< 5%)
- 🎯 High suggestion click rate (> 30%)

---

## Future Enhancements (Post-MVP)

1. **Conversation History:** Persist in localStorage across page loads
2. **Typing Indicator:** More realistic "..." animation
3. **Message Reactions:** Thumbs up/down on AI responses
4. **File Upload:** Send screenshots or documents
5. **Voice Input:** Speech-to-text for mobile users
6. **Dark Mode:** Auto-detect system preference
7. **Multi-language:** i18n support for Spanish, etc.
8. **Analytics:** Track popular questions, conversion rates

---

## Conclusion

**Recommended Architecture:** Vanilla JavaScript, single-file deployment, no build step (optional minification).

**Why This Works:**
- ✅ Perfect for Ghost Code Injection
- ✅ Lightweight and fast
- ✅ Easy to maintain and update
- ✅ No dependencies or security vulnerabilities
- ✅ Mobile responsive and accessible
- ✅ Production-ready with minimal complexity

**Next Steps:**
1. Approve this architecture ✅
2. Build minimized bubble UI (Task #2)
3. Build expanded window UI (Task #3)
4. Implement API integration (Task #5)
5. Deploy to Ghost Pro (Phase 7.6.3)

---

**Architecture Approved By:** [Pending]
**Date:** 2026-02-24
