# API Documentation - MJ Chatbot Backend

**For Frontend Integration (Week 2)**

## Base URL

**Development:** `http://localhost:8787` (when running `npm run dev`)
**Production:** `https://mj-chatbot-backend.YOUR-SUBDOMAIN.workers.dev`
**Custom Domain:** `https://chat-api.mikejones.online` (if configured)

## Authentication

No authentication required. Rate limiting is handled via session ID and IP address.

## Endpoint

### POST /chat

Send a user message and receive an AI-generated response based on Mike's knowledge base.

#### Request

**URL:** `POST /chat`

**Headers:**
```http
Content-Type: application/json
Origin: https://mikejones.online
X-Session-ID: <session-id>  (optional but recommended)
```

**Body:**
```json
{
  "message": "What has Mike worked on?"
}
```

**Field Descriptions:**
- `message` (string, required): The user's question. Max 500 characters recommended.

**Session ID Generation (Frontend):**
```javascript
// Generate or retrieve session ID from localStorage
let sessionId = localStorage.getItem('chatbot-session-id');
if (!sessionId) {
  sessionId = 'session-' + Math.random().toString(36).substr(2, 16);
  localStorage.setItem('chatbot-session-id', sessionId);
}
```

#### Response

**Success (200 OK):**
```json
{
  "message": "Mike has 29 years of experience in program and project management, specializing in gaming, entertainment, and media industries. He contributed to Microsoft Xbox and Xbox 360 launch teams, working on 6 AAA titles, and holds an Xbox SDK patent for an instrumentation method. He's held director-level roles at Kabam, Livescribe, and Kinoo, and was co-founder of 8 Circuit Studio, a Web3 gaming company.\n\nWould you like to know more about his work at a specific company or see examples of systems he's built?",
  "suggestions": [
    "Tell me more about Mike's experience",
    "What services does Mike offer?",
    "How can I contact Mike?"
  ],
  "metadata": {
    "retrievalTime": 12,
    "aiGenerationTime": 1145,
    "totalTime": 1157,
    "entriesFound": 5,
    "topics": ["career_history", "skills"]
  }
}
```

**Field Descriptions:**
- `message` (string): AI-generated response (2-3 paragraphs)
- `suggestions` (array): 3 suggested follow-up questions
- `metadata` (object): Performance and debugging info
  - `retrievalTime` (number): RAG retrieval time in ms
  - `aiGenerationTime` (number): OpenAI API time in ms
  - `totalTime` (number): Total response time in ms
  - `entriesFound` (number): Knowledge base entries used
  - `topics` (array): Topics covered in response

**No Relevant Entries (200 OK):**

If the question isn't covered by the knowledge base:

```json
{
  "message": "I don't have information about that in my knowledge base. I'm focused on Mike's professional experience, projects, and consulting services. Is there something specific about his work I can help you with?",
  "suggestions": [
    "What has Mike worked on?",
    "Tell me about the AI Memory System",
    "How does Mike help with process optimization?"
  ],
  "metadata": {
    "retrievalTime": 8,
    "entriesFound": 0
  }
}
```

**Rate Limit Exceeded (429 Too Many Requests):**

```json
{
  "error": "Rate limit exceeded. You can send 10 messages per hour.",
  "retryAfter": 2400
}
```

**Headers:**
```http
Retry-After: 2400
```

**Field Descriptions:**
- `error` (string): Human-readable error message
- `retryAfter` (number): Seconds until rate limit resets

**Invalid Request (400 Bad Request):**

```json
{
  "error": "Invalid request. Please provide a message."
}
```

**Server Error (500 Internal Server Error):**

```json
{
  "error": "Internal server error. Please try again.",
  "message": "I'm having trouble connecting to my knowledge base right now. Please try again in a moment, or contact Mike directly at mike@mikejones.online."
}
```

## Rate Limits

- **Visitor limit:** 10 messages per hour (tracked by session ID)
- **IP limit:** 100 messages per day (tracked by IP address)

Rate limits reset on a rolling window (not fixed time blocks).

## CORS

**Allowed Origins:**
- `https://mikejones.online`
- `https://www.mikejones.online`
- `http://localhost:3000` (for local development)
- `http://127.0.0.1:3000` (for local development)

**Preflight Request:**

```http
OPTIONS /chat HTTP/1.1
Origin: https://mikejones.online
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, X-Session-ID
```

**Response:**

```http
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://mikejones.online
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Session-ID
Access-Control-Max-Age: 86400
```

## Sample Integration (JavaScript)

### Basic Example

```javascript
async function sendMessage(message) {
  const sessionId = getOrCreateSessionId();

  const response = await fetch('https://chat-api.mikejones.online/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Session-ID': sessionId
    },
    body: JSON.stringify({ message })
  });

  if (!response.ok) {
    if (response.status === 429) {
      const data = await response.json();
      throw new Error(data.error);
    }
    throw new Error('Failed to send message');
  }

  return response.json();
}

function getOrCreateSessionId() {
  let sessionId = localStorage.getItem('chatbot-session-id');
  if (!sessionId) {
    sessionId = 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('chatbot-session-id', sessionId);
  }
  return sessionId;
}

// Usage
try {
  const result = await sendMessage("What has Mike worked on?");
  console.log(result.message);
  console.log("Suggestions:", result.suggestions);
} catch (error) {
  console.error("Error:", error.message);
}
```

### With Error Handling and Retry

```javascript
async function sendMessageWithRetry(message, maxRetries = 3) {
  const sessionId = getOrCreateSessionId();

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch('https://chat-api.mikejones.online/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': sessionId
        },
        body: JSON.stringify({ message }),
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      if (response.status === 429) {
        const data = await response.json();
        throw new RateLimitError(data.error, data.retryAfter);
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();

    } catch (error) {
      if (error instanceof RateLimitError) {
        // Don't retry rate limit errors
        throw error;
      }

      if (attempt === maxRetries - 1) {
        throw error;
      }

      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
}

class RateLimitError extends Error {
  constructor(message, retryAfter) {
    super(message);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}
```

### Frontend Display Example

```javascript
// Add message to chat UI
function displayBotMessage(data) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'bot-message';
  messageDiv.textContent = data.message;

  document.getElementById('chat-messages').appendChild(messageDiv);

  // Show suggestions
  if (data.suggestions && data.suggestions.length > 0) {
    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.className = 'suggestions';

    data.suggestions.forEach(suggestion => {
      const button = document.createElement('button');
      button.textContent = suggestion;
      button.onclick = () => sendMessage(suggestion);
      suggestionsDiv.appendChild(button);
    });

    document.getElementById('chat-messages').appendChild(suggestionsDiv);
  }

  // Log performance
  console.log(`Response time: ${data.metadata.totalTime}ms`);
  console.log(`Topics: ${data.metadata.topics.join(', ')}`);
}

// Handle rate limiting
function handleRateLimit(error) {
  const minutes = Math.ceil(error.retryAfter / 60);
  const messageDiv = document.createElement('div');
  messageDiv.className = 'error-message';
  messageDiv.textContent = `Rate limit reached. Please try again in ${minutes} minute${minutes > 1 ? 's' : ''}.`;

  document.getElementById('chat-messages').appendChild(messageDiv);
}
```

## Testing Endpoints

### Test with cURL

**Basic request:**
```bash
curl -X POST https://chat-api.mikejones.online/chat \
  -H "Content-Type: application/json" \
  -H "Origin: https://mikejones.online" \
  -H "X-Session-ID: test-123" \
  -d '{"message": "What has Mike worked on?"}'
```

**Test rate limiting:**
```bash
# Send 11 requests quickly
for i in {1..11}; do
  echo "Request $i:"
  curl -X POST https://chat-api.mikejones.online/chat \
    -H "Content-Type: application/json" \
    -H "X-Session-ID: rate-limit-test" \
    -d '{"message": "Test"}' | jq -r '.error // .message' | head -c 50
  echo ""
done
```

### Sample Test Questions

Use these to test knowledge base coverage:

1. **General Experience:**
   - "What has Mike worked on?"
   - "Tell me about Mike's background"

2. **Specific Projects:**
   - "Tell me about the AI Memory System"
   - "What is NeighborhoodShare?"
   - "What are the 7 Pillars of Resilient Tomorrow?"

3. **Services & Fit:**
   - "What services does Mike offer?"
   - "How does Mike help with process optimization?"
   - "Is Mike a good fit for my startup?"

4. **Technical Details:**
   - "What is the VINCE tool?"
   - "How does the memory system work?"
   - "What tech stack does Mike use?"

5. **Edge Cases:**
   - "What's Mike's favorite color?" (not in knowledge base)
   - "" (empty message - should return error)
   - "Lorem ipsum dolor sit amet..." (irrelevant - fallback response)

## Performance Expectations

- **P50 (median):** < 1.5s
- **P95:** < 2s
- **P99:** < 3s

**Breakdown:**
- Rate limit check: 5-10ms
- RAG retrieval: 10-50ms
- OpenAI API: 1-2s (varies by load)
- Response formatting: < 5ms

## Frontend Implementation Checklist

- [ ] Generate and store session ID in localStorage
- [ ] Send X-Session-ID header with all requests
- [ ] Handle 429 rate limit errors gracefully
- [ ] Display retry time to user when rate limited
- [ ] Implement loading state during API call
- [ ] Show typing indicator (1-2 second delay)
- [ ] Display suggestions as clickable buttons
- [ ] Handle network errors with retry logic
- [ ] Log performance metrics (optional)
- [ ] Test on all browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on mobile (iOS Safari, Android Chrome)

## Support

Questions about the API?
- **Technical Issues:** Review DEPLOYMENT.md troubleshooting section
- **Integration Help:** Contact backend team or mike@mikejones.online
- **Feature Requests:** Submit via project roadmap (Phase 2 enhancements)
