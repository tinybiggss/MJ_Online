# Implementation Tasks: RAG-Powered AI Chatbot

## Pre-Implementation

- [ ] 0.1 Review and approve proposal
- [ ] 0.2 Decide on architecture option (Serverless/Self-hosted/Hybrid)
- [ ] 0.3 Decide on AI provider (OpenAI/Claude/Local LLM)
- [ ] 0.4 Answer open questions (privacy, persistence, rate limits)
- [ ] 0.5 Ensure core website content is published and live

## 1. Backend Implementation (Phase 1: MVP)

### 1.1 Project Setup
- [ ] 1.1.1 Create new repository for chatbot backend
- [ ] 1.1.2 Set up Cloudflare Workers project
- [ ] 1.1.3 Configure environment variables (OpenAI API key, CORS settings)
- [ ] 1.1.4 Set up local development environment

### 1.2 Knowledge Base Integration
- [ ] 1.2.1 Copy knowledge.jsonl to backend repository
- [ ] 1.2.2 Implement JSONL parser and loader
- [ ] 1.2.3 Create knowledge base indexing function
- [ ] 1.2.4 Implement filtering by topic, type, confidence
- [ ] 1.2.5 Build relevance ranking algorithm

### 1.3 RAG Retrieval System
- [ ] 1.3.1 Implement question parsing logic
- [ ] 1.3.2 Build keyword-based retrieval (MVP approach)
- [ ] 1.3.3 Create entry ranking and selection (top 3-5 most relevant)
- [ ] 1.3.4 Format retrieved entries for AI context injection
- [ ] 1.3.5 Handle edge cases (no matches, multiple topics)

### 1.4 AI Integration
- [ ] 1.4.1 Set up OpenAI API client
- [ ] 1.4.2 Create system prompt with chatbot behavior guidelines
- [ ] 1.4.3 Implement context injection from RAG entries
- [ ] 1.4.4 Build response generation function
- [ ] 1.4.5 Add error handling and fallback responses
- [ ] 1.4.6 Implement rate limiting (10 messages/visitor/hour)

### 1.5 API Endpoint
- [ ] 1.5.1 Create POST /chat endpoint
- [ ] 1.5.2 Implement request validation
- [ ] 1.5.3 Add CORS headers for mikejones.online
- [ ] 1.5.4 Build response streaming (optional)
- [ ] 1.5.5 Add logging for analytics (privacy-compliant)

### 1.6 Testing
- [ ] 1.6.1 Unit tests for JSONL parsing
- [ ] 1.6.2 Unit tests for RAG retrieval
- [ ] 1.6.3 Integration tests for chat endpoint
- [ ] 1.6.4 Test with sample questions from specification
- [ ] 1.6.5 Validate response quality against knowledge base
- [ ] 1.6.6 Load testing for rate limits

## 2. Frontend Widget (Phase 1: MVP)

### 2.1 Widget Development
- [ ] 2.1.1 Create widget HTML structure
- [ ] 2.1.2 Build CSS styles (minimized and expanded states)
- [ ] 2.1.3 Implement JavaScript widget initialization
- [ ] 2.1.4 Add conversation state management
- [ ] 2.1.5 Build message rendering (user and bot messages)
- [ ] 2.1.6 Add typing indicator animation

### 2.2 User Interface
- [ ] 2.2.1 Design chat icon (bottom-right corner)
- [ ] 2.2.2 Create expand/collapse animations
- [ ] 2.2.3 Implement input field and send button
- [ ] 2.2.4 Add suggested questions display
- [ ] 2.2.5 Build message history scrolling
- [ ] 2.2.6 Add privacy disclosure footer

### 2.3 Responsive Design
- [ ] 2.3.1 Desktop layout (400px × 600px window)
- [ ] 2.3.2 Mobile layout (full-screen overlay)
- [ ] 2.3.3 Tablet breakpoints
- [ ] 2.3.4 Test across devices and browsers

### 2.4 Accessibility
- [ ] 2.4.1 Keyboard navigation (Tab, Enter, Esc)
- [ ] 2.4.2 ARIA labels for screen readers
- [ ] 2.4.3 Focus management
- [ ] 2.4.4 Color contrast compliance (WCAG AA)
- [ ] 2.4.5 Screen reader testing (NVDA/VoiceOver)

### 2.5 API Integration
- [ ] 2.5.1 Implement fetch() to backend endpoint
- [ ] 2.5.2 Handle loading states
- [ ] 2.5.3 Error handling and retry logic
- [ ] 2.5.4 Timeout handling
- [ ] 2.5.5 Rate limit feedback to user

## 3. Ghost Integration (Phase 1: MVP)

### 3.1 Code Injection
- [ ] 3.1.1 Access Ghost Admin → Settings → Code Injection
- [ ] 3.1.2 Add widget script tag to Site Footer
- [ ] 3.1.3 Configure widget initialization with settings
- [ ] 3.1.4 Test on staging environment
- [ ] 3.1.5 Verify no conflicts with Ghost theme

### 3.2 Asset Hosting
- [ ] 3.2.1 Choose CDN for widget assets (Cloudflare R2, AWS S3, or GitHub)
- [ ] 3.2.2 Upload JavaScript bundle
- [ ] 3.2.3 Upload CSS styles
- [ ] 3.2.4 Configure CORS headers
- [ ] 3.2.5 Test asset loading from CDN

### 3.3 Configuration
- [ ] 3.3.1 Set API endpoint URL
- [ ] 3.3.2 Configure theme colors to match site
- [ ] 3.3.3 Set greeting message
- [ ] 3.3.4 Define suggested questions
- [ ] 3.3.5 Set widget position and behavior

## 4. Analytics & Monitoring (Phase 1: MVP)

### 4.1 Conversation Analytics
- [ ] 4.1.1 Track conversation volume (daily/weekly/monthly)
- [ ] 4.1.2 Log popular topics asked
- [ ] 4.1.3 Track engagement rate (% visitors who interact)
- [ ] 4.1.4 Monitor question types (career/projects/services/fit)
- [ ] 4.1.5 Log unhandled queries for knowledge base expansion

### 4.2 Performance Monitoring
- [ ] 4.2.1 Track API response times
- [ ] 4.2.2 Monitor error rates
- [ ] 4.2.3 Set up uptime monitoring (UptimeRobot or Cloudflare)
- [ ] 4.2.4 Log rate limit hits
- [ ] 4.2.5 Monitor OpenAI API costs

### 4.3 Quality Metrics
- [ ] 4.3.1 Implement thumbs up/down feedback
- [ ] 4.3.2 Track "I don't know" response frequency
- [ ] 4.3.3 Monitor conversation length (messages per session)
- [ ] 4.3.4 Track CTA clicks (contact/schedule)

## 5. Testing & Quality Assurance (Phase 1: MVP)

### 5.1 Functional Testing
- [ ] 5.1.1 Test all suggested questions
- [ ] 5.1.2 Verify response accuracy against knowledge base
- [ ] 5.1.3 Test conversation flow and follow-ups
- [ ] 5.1.4 Validate fit assessment logic
- [ ] 5.1.5 Test "I don't know" fallback responses

### 5.2 Integration Testing
- [ ] 5.2.1 Test widget on all major pages (Home, About, Projects, etc.)
- [ ] 5.2.2 Verify mobile responsiveness
- [ ] 5.2.3 Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] 5.2.4 Test with slow network conditions
- [ ] 5.2.5 Verify accessibility with assistive technologies

### 5.3 Security Testing
- [ ] 5.3.1 Validate rate limiting effectiveness
- [ ] 5.3.2 Test CORS configuration
- [ ] 5.3.3 Verify no sensitive data leakage
- [ ] 5.3.4 Test input sanitization
- [ ] 5.3.5 Review privacy compliance (GDPR)

## 6. Documentation (Phase 1: MVP)

### 6.1 User Documentation
- [ ] 6.1.1 Create privacy policy section for chatbot
- [ ] 6.1.2 Document data collection practices
- [ ] 6.1.3 Add FAQ about chatbot capabilities

### 6.2 Technical Documentation
- [ ] 6.2.1 Document API endpoints and parameters
- [ ] 6.2.2 Create knowledge base update workflow
- [ ] 6.2.3 Document deployment process
- [ ] 6.2.4 Create troubleshooting guide
- [ ] 6.2.5 Document analytics dashboard

### 6.3 Maintenance Documentation
- [ ] 6.3.1 Knowledge base expansion guidelines
- [ ] 6.3.2 Monitoring checklist
- [ ] 6.3.3 Cost tracking and optimization
- [ ] 6.3.4 Backup and recovery procedures

## 7. Deployment (Phase 1: MVP)

### 7.1 Staging Deployment
- [ ] 7.1.1 Deploy backend to Cloudflare Workers (staging)
- [ ] 7.1.2 Deploy widget assets to CDN (staging)
- [ ] 7.1.3 Add code injection to Ghost staging site
- [ ] 7.1.4 End-to-end testing on staging
- [ ] 7.1.5 Performance testing on staging

### 7.2 Production Deployment
- [ ] 7.2.1 Deploy backend to Cloudflare Workers (production)
- [ ] 7.2.2 Deploy widget assets to CDN (production)
- [ ] 7.2.3 Update Ghost code injection to production URLs
- [ ] 7.2.4 Verify deployment on mikejones.online
- [ ] 7.2.5 Monitor initial traffic and errors

### 7.3 Launch Activities
- [ ] 7.3.1 Announce chatbot feature (if applicable)
- [ ] 7.3.2 Monitor first 24 hours closely
- [ ] 7.3.3 Collect initial feedback
- [ ] 7.3.4 Document any issues and quick fixes
- [ ] 7.3.5 Update roadmap with Phase 2 plans

## 8. Phase 2: Enhanced Features (Post-MVP)

### 8.1 UX Improvements
- [ ] 8.1.1 Add "Learn more" links to relevant pages
- [ ] 8.1.2 Integrate Cal.com for direct scheduling
- [ ] 8.1.3 Improve conversation context awareness
- [ ] 8.1.4 Add conversation history (optional)
- [ ] 8.1.5 A/B test greeting messages

### 8.2 Analytics Enhancements
- [ ] 8.2.1 Build analytics dashboard
- [ ] 8.2.2 Add session replay (PostHog or similar)
- [ ] 8.2.3 Advanced topic clustering
- [ ] 8.2.4 Conversion funnel analysis

### 8.3 Knowledge Base Expansion
- [ ] 8.3.1 Analyze unhandled questions
- [ ] 8.3.2 Add 20-30 new RAG entries based on gaps
- [ ] 8.3.3 Improve fit_assessment entries
- [ ] 8.3.4 Add more qa_pair entries for common questions

## 9. Phase 3: Self-Hosted Option (Optional)

### 9.1 Infrastructure Setup
- [ ] 9.1.1 Provision VPS (DigitalOcean/Linode)
- [ ] 9.1.2 Install Ollama and local LLM (Qwen 2.5:14B)
- [ ] 9.1.3 Set up vector database (ChromaDB/Qdrant)
- [ ] 9.1.4 Build Python FastAPI backend
- [ ] 9.1.5 Implement embedding-based RAG retrieval

### 9.2 Migration
- [ ] 9.2.1 Test response quality vs OpenAI
- [ ] 9.2.2 Implement gradual traffic migration
- [ ] 9.2.3 Monitor performance and accuracy
- [ ] 9.2.4 Document cost savings
- [ ] 9.2.5 Update documentation for self-hosted approach

## 10. Archive Change

- [ ] 10.1 Verify all tasks complete
- [ ] 10.2 Run `openspec validate add-rag-chatbot --strict --no-interactive`
- [ ] 10.3 Run `openspec archive add-rag-chatbot --yes`
- [ ] 10.4 Update roadmap to mark feature complete
- [ ] 10.5 Document lessons learned

---

**Note:** Tasks are numbered for sequential implementation. Some tasks within sections can be parallelized. Each checkbox must be completed before marking the feature as done.
