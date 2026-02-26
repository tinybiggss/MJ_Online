/**
 * Analytics Module for MJ Chatbot
 * Handles event logging, session tracking, and data querying
 *
 * Events are stored in Cloudflare KV with key prefixes:
 *   - event:{timestamp}:{random} - Individual events
 *   - daily:{YYYY-MM-DD} - Daily aggregate counters
 *   - gaps:{hash} - Knowledge gap tracking
 */

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

/**
 * Extract or generate a session ID from the request
 * Frontend sends X-Session-ID header; fallback to IP-based hash
 */
function getAnalyticsSessionId(request) {
  const sessionHeader = request.headers.get('X-Session-ID');
  if (sessionHeader) return sessionHeader;

  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const ua = request.headers.get('User-Agent') || 'unknown';
  return `anon-${simpleHash(ip + ua)}`;
}

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// ============================================================================
// EVENT LOGGING
// ============================================================================

/**
 * Log an analytics event to KV
 *
 * @param {string} eventType - Type of event (message_sent, bubble_opened, etc.)
 * @param {object} data - Event data
 * @param {KVNamespace} kv - Cloudflare KV namespace
 */
async function logEvent(eventType, data, kv) {
  const now = Date.now();
  const eventKey = `event:${now}:${Math.random().toString(36).substr(2, 9)}`;

  const event = {
    timestamp: new Date(now).toISOString(),
    eventType: eventType,

    // Session tracking
    sessionId: data.sessionId || null,
    messageNumber: data.messageNumber || null,

    // Message data (only for message_sent events)
    question: data.question || null,
    topic: data.topic || null,
    entriesRetrieved: data.entriesRetrieved || 0,
    responseLength: data.responseLength || 0,
    success: data.success !== undefined ? data.success : true,

    // Performance metrics
    ragTimeMs: data.ragTimeMs || null,
    aiTimeMs: data.aiTimeMs || null,
    totalTimeMs: data.totalTimeMs || null,

    // Knowledge gaps
    noRagMatch: data.noRagMatch || false,
    ragMatchScore: data.ragMatchScore || null,

    // Page context
    pageUrl: data.pageUrl || null,
    pageTitle: data.pageTitle || null,
    referrer: data.referrer || null,

    // Error tracking
    errorType: data.errorType || null,
    errorMessage: data.errorMessage || null
  };

  try {
    // Store event with 30-day TTL
    await kv.put(eventKey, JSON.stringify(event), {
      expirationTtl: 30 * 24 * 60 * 60
    });

    // Update daily counter
    await incrementDailyCounter(kv, eventType, now);

    // Track knowledge gaps
    if (data.noRagMatch && data.question) {
      await trackKnowledgeGap(kv, data.question);
    }
  } catch (error) {
    console.error('Failed to log analytics event:', error);
    // Don't throw - analytics failures shouldn't break the chat
  }
}

/**
 * Increment a daily counter for an event type
 */
async function incrementDailyCounter(kv, eventType, timestamp) {
  const dateStr = new Date(timestamp).toISOString().split('T')[0];
  const counterKey = `daily:${dateStr}`;

  try {
    const existing = await kv.get(counterKey, { type: 'json' });
    const counters = existing || {};
    counters[eventType] = (counters[eventType] || 0) + 1;
    counters.total = (counters.total || 0) + 1;

    await kv.put(counterKey, JSON.stringify(counters), {
      expirationTtl: 90 * 24 * 60 * 60 // Keep daily counters for 90 days
    });
  } catch (error) {
    console.error('Failed to update daily counter:', error);
  }
}

/**
 * Track a knowledge gap (question with no RAG match)
 */
async function trackKnowledgeGap(kv, question) {
  const normalizedQuestion = question.toLowerCase().trim();
  const gapHash = simpleHash(normalizedQuestion);
  const gapKey = `gaps:${gapHash}`;

  try {
    const existing = await kv.get(gapKey, { type: 'json' });
    const gapData = existing || {
      question: question, // Keep original casing of first occurrence
      count: 0,
      firstSeen: new Date().toISOString(),
      lastSeen: null
    };

    gapData.count += 1;
    gapData.lastSeen = new Date().toISOString();

    await kv.put(gapKey, JSON.stringify(gapData), {
      expirationTtl: 90 * 24 * 60 * 60 // Keep gaps for 90 days
    });
  } catch (error) {
    console.error('Failed to track knowledge gap:', error);
  }
}

// ============================================================================
// QUERY FUNCTIONS (for Dashboard)
// ============================================================================

/**
 * Get all events within a time range
 * Note: KV list is eventually consistent, so recent events may not appear immediately
 */
async function getEvents(kv, options = {}) {
  const { limit = 1000, eventType = null } = options;
  const events = [];
  let cursor = null;

  // List all event keys
  do {
    const listResult = await kv.list({
      prefix: 'event:',
      limit: 1000,
      cursor: cursor
    });

    for (const key of listResult.keys) {
      const event = await kv.get(key.name, { type: 'json' });
      if (event) {
        if (!eventType || event.eventType === eventType) {
          events.push(event);
        }
      }
    }

    cursor = listResult.list_complete ? null : listResult.cursor;
  } while (cursor && events.length < limit);

  // Sort by timestamp descending (newest first)
  events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return events.slice(0, limit);
}

/**
 * Get daily counters for a date range
 */
async function getDailyCounters(kv, daysBack = 30) {
  const counters = [];
  const now = new Date();

  for (let i = 0; i < daysBack; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const counterKey = `daily:${dateStr}`;

    const data = await kv.get(counterKey, { type: 'json' });
    counters.push({
      date: dateStr,
      ...(data || { total: 0 })
    });
  }

  return counters.reverse(); // Oldest first for charting
}

/**
 * Get knowledge gaps sorted by frequency
 */
async function getKnowledgeGaps(kv, minCount = 1) {
  const gaps = [];
  let cursor = null;

  do {
    const listResult = await kv.list({
      prefix: 'gaps:',
      limit: 1000,
      cursor: cursor
    });

    for (const key of listResult.keys) {
      const gap = await kv.get(key.name, { type: 'json' });
      if (gap && gap.count >= minCount) {
        gaps.push(gap);
      }
    }

    cursor = listResult.list_complete ? null : listResult.cursor;
  } while (cursor);

  // Sort by count descending
  gaps.sort((a, b) => b.count - a.count);
  return gaps;
}

/**
 * Compute aggregate analytics for the dashboard
 */
async function getAnalyticsSummary(kv, daysBack = 30) {
  const events = await getEvents(kv, { limit: 5000 });
  const dailyCounters = await getDailyCounters(kv, daysBack);
  const gaps = await getKnowledgeGaps(kv, 1);

  const now = new Date();
  const cutoff = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);

  // Filter events by time range
  const recentEvents = events.filter(e => new Date(e.timestamp) >= cutoff);
  const messageEvents = recentEvents.filter(e => e.eventType === 'message_sent');
  const bubbleEvents = recentEvents.filter(e => e.eventType === 'bubble_opened');
  const suggestionEvents = recentEvents.filter(e => e.eventType === 'suggestion_clicked');
  const errorEvents = recentEvents.filter(e => e.errorType !== null);

  // Session analysis
  const sessions = {};
  recentEvents.forEach(e => {
    if (e.sessionId) {
      if (!sessions[e.sessionId]) {
        sessions[e.sessionId] = { messages: 0, events: [], firstEvent: e.timestamp, lastEvent: e.timestamp };
      }
      sessions[e.sessionId].events.push(e);
      if (e.eventType === 'message_sent') sessions[e.sessionId].messages += 1;
      if (new Date(e.timestamp) < new Date(sessions[e.sessionId].firstEvent)) {
        sessions[e.sessionId].firstEvent = e.timestamp;
      }
      if (new Date(e.timestamp) > new Date(sessions[e.sessionId].lastEvent)) {
        sessions[e.sessionId].lastEvent = e.timestamp;
      }
    }
  });

  const sessionIds = Object.keys(sessions);
  const sessionsWithMessages = sessionIds.filter(id => sessions[id].messages > 0);

  // Topic distribution
  const topicCounts = {};
  messageEvents.forEach(e => {
    const topic = e.topic || 'unknown';
    topicCounts[topic] = (topicCounts[topic] || 0) + 1;
  });

  // Performance metrics
  const perfEvents = messageEvents.filter(e => e.totalTimeMs !== null);
  const avgRagTime = perfEvents.length > 0
    ? Math.round(perfEvents.reduce((sum, e) => sum + (e.ragTimeMs || 0), 0) / perfEvents.length)
    : 0;
  const avgAiTime = perfEvents.length > 0
    ? Math.round(perfEvents.reduce((sum, e) => sum + (e.aiTimeMs || 0), 0) / perfEvents.length)
    : 0;
  const avgTotalTime = perfEvents.length > 0
    ? Math.round(perfEvents.reduce((sum, e) => sum + e.totalTimeMs, 0) / perfEvents.length)
    : 0;

  // P95 response time
  const sortedTimes = perfEvents.map(e => e.totalTimeMs).sort((a, b) => a - b);
  const p95Time = sortedTimes.length > 0
    ? sortedTimes[Math.floor(sortedTimes.length * 0.95)]
    : 0;

  // Error analysis
  const errorsByType = {};
  errorEvents.forEach(e => {
    const type = e.errorType || 'unknown';
    errorsByType[type] = (errorsByType[type] || 0) + 1;
  });

  // Page context
  const pageCounts = {};
  recentEvents.forEach(e => {
    if (e.pageUrl) {
      const path = new URL(e.pageUrl).pathname || '/';
      pageCounts[path] = (pageCounts[path] || 0) + 1;
    }
  });

  // Referrer sources
  const referrerCounts = {};
  recentEvents.forEach(e => {
    if (e.referrer) {
      try {
        const host = new URL(e.referrer).hostname || 'direct';
        referrerCounts[host] = (referrerCounts[host] || 0) + 1;
      } catch {
        referrerCounts['direct'] = (referrerCounts['direct'] || 0) + 1;
      }
    }
  });

  return {
    timeRange: { daysBack, from: cutoff.toISOString(), to: now.toISOString() },

    volume: {
      totalEvents: recentEvents.length,
      totalMessages: messageEvents.length,
      totalSessions: sessionIds.length,
      sessionsWithMessages: sessionsWithMessages.length,
      avgMessagesPerSession: sessionsWithMessages.length > 0
        ? (messageEvents.length / sessionsWithMessages.length).toFixed(1)
        : 0,
      bubbleOpens: bubbleEvents.length,
      suggestionClicks: suggestionEvents.length
    },

    daily: dailyCounters,

    topics: Object.entries(topicCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([topic, count]) => ({ topic, count })),

    gaps: gaps.slice(0, 20),

    performance: {
      avgRagTimeMs: avgRagTime,
      avgAiTimeMs: avgAiTime,
      avgTotalTimeMs: avgTotalTime,
      p95TotalTimeMs: p95Time,
      sampleSize: perfEvents.length
    },

    errors: {
      totalErrors: errorEvents.length,
      errorRate: recentEvents.length > 0
        ? ((errorEvents.length / recentEvents.length) * 100).toFixed(1) + '%'
        : '0%',
      byType: errorsByType,
      recent: errorEvents.slice(0, 10).map(e => ({
        timestamp: e.timestamp,
        type: e.errorType,
        message: e.errorMessage,
        question: e.question
      }))
    },

    pages: Object.entries(pageCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([page, count]) => ({ page, count })),

    referrers: Object.entries(referrerCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([source, count]) => ({ source, count })),

    engagement: {
      bubbleOpenRate: sessionIds.length > 0
        ? ((bubbleEvents.length / sessionIds.length) * 100).toFixed(1) + '%'
        : '0%',
      suggestionClickRate: sessionsWithMessages.length > 0
        ? ((suggestionEvents.length / sessionsWithMessages.length) * 100).toFixed(1) + '%'
        : '0%'
    }
  };
}

module.exports = {
  getAnalyticsSessionId,
  logEvent,
  getEvents,
  getDailyCounters,
  getKnowledgeGaps,
  getAnalyticsSummary
};
