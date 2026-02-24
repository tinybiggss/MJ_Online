/**
 * Cloudflare Worker - MJ Chatbot Backend
 * Main entry point for the RAG-powered AI chatbot
 */

const { retrieveEntries, formatEntriesForContext } = require('./rag-retrieval');
const { generateResponse, getFallbackResponse } = require('./ai-integration');
const { checkRateLimit, getSessionId, getClientIP } = require('./rate-limiter');
const { getKnowledgeBase, stats } = require('./knowledge-data');

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
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Session-ID',
    'Access-Control-Max-Age': '86400',
  };
}

/**
 * Log conversation anonymously (for analytics)
 */
async function logConversation(data, kvNamespace) {
  const logKey = `log:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;

  const logEntry = {
    timestamp: new Date().toISOString(),
    question: data.message,
    topic: data.retrievedTopic || 'unknown',
    entriesRetrieved: data.entriesCount || 0,
    responseLength: data.responseLength || 0,
    success: data.success || false
  };

  try {
    // Store with 30-day TTL
    await kvNamespace.put(
      logKey,
      JSON.stringify(logEntry),
      { expirationTtl: 30 * 24 * 60 * 60 } // 30 days
    );
  } catch (error) {
    console.error('Failed to log conversation:', error);
    // Don't throw - logging failure shouldn't break the chat
  }
}

/**
 * Main request handler
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

  // Only allow POST requests to /chat
  if (request.method !== 'POST' || url.pathname !== '/chat') {
    return new Response('Not Found', {
      status: 404,
      headers: getCorsHeaders(origin)
    });
  }

  try {
    // Parse request body
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return new Response(JSON.stringify({
        error: 'Invalid request. Please provide a message.'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(origin)
        }
      });
    }

    // Rate limiting check
    const sessionId = getSessionId(request);
    const ipAddress = getClientIP(request);

    const rateLimitResult = await checkRateLimit(sessionId, ipAddress, env.RATE_LIMIT);

    if (!rateLimitResult.allowed) {
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

    // Retrieve relevant entries
    const startTime = Date.now();
    const retrievedEntries = retrieveEntries(message, kb, 5);
    const retrievalTime = Date.now() - startTime;

    if (retrievedEntries.length === 0) {
      // No relevant entries found
      const response = {
        message: "I don't have information about that in my knowledge base. I'm focused on Mike's professional experience, projects, and consulting services. Is there something specific about his work I can help you with?",
        suggestions: [
          "What has Mike worked on?",
          "Tell me about the AI Memory System",
          "How does Mike help with process optimization?"
        ],
        metadata: {
          retrievalTime,
          entriesFound: 0
        }
      };

      // Log conversation
      await logConversation({
        message,
        retrievedTopic: 'none',
        entriesCount: 0,
        responseLength: response.message.length,
        success: true
      }, env.RATE_LIMIT);

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(origin)
        }
      });
    }

    // Format entries for AI context
    const ragContext = formatEntriesForContext(retrievedEntries);

    // Generate AI response
    const aiStartTime = Date.now();
    let aiResponse;

    try {
      aiResponse = await generateResponse(message, ragContext, env.OPENAI_API_KEY);
    } catch (error) {
      console.error('AI generation failed:', error);
      aiResponse = getFallbackResponse();
    }

    const aiTime = Date.now() - aiStartTime;
    const totalTime = Date.now() - startTime;

    // Build response with suggestions
    const response = {
      message: aiResponse,
      suggestions: [
        "Tell me more about Mike's experience",
        "What services does Mike offer?",
        "How can I contact Mike?"
      ],
      metadata: {
        retrievalTime,
        aiGenerationTime: aiTime,
        totalTime,
        entriesFound: retrievedEntries.length,
        topics: [...new Set(retrievedEntries.map(e => e.topic))]
      }
    };

    // Log conversation
    await logConversation({
      message,
      retrievedTopic: retrievedEntries[0]?.topic || 'unknown',
      entriesCount: retrievedEntries.length,
      responseLength: aiResponse.length,
      success: true
    }, env.RATE_LIMIT);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...getCorsHeaders(origin)
      }
    });

  } catch (error) {
    console.error('Request handler error:', error);

    return new Response(JSON.stringify({
      error: 'Internal server error. Please try again.',
      message: getFallbackResponse()
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...getCorsHeaders(origin)
      }
    });
  }
}

/**
 * Cloudflare Worker entry point
 */
export default {
  async fetch(request, env, ctx) {
    return handleRequest(request, env);
  }
};
