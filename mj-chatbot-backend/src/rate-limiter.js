/**
 * Rate Limiting System
 * Prevents abuse using Cloudflare Workers KV
 *
 * Limits:
 * - 10 messages per visitor per hour (session-based)
 * - 100 messages per IP per day
 */

const VISITOR_LIMIT = 10; // messages per hour
const IP_LIMIT = 100; // messages per day
const HOUR_IN_SECONDS = 3600;
const DAY_IN_SECONDS = 86400;

/**
 * Check if a visitor has exceeded rate limits
 *
 * @param {string} sessionId - Visitor session ID (from cookie/localStorage)
 * @param {string} ipAddress - Visitor IP address
 * @param {KVNamespace} kvNamespace - Cloudflare KV binding
 * @returns {Promise<{allowed: boolean, reason?: string, retryAfter?: number}>}
 */
async function checkRateLimit(sessionId, ipAddress, kvNamespace) {
  const now = Math.floor(Date.now() / 1000); // Current Unix timestamp

  // Check session-based limit (10/hour)
  const sessionKey = `session:${sessionId}`;
  const sessionData = await kvNamespace.get(sessionKey, { type: 'json' });

  if (sessionData) {
    const { count, resetAt } = sessionData;

    if (now < resetAt) {
      // Within the same hour
      if (count >= VISITOR_LIMIT) {
        return {
          allowed: false,
          reason: `Rate limit exceeded. You can send ${VISITOR_LIMIT} messages per hour.`,
          retryAfter: resetAt - now
        };
      }

      // Increment count
      await kvNamespace.put(
        sessionKey,
        JSON.stringify({ count: count + 1, resetAt }),
        { expirationTtl: HOUR_IN_SECONDS }
      );
    } else {
      // Hour has passed, reset
      await kvNamespace.put(
        sessionKey,
        JSON.stringify({ count: 1, resetAt: now + HOUR_IN_SECONDS }),
        { expirationTtl: HOUR_IN_SECONDS }
      );
    }
  } else {
    // First message from this session
    await kvNamespace.put(
      sessionKey,
      JSON.stringify({ count: 1, resetAt: now + HOUR_IN_SECONDS }),
      { expirationTtl: HOUR_IN_SECONDS }
    );
  }

  // Check IP-based limit (100/day)
  const ipKey = `ip:${ipAddress}`;
  const ipData = await kvNamespace.get(ipKey, { type: 'json' });

  if (ipData) {
    const { count, resetAt } = ipData;

    if (now < resetAt) {
      // Within the same day
      if (count >= IP_LIMIT) {
        return {
          allowed: false,
          reason: `IP rate limit exceeded. Maximum ${IP_LIMIT} messages per day.`,
          retryAfter: resetAt - now
        };
      }

      // Increment count
      await kvNamespace.put(
        ipKey,
        JSON.stringify({ count: count + 1, resetAt }),
        { expirationTtl: DAY_IN_SECONDS }
      );
    } else {
      // Day has passed, reset
      await kvNamespace.put(
        ipKey,
        JSON.stringify({ count: 1, resetAt: now + DAY_IN_SECONDS }),
        { expirationTtl: DAY_IN_SECONDS }
      );
    }
  } else {
    // First message from this IP
    await kvNamespace.put(
      ipKey,
      JSON.stringify({ count: 1, resetAt: now + DAY_IN_SECONDS }),
      { expirationTtl: DAY_IN_SECONDS }
    );
  }

  return { allowed: true };
}

/**
 * Generate a session ID from request (or use provided one)
 */
function getSessionId(request) {
  // Try to get from header (frontend will send this)
  const sessionHeader = request.headers.get('X-Session-ID');
  if (sessionHeader) {
    return sessionHeader;
  }

  // Fallback: generate from IP + User-Agent (less ideal but works)
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const userAgent = request.headers.get('User-Agent') || 'unknown';
  return `${ip}-${hashString(userAgent)}`;
}

/**
 * Simple hash function for generating session IDs
 */
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Get client IP address from request
 */
function getClientIP(request) {
  return request.headers.get('CF-Connecting-IP') ||
         request.headers.get('X-Forwarded-For')?.split(',')[0] ||
         'unknown';
}

module.exports = {
  checkRateLimit,
  getSessionId,
  getClientIP,
  VISITOR_LIMIT,
  IP_LIMIT
};
