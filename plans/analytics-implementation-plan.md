# Chatbot Analytics Implementation Plan

**Project:** MJ_Online Chatbot Analytics & Monitoring System
**Phase:** 7.6.4 - Analytics & Monitoring
**Date:** 2026-02-26
**PM:** Morgan
**Status:** IN PROGRESS

---

## Overview

Implement comprehensive analytics system for the chatbot to track usage, identify knowledge gaps, monitor performance, and inform RAG knowledge base expansion.

**Decision:** Use Cloudflare Workers-based dashboard (free, privacy-focused, self-contained)
- Approved by Mike: 2026-02-26
- Rationale: Free, keeps all data in Cloudflare account, privacy-focused, no external dependencies

---

## Implementation Approach

### Three-Tier System

**Tier 1: Enhanced Backend Logging** (Week 1)
- Expand conversation logging with session tracking, event types, performance metrics
- Add frontend event tracking (bubble clicks, suggestions, etc.)
- Enable knowledge gap identification

**Tier 2: Analytics Dashboard** (Week 2)
- Build password-protected `/analytics` route on Cloudflare Worker
- Display key metrics: volume, topics, gaps, performance, errors
- CSV/JSON export functionality

**Tier 3: Monitor & Iterate** (Ongoing)
- Weekly analytics reviews
- Monthly optimizations based on data
- RAG knowledge base expansion

---

## Agent Assignments

### Phase 1: Backend Logging Enhancement
**Agent:** Ted (Technical Research Agent) or general-purpose
**Tasks:** See Task #14
**Timeline:** Week 1 (7-10 hours)
**Deliverables:**
- `/mj-chatbot-backend/src/analytics.js` - Analytics module
- Updated `logConversation()` function
- Frontend `trackEvent()` helper
- `/docs/ANALYTICS-SCHEMA.md` - Schema documentation

### Phase 2: Analytics Dashboard
**Agent:** Alice (Web Content Builder) or general-purpose
**Tasks:** See Task #15
**Timeline:** Week 2 (9-12 hours)
**Deliverables:**
- `/analytics` route with password protection
- Dashboard UI with metrics visualization
- CSV/JSON export
- `/docs/ANALYTICS-DASHBOARD.md` - Usage guide

### Phase 3: Ongoing Monitoring
**Agent:** Morgan (PM)
**Tasks:** Weekly reviews, monthly optimizations
**Timeline:** Ongoing (30 min/week + 2 hours/month)

---

## Expanded Log Schema

### Current Schema (Basic)
```json
{
  "timestamp": "2026-02-26T10:30:00Z",
  "question": "What's Mike's AI expertise?",
  "topic": "skills",
  "entriesRetrieved": 5,
  "responseLength": 250,
  "success": true
}
```

### New Schema (Enhanced)
```json
{
  // Existing fields
  "timestamp": "2026-02-26T10:30:00Z",
  "question": "What's Mike's AI expertise?",
  "topic": "skills",
  "entriesRetrieved": 5,
  "responseLength": 250,
  "success": true,

  // NEW: Session tracking
  "sessionId": "sess_abc123xyz",
  "messageNumber": 2,  // 2nd message in this session

  // NEW: Event tracking
  "eventType": "message_sent",  // message_sent, bubble_opened, bubble_closed, suggestion_clicked, cta_clicked

  // NEW: Performance metrics
  "ragTimeMs": 12,
  "aiTimeMs": 850,
  "totalTimeMs": 862,

  // NEW: Knowledge gaps
  "noRagMatch": false,  // true if no RAG entries matched
  "ragMatchScore": 0.85,  // relevance score of top match

  // NEW: Page context
  "pageUrl": "https://mikejones.online/about",
  "pageTitle": "About | Mike Jones",
  "referrer": "https://google.com/search",

  // NEW: Error tracking
  "errorType": null,  // "rate_limit", "api_timeout", "openai_error", null
  "errorMessage": null
}
```

---

## Analytics Dashboard Metrics

### Key Metrics to Display

**1. Conversation Volume**
- Total conversations (all time, last 30 days, last 7 days)
- Conversations by day (line chart)
- Messages per session (average)
- Session duration (average time from first to last message)

**2. Popular Topics**
- Topic distribution (pie chart or bar chart)
- Most retrieved RAG entries
- Suggestion chips clicked most

**3. Knowledge Gaps**
- Questions with no RAG matches (list with count)
- Low match score questions (<0.5)
- Priority queue for RAG expansion

**4. Performance Metrics**
- Average RAG retrieval time
- Average AI generation time
- Average total response time
- 95th percentile response time

**5. Error Tracking**
- Error rate by type (rate limits, timeouts, API errors)
- Error timeline (when errors occurred)
- Most recent errors (last 20)

**6. Page Context**
- Top pages where chatbot is used
- Referrer sources
- Time-of-day distribution

**7. User Engagement**
- Bubble open rate (sessions where bubble was opened)
- Messages per conversation distribution
- Suggestion click rate
- CTA click rate (if we track contact form clicks)

---

## Dashboard UI Mockup

```
┌─────────────────────────────────────────────────────────────┐
│ MJ Chatbot Analytics                        🔐 Logout        │
├─────────────────────────────────────────────────────────────┤
│ Time Range: [Last 7 Days ▼] [Last 30 Days] [All Time]      │
│                                                              │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│ │ 127         │ │ 3.2         │ │ 1.2s        │           │
│ │ Conversations│ │ Msgs/Session│ │ Avg Response│           │
│ └─────────────┘ └─────────────┘ └─────────────┘           │
│                                                              │
│ Conversations Over Time                                     │
│ ┌─────────────────────────────────────────────────────────┐│
│ │      ╱╲                                                  ││
│ │    ╱    ╲     ╱╲                                        ││
│ │  ╱        ╲  ╱  ╲                                       ││
│ │╱            ╲╱                                           ││
│ └─────────────────────────────────────────────────────────┘│
│                                                              │
│ Top Topics                   Knowledge Gaps                │
│ ┌──────────────────────┐    ┌──────────────────────────┐  │
│ │ Skills: 45%          │    │ "Is Mike available for   │  │
│ │ Projects: 30%        │    │  part-time work?" (7x)   │  │
│ │ Career: 15%          │    │ "What's Mike's rate?"    │  │
│ │ Services: 10%        │    │  (5x)                     │  │
│ └──────────────────────┘    └──────────────────────────┘  │
│                                                              │
│ [Export CSV] [Export JSON] [Refresh Data]                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Technical Implementation Notes

### Backend Changes (Task #14)

**1. New analytics module** (`src/analytics.js`)
```javascript
// Session management
export function getSessionId(request) {
  // Check X-Session-ID header, or generate new one
}

// Event logging
export async function logEvent(eventType, data, kvNamespace) {
  // Log various event types with expanded schema
}

// Query functions for dashboard
export async function getConversationVolume(kvNamespace, timeRange) {
  // Query KV for conversation counts by date
}

export async function getKnowledgeGaps(kvNamespace, minCount = 3) {
  // Find questions with no RAG matches, group and count
}
```

**2. Update main handler** (`src/index.js`)
- Replace `logConversation()` with `logEvent()`
- Add performance timing
- Track session IDs
- Flag knowledge gaps

**3. New endpoint** `/analytics-event` (for frontend events)
```javascript
// POST /analytics-event
// Body: { eventType, sessionId, metadata }
// Log frontend events (bubble_opened, etc.)
```

**4. Frontend changes** (`chatbot-widget.js`)
```javascript
// Add trackEvent helper
function trackEvent(eventType, metadata) {
  const sessionId = getSessionId(); // from localStorage
  fetch(`${CONFIG.apiEndpoint.replace('/chat', '/analytics-event')}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ eventType, sessionId, metadata })
  });
}

// Call trackEvent on:
// - Bubble opened
// - Bubble closed
// - Message sent
// - Suggestion clicked
// - CTA clicked (if applicable)
```

### Dashboard Implementation (Task #15)

**1. New route** `/analytics` in worker
```javascript
// src/index.js
if (url.pathname === '/analytics') {
  return handleAnalyticsDashboard(request, env);
}
```

**2. Basic HTTP Auth**
```javascript
function checkAuth(request, env) {
  const auth = request.headers.get('Authorization');
  if (!auth || auth !== `Basic ${btoa(`admin:${env.ANALYTICS_PASSWORD}`)}`) {
    return false;
  }
  return true;
}
```

**3. Query KV logs**
```javascript
async function getAnalyticsData(kvNamespace, timeRange) {
  // List all log keys from KV
  // Filter by time range
  // Aggregate metrics
  return {
    volume: { total, byDay, avgMessagesPerSession },
    topics: { distribution, topEntries },
    gaps: [ { question, count, lastSeen } ],
    performance: { avgRagTime, avgAiTime, avgTotal, p95 },
    errors: { rateByType, recent }
  };
}
```

**4. HTML Dashboard**
- Single-page app (vanilla JS, no framework)
- Chart.js from CDN for visualizations
- Responsive design (mobile-friendly)
- Export buttons (CSV, JSON)

---

## Success Criteria

**Tier 1 (Backend Logging) Complete When:**
- ✅ All event types tracked (message, bubble, suggestion, etc.)
- ✅ Session IDs persist across page loads
- ✅ Performance metrics captured accurately
- ✅ Knowledge gaps flagged correctly
- ✅ Page context captured
- ✅ Tests pass for all event types
- ✅ Documentation complete

**Tier 2 (Dashboard) Complete When:**
- ✅ `/analytics` route accessible with password
- ✅ All 7 metric categories displayed
- ✅ Charts render correctly
- ✅ Export functionality works (CSV/JSON)
- ✅ Dashboard responsive on mobile
- ✅ Real data from production chatbot displayed
- ✅ Documentation complete

**Tier 3 (Ongoing) Success:**
- Weekly reviews conducted
- Knowledge gaps added to RAG backlog
- Monthly optimizations implemented
- Chatbot performance improving over time

---

## Timeline

**Week 1 (Backend Logging):**
- Day 1-2: Schema design + backend implementation
- Day 3: Frontend event tracking
- Day 4: Testing + documentation

**Week 2 (Dashboard):**
- Day 1-2: /analytics route + data queries
- Day 3-4: Dashboard UI + charts
- Day 5: Export functionality + testing + documentation

**Ongoing:**
- Weekly: 30 min analytics review
- Monthly: 2 hours optimization work

---

## Questions & Decisions

**Q: Store logs forever or 30-day TTL?**
**A:** Keep 30-day TTL initially. Can extend to 90 days or permanent storage later if needed.

**Q: Should we track user IP addresses?**
**A:** No. Privacy-first approach. Track sessions but not personally identifiable info.

**Q: What password for dashboard?**
**A:** Set via environment variable `ANALYTICS_PASSWORD` in Cloudflare Workers settings.

**Q: Should dashboard be real-time or cached?**
**A:** Cached with manual refresh button. Real-time not necessary for analytics review.

**Q: Export format for logs?**
**A:** Both CSV (easy to open in Excel) and JSON (programmatic access).

---

## Next Steps

1. ✅ Update roadmap with detailed Phase 7.6.4 plan - DONE
2. ✅ Create Task #14 and #15 - DONE
3. ⏸️ Assign Task #14 to Ted (or general-purpose agent)
4. ⏸️ Wait for Phase 1 completion
5. ⏸️ Assign Task #15 to Alice (or general-purpose agent)
6. ⏸️ Test dashboard with real data
7. ⏸️ Document usage guide
8. ⏸️ Begin weekly analytics reviews

---

## References

- **Task #12:** Review and implement logging/analytics options (parent task)
- **Task #14:** Backend logging enhancement (Tier 1)
- **Task #15:** Analytics dashboard (Tier 2)
- **Roadmap:** `/plans/roadmap.md` Phase 7.6.4
- **Backend Code:** `/mj-chatbot-backend/src/index.js`
- **Frontend Code:** `/mj-chatbot-frontend/chatbot-widget.js`
- **Current Logging:** Lines 43-66 in `src/index.js`

---

**Last Updated:** 2026-02-26 by Morgan (PM)
