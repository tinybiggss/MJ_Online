# Mobile Device Testing Checklist - Task #6

**Date:** 2026-02-25
**Status:** In Progress
**Testing URL:** http://localhost:8000/test.html

---

## Pre-Test Setup

### Start Local Server
```bash
cd /Users/michaeljones/Dev/MJ_Online/mj-chatbot-frontend
python3 -m http.server 8000
```

### Access on Mobile Devices

**Option 1: Same WiFi Network**
1. Find your Mac's IP address: `ifconfig | grep "inet " | grep -v 127.0.0.1`
2. On mobile device, navigate to: `http://[YOUR_IP]:8000/test.html`
3. Example: `http://192.168.1.100:8000/test.html`

**Option 2: Chrome DevTools Device Emulation (Desktop)**
1. Open http://localhost:8000/test.html in Chrome
2. Press `Cmd + Opt + I` (Mac) to open DevTools
3. Click "Toggle Device Toolbar" icon (phone/tablet icon) or press `Cmd + Shift + M`
4. Select device from dropdown (iPhone 14 Pro, Pixel 7, etc.)

---

## Mobile Responsive Features Already Implemented

### 📱 Full-Screen Takeover (@media max-width: 768px)
- **Window dimensions:** 100vw × 100vh (100dvh for mobile browsers)
- **Border radius:** Removed (0) for full-screen appearance
- **Position:** Fixed, covers entire viewport (top: 0, left: 0, right: 0, bottom: 0)

### 👆 Touch Target Sizes (WCAG Compliance)
- **Input field:** min-height: 44px ✅
- **Send button:** height: 44px, min-width: 60px ✅
- **Header buttons:** width: 28px, height: 28px ⚠️ (below 44px - may need adjustment)
- **Suggestion chips:** padding: 12px 16px (approximately 44px total) ✅
- **Chat bubble:** 60px × 60px ✅

### ⌨️ Keyboard Handling
- **Auto-resize textarea:** min-height: 44px, max-height: 120px
- **Auto-focus:** Input focuses when chat opens
- **Virtual keyboard:** Uses 100dvh (dynamic viewport height) to adjust for iOS Safari keyboard

---

## Test Cases

### Test 1: iPhone Devices

#### iPhone SE (375×667, small screen)
- [ ] Open test page on device
- [ ] Chat bubble appears in bottom-right corner
- [ ] Click chat bubble - window expands to full screen
- [ ] Verify no white space around edges
- [ ] Type a message - keyboard appears and doesn't cover input
- [ ] Send message - typing indicator shows
- [ ] Receive response - message displays correctly
- [ ] Click suggested question - sends and gets response
- [ ] Minimize button works (returns to bubble)
- [ ] Close button works (hides widget)

#### iPhone 14 Pro (393×852, standard)
- [ ] Repeat all tests from iPhone SE
- [ ] Verify full-screen coverage (no gaps at top/bottom)
- [ ] Test Dynamic Island area - no overlap with header
- [ ] Landscape mode - window still fills screen

#### iPhone 14 Pro Max (430×932, large)
- [ ] Repeat all tests
- [ ] Verify full-screen coverage
- [ ] Test landscape orientation

### Test 2: Android Devices

#### Google Pixel 7 (412×915)
- [ ] Open test page on device
- [ ] Chat bubble appears and is tappable
- [ ] Expand to full screen - verify complete coverage
- [ ] Virtual keyboard test - input remains visible
- [ ] Send message and receive response
- [ ] Test suggested questions
- [ ] Minimize and close functions work

#### Samsung Galaxy S23 (360×780, compact)
- [ ] Repeat all Pixel 7 tests
- [ ] Verify no horizontal scrolling
- [ ] Test with Samsung Internet browser (if available)

### Test 3: Tablet Devices

#### iPad Mini (768×1024, breakpoint boundary)
- [ ] At 768px width: Should show FULL-SCREEN layout
- [ ] Rotate to landscape (1024×768): Should show DESKTOP layout (400×600px window)
- [ ] Verify breakpoint transition is smooth

#### iPad Pro (1024×1366)
- [ ] Should show desktop layout (400×600px window)
- [ ] Chat bubble in bottom-right corner
- [ ] Window doesn't fill entire screen
- [ ] Verify positioning with keyboard open

---

## Specific Feature Tests

### Virtual Keyboard Handling

**iOS Safari (critical test - most challenging browser)**
- [ ] Open chat window
- [ ] Tap input field
- [ ] Verify keyboard doesn't cover input field
- [ ] Type multi-line message (press Enter for newlines)
- [ ] Scroll messages while keyboard is open
- [ ] Send message - keyboard remains open, input clears

**Android Chrome**
- [ ] Repeat iOS tests
- [ ] Verify 100dvh adjusts for keyboard
- [ ] Test "done" button on keyboard

### Touch Target Verification

**Measure touch targets (minimum 44×44px per WCAG):**
- [ ] Chat bubble: 60×60px ✅ (exceeds minimum)
- [ ] Send button: 44px height, 60px width ✅
- [ ] Input field: 44px min-height ✅
- [ ] Suggested question chips: ~44px total height ✅
- [ ] ⚠️ Header buttons (close/minimize): 28×28px (BELOW minimum)

**Action Required:** Header buttons may need size increase or padding increase for better tap targets.

### Gesture and Interaction Tests

**Touch interactions:**
- [ ] Single tap on bubble - opens chat
- [ ] Single tap on close button - closes chat
- [ ] Single tap on minimize button - minimizes to bubble
- [ ] Single tap on suggestion - sends question
- [ ] Tap and hold - no unexpected behavior
- [ ] Double tap - no zoom (should be prevented)
- [ ] Pinch zoom - disabled for chat window (user-scalable=no in viewport?)

**Scrolling:**
- [ ] Messages scroll smoothly with finger swipe
- [ ] Input area remains fixed at bottom during scroll
- [ ] Auto-scroll to latest message works
- [ ] Overscroll bounce (iOS) - should be contained to messages area

### Orientation Changes

**Portrait to Landscape:**
- [ ] Open chat in portrait mode
- [ ] Rotate device to landscape
- [ ] Verify full-screen layout still works (on phones)
- [ ] Verify desktop layout appears (on tablets/large devices)
- [ ] No layout breaks or overlaps

**Landscape to Portrait:**
- [ ] Repeat in reverse
- [ ] Verify smooth transition

---

## Browser Compatibility

### iOS Browsers
- [ ] Safari (primary iOS browser)
- [ ] Chrome for iOS (uses Safari WebKit engine)
- [ ] Firefox for iOS (uses Safari WebKit engine)

### Android Browsers
- [ ] Chrome (primary Android browser)
- [ ] Samsung Internet (if available)
- [ ] Firefox for Android

---

## Known Issues to Check

### Potential Issues from Code Review

1. **Header button touch targets (28×28px)**
   - Below WCAG 44×44px minimum
   - May be difficult to tap on mobile
   - **Fix:** Increase padding or button size

2. **100vh vs 100dvh**
   - Code uses both: `height: 100vh; height: 100dvh;`
   - 100dvh is better for mobile (accounts for browser chrome)
   - Should work correctly (second declaration overrides first)

3. **No viewport meta tag check**
   - Ensure test.html has: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
   - Without this, mobile devices may zoom out

---

## Performance Testing

### Load Time on Mobile (3G/4G)
- [ ] Open test page on mobile network (not WiFi)
- [ ] Measure time to interactive
- [ ] Widget should load in < 2 seconds

### Animation Smoothness
- [ ] Chat bubble appearance - smooth fade-in
- [ ] Window expansion - smooth slide-up (0.3s)
- [ ] Message appearance - smooth fade-in
- [ ] Typing indicator - smooth animation (no jank)

### Memory Usage
- [ ] Open chat and send 20+ messages
- [ ] Check for slowdown or memory leaks
- [ ] Browser should remain responsive

---

## Accessibility on Mobile

### Screen Reader Testing (iOS VoiceOver)
- [ ] Enable VoiceOver: Settings → Accessibility → VoiceOver
- [ ] Navigate to chat bubble
- [ ] VoiceOver announces: "Chat with Mike, button"
- [ ] Tap to open chat
- [ ] Navigate through messages with swipe
- [ ] Each message announced correctly
- [ ] Input field announced: "Ask me about Mike's work, text field"
- [ ] Send button announced: "Send message, button"

### Screen Reader Testing (Android TalkBack)
- [ ] Enable TalkBack: Settings → Accessibility → TalkBack
- [ ] Repeat VoiceOver tests
- [ ] Verify ARIA labels work correctly

---

## Test Results Template

### Device: _________________
### OS Version: _________________
### Browser: _________________
### Date Tested: _________________

**Overall Result:** ✅ Pass / ⚠️ Pass with Issues / ❌ Fail

**Issues Found:**
1.
2.
3.

**Screenshots:** (attach if available)

---

## DevTools Mobile Emulation Quick Test

**For quick validation without physical devices:**

1. Open http://localhost:8000/test.html in Chrome
2. Open DevTools (Cmd + Opt + I)
3. Enable Device Toolbar (Cmd + Shift + M)
4. Test these presets:
   - iPhone SE (375×667)
   - iPhone 14 Pro (393×852)
   - Pixel 7 (412×915)
   - iPad Mini (768×1024)

**Quick checks:**
- [ ] Full-screen on phones (< 768px width)
- [ ] Desktop layout on tablets (≥ 768px width)
- [ ] Touch targets feel tappable
- [ ] No horizontal scroll
- [ ] Input field visible with virtual keyboard

---

## Next Steps After Testing

1. **Document all issues** found during testing
2. **Prioritize fixes**:
   - Critical: Blocking bugs (layout breaks, unusable features)
   - High: WCAG violations (touch target sizes)
   - Medium: UX improvements (animations, polish)
   - Low: Nice-to-haves
3. **Create fix tasks** for any issues found
4. **Retest after fixes** on same devices
5. **Mark Task #6 complete** when all critical issues resolved

---

## Success Criteria

Task #6 is COMPLETE when:
- ✅ Chatbot works on iPhone (iOS Safari)
- ✅ Chatbot works on Android (Chrome)
- ✅ Full-screen takeover works correctly
- ✅ Virtual keyboard doesn't break layout
- ✅ All touch targets ≥ 44×44px (WCAG compliant)
- ✅ No critical bugs on mobile devices
- ✅ Smooth performance (no lag or jank)

---

**Last Updated:** 2026-02-25
**Tester:** _________________
**Status:** Ready for Testing
