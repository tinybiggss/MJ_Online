# MJ Chatbot Backend

RAG-powered AI chatbot backend for MikeJones.online using Cloudflare Workers and OpenAI GPT-3.5-turbo.

## Overview

This backend provides a serverless API endpoint that:
- Retrieves relevant information from Mike's 190-entry knowledge base using keyword-based RAG
- Generates contextual responses using OpenAI GPT-3.5-turbo
- Implements rate limiting (10 msg/visitor/hour, 100/IP/day)
- Logs conversations anonymously for analytics (30-day retention)
- Responds in < 2 seconds (P95 target)

## Architecture

```
User Question → POST /chat
    ↓
Rate Limiting Check (Cloudflare Workers KV)
    ↓
RAG Retrieval (keyword-based, 190 entries)
    ↓
OpenAI GPT-3.5 (context injection + response generation)
    ↓
JSON Response + Suggestions
```

## Project Structure

```
mj-chatbot-backend/
├── src/
│   ├── index.js              # Main Cloudflare Worker entry point
│   ├── rag-retrieval.js      # RAG retrieval system
│   ├── ai-integration.js     # OpenAI API integration
│   ├── rate-limiter.js       # Rate limiting logic
│   ├── knowledge-loader.js   # Knowledge base build script
│   └── knowledge-data.js     # Generated knowledge module (190 entries)
├── test/
│   └── test-rag-retrieval.js # RAG retrieval tests
├── knowledge.jsonl           # Source knowledge base (190 entries)
├── wrangler.toml             # Cloudflare Workers configuration
├── package.json
└── README.md
```

## Setup

### Prerequisites

- Node.js 18+
- Cloudflare account (free tier)
- OpenAI API key

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**

Create `.env` file (for local development):
```bash
cp .env.example .env
# Edit .env and add your OpenAI API key
```

For Cloudflare Workers deployment, set secrets:
```bash
npx wrangler secret put OPENAI_API_KEY
# Enter your OpenAI API key when prompted
```

3. **Create Cloudflare KV namespace (for rate limiting):**
```bash
npx wrangler kv:namespace create RATE_LIMIT
# Copy the ID and update wrangler.toml
```

4. **Build knowledge base module:**
```bash
node src/knowledge-loader.js
# Generates src/knowledge-data.js from knowledge.jsonl
```

## Development

### Run Tests

Test RAG retrieval accuracy:
```bash
node test/test-rag-retrieval.js
```

### Local Development

Start local dev server:
```bash
npx wrangler dev
```

This starts a local server at `http://localhost:8787`

Test the endpoint:
```bash
curl -X POST http://localhost:8787/chat \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{"message": "What has Mike worked on?"}'
```

## Deployment

### Deploy to Cloudflare Workers

```bash
npx wrangler deploy
```

This deploys to: `https://mj-chatbot-backend.<your-subdomain>.workers.dev`

### Custom Domain (Optional)

Add a custom domain in Cloudflare Workers dashboard:
```
https://chat-api.mikejones.online
```

## API Reference

### POST /chat

**Endpoint:** `POST /chat`

**Headers:**
- `Content-Type: application/json`
- `Origin: https://mikejones.online` (required for CORS)
- `X-Session-ID: <session-id>` (optional, for rate limiting)

**Request Body:**
```json
{
  "message": "What has Mike worked on?"
}
```

**Success Response (200):**
```json
{
  "message": "Mike has 29 years of experience in program and project management...",
  "suggestions": [
    "Tell me more about Mike's experience",
    "What services does Mike offer?",
    "How can I contact Mike?"
  ],
  "metadata": {
    "retrievalTime": 15,
    "aiGenerationTime": 1200,
    "totalTime": 1215,
    "entriesFound": 5,
    "topics": ["career_history", "skills"]
  }
}
```

**Rate Limit Response (429):**
```json
{
  "error": "Rate limit exceeded. You can send 10 messages per hour.",
  "retryAfter": 2400
}
```

**Error Response (400/500):**
```json
{
  "error": "Invalid request. Please provide a message."
}
```

## Rate Limiting

- **Visitor limit:** 10 messages per hour (session-based)
- **IP limit:** 100 messages per day
- Uses Cloudflare Workers KV for tracking

## Knowledge Base

### Source

- **File:** `knowledge.jsonl` (190 entries)
- **Format:** JSONL (one JSON object per line)
- **Schema:** See `/Cowork/content/rag/RAG_SCHEMA.md`

### Entry Types

- `fact` - Atomic facts (70 entries)
- `narrative` - Contextual explanations (45 entries)
- `qa_pair` - Pre-formatted Q&A (50 entries)
- `fit_assessment` - Client fit evaluation (15 entries)
- `technical` - Technical details (10 entries)

### Updating Knowledge Base

1. Edit `knowledge.jsonl` (follow RAG_SCHEMA.md)
2. Rebuild module: `node src/knowledge-loader.js`
3. Test: `node test/test-rag-retrieval.js`
4. Deploy: `npx wrangler deploy`

## RAG Retrieval System

### Algorithm

1. **Extract keywords** from question (remove stop words)
2. **Score entries** based on:
   - Content matches (3 points)
   - Topic matches (2 points)
   - Title matches (2 points)
   - Tag matches (1 point)
   - QA pair question matches (5 points bonus)
   - Verified confidence (+1 point)
3. **Rank entries** by score
4. **Return top 5** entries

### Example Queries

| Query | Top Entries Retrieved |
|-------|----------------------|
| "What has Mike worked on?" | career_history, skills, qa_pairs |
| "Tell me about AI Memory System" | project_ai_memory (narrative, qa_pair, technical) |
| "How does Mike help with process optimization?" | services, fit, career_history |
| "What are the 7 Pillars?" | project_resilient_tomorrow (framework, narrative) |

## AI Integration

### Model

- **Provider:** OpenAI
- **Model:** GPT-3.5-turbo
- **Temperature:** 0.7 (balanced creativity/consistency)
- **Max Tokens:** 500 (concise responses)

### System Prompt

The chatbot is instructed to:
- Only answer from knowledge base entries
- Be professional but approachable
- Keep responses concise (2-3 paragraphs)
- Always offer next steps
- Be honest about limitations

### Cost Estimation

- **GPT-3.5-turbo:** ~$0.002 per conversation
- **Expected traffic:** 500-2500 conversations/month
- **Monthly cost:** $1-10

## Testing

### Test Coverage

- ✅ Knowledge base loading (190 entries)
- ✅ Keyword extraction
- ✅ RAG retrieval accuracy (85%+ relevance)
- ✅ Entry scoring and ranking
- ✅ Context formatting for AI
- ✅ Edge cases (empty queries, non-matches)

### Sample Test Questions

1. "Tell me about Mike's AI implementation experience"
2. "What has Mike worked on?"
3. "Tell me about the AI Memory System"
4. "What are the 7 Pillars of Resilient Tomorrow?"
5. "How does Mike help companies with process optimization?"

### Running Tests

```bash
# RAG retrieval tests
node test/test-rag-retrieval.js

# Expected output: 5/5 queries return relevant entries
```

## Performance Targets

- **Response time:** < 2s (P95)
- **RAG retrieval:** < 50ms
- **OpenAI API:** 1-2s (external dependency)
- **Rate limit check:** < 10ms

## Security

- **CORS:** Restricted to mikejones.online domain
- **Rate limiting:** Prevents abuse and cost attacks
- **Input validation:** Sanitizes user messages
- **Anonymous logging:** No PII collection (30-day retention)

## Monitoring

### Logs

Cloudflare Workers dashboard shows:
- Request volume
- Error rates
- Response times
- KV operations

### Analytics

Anonymous conversation logs stored in KV:
- Timestamp
- Question topic
- Entries retrieved
- Response success

Logs auto-delete after 30 days.

## Troubleshooting

### Issue: "Knowledge base initialization failed"

**Solution:** Rebuild knowledge module:
```bash
node src/knowledge-loader.js
```

### Issue: "OpenAI API error: 401"

**Solution:** Check API key:
```bash
npx wrangler secret put OPENAI_API_KEY
```

### Issue: "Rate limit KV namespace not found"

**Solution:** Create KV namespace and update `wrangler.toml`:
```bash
npx wrangler kv:namespace create RATE_LIMIT
```

### Issue: "CORS error"

**Solution:** Verify origin in request headers matches allowed origins in `src/index.js`

## Next Steps

### Frontend Integration (Week 2)

The frontend widget will:
1. Generate session ID (localStorage)
2. POST to `/chat` endpoint
3. Display response with typing indicator
4. Handle rate limit errors gracefully

### Phase 2 Enhancements

- Cal.com integration for scheduling
- "Learn more" page links
- Improved suggested questions based on analytics
- Knowledge base expansion (20-30 new entries)

## License

Proprietary - Mike Jones / Jones Collaboration Company, LLC

## Contact

For questions about this backend:
- **Mike Jones:** mike@mikejones.online
- **Project:** MJ_Online chatbot (Phase 7.6)
