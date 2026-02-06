# Job Fit Analyzer Capability

## ADDED Requirements

### Requirement: Job Description Input Form
The system SHALL provide a form embedded in multiple locations where visitors can paste a job description for fit analysis.

#### Scenario: User accesses fit analyzer from navigation
- **WHEN** a visitor navigates to `/fit-analyzer` via main navigation
- **THEN** a form with textarea is displayed
- **AND** instructions explain how to use the tool
- **AND** privacy notice states "Your job description is logged for analytics to improve matching quality"

#### Scenario: User accesses embedded form from About page
- **WHEN** a visitor views the About page
- **THEN** an embedded fit analyzer form is visible
- **AND** the form functions identically to the standalone page
- **AND** submission redirects to dedicated results page

#### Scenario: User accesses embedded form from Resume page
- **WHEN** a visitor views the Resume page
- **THEN** an embedded fit analyzer form is visible (e.g., in sidebar or CTA section)
- **AND** the form functions identically to the standalone page
- **AND** submission redirects to dedicated results page

#### Scenario: User pastes job description
- **WHEN** a visitor pastes text into the textarea
- **AND** the text is between 500 and 5000 characters
- **THEN** the character counter updates in real-time
- **AND** the "Analyze Fit" button becomes enabled
- **AND** the form validates the input

#### Scenario: Input validation failure
- **WHEN** a visitor submits text shorter than 500 characters
- **THEN** an error message displays: "Job description too short (minimum 500 characters)"
- **AND** the form does not submit
- **AND** the textarea remains focused for editing

### Requirement: Job Description Analysis
The system SHALL analyze the job description against Mike's knowledge base and return a structured fit assessment.

#### Scenario: Successful analysis
- **WHEN** a visitor submits a valid job description
- **THEN** a loading state displays "Analyzing your role..."
- **AND** the system parses the JD to extract requirements (skills, experience, industry, role type)
- **AND** retrieves relevant knowledge entries from the 70-entry knowledge base
- **AND** computes weighted fit score (skills 40%, experience 30%, industry 20%, role 10%)
- **AND** generates structured analysis via GPT-4 Turbo
- **AND** returns results within 60 seconds
- **AND** displays results in structured format

#### Scenario: Analysis of PM role in gaming
- **WHEN** a visitor submits a job description for "Senior Program Manager, Gaming Studio, 10+ years experience"
- **THEN** strong_matches include:
  - "26+ years program/project management experience" (evidence from knowledge base)
  - "Xbox and Xbox 360 launch teams contributor" (gaming industry)
  - "Director-level roles at gaming companies (Kabam)" (relevant experience)
- **AND** potential_gaps may include:
  - Specific technologies mentioned in JD not in Mike's recent work
- **AND** discussion_areas include:
  - "Current certifications or methodologies preferred by the company"
- **AND** overall_fit score is "high" (85/100)

#### Scenario: Analysis of ML Engineer role
- **WHEN** a visitor submits a job description for "Machine Learning Engineer, training models, deep learning"
- **THEN** strong_matches include:
  - "AI Memory System implementation" (practical AI work)
  - "Top 1% ChatGPT user" (AI expertise)
- **AND** potential_gaps include:
  - "Machine learning model training" (severity: high)
  - "Deep learning frameworks (TensorFlow, PyTorch)" (severity: high)
  - "Data science and statistical modeling" (severity: high)
- **AND** discussion_areas include:
  - "Distinguish between LLM integration vs ML engineering roles"
- **AND** overall_fit score is "low" (35/100)
- **AND** reasoning states Mike's expertise is in LLM integration and AI tooling, not ML model development

### Requirement: Structured Analysis Results
The system SHALL display analysis results in four structured categories: Overall Fit, Strong Matches, Potential Gaps, and Discussion Areas.

#### Scenario: Display overall fit assessment
- **WHEN** analysis completes successfully
- **THEN** overall fit section displays prominently at top
- **AND** shows fit score badge with categorical scoring (4 levels) and color coding:
  - **Perfect** (100% match - all requirements met): Dark Green
  - **High** (strong fit, minor gaps): Green
  - **Medium** (decent fit, some gaps): Yellow
  - **Low** (significant misalignment): Orange
- **AND** displays 2-3 sentence reasoning explanation
- **AND** shows recommendation ("Perfect match" | "Strong fit" | "Worth discussing" | "Better opportunities elsewhere")

#### Scenario: Display per-area fit scores
- **WHEN** analysis completes successfully
- **THEN** each job requirement area receives its own categorical score:
  - Technical Skills: (Perfect | High | Medium | Low)
  - Industry Experience: (Perfect | High | Medium | Low)
  - Management Experience: (Perfect | High | Medium | Low)
  - Role-Specific Requirements: (Perfect | High | Medium | Low)
- **AND** each area score includes brief evidence/reasoning
- **AND** overall fit score is derived from area scores with weighted aggregation

#### Scenario: Display strong matches
- **WHEN** analysis identifies matching qualifications
- **THEN** strong matches section lists each match as a card:
  - Category tag (skill, experience, industry, role_type)
  - Specific match ("Xbox launch teams", "26+ years PM experience")
  - Evidence quote from knowledge base
  - Confidence indicator (high/medium/low)
- **AND** matches are sorted by confidence (high first)
- **AND** each match has a green checkmark icon

#### Scenario: Display potential gaps
- **WHEN** analysis identifies missing requirements
- **THEN** potential gaps section lists each gap as a card:
  - Requirement from job description
  - Explanation of why it's missing
  - Severity indicator (high/medium/low) with color coding:
    - High: Red/Orange (critical missing requirement)
    - Medium: Yellow (nice-to-have, not critical)
    - Low: Gray (minor or addressable)
  - Mitigation suggestion if applicable
- **AND** gaps are sorted by severity (high first)

#### Scenario: Display discussion areas
- **WHEN** analysis identifies topics needing clarification
- **THEN** discussion areas section lists each item:
  - Topic or question label
  - Specific question to ask in initial conversation
  - Importance indicator (critical | important | nice_to_know)
- **AND** critical items are highlighted
- **AND** provides context for why each topic matters

### Requirement: Progressive Disclosure (Quick Overview → Detailed Breakdown)
The system SHALL display results using progressive disclosure - showing a quick overview first, with option to generate/view detailed breakdown on demand.

#### Scenario: Initial results show quick overview
- **WHEN** analysis completes successfully
- **THEN** results page displays immediately with quick overview:
  - Overall fit score (categorical badge)
  - Brief 2-3 sentence summary
  - First 2-3 lines of Strong Matches section (preview)
  - First 2-3 lines of Potential Gaps section (preview)
  - First 2-3 lines of Discussion Areas section (preview)
  - Per-area scores visible (Technical, Industry, Management, Role-Specific)
- **AND** each section shows "Show detailed breakdown" button or expand icon
- **AND** page loads fast (< 2 seconds for overview)

#### Scenario: User clicks for detailed breakdown
- **WHEN** a visitor clicks "Show detailed breakdown" button
- **THEN** the system generates/reveals complete detailed analysis:
  - Full Strong Matches with all evidence and examples from knowledge base
  - Complete Potential Gaps with detailed explanations and mitigation strategies
  - All Discussion Areas with context and suggested questions
  - Specific evidence quotes from knowledge base entries
- **AND** if email not yet provided, email gate appears (see Email Gate requirement)
- **AND** detailed content expands smoothly with visual transition
- **AND** visitor can collapse back to overview if desired

#### Scenario: Performance optimization
- **WHEN** initial analysis runs
- **THEN** quick overview is generated immediately
- **AND** detailed breakdown generation is deferred until requested
- **AND** this reduces initial API costs and improves response time
- **AND** visitors only pay cost of detailed analysis if they want it

### Requirement: Email Gate for Full Results (Lead Capture)
The system SHALL require email address before displaying full detailed breakdown and complete scoring information.

#### Scenario: Free tier preview (no email required)
- **WHEN** analysis completes and overview displays
- **THEN** visitor can see without email:
  - Quick overview summary
  - Overall fit score badge (Perfect | High | Medium | Low)
  - First 2-3 lines of each section (Strong Matches, Potential Gaps, Discussion Areas)
  - Per-area categorical scores (labels only, not full details)
- **AND** no email is required to see preview
- **AND** preview demonstrates value of the tool

#### Scenario: Email gate triggers on detailed breakdown request
- **WHEN** visitor clicks "Show detailed breakdown" button
- **AND** email has not been provided yet
- **THEN** email capture modal/form appears
- **AND** form states: "Enter your email to see the complete analysis"
- **AND** form includes:
  - Email input field
  - "Get Full Analysis" submit button
  - Privacy notice: "We'll use this to send analysis results and occasional updates about Mike's availability"
  - Checkbox (optional): "Interested in discussing this role with Mike"
- **AND** form is non-dismissible (must provide email or leave page)

#### Scenario: Email provided, full results unlocked
- **WHEN** visitor submits valid email address
- **THEN** email is captured and stored with analysis log
- **AND** detailed breakdown is revealed immediately
- **AND** all sections expand to show complete information:
  - Full Strong Matches with all evidence
  - Complete Potential Gaps with detailed explanations
  - All Discussion Areas with context
  - Specific knowledge base quotes and examples
- **AND** CTAs appear (Schedule Call, Contact Mike)
- **AND** visitor can download/print results (future enhancement)

#### Scenario: Email validation
- **WHEN** visitor enters invalid email format
- **THEN** error displays: "Please enter a valid email address"
- **AND** form remains visible until valid email provided
- **AND** submit button is disabled until valid email entered

### Requirement: Call-to-Action Integration
The system SHALL provide clear next-step CTAs based on fit assessment results.

#### Scenario: Perfect fit CTA
- **WHEN** overall fit score is "Perfect" (100% match - all requirements met)
- **THEN** primary CTA displays: "Schedule a Call with Mike" (links to Cal.com) with high visual prominence
- **AND** secondary CTA displays: "Contact Mike" (links to contact form)
- **AND** tertiary option: "Ask Questions" (links to chatbot if available)
- **AND** celebration message: "Perfect match! Mike meets all requirements for this role. Let's get started."
- **AND** visual emphasis (e.g., animated checkmark, celebratory color scheme)

#### Scenario: High fit CTA
- **WHEN** overall fit score is "High" (strong fit with minor gaps)
- **THEN** primary CTA displays: "Schedule a Call with Mike" (links to Cal.com)
- **AND** secondary CTA displays: "Contact Mike" (links to contact form)
- **AND** tertiary option: "Ask Questions" (links to chatbot if available)
- **AND** encouragement message: "This looks like a great match. Let's discuss how Mike can help."

#### Scenario: Medium fit CTA
- **WHEN** overall fit score is "Medium" (decent fit with some gaps)
- **THEN** primary CTA displays: "Discuss Fit with Mike" (links to Cal.com)
- **AND** encouragement message: "There's potential here. Let's talk about the discussion areas and how Mike's experience applies."

#### Scenario: Low fit CTA
- **WHEN** overall fit score is "Low" (significant misalignment)
- **THEN** primary CTA displays: "Explore Mike's Background" (links to Projects or About)
- **AND** secondary CTA: "Contact Mike Anyway" (links to contact form)
- **AND** honest message: "This role may not be the best fit based on the job description, but Mike is happy to discuss opportunities that align better with his expertise in AI implementation and context engineering."

### Requirement: Rate Limiting
The system SHALL enforce rate limits to prevent abuse and control costs.

#### Scenario: Within rate limits
- **WHEN** a visitor submits their 2nd analysis within an hour
- **AND** rate limit is 3 analyses per visitor per hour
- **THEN** the analysis proceeds normally
- **AND** no warning is displayed

#### Scenario: Visitor exceeds hourly limit
- **WHEN** a visitor submits their 4th analysis within an hour
- **AND** rate limit is 3 analyses per visitor per hour
- **THEN** the system blocks the request
- **AND** displays error: "Analysis limit reached. You can submit 3 job descriptions per hour. Please try again in [X] minutes."
- **AND** logs the rate limit hit

#### Scenario: IP-based daily limit
- **WHEN** a single IP address submits more than 20 analyses in a day
- **THEN** all subsequent analyses are blocked
- **AND** error displays: "Daily analysis limit reached. Please try again tomorrow."
- **AND** the abuse attempt is logged for investigation

### Requirement: Privacy and Data Protection
The system SHALL log 100% of job descriptions submitted for analytics and continuous improvement.

#### Scenario: Complete job description logging
- **WHEN** a visitor submits a job description for analysis
- **THEN** the system logs the complete submission:
  - Full job description text (100% verbatim)
  - Timestamp (ISO 8601 format)
  - Analysis results (fit scores, matches, gaps, discussion areas)
  - Per-area categorical scores (Technical, Industry, Management, Role-Specific)
  - Overall fit level (Perfect | High | Medium | Low)
  - CTA interaction (if any)
- **AND** logs are retained indefinitely for trend analysis
- **AND** logs enable understanding:
  - What roles visitors are assessing
  - Common job requirements in Mike's target market
  - Fit score distribution
  - Knowledge base gaps to address

#### Scenario: Privacy notice transparency
- **WHEN** a visitor views the fit analyzer page
- **THEN** a privacy notice is prominently displayed:
  - "Your job description is logged for analytics to improve matching quality"
  - "We analyze submitted job descriptions to understand trends and improve our assessment algorithms"
  - Link to privacy policy with full details
- **AND** notice is clear and honest about data retention

### Requirement: Performance
The system SHALL analyze job descriptions and display results quickly.

#### Scenario: Fast page load
- **WHEN** a visitor navigates to `/fit-analyzer`
- **THEN** the page loads within 500ms
- **AND** the form is immediately interactive
- **AND** page weight is < 500KB total

#### Scenario: Analysis completes in under 60 seconds
- **WHEN** a visitor submits a job description
- **THEN** analysis completes and results display within 60 seconds (P95)
- **AND** job description parsing completes within 1 second
- **AND** RAG retrieval completes within 500ms
- **AND** fit scoring algorithm completes within 500ms
- **AND** OpenAI API call completes within 45 seconds
- **AND** response formatting completes within 1 second

### Requirement: Accessibility
The job fit analyzer SHALL be accessible to users with disabilities and comply with WCAG 2.1 Level AA.

#### Scenario: Keyboard navigation
- **WHEN** a user navigates using only a keyboard
- **THEN** the textarea can be focused with Tab key
- **AND** the "Analyze Fit" button can be activated with Enter or Space
- **AND** results sections can be navigated with Tab
- **AND** expandable sections can be toggled with Enter or Space
- **AND** focus indicators are clearly visible

#### Scenario: Screen reader compatibility
- **WHEN** a screen reader user accesses the page
- **THEN** the textarea has label: "Paste job description here"
- **AND** the submit button has clear label: "Analyze fit for this role"
- **AND** loading state is announced: "Analyzing job description, please wait"
- **AND** results sections have proper heading hierarchy (H2, H3)
- **AND** each result card has semantic HTML (list items, definition lists)

#### Scenario: Color contrast compliance
- **WHEN** the page is displayed
- **THEN** all text has minimum 4.5:1 contrast ratio (WCAG AA)
- **AND** fit score badges have sufficient contrast
- **AND** severity indicators (red, yellow, green) are supplemented with icons/text (not color-only)
- **AND** focus indicators are visible and high contrast

### Requirement: Error Handling
The system SHALL gracefully handle errors and provide helpful feedback.

#### Scenario: OpenAI API timeout
- **WHEN** the OpenAI API does not respond within 60 seconds
- **THEN** the system displays error: "Analysis is taking longer than expected. Please try again."
- **AND** the form is re-enabled for retry
- **AND** the error is logged for monitoring

#### Scenario: Invalid job description format
- **WHEN** the submitted text is detected as not a job description (e.g., "test", "hello world")
- **THEN** the system displays warning: "This doesn't appear to be a job description. Please paste a full role description including responsibilities and requirements."
- **AND** analysis does not proceed
- **AND** the visitor can edit and resubmit

#### Scenario: OpenAI API error
- **WHEN** the OpenAI API returns an error (rate limit, quota exceeded)
- **THEN** the system displays: "Analysis service temporarily unavailable. Please try again in a few minutes or contact Mike directly."
- **AND** provides Mike's contact information
- **AND** the error is logged with high priority

### Requirement: Analytics and Monitoring
The system SHALL track usage metrics to inform improvements and lead qualification.

#### Scenario: Track page usage
- **WHEN** visitors interact with the fit analyzer
- **THEN** the system tracks:
  - Page views on `/fit-analyzer`
  - Form submissions (analyses requested)
  - Completion rate (submissions / page views)
  - Time on page
  - Abandonment rate (form started but not submitted)

#### Scenario: Track fit score distribution
- **WHEN** analyses are completed
- **THEN** the system logs:
  - Distribution of fit scores (% high, medium, low)
  - Average fit score
  - Most common industries submitted
  - Most common role types submitted
  - Most frequently matched skills
  - Most common potential gaps

#### Scenario: Track conversion
- **WHEN** visitors interact with CTAs in results
- **THEN** the system tracks:
  - CTA clicks (Schedule Call, Contact Mike, Ask Questions)
  - Conversion rate by fit score (% who click CTA per score level)
  - Time from analysis to CTA click
- **AND** can identify which fit scores drive highest conversion

### Requirement: User Experience
The system SHALL provide clear guidance and reduce friction throughout the process.

#### Scenario: Example job description provided
- **WHEN** a visitor views the fit analyzer page
- **THEN** an example job description is available (collapsible section)
- **AND** example shows proper format and detail level
- **AND** includes note: "This is an example. Paste your actual job description above."

#### Scenario: Progressive disclosure in results
- **WHEN** analysis results are displayed
- **THEN** the most critical information (overall fit) is shown first
- **AND** detailed sections can be expanded/collapsed
- **AND** default state shows summary, collapsed detailed breakdowns
- **AND** smooth animations reveal/hide content

#### Scenario: Reset and try another
- **WHEN** a visitor has viewed analysis results
- **AND** wants to analyze another job description
- **THEN** an "Analyze Another Job" button is prominently displayed
- **AND** clicking it resets the form and clears results
- **AND** focus returns to the textarea for next entry

### Requirement: Multi-Job Comparison (Phase 2/3 Enhancement)
The system SHALL support comparing multiple job descriptions side-by-side to help visitors evaluate fit across multiple opportunities.

**Note:** This is a Phase 2 or Phase 3 enhancement, not part of the MVP. Expected usage is low, but valuable for visitors comparing multiple roles or recruiters assessing fit across positions.

#### Scenario: Add second job for comparison
- **WHEN** a visitor has completed analysis of first job description
- **AND** clicks "Compare with another role" button
- **THEN** a second job description input form appears
- **AND** visitor can paste a second job description
- **AND** system analyzes second job description using same process

#### Scenario: Side-by-side comparison display
- **WHEN** visitor has analyzed 2+ job descriptions
- **THEN** results display in side-by-side comparison table:
  - Overall fit scores for each job (Perfect | High | Medium | Low)
  - Per-area scores for each job (Technical, Industry, Management, Role-Specific)
  - Shared strengths (qualifications that match both jobs)
  - Unique gaps (requirements unique to each job)
  - Job-specific discussion areas
- **AND** comparison helps visitor understand which role is better fit
- **AND** each job's detailed breakdown is accessible via expand/collapse

#### Scenario: Compare up to 3 jobs maximum
- **WHEN** visitor attempts to add a 4th job description
- **THEN** system displays message: "Compare up to 3 job descriptions at once"
- **AND** visitor must remove one job to add another
- **AND** this prevents analysis overload and keeps UI manageable

#### Scenario: Remove job from comparison
- **WHEN** visitor clicks "Remove" on a job in comparison view
- **THEN** that job's analysis is removed from display
- **AND** remaining jobs re-layout to fill space
- **AND** visitor can add another job if desired

---

**Note:** This spec defines the job-fit-analyzer capability. All requirements use ADDED since this is a new capability with no prior implementation.
