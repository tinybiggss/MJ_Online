/**
 * Cloudflare Worker - MJ Chatbot Backend
 * Main entry point for the RAG-powered AI chatbot
 *
 * Routes:
 *   POST /chat              - Chat endpoint (existing)
 *   POST /analytics-event   - Frontend event tracking (new)
 *   GET  /analytics         - Analytics dashboard (new, password-protected)
 *   GET  /analytics/data    - Analytics JSON API (new, password-protected)
 *   GET  /analytics/export  - Export CSV/JSON (new, password-protected)
 */

const { retrieveEntries, formatEntriesForContext } = require('./rag-retrieval');
const { generateResponse, getFallbackResponse } = require('./ai-integration');
const { checkRateLimit, getSessionId, getClientIP } = require('./rate-limiter');
const { getKnowledgeBase, stats } = require('./knowledge-data');
const { logEvent, getAnalyticsSummary, getEvents, getKnowledgeGaps } = require('./analytics');
const { getDashboardHTML } = require('./dashboard');

// Load knowledge base at worker startup (cached across requests)
const knowledgeBase = getKnowledgeBase();
console.log(`Knowledge base loaded: ${stats.totalEntries} entries`);
console.log('Entry types:', stats.types);
console.log('Topics:', stats.topics);

/**
 * CORS headers for mikejones.online
 */
function getCorsHeaders(origin) {
  const allowedOrigins = [
    'https://mikejones.online',
    'https://www.mikejones.online',
    'http://localhost:3000', // For local testing
    'http://127.0.0.1:3000',
    'http://localhost:8000', // Python http.server
    'http://127.0.0.1:8000'
  ];

  const isAllowed = allowedOrigins.some(allowed => origin?.startsWith(allowed));

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0],
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Session-ID, X-Page-URL, X-Page-Title, X-Referrer',
    'Access-Control-Max-Age': '86400',
  };
}

/**
 * Check Basic Auth for analytics dashboard
 */
function checkAnalyticsAuth(request, env) {
  const password = env.ANALYTICS_PASSWORD;
  if (!password) {
    console.error('ANALYTICS_PASSWORD not set');
    return false;
  }

  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }

  try {
    const decoded = atob(authHeader.slice(6));
    const [user, pass] = decoded.split(':');
    return user === 'admin' && pass === password;
  } catch {
    return false;
  }
}

/**
 * Return 401 with auth challenge
 */
function unauthorizedResponse() {
  return new Response('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="MJ Chatbot Analytics"',
      'Content-Type': 'text/plain'
    }
  });
}

/**
 * Handle POST /analytics-event (frontend event tracking)
 */
async function handleAnalyticsEvent(request, env) {
  const origin = request.headers.get('Origin');

  try {
    const body = await request.json();
    const { eventType, sessionId, metadata } = body;

    if (!eventType || !sessionId) {
      return new Response(JSON.stringify({ error: 'eventType and sessionId required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...getCorsHeaders(origin) }
      });
    }

    // Allowed frontend event types
    const allowedTypes = ['bubble_opened', 'bubble_closed', 'suggestion_clicked', 'cta_clicked', 'widget_loaded'];
    if (!allowedTypes.includes(eventType)) {
      return new Response(JSON.stringify({ error: 'Invalid event type' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...getCorsHeaders(origin) }
      });
    }

    await logEvent(eventType, {
      sessionId,
      pageUrl: metadata?.pageUrl || null,
      pageTitle: metadata?.pageTitle || null,
      referrer: metadata?.referrer || null,
      ...(metadata || {})
    }, env.RATE_LIMIT);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...getCorsHeaders(origin) }
    });

  } catch (error) {
    console.error('Analytics event error:', error);
    return new Response(JSON.stringify({ success: true }), {
      status: 200, // Don't expose errors to frontend
      headers: { 'Content-Type': 'application/json', ...getCorsHeaders(origin) }
    });
  }
}

/**
 * Handle GET /analytics (dashboard HTML)
 */
async function handleAnalyticsDashboard(request, env) {
  if (!checkAnalyticsAuth(request, env)) {
    return unauthorizedResponse();
  }

  return new Response(getDashboardHTML(), {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

/**
 * Handle GET /analytics/data (JSON API for dashboard)
 */
async function handleAnalyticsData(request, env) {
  if (!checkAnalyticsAuth(request, env)) {
    return unauthorizedResponse();
  }

  const url = new URL(request.url);
  const daysBack = parseInt(url.searchParams.get('days') || '30', 10);

  try {
    const summary = await getAnalyticsSummary(env.RATE_LIMIT, Math.min(daysBack, 90));
    return new Response(JSON.stringify(summary), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Analytics data error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch analytics data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Handle GET /analytics/export (CSV or JSON export)
 */
async function handleAnalyticsExport(request, env) {
  if (!checkAnalyticsAuth(request, env)) {
    return unauthorizedResponse();
  }

  const url = new URL(request.url);
  const format = url.searchParams.get('format') || 'json';
  const daysBack = parseInt(url.searchParams.get('days') || '30', 10);

  try {
    const events = await getEvents(env.RATE_LIMIT, { limit: 5000 });
    const cutoff = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);
    const filtered = events.filter(e => new Date(e.timestamp) >= cutoff);

    if (format === 'csv') {
      const headers = [
        'timestamp', 'eventType', 'sessionId', 'question', 'topic',
        'entriesRetrieved', 'responseLength', 'success', 'ragTimeMs',
        'aiTimeMs', 'totalTimeMs', 'noRagMatch', 'pageUrl', 'errorType'
      ];
      const csvRows = [headers.join(',')];

      for (const event of filtered) {
        const row = headers.map(h => {
          const val = event[h];
          if (val === null || val === undefined) return '';
          const str = String(val);
          return str.includes(',') || str.includes('"') || str.includes('\n')
            ? `"${str.replace(/"/g, '""')}"`
            : str;
        });
        csvRows.push(row.join(','));
      }

      return new Response(csvRows.join('\n'), {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="chatbot-analytics-${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    }

    // JSON export
    return new Response(JSON.stringify(filtered, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="chatbot-analytics-${new Date().toISOString().split('T')[0]}.json"`
      }
    });

  } catch (error) {
    console.error('Analytics export error:', error);
    return new Response(JSON.stringify({ error: 'Export failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Handle POST /chat (existing chat endpoint, enhanced with analytics)
 */
async function handleChat(request, env) {
  const origin = request.headers.get('Origin');

  try {
    // Parse request body
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return new Response(JSON.stringify({
        error: 'Invalid request. Please provide a message.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...getCorsHeaders(origin) }
      });
    }

    // Rate limiting check
    const sessionId = getSessionId(request);
    const ipAddress = getClientIP(request);

    const rateLimitResult = await checkRateLimit(sessionId, ipAddress, env.RATE_LIMIT);

    if (!rateLimitResult.allowed) {
      // Log rate limit event
      await logEvent('rate_limited', {
        sessionId,
        question: message,
        pageUrl: request.headers.get('X-Page-URL'),
        pageTitle: request.headers.get('X-Page-Title'),
        referrer: request.headers.get('X-Referrer')
      }, env.RATE_LIMIT);

      return new Response(JSON.stringify({
        error: rateLimitResult.reason,
        retryAfter: rateLimitResult.retryAfter
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': rateLimitResult.retryAfter.toString(),
          ...getCorsHeaders(origin)
        }
      });
    }

    // Use pre-loaded knowledge base
    const kb = knowledgeBase;

    // Retrieve relevant entries with timing
    const ragStartTime = Date.now();
    const retrievedEntries = retrieveEntries(message, kb, 5);
    const ragTimeMs = Date.now() - ragStartTime;

    // Determine RAG match quality
    const noRagMatch = retrievedEntries.length === 0;
    const ragMatchScore = retrievedEntries.length > 0 && retrievedEntries[0].score !== undefined
      ? retrievedEntries[0].score
      : null;

    if (noRagMatch) {
      const responseText = "I don't have information about that in my knowledge base. I'm focused on Mike's professional experience, projects, and consulting services. Is there something specific about his work I can help you with?";

      const response = {
        message: responseText,
        suggestions: [
          "What has Mike worked on?",
          "Tell me about the AI Memory System",
          "How does Mike help with process optimization?"
        ],
        metadata: {
          retrievalTime: ragTimeMs,
          entriesFound: 0
        }
      };

      // Enhanced analytics logging
      await logEvent('message_sent', {
        sessionId,
        messageNumber: body.messageNumber || null,
        question: message,
        topic: 'none',
        entriesRetrieved: 0,
        responseLength: responseText.length,
        success: true,
        ragTimeMs,
        aiTimeMs: 0,
        totalTimeMs: ragTimeMs,
        noRagMatch: true,
        ragMatchScore: 0,
        pageUrl: request.headers.get('X-Page-URL'),
        pageTitle: request.headers.get('X-Page-Title'),
        referrer: request.headers.get('X-Referrer')
      }, env.RATE_LIMIT);

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...getCorsHeaders(origin) }
      });
    }

    // Format entries for AI context
    const ragContext = formatEntriesForContext(retrievedEntries);

    // Generate AI response with timing
    const aiStartTime = Date.now();
    let aiResponse;
    let aiError = null;

    try {
      aiResponse = await generateResponse(message, ragContext, env.OPENAI_API_KEY);
    } catch (error) {
      console.error('AI generation failed:', error);
      aiError = error;
      aiResponse = getFallbackResponse();
    }

    const aiTimeMs = Date.now() - aiStartTime;
    const totalTimeMs = Date.now() - ragStartTime;

    // Build response with suggestions
    const response = {
      message: aiResponse,
      suggestions: [
        "Tell me more about Mike's experience",
        "What services does Mike offer?",
        "How can I contact Mike?"
      ],
      metadata: {
        retrievalTime: ragTimeMs,
        aiGenerationTime: aiTimeMs,
        totalTime: totalTimeMs,
        entriesFound: retrievedEntries.length,
        topics: [...new Set(retrievedEntries.map(e => e.topic))]
      }
    };

    // Enhanced analytics logging
    await logEvent('message_sent', {
      sessionId,
      messageNumber: body.messageNumber || null,
      question: message,
      topic: retrievedEntries[0]?.topic || 'unknown',
      entriesRetrieved: retrievedEntries.length,
      responseLength: aiResponse.length,
      success: !aiError,
      ragTimeMs,
      aiTimeMs,
      totalTimeMs,
      noRagMatch: false,
      ragMatchScore,
      pageUrl: request.headers.get('X-Page-URL'),
      pageTitle: request.headers.get('X-Page-Title'),
      referrer: request.headers.get('X-Referrer'),
      errorType: aiError ? 'openai_error' : null,
      errorMessage: aiError ? aiError.message : null
    }, env.RATE_LIMIT);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...getCorsHeaders(origin) }
    });

  } catch (error) {
    console.error('Request handler error:', error);

    // Log error event
    try {
      await logEvent('message_sent', {
        sessionId: getSessionId(request),
        success: false,
        errorType: 'server_error',
        errorMessage: error.message,
        pageUrl: request.headers.get('X-Page-URL')
      }, env.RATE_LIMIT);
    } catch (logError) {
      console.error('Failed to log error event:', logError);
    }

    return new Response(JSON.stringify({
      error: 'Internal server error. Please try again.',
      message: getFallbackResponse()
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...getCorsHeaders(request.headers.get('Origin'))
      }
    });
  }
}

/**
 * Main request handler - routes to appropriate handler
 */
async function handleRequest(request, env) {
  const url = new URL(request.url);
  const origin = request.headers.get('Origin');

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: getCorsHeaders(origin)
    });
  }

  // Route: POST /chat
  if (request.method === 'POST' && url.pathname === '/chat') {
    return handleChat(request, env);
  }

  // Route: POST /analytics-event
  if (request.method === 'POST' && url.pathname === '/analytics-event') {
    return handleAnalyticsEvent(request, env);
  }

  // Route: GET /analytics (dashboard HTML)
  if (request.method === 'GET' && url.pathname === '/analytics') {
    return handleAnalyticsDashboard(request, env);
  }

  // Route: GET /analytics/data (JSON API)
  if (request.method === 'GET' && url.pathname === '/analytics/data') {
    return handleAnalyticsData(request, env);
  }

  // Route: GET /analytics/export (CSV/JSON download)
  if (request.method === 'GET' && url.pathname === '/analytics/export') {
    return handleAnalyticsExport(request, env);
  }

  // 404 for everything else
  return new Response('Not Found', {
    status: 404,
    headers: getCorsHeaders(origin)
  });
}

/**
 * Cloudflare Worker entry point
 */
export default {
  async fetch(request, env, ctx) {
    return handleRequest(request, env);
  }
};
