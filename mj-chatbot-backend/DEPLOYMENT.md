# Deployment Guide - MJ Chatbot Backend

## Prerequisites Checklist

- [ ] Cloudflare account (free tier is sufficient)
- [ ] OpenAI API key with billing set up
- [ ] Node.js 18+ installed
- [ ] Wrangler CLI installed (`npm install -g wrangler` or use `npx wrangler`)

## Step-by-Step Deployment

### 1. Authenticate with Cloudflare

```bash
npx wrangler login
```

This opens a browser window to authorize Wrangler with your Cloudflare account.

### 2. Create KV Namespace for Rate Limiting

```bash
npx wrangler kv:namespace create RATE_LIMIT
```

**Output:**
```
✨ Success!
Add the following to your configuration file:
[[kv_namespaces]]
binding = "RATE_LIMIT"
id = "YOUR_KV_NAMESPACE_ID"
```

**Action:** Copy the `id` and update `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "RATE_LIMIT"
id = "YOUR_KV_NAMESPACE_ID_HERE"  # Replace with your actual ID
```

### 3. Set OpenAI API Key as Secret

```bash
npx wrangler secret put OPENAI_API_KEY
```

**Prompt:**
```
Enter a secret value: [paste your OpenAI API key]
```

**Verify it's set:**
```bash
npx wrangler secret list
```

### 4. Build Knowledge Base Module

```bash
npm run build
```

**Output:**
```
Knowledge base module generated: /path/to/src/knowledge-data.js
```

### 5. Test Locally (Optional)

```bash
npm run dev
```

**Open another terminal and test:**
```bash
curl -X POST http://localhost:8787/chat \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -H "X-Session-ID: test-session-123" \
  -d '{"message": "What has Mike worked on?"}'
```

**Expected Response:**
```json
{
  "message": "Mike has 29 years of experience...",
  "suggestions": [...],
  "metadata": {...}
}
```

### 6. Deploy to Production

```bash
npm run deploy
```

**Output:**
```
Total Upload: 450.00 KiB / gzip: 120.00 KiB
Uploaded mj-chatbot-backend (1.23 sec)
Published mj-chatbot-backend (2.34 sec)
  https://mj-chatbot-backend.YOUR-SUBDOMAIN.workers.dev
```

### 7. Test Production Deployment

```bash
curl -X POST https://mj-chatbot-backend.YOUR-SUBDOMAIN.workers.dev/chat \
  -H "Content-Type: application/json" \
  -H "Origin: https://mikejones.online" \
  -H "X-Session-ID: test-prod-123" \
  -d '{"message": "Tell me about the AI Memory System"}'
```

### 8. Set Up Custom Domain (Optional)

**Via Cloudflare Dashboard:**

1. Go to Workers & Pages → mj-chatbot-backend → Settings → Domains & Routes
2. Click "Add Custom Domain"
3. Enter: `chat-api.mikejones.online`
4. Cloudflare automatically creates DNS records

**Result:** API accessible at `https://chat-api.mikejones.online/chat`

## Post-Deployment Verification

### ✅ Checklist

- [ ] **Health check:** `curl https://your-worker.workers.dev/health` (should return 404, that's expected - we only have /chat endpoint)
- [ ] **Chat endpoint:** POST to `/chat` returns valid JSON
- [ ] **Rate limiting:** Send 11 messages in < 1 hour → get 429 error
- [ ] **CORS:** Origin header from mikejones.online works
- [ ] **Knowledge base:** Responses reference 190-entry knowledge base
- [ ] **Response time:** P95 < 2 seconds

### Test Rate Limiting

```bash
# Send 11 requests quickly
for i in {1..11}; do
  echo "Request $i:"
  curl -X POST https://your-worker.workers.dev/chat \
    -H "Content-Type: application/json" \
    -H "Origin: https://mikejones.online" \
    -H "X-Session-ID: rate-limit-test" \
    -d '{"message": "Test message"}' | jq '.error'
  sleep 1
done
```

**Expected:** Request #11 returns `"Rate limit exceeded..."`

## Monitoring

### Cloudflare Dashboard

**Workers & Pages → mj-chatbot-backend → Metrics**

Monitor:
- Requests per second
- Error rate (< 1% target)
- CPU time (< 50ms target)
- KV operations (rate limiting)

### View Logs

**Real-time logs:**
```bash
npx wrangler tail
```

**Filter errors only:**
```bash
npx wrangler tail --status error
```

## Updating the Chatbot

### Update Knowledge Base

1. Edit `/Users/michaeljones/Dev/MJ_Online/Cowork/content/rag/knowledge.jsonl`
2. Copy to backend: `cp /path/to/knowledge.jsonl ./knowledge.jsonl`
3. Rebuild: `npm run build`
4. Deploy: `npm run deploy`

### Update AI Behavior (System Prompt)

1. Edit `src/ai-integration.js` → `SYSTEM_PROMPT`
2. Deploy: `npm run deploy`

### Update Rate Limits

1. Edit `src/rate-limiter.js` → `VISITOR_LIMIT` and `IP_LIMIT`
2. Deploy: `npm run deploy`

## Rollback

If deployment breaks something:

```bash
# Deploy previous version
npx wrangler rollback

# Or deploy specific version
npx wrangler rollback --message "Rollback to v1.0"
```

## Cost Monitoring

### Expected Costs

**Cloudflare Workers:**
- Free tier: 100,000 requests/day
- Exceeding free tier: $0.50 per million requests

**Cloudflare KV:**
- Free tier: 100,000 reads/day, 1,000 writes/day
- Exceeding free tier: minimal cost (< $1/month)

**OpenAI API (GPT-3.5-turbo):**
- $0.50 per 1M input tokens
- $1.50 per 1M output tokens
- Estimated: $0.002 per conversation
- **Monthly estimate (500-2500 conversations):** $1-10

**Total: $1-10/month**

### Set Budget Alerts

**OpenAI Dashboard:**
1. Settings → Billing → Usage limits
2. Set hard limit: $50/month
3. Set email alert: $10/month

**Cloudflare Dashboard:**
1. Workers & Pages → Billing
2. Enable email alerts for free tier limits

## Troubleshooting

### Issue: Deployment fails with "No such KV namespace"

**Solution:**
```bash
# Recreate KV namespace
npx wrangler kv:namespace create RATE_LIMIT

# Update wrangler.toml with new ID
```

### Issue: OpenAI API errors (401 Unauthorized)

**Solution:**
```bash
# Reset secret
npx wrangler secret delete OPENAI_API_KEY
npx wrangler secret put OPENAI_API_KEY
# Enter correct API key
```

### Issue: CORS errors in browser

**Solution:** Verify allowed origins in `src/index.js`:
```javascript
const allowedOrigins = [
  'https://mikejones.online',
  'https://www.mikejones.online',
  // Add your domain here
];
```

### Issue: Slow response times (> 5s)

**Possible causes:**
- OpenAI API latency (check OpenAI status page)
- Large knowledge base (190 entries should be fine)
- Cold start (first request after idle)

**Solutions:**
- Switch to GPT-4 Turbo (faster but more expensive)
- Add caching for common questions (Phase 2)
- Warm up worker with cron trigger

## Security Best Practices

### ✅ Implemented

- CORS restricted to mikejones.online
- Rate limiting (10/hour, 100/day)
- Input validation and sanitization
- Anonymous logging (no PII)
- Secrets stored in Cloudflare (not in code)

### 🔒 Additional Recommendations

1. **Monitor for abuse patterns** in Cloudflare logs
2. **Rotate OpenAI API key** quarterly
3. **Review conversation logs** monthly for quality
4. **Set up budget alerts** (OpenAI + Cloudflare)
5. **Enable Cloudflare WAF** if traffic scales

## Next Steps After Deployment

1. **Frontend Integration** (Week 2)
   - Build JavaScript widget
   - Connect to this backend API
   - Handle rate limiting gracefully

2. **Analytics Setup** (Week 3)
   - Track conversation topics
   - Monitor popular questions
   - Identify knowledge gaps

3. **Ghost Integration** (Week 3)
   - Add widget to site footer via code injection
   - Test on all pages
   - Verify mobile responsiveness

4. **Launch** (Week 4)
   - Soft launch with limited visibility
   - Monitor for 24 hours
   - Full launch to all visitors

## Support

For deployment issues:
- **Cloudflare Docs:** https://developers.cloudflare.com/workers/
- **OpenAI Docs:** https://platform.openai.com/docs/
- **Project Contact:** mike@mikejones.online
