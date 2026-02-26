# Chatbot Analytics Schema

**Version:** 1.0
**Date:** 2026-02-26
**Phase:** 7.6.4 - Analytics & Monitoring

---

## Overview

The MJ Chatbot analytics system tracks user interactions, performance metrics, and knowledge gaps using Cloudflare Workers KV. All data is privacy-first (no PII, no IP tracking) with a 30-day TTL on events and 90-day TTL on aggregates.

---

## Event Schema

Every analytics event is stored as a JSON object in KV with key prefix `event:`.

```json
{
  "timestamp": "2026-02-26T10:30:00Z",
  "eventType": "message_sent",

  "sessionId": "session-1740123456-abc123xyz",
  "messageNumber": 2,

  "question": "What's Mike's AI expertise?",
  "topic": "skills",
  "entriesRetrieved": 5,
  "responseLength": 250,
  "success": true,

  "ragTimeMs": 12,
  "aiTimeMs": 850,
  "totalTimeMs": 862,

  "noRagMatch": false,
  "ragMatchScore": 0.85,

  "pageUrl": "https://mikejones.online/about",
  "pageTitle": "About | Mike Jones",
  "referrer": "https://google.com/search",

  "errorType": null,
  "errorMessage": null
}
```

---

## Event Types

| Event Type | Source | Description |
|---|---|---|
| `message_sent` | Backend | User sent a chat message (logged with full context) |
| `bubble_opened` | Frontend | User clicked the chat bubble to open |
| `bubble_closed` | Frontend | User closed the chat window |
| `suggestion_clicked` | Frontend | User clicked a suggested question |
| `widget_loaded` | Frontend | Chat widget initialized on page |
| `cta_clicked` | Frontend | User clicked a call-to-action link |
| `rate_limited` | Backend | User hit rate limit |

---

## KV Key Patterns

| Prefix | TTL | Description |
|---|---|---|
| `event:{timestamp}:{random}` | 30 days | Individual analytics events |
| `daily:{YYYY-MM-DD}` | 90 days | Daily aggregate counters by event type |
| `gaps:{hash}` | 90 days | Knowledge gap tracking (questions with no RAG match) |
| `session:{id}` | 1 hour | Rate limiting (existing) |
| `ip:{address}` | 1 day | Rate limiting (existing) |
| `log:{timestamp}:{random}` | 30 days | Legacy log format (deprecated, replaced by events) |

---

## Dashboard Routes

| Route | Method | Auth | Description |
|---|---|---|---|
| `/analytics` | GET | Basic Auth | Dashboard HTML page |
| `/analytics/data` | GET | Basic Auth | JSON analytics summary |
| `/analytics/export` | GET | Basic Auth | CSV or JSON export |
| `/analytics-event` | POST | None (CORS) | Frontend event ingestion |

### Query Parameters

**`/analytics/data`**
- `days` (int, default: 30) - Number of days to look back (max: 90)

**`/analytics/export`**
- `format` (string: "csv" or "json", default: "json")
- `days` (int, default: 30) - Number of days to export

---

## Dashboard Metrics

The dashboard displays 7 metric categories:

1. **Conversation Volume** - Total messages, sessions, messages/session, bubble opens
2. **Messages Over Time** - Line chart of daily message and bubble open counts
3. **Topic Distribution** - Doughnut chart of topics from RAG retrieval
4. **Knowledge Gaps** - Table of questions with no RAG match, sorted by frequency
5. **Performance** - Avg RAG time, AI time, total time, P95
6. **Errors** - Error rate, errors by type, recent error log
7. **Pages & Sources** - Top pages where chatbot is used, traffic sources

---

## Authentication

The dashboard uses HTTP Basic Auth:
- **Username:** `admin`
- **Password:** Set via `ANALYTICS_PASSWORD` environment variable in Cloudflare Workers

---

## Privacy

- No personally identifiable information (PII) is collected
- No IP addresses are stored in analytics events
- Session IDs are random strings stored in localStorage
- All data has automatic TTL expiration (30-90 days)
- Dashboard is password-protected
- No third-party analytics services involved

---

## Frontend Integration

The widget sends analytics events via `trackEvent()`:

```javascript
// Fire-and-forget POST to /analytics-event
trackEvent('bubble_opened');
trackEvent('suggestion_clicked', { question: 'What is Mike's AI expertise?' });
```

Chat messages include page context headers:
- `X-Page-URL` - Current page URL
- `X-Page-Title` - Current page title
- `X-Referrer` - Document referrer
- `X-Session-ID` - Session identifier (existing)

---

## Deployment

After code changes, deploy with:

```bash
cd mj-chatbot-backend

# Set analytics password (one-time)
npx wrangler secret put ANALYTICS_PASSWORD
# Enter: Cassidy=1

# Deploy
npm run deploy
```

Dashboard available at: `https://mj-chatbot-backend.mejones73.workers.dev/analytics`
