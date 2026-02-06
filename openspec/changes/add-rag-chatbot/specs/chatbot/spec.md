# Chatbot Capability

## ADDED Requirements

### Requirement: Persistent Chat Widget
The website SHALL display a persistent chat widget on all pages that allows visitors to ask questions about Mike's work, experience, and projects.

#### Scenario: Widget appears on page load
- **WHEN** a visitor loads any page on mikejones.online
- **THEN** a minimized chat icon appears in the bottom-right corner
- **AND** the icon does not block page content
- **AND** the widget loads asynchronously without blocking page render

#### Scenario: Widget expands on click
- **WHEN** a visitor clicks the minimized chat icon
- **THEN** the chat window expands to 400px wide by 600px tall on desktop
- **AND** displays a greeting message
- **AND** shows 4 suggested questions
- **AND** provides an input field for typing questions

#### Scenario: Widget collapses on close
- **WHEN** a visitor clicks the close button in the expanded chat window
- **THEN** the chat window collapses back to the minimized icon
- **AND** conversation history is preserved during the current page session

#### Scenario: Mobile full-screen mode
- **WHEN** a visitor opens the chat widget on a mobile device (< 768px width)
- **THEN** the chat window displays as a full-screen overlay
- **AND** includes a close button in the top-right corner
- **AND** prevents scrolling of the underlying page while open

### Requirement: RAG-Based Question Answering
The chatbot SHALL answer visitor questions by retrieving relevant entries from the 70-entry knowledge base and using them as context for AI-generated responses.

#### Scenario: Question with matching knowledge base entries
- **WHEN** a visitor asks "What has Mike worked on?"
- **THEN** the system retrieves relevant entries (type: fact, narrative with topic: career_history)
- **AND** ranks entries by relevance and type priority (qa_pair > fact > narrative)
- **AND** selects the top 3-5 most relevant entries
- **AND** injects them as context into the AI prompt
- **AND** generates a response based only on the provided context
- **AND** displays the response in < 2 seconds (P95)

#### Scenario: Question with no matching entries
- **WHEN** a visitor asks a question not covered in the knowledge base (e.g., "What's Mike's favorite color?")
- **THEN** the system returns a fallback response
- **AND** the response states "I don't have that information in my knowledge base"
- **AND** the response offers to help with topics covered (career, projects, services)
- **AND** the response does not hallucinate or make up information

#### Scenario: Ambiguous question requiring clarification
- **WHEN** a visitor asks "Tell me about AI"
- **THEN** the system retrieves entries about multiple AI-related topics (AI Memory System, Local LLM, general AI transition)
- **AND** asks clarifying questions (e.g., "I can tell you about Mike's AI Memory System, his Local LLM infrastructure, or his transition into AI work. Which interests you?")

### Requirement: Lead Qualification
The chatbot SHALL assess visitor fit for Mike's consulting services using fit_assessment entries from the knowledge base.

#### Scenario: Visitor indicates good fit
- **WHEN** a visitor describes their situation matching good_fit criteria (e.g., "I run a 100-person gaming studio drowning in meetings")
- **THEN** the system retrieves fit_assessment entries with fit_type: "good_fit"
- **AND** responds positively explaining why it's a good match
- **AND** offers a "Schedule a call" CTA linking to Cal.com
- **AND** provides Mike's contact information

#### Scenario: Visitor indicates poor fit
- **WHEN** a visitor describes their situation matching not_ideal criteria (e.g., "I'm a solo founder just starting out")
- **THEN** the system retrieves fit_assessment entries with fit_type: "not_ideal"
- **AND** responds honestly about the mismatch
- **AND** suggests alternative resources or approaches if applicable
- **AND** maintains a helpful, respectful tone

### Requirement: Suggested Questions
The chatbot SHALL display 4 suggested questions to guide visitor engagement and reduce friction.

#### Scenario: Initial suggested questions on widget open
- **WHEN** a visitor opens the chat widget for the first time
- **THEN** the system displays 4 suggested questions as clickable buttons:
  - "What has Mike worked on?"
  - "Tell me about the AI Memory System"
  - "How does Mike help with process optimization?"
  - "What are the 7 Pillars?"

#### Scenario: Clicking suggested question
- **WHEN** a visitor clicks a suggested question button
- **THEN** the question text appears in the chat as if the visitor typed it
- **AND** the system immediately processes the question and generates a response
- **AND** new contextual suggestions may appear based on the conversation topic

### Requirement: Conversation State Management
The chatbot SHALL maintain conversation context within the current page session to enable natural follow-up questions.

#### Scenario: Follow-up question with context
- **WHEN** a visitor asks "Tell me about the AI Memory System"
- **AND** the chatbot responds with information about the system
- **AND** the visitor then asks "Why did he build it?"
- **THEN** the system understands "it" refers to the AI Memory System from previous context
- **AND** retrieves entries about motivation (e.g., rag-2026-01-29-023)
- **AND** generates a contextual response

#### Scenario: Context resets on page refresh
- **WHEN** a visitor refreshes the page or navigates to a different page
- **THEN** the conversation history is cleared
- **AND** the chat widget returns to the initial state with suggested questions
- **AND** the visitor can start a new conversation

### Requirement: Rate Limiting
The system SHALL enforce rate limits to prevent abuse and control API costs.

#### Scenario: Visitor within rate limits
- **WHEN** a visitor sends their 8th message within an hour
- **AND** the rate limit is 15 messages per visitor per hour
- **THEN** the message is processed normally
- **AND** no rate limit warning is displayed

#### Scenario: Visitor exceeds rate limit
- **WHEN** a visitor sends their 16th message within an hour
- **AND** the rate limit is 15 messages per visitor per hour
- **THEN** the system blocks the message
- **AND** displays an error: "You've reached the conversation limit. Please try again in [X] minutes."
- **AND** logs the rate limit hit for monitoring

#### Scenario: IP-based rate limiting
- **WHEN** a single IP address sends more than 100 messages in a day
- **THEN** all subsequent messages from that IP are blocked
- **AND** an error message is displayed
- **AND** the abuse attempt is logged for investigation

### Requirement: Privacy and Data Protection
The chatbot SHALL log full conversations for analytics while respecting visitor privacy and providing transparency.

#### Scenario: Conversation logging for analytics (Phase 1 - Initial Implementation)
- **WHEN** a visitor has a conversation with the chatbot
- **THEN** the system logs the following:
  - Visitor question (full text)
  - Retrieved knowledge entries (IDs and content)
  - AI-generated response (full text)
  - Conversation topic classification
  - Timestamp (ISO 8601 format)
  - Session ID (unique identifier for the page session)
- **AND** logs are retained for analytics and quality improvement

#### Scenario: Enhanced visitor identification (Phase 2 - Future Enhancement)
- **WHEN** visitor identification features are implemented
- **THEN** the system ADDITIONALLY logs:
  - Timestamp correlation (time of visit, session duration)
  - Cross-site interaction data (other pages visited, actions taken)
  - Google Analytics Client ID (if available)
  - Advertiser ID or similar identifiers (if available)
  - IP address (for geographic analytics)
- **AND** visitor identification helps correlate conversations with other site engagement
- **NOTE:** This is a planned future enhancement, not part of the initial MVP

#### Scenario: Privacy disclosure displayed
- **WHEN** a visitor opens the chat widget
- **THEN** a privacy disclosure is displayed in the widget footer
- **AND** the disclosure states: "This chatbot uses AI to answer questions about Mike's work. Conversations are logged for analytics and quality improvement. [Privacy Policy]"
- **AND** the disclosure includes a link to the full privacy policy

#### Scenario: Data retention enforcement
- **WHEN** conversation logs are older than 30 days
- **THEN** they are automatically deleted from storage
- **AND** deletion is logged for audit purposes

### Requirement: Accessibility
The chatbot widget SHALL be accessible to users with disabilities and comply with WCAG 2.1 Level AA standards.

#### Scenario: Keyboard navigation
- **WHEN** a user navigates using only a keyboard (no mouse)
- **THEN** the chat icon can be focused with Tab key
- **AND** pressing Enter or Space opens the chat widget
- **AND** Tab key moves focus through suggested questions, input field, and send button
- **AND** Escape key closes the chat widget
- **AND** focus returns to the chat icon after closing

#### Scenario: Screen reader compatibility
- **WHEN** a screen reader user encounters the chat widget
- **THEN** the chat icon has an ARIA label: "Open chat assistant"
- **AND** new messages are announced via ARIA live regions
- **AND** suggested questions are marked as buttons with clear labels
- **AND** the input field has an accessible label: "Type your question"

#### Scenario: Color contrast compliance
- **WHEN** the chat widget is displayed
- **THEN** all text has a minimum contrast ratio of 4.5:1 against its background (WCAG AA)
- **AND** interactive elements have clear visual focus indicators
- **AND** color is not the only means of conveying information

### Requirement: Ghost Integration
The chatbot SHALL integrate with the Ghost CMS via code injection without requiring theme modifications.

#### Scenario: Code injection installation
- **WHEN** the chatbot code is added to Ghost Admin → Settings → Code Injection → Site Footer
- **THEN** the widget appears on all pages automatically
- **AND** the integration does not conflict with the Ghost theme
- **AND** the widget can be disabled by removing the code injection without other changes

#### Scenario: Theme compatibility
- **WHEN** the Ghost theme is changed
- **THEN** the chatbot widget continues to function
- **AND** the widget styling adapts to the new theme (auto-detects light/dark mode)
- **AND** no manual reconfiguration is required

### Requirement: Performance
The chatbot SHALL load and respond quickly without degrading page performance.

#### Scenario: Non-blocking widget load
- **WHEN** a page loads on mikejones.online
- **THEN** the chatbot widget script loads asynchronously
- **AND** the page's Lighthouse Performance score is not reduced by more than 2 points
- **AND** the widget JavaScript bundle is < 50KB gzipped
- **AND** the widget becomes interactive within 500ms of page load

#### Scenario: Fast chat response time
- **WHEN** a visitor sends a message to the chatbot
- **THEN** a typing indicator appears within 100ms
- **AND** the AI-generated response is displayed within 2 seconds (P95)
- **AND** RAG retrieval completes within 50ms
- **AND** the total API call (including OpenAI) completes within 2 seconds

### Requirement: Analytics and Monitoring
The system SHALL track conversation metrics to enable quality improvement and knowledge base expansion.

#### Scenario: Track conversation volume
- **WHEN** visitors interact with the chatbot
- **THEN** the system logs:
  - Total conversations per day/week/month
  - Total messages per conversation (average, median, P95)
  - Engagement rate (% of visitors who interact)
  - Popular topics asked (career, projects, services, fit)

#### Scenario: Track unhandled questions
- **WHEN** the chatbot returns an "I don't know" response
- **THEN** the question is logged separately as "unhandled"
- **AND** unhandled questions are reviewed monthly
- **AND** frequently asked unhandled questions trigger knowledge base expansion

#### Scenario: Track CTA effectiveness
- **WHEN** a visitor clicks "Contact Mike" or "Schedule Call" from the chatbot
- **THEN** the click is logged as a conversion event
- **AND** the conversation topic that led to the click is recorded
- **AND** conversion rate is calculated (% of conversations ending in CTA click)

### Requirement: Error Handling and Resilience
The chatbot SHALL gracefully handle errors and degrade functionality when external dependencies fail.

#### Scenario: OpenAI API timeout
- **WHEN** the OpenAI API does not respond within 5 seconds
- **THEN** the system displays an error message: "Sorry, I'm taking too long to respond. Please try again."
- **AND** the error is logged for monitoring
- **AND** the visitor can retry the question

#### Scenario: OpenAI API quota exceeded
- **WHEN** the OpenAI API returns a rate limit or quota error
- **THEN** the system displays: "I'm experiencing high demand right now. Please try again in a few minutes."
- **AND** the error is logged with high priority
- **AND** an alert is sent to monitor the issue

#### Scenario: Knowledge base loading failure
- **WHEN** the knowledge.jsonl file fails to load (e.g., CDN issue)
- **THEN** the system displays: "Chat is temporarily unavailable. Please contact Mike directly at [email]."
- **AND** the widget is disabled until the knowledge base loads successfully
- **AND** the error is logged for investigation

### Requirement: Response Quality
The chatbot SHALL provide accurate, helpful responses based only on verified knowledge base content.

#### Scenario: Response uses only knowledge base content
- **WHEN** a visitor asks a question covered in the knowledge base
- **THEN** the response includes ONLY information from retrieved entries
- **AND** the response does not hallucinate or infer information not in the knowledge base
- **AND** the confidence level is considered (verified > inferred > approximate)

#### Scenario: Response tone matches brand
- **WHEN** the chatbot generates a response
- **THEN** the tone is professional but approachable
- **AND** the language is direct and helpful (no unnecessary fluff)
- **AND** the response is action-oriented (offers next steps where applicable)
- **AND** the response matches Mike's communication style as described in the knowledge base

#### Scenario: Response provides actionable next steps
- **WHEN** a visitor asks about working with Mike
- **THEN** the response includes relevant CTAs:
  - "Schedule a call" link (Cal.com integration)
  - "Contact Mike" link (email or contact form)
  - "Learn more" link to relevant project pages
- **AND** CTAs are contextual to the conversation topic

---

**Note:** This spec defines the chatbot capability. All requirements use ADDED since this is a new capability with no prior implementation.
