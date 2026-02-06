# Implementation Tasks: Job Fit Analyzer Tool

## Pre-Implementation

- [ ] 0.1 Review and approve proposal
- [ ] 0.2 Answer open questions (page location, analysis depth, scoring system, privacy, access control)
- [ ] 0.3 Decide if sharing backend with chatbot or standalone
- [ ] 0.4 Design mockups/wireframes for results display
- [ ] 0.5 Ensure core website content is published and live

## 1. Page Design & Frontend (Phase 1: MVP)

### 1.1 Create Ghost Page
- [ ] 1.1.1 Create new page in Ghost at `/fit-analyzer`
- [ ] 1.1.2 Set page title: "Assess Your Job Fit"
- [ ] 1.1.3 Write page introduction and instructions
- [ ] 1.1.4 Add SEO metadata (title, description, keywords)
- [ ] 1.1.5 Configure page settings (visibility, published)

### 1.2 Form Design
- [ ] 1.2.1 Design form layout (desktop and mobile)
- [ ] 1.2.2 Create textarea component for job description (500-5000 chars)
- [ ] 1.2.3 Add character counter with min/max indicators
- [ ] 1.2.4 Design "Analyze Fit" submit button (prominent, clear)
- [ ] 1.2.5 Add loading state (spinner, "Analyzing..." message)
- [ ] 1.2.6 Include example job description (collapsible, optional)
- [ ] 1.2.7 Add privacy notice ("Your job description is analyzed privately and not stored")

### 1.3 Results Display Design
- [ ] 1.3.1 Design results layout (sections for each analysis category)
- [ ] 1.3.2 Create visual indicators (icons, colors) for fit levels:
  - Green checkmark for Strong Matches
  - Yellow caution for Discussion Areas
  - Orange/Red for Potential Gaps
  - Overall fit badge (High/Medium/Low)
- [ ] 1.3.3 Design expandable sections for detailed breakdown
- [ ] 1.3.4 Add CTA section (Schedule Call, Contact Mike, Ask Questions in Chat)
- [ ] 1.3.5 Include "Analyze Another" button to reset form
- [ ] 1.3.6 Design error state (if analysis fails)

### 1.4 Accessibility & Responsiveness
- [ ] 1.4.1 Ensure keyboard navigation (Tab, Enter, Esc)
- [ ] 1.4.2 Add ARIA labels and roles
- [ ] 1.4.3 Test screen reader compatibility
- [ ] 1.4.4 Verify color contrast (WCAG AA)
- [ ] 1.4.5 Responsive layout for mobile (< 768px)
- [ ] 1.4.6 Tablet breakpoints (768px - 1024px)
- [ ] 1.4.7 Test across browsers (Chrome, Firefox, Safari, Edge)

## 2. Backend Implementation (Phase 1: MVP)

### 2.1 Job Description Parser
- [ ] 2.1.1 Create job description text extraction function
- [ ] 2.1.2 Identify key sections (responsibilities, requirements, qualifications, nice-to-haves)
- [ ] 2.1.3 Extract required skills/technologies (keywords)
- [ ] 2.1.4 Extract experience requirements (years, level)
- [ ] 2.1.5 Extract industry/domain context
- [ ] 2.1.6 Extract role type (PM, Director, IC, Consultant)
- [ ] 2.1.7 Handle various JD formats gracefully

### 2.2 RAG Retrieval System
- [ ] 2.2.1 Reuse knowledge base loader from chatbot (if exists)
- [ ] 2.2.2 Build job-specific retrieval logic:
  - Match required skills to Mike's skills
  - Match required experience to career history
  - Match industry to past roles
  - Match role type to past titles
- [ ] 2.2.3 Rank knowledge entries by relevance to job requirements
- [ ] 2.2.4 Select top 10-15 most relevant entries
- [ ] 2.2.5 Categorize entries by fit type (strong match, partial match, missing)

### 2.3 Fit Analysis Algorithm
- [ ] 2.3.1 Create structured prompt for AI analysis:
  - Input: Job description + relevant knowledge entries
  - Output: JSON with structured fit analysis
- [ ] 2.3.2 Define analysis categories:
  - `strong_matches`: Array of {skill/experience, evidence from knowledge base, confidence}
  - `potential_gaps`: Array of {requirement, why missing, severity: high/medium/low}
  - `discussion_areas`: Array of {topic, question to clarify, importance}
  - `overall_fit`: {score: high/medium/low, reasoning, recommendation}
- [ ] 2.3.3 Implement scoring logic (weighted algorithm):
  - Required skills match: 40% weight
  - Experience level match: 30% weight
  - Industry match: 20% weight
  - Role type match: 10% weight
- [ ] 2.3.4 Generate overall fit score (High: 80%+, Medium: 60-79%, Low: <60%)
- [ ] 2.3.5 Generate fit reasoning (2-3 sentence explanation)

### 2.4 AI Integration
- [ ] 2.4.1 Set up OpenAI API client (or reuse from chatbot)
- [ ] 2.4.2 Create system prompt for fit analysis:
  - Role: Expert recruiter assessing candidate fit
  - Task: Analyze job description against candidate profile
  - Output: Structured JSON with analysis
- [ ] 2.4.3 Use GPT-4 (recommended for accuracy) or GPT-3.5 (cheaper)
- [ ] 2.4.4 Inject job description and knowledge entries as context
- [ ] 2.4.5 Parse AI response into structured format
- [ ] 2.4.6 Validate response structure (ensure all required fields present)
- [ ] 2.4.7 Add error handling and retry logic

### 2.5 API Endpoint
- [ ] 2.5.1 Create POST `/analyze-fit` endpoint (or `/api/job-fit`)
- [ ] 2.5.2 Implement request validation:
  - Job description text (500-5000 chars)
  - Sanitize input (remove malicious content)
- [ ] 2.5.3 Add rate limiting (3 analyses per visitor per hour, 20 per IP per day)
- [ ] 2.5.4 Return structured JSON response:
  ```json
  {
    "overall_fit": {"score": "high|medium|low", "reasoning": "..."},
    "strong_matches": [{skill, evidence, confidence}],
    "potential_gaps": [{requirement, why_missing, severity}],
    "discussion_areas": [{topic, question, importance}]
  }
  ```
- [ ] 2.5.5 Add CORS headers for mikejones.online
- [ ] 2.5.6 Log analysis for analytics (if privacy policy allows)
- [ ] 2.5.7 Return appropriate error codes (400, 429, 500)

### 2.6 Testing
- [ ] 2.6.1 Unit tests for job description parser
- [ ] 2.6.2 Unit tests for RAG retrieval logic
- [ ] 2.6.3 Integration tests for fit analysis endpoint
- [ ] 2.6.4 Test with 10+ real job descriptions (PM, Director, Consultant roles)
- [ ] 2.6.5 Validate analysis accuracy (manually review results)
- [ ] 2.6.6 Test edge cases (short JD, very long JD, generic JD)
- [ ] 2.6.7 Test rate limiting enforcement
- [ ] 2.6.8 Load testing for performance

## 3. Frontend Integration (Phase 1: MVP)

### 3.1 Form Submission Logic
- [ ] 3.1.1 Implement form validation (min/max character count)
- [ ] 3.1.2 Add submit handler with loading state
- [ ] 3.1.3 Implement fetch() to backend endpoint
- [ ] 3.1.4 Handle loading state (disable form, show spinner)
- [ ] 3.1.5 Implement error handling (display user-friendly messages)
- [ ] 3.1.6 Implement timeout handling (30 second max)

### 3.2 Results Rendering
- [ ] 3.2.1 Parse JSON response from backend
- [ ] 3.2.2 Render overall fit score with visual indicator
- [ ] 3.2.3 Render strong matches section:
  - List each match with bullet points
  - Show evidence from knowledge base (quote snippets)
  - Display confidence level (visual indicator)
- [ ] 3.2.4 Render potential gaps section:
  - List each gap with explanation
  - Show severity (high/medium/low with color coding)
  - Provide context (why it matters or doesn't)
- [ ] 3.2.5 Render discussion areas section:
  - List topics needing clarification
  - Show questions to ask in initial conversation
  - Mark importance (critical vs nice-to-know)
- [ ] 3.2.6 Render CTA section with action buttons
- [ ] 3.2.7 Smooth scroll to results after analysis complete

### 3.3 User Actions
- [ ] 3.3.1 Implement "Schedule Call" button (link to Cal.com)
- [ ] 3.3.2 Implement "Contact Mike" button (link to contact form or email)
- [ ] 3.3.3 Implement "Ask Questions" button (link to chatbot if exists)
- [ ] 3.3.4 Implement "Analyze Another" button (reset form, clear results)
- [ ] 3.3.5 Track CTA clicks in analytics

## 4. Analytics & Monitoring (Phase 1: MVP)

### 4.1 Usage Analytics
- [ ] 4.1.1 Track page views on `/fit-analyzer`
- [ ] 4.1.2 Track form submissions (analysis requests)
- [ ] 4.1.3 Track completion rate (submissions / page views)
- [ ] 4.1.4 Track average time on page
- [ ] 4.1.5 Track CTA clicks from results

### 4.2 Analysis Metrics
- [ ] 4.2.1 Log fit score distribution (% High/Medium/Low)
- [ ] 4.2.2 Log most common required skills in JDs
- [ ] 4.2.3 Log most common potential gaps
- [ ] 4.2.4 Log role types submitted (PM, Director, etc.)
- [ ] 4.2.5 Track conversion rate (analyses → contact/schedule)

### 4.3 Quality Monitoring
- [ ] 4.3.1 Track API response times
- [ ] 4.3.2 Monitor error rates
- [ ] 4.3.3 Log rate limit hits
- [ ] 4.3.4 Monitor OpenAI API costs per analysis
- [ ] 4.3.5 Set up alerts for errors or high costs

### 4.4 Privacy Compliance
- [ ] 4.4.1 Ensure job descriptions not stored (or auto-delete after analysis)
- [ ] 4.4.2 Log only aggregate metrics (not full JD text)
- [ ] 4.4.3 Update privacy policy to mention fit analyzer
- [ ] 4.4.4 Add privacy notice on page ("Not stored, analyzed privately")

## 5. Content & Copy (Phase 1: MVP)

### 5.1 Page Content
- [ ] 5.1.1 Write compelling headline ("See How I Fit Your Role")
- [ ] 5.1.2 Write introduction explaining the tool (2-3 sentences)
- [ ] 5.1.3 Write instructions (how to use the tool)
- [ ] 5.1.4 Create example job description (collapsible section)
- [ ] 5.1.5 Write privacy notice
- [ ] 5.1.6 Write results interpretation guide (what each section means)

### 5.2 Analysis Copy Templates
- [ ] 5.2.1 Define templates for High Fit results
- [ ] 5.2.2 Define templates for Medium Fit results
- [ ] 5.2.3 Define templates for Low Fit results
- [ ] 5.2.4 Write fallback messages for edge cases
- [ ] 5.2.5 Define CTA copy for each fit level

### 5.3 Error Messages
- [ ] 5.3.1 Write user-friendly error for analysis failure
- [ ] 5.3.2 Write rate limit message
- [ ] 5.3.3 Write validation error messages (too short, too long)
- [ ] 5.3.4 Write timeout message

## 6. Testing & Quality Assurance (Phase 1: MVP)

### 6.1 Functional Testing
- [ ] 6.1.1 Test with 10+ real job descriptions
- [ ] 6.1.2 Verify analysis accuracy (compare to manual assessment)
- [ ] 6.1.3 Test edge cases (generic JD, very specific JD, poorly formatted)
- [ ] 6.1.4 Test rate limiting (submit multiple times quickly)
- [ ] 6.1.5 Test error handling (invalid input, backend failure)

### 6.2 User Experience Testing
- [ ] 6.2.1 Time the full flow (paste → analyze → read results)
- [ ] 6.2.2 Test on mobile devices (various screen sizes)
- [ ] 6.2.3 Test with slow network (3G simulation)
- [ ] 6.2.4 Collect feedback from 3-5 test users
- [ ] 6.2.5 Iterate based on feedback

### 6.3 Cross-Browser Testing
- [ ] 6.3.1 Test on Chrome (latest)
- [ ] 6.3.2 Test on Firefox (latest)
- [ ] 6.3.3 Test on Safari (latest)
- [ ] 6.3.4 Test on Edge (latest)
- [ ] 6.3.5 Test on mobile browsers (iOS Safari, Chrome Mobile)

### 6.4 Accessibility Testing
- [ ] 6.4.1 Test keyboard navigation
- [ ] 6.4.2 Test with NVDA screen reader (Windows)
- [ ] 6.4.3 Test with VoiceOver (Mac/iOS)
- [ ] 6.4.4 Validate color contrast with tools
- [ ] 6.4.5 Check for WCAG 2.1 AA compliance

## 7. Documentation (Phase 1: MVP)

### 7.1 User Documentation
- [ ] 7.1.1 Add FAQ section to page ("How does it work?", "Is my JD stored?")
- [ ] 7.1.2 Create guidance on interpreting results
- [ ] 7.1.3 Document privacy practices

### 7.2 Technical Documentation
- [ ] 7.2.1 Document API endpoint and parameters
- [ ] 7.2.2 Document fit scoring algorithm
- [ ] 7.2.3 Document deployment process
- [ ] 7.2.4 Create troubleshooting guide
- [ ] 7.2.5 Document analytics dashboard

### 7.3 Maintenance Documentation
- [ ] 7.3.1 Knowledge base update impact (how to keep analysis accurate)
- [ ] 7.3.2 Monitoring checklist
- [ ] 7.3.3 Cost tracking and optimization
- [ ] 7.3.4 Feature expansion roadmap (Phase 2/3)

## 8. Deployment (Phase 1: MVP)

### 8.1 Staging Deployment
- [ ] 8.1.1 Deploy backend to Cloudflare Workers (staging)
- [ ] 8.1.2 Create page on Ghost staging site
- [ ] 8.1.3 Test end-to-end on staging
- [ ] 8.1.4 Performance testing on staging
- [ ] 8.1.5 Fix any issues found

### 8.2 Production Deployment
- [ ] 8.2.1 Deploy backend to Cloudflare Workers (production)
- [ ] 8.2.2 Create page on Ghost production site (mikejones.online)
- [ ] 8.2.3 Add link to navigation (optional: "Hiring?" or "Assess Fit")
- [ ] 8.2.4 Verify deployment on production
- [ ] 8.2.5 Monitor first 24 hours closely

### 8.3 Launch Activities
- [ ] 8.3.1 Add link to Resume/CV page ("Assess your fit")
- [ ] 8.3.2 Mention in About page or homepage (optional)
- [ ] 8.3.3 Update LinkedIn/social profiles to mention tool (optional)
- [ ] 8.3.4 Monitor usage and collect feedback
- [ ] 8.3.5 Document any issues and quick fixes

## 9. Phase 2: Enhanced Features (Post-MVP)

### 9.1 Visual Enhancements
- [ ] 9.1.1 Add fit score gauge/chart (visual representation)
- [ ] 9.1.2 Create skill match matrix (visual comparison)
- [ ] 9.1.3 Add progress indicators for analysis steps
- [ ] 9.1.4 Improve results layout with tabs or sections
- [ ] 9.1.5 Add animations for results reveal

### 9.2 Export & Sharing
- [ ] 9.2.1 Implement PDF export of analysis results
- [ ] 9.2.2 Add "Email Results" feature (send to self)
- [ ] 9.2.3 Generate shareable link (for hiring manager to share with team)
- [ ] 9.2.4 Add print-friendly stylesheet

### 9.3 Lead Capture (Optional)
- [ ] 9.3.1 Add optional email field ("Send me the full analysis")
- [ ] 9.3.2 Integrate with email marketing (if applicable)
- [ ] 9.3.3 Track lead quality (fit score vs conversion)

### 9.4 Enhanced Analysis
- [ ] 9.4.1 Add salary expectations comparison (if JD includes range)
- [ ] 9.4.2 Suggest similar roles Mike would be better fit for
- [ ] 9.4.3 Include related projects to highlight (links to case studies)
- [ ] 9.4.4 Add "Ask Mike about..." suggested questions for chatbot

## 10. Phase 3: Advanced Features (Optional)

### 10.1 Multi-Job Comparison
- [ ] 10.1.1 Allow saving multiple job analyses
- [ ] 10.1.2 Create comparison view (side-by-side)
- [ ] 10.1.3 Rank jobs by fit score
- [ ] 10.1.4 Store analyses in browser (localStorage or backend)

### 10.2 Fit History & Trends
- [ ] 10.2.1 Track fit analysis history (aggregate)
- [ ] 10.2.2 Identify trending job requirements
- [ ] 10.2.3 Suggest skills Mike should highlight more
- [ ] 10.2.4 Update knowledge base based on patterns

### 10.3 Enhanced Matching
- [ ] 10.3.1 Implement semantic matching (not just keyword)
- [ ] 10.3.2 Add vector embeddings for better similarity
- [ ] 10.3.3 Consider job context (startup vs enterprise)
- [ ] 10.3.4 Weight recent experience higher

## 11. Archive Change

- [ ] 11.1 Verify all tasks complete
- [ ] 11.2 Run `openspec validate add-job-fit-analyzer --strict --no-interactive`
- [ ] 11.3 Run `openspec archive add-job-fit-analyzer --yes`
- [ ] 11.4 Update roadmap to mark feature complete
- [ ] 11.5 Document lessons learned

---

**Note:** Tasks are numbered for sequential implementation within each phase. MVP (Phase 1) should be completed before Phase 2/3. Total estimated: 120+ tasks for full implementation.
