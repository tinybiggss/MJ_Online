# MJ_Online Development Roadmap

**Project:** MJ_Online Personal Website & Portfolio
**Domain:** MikeJones.online
**Target Launch:** 1-2 weeks from start
**Last Updated:** 2026-01-26

---

## Overview

This roadmap breaks down the MJ_Online project into agent-actionable work streams, organized by priority and dependencies. The project emphasizes AI/ML portfolio demonstration with Ghost CMS, ActivityPub federation, and professional content showcase.

**Key Principles:**
- AI project showcases are CRITICAL priority (career advancement focus)
- Work streams designed for parallel agent execution where possible
- Each task is scoped for autonomous agent completion
- No time estimates provided (user will judge timing)

---

## Phase 1: Foundation & Infrastructure
**Priority:** CRITICAL (Blocking all other work)
**Parallelization:** Limited - sequential dependencies

### 1.1 Server Provisioning & Initial Setup
**Agent Type:** general-purpose
**Dependencies:** None
**Blocking:** All subsequent phases

**Tasks:**
- [ ] Provision VPS hosting (DigitalOcean or Linode)
  - 2GB RAM minimum
  - Ubuntu 22.04 LTS
  - Document server credentials and IP address
- [ ] Configure firewall rules (ports 80, 443, 22)
- [ ] Set up SSH key authentication
- [ ] Create non-root user with sudo privileges
- [ ] Initial server hardening (disable root login, configure fail2ban)

**Deliverables:**
- Server IP address
- SSH access configured
- Security baseline established

---

### 1.2 Domain & DNS Configuration
**Agent Type:** general-purpose
**Dependencies:** 1.1 (Server IP needed)
**Can Parallel With:** 1.3 (Ghost installation prep)

**Tasks:**
- [ ] Configure DNS A record pointing MikeJones.online to server IP
- [ ] Configure www CNAME record
- [ ] Verify DNS propagation
- [ ] Document DNS configuration

**Deliverables:**
- Domain resolving to server
- DNS configuration documented

---

### 1.3 Ghost CMS Installation
**Agent Type:** general-purpose
**Dependencies:** 1.1 (Server ready)
**Blocking:** All Phase 2 work

**Tasks:**
- [ ] Install Node.js (LTS version required by Ghost)
- [ ] Install MySQL or configure SQLite
- [ ] Install Ghost CLI globally
- [ ] Install Ghost in production mode
- [ ] Configure Ghost with domain (MikeJones.online)
- [ ] Start Ghost service
- [ ] Verify Ghost is running and accessible

**Deliverables:**
- Ghost CMS installed and running
- Admin interface accessible
- Database configured

---

### 1.4 SSL/TLS Certificate Setup
**Agent Type:** general-purpose
**Dependencies:** 1.2 (DNS configured), 1.3 (Ghost installed)

**Tasks:**
- [ ] Install Certbot
- [ ] Obtain Let's Encrypt SSL certificate for MikeJones.online and www
- [ ] Configure automatic certificate renewal
- [ ] Verify HTTPS is working
- [ ] Configure HTTP to HTTPS redirect

**Deliverables:**
- HTTPS enabled on all pages
- Auto-renewal configured
- SSL verification passing

---

### 1.5 Nginx Configuration
**Agent Type:** general-purpose
**Dependencies:** 1.3 (Ghost installed), 1.4 (SSL ready)

**Tasks:**
- [ ] Install Nginx
- [ ] Configure Nginx as reverse proxy for Ghost
- [ ] Set up caching headers
- [ ] Configure gzip compression
- [ ] Optimize for performance
- [ ] Test Nginx configuration

**Deliverables:**
- Nginx serving Ghost with optimal configuration
- Performance headers configured

---

### 1.6 Email Delivery Setup
**Agent Type:** general-purpose
**Dependencies:** 1.3 (Ghost installed)
**Can Parallel With:** Phase 2 work

**Tasks:**
- [ ] Choose email service (SendGrid, Mailgun, or SMTP)
- [ ] Create account and obtain API credentials
- [ ] Configure Ghost email settings
- [ ] Set up SPF and DKIM DNS records
- [ ] Test transactional email delivery
- [ ] Test contact form email delivery

**Deliverables:**
- Email delivery configured and tested
- SPF/DKIM records in DNS
- Contact form emails routing correctly

---

### 1.7 Backup System
**Agent Type:** general-purpose
**Dependencies:** 1.3 (Ghost installed)
**Can Parallel With:** Phase 2 and 3 work

**Tasks:**
- [ ] Set up automated daily backups (database + content)
- [ ] Configure off-site backup storage
- [ ] Create backup script (rsync or borg)
- [ ] Set up backup monitoring/notifications
- [ ] Test backup restoration process
- [ ] Document backup/restore procedures

**Deliverables:**
- Daily automated backups running
- Backup restoration verified
- Documentation complete

---

## Phase 2: Ghost Configuration & Theming
**Priority:** CRITICAL (Blocking content display)
**Dependencies:** Phase 1 (Ghost installed)
**Parallelization:** HIGH - most tasks can run concurrently

### 2.1 Theme Selection & Installation
**Agent Type:** general-purpose
**Dependencies:** 1.3 (Ghost installed)
**Blocking:** 2.2, 2.3 (theme customization)

**Tasks:**
- [ ] Evaluate Ghost themes (default Casper vs. premium options)
- [ ] Select theme that supports:
  - Portfolio/project showcase layouts
  - Dark mode capability
  - Modern tech aesthetic
  - Customization flexibility
- [ ] Install selected theme
- [ ] Activate theme in Ghost admin
- [ ] Document theme choice and rationale

**Deliverables:**
- Theme selected and installed
- Theme documentation

---

### 2.2 Visual Design Customization
**Agent Type:** general-purpose or Plan (if complex customization)
**Dependencies:** 2.1 (Theme installed)
**Can Parallel With:** 2.4, 2.5, 2.6

**Tasks:**
- [ ] Define color palette (professional tech colors with AI-forward aesthetic)
- [ ] Configure typography:
  - Primary font: Modern sans-serif (Inter, SF Pro, or similar)
  - Monospace font for code elements
  - Readable body text (16-18px minimum)
- [ ] Implement dark mode toggle/automatic switching
- [ ] Customize theme CSS:
  - AI project visual indicators (badges, tags, icons)
  - Code-inspired design elements
  - Generous whitespace
  - High contrast for readability
- [ ] Create/upload logo or finalize text-based branding
- [ ] Test visual design across devices

**Deliverables:**
- Custom color scheme implemented
- Typography configured
- Dark mode functional
- Brand identity established

---

### 2.3 Navigation & Information Architecture
**Agent Type:** general-purpose
**Dependencies:** 2.1 (Theme installed)
**Can Parallel With:** 2.2, 2.4, 2.5

**Tasks:**
- [ ] Configure primary navigation menu:
  - Home
  - About
  - Projects (with AI Projects filter/section)
  - SubStacks (dropdown for both feeds)
  - Resume/CV
  - Contact
- [ ] Set up mobile hamburger menu
- [ ] Configure footer navigation
- [ ] Add social profile links to footer
- [ ] Implement sticky navigation
- [ ] Add active page indication
- [ ] Test navigation on mobile and desktop

**Deliverables:**
- Complete navigation structure
- Mobile-responsive menu
- Footer with social links

---

### 2.4 ActivityPub Configuration
**Agent Type:** general-purpose
**Dependencies:** 1.3 (Ghost installed), 1.4 (HTTPS enabled)
**Can Parallel With:** 2.2, 2.3, 2.5

**Tasks:**
- [ ] Enable Ghost's built-in ActivityPub support
- [ ] Configure ActivityPub actor settings
- [ ] Set up WebFinger for @mike@MikeJones.online
- [ ] Test federation with Mastodon instance
- [ ] Configure which content types federate
- [ ] Set up Fediverse engagement display (likes, boosts, replies)
- [ ] Configure follower visibility
- [ ] Document ActivityPub configuration

**Deliverables:**
- ActivityPub enabled and tested
- Fediverse account followable
- Federation verified

---

### 2.5 Analytics Setup
**Agent Type:** general-purpose
**Dependencies:** 1.3 (Ghost installed)
**Can Parallel With:** 2.2, 2.3, 2.4

**Tasks:**
- [ ] Choose analytics platform (Plausible, Simple Analytics, or Ghost Analytics)
- [ ] Create analytics account
- [ ] Install analytics tracking code
- [ ] Configure tracked events:
  - Page views
  - Popular content
  - Traffic sources
  - Resume downloads
  - Contact form submissions
- [ ] Verify GDPR compliance
- [ ] Set up analytics dashboard access
- [ ] Test tracking functionality

**Deliverables:**
- Analytics platform configured
- Tracking verified
- Dashboard accessible

---

### 2.6 Page Templates Configuration
**Agent Type:** general-purpose
**Dependencies:** 2.1 (Theme installed)
**Can Parallel With:** 2.2, 2.4, 2.5

**Tasks:**
- [ ] Create/configure homepage template with:
  - Hero section layout
  - Featured projects section (with AI projects prioritized)
  - Recent content section
  - Professional summary section
  - Contact CTA
- [ ] Configure project case study template
- [ ] Configure About page template
- [ ] Configure Resume/CV page template
- [ ] Configure Contact page template
- [ ] Set up SubStack feed display templates

**Deliverables:**
- All page templates configured
- Layout structures ready for content

---

## Phase 3: Core Content Creation
**Priority:** CRITICAL (Launch blocking)
**Dependencies:** Phase 2 (Templates ready)
**Parallelization:** HIGH - content writing can be distributed

### 3.1 Asset Gathering & Preparation
**Agent Type:** general-purpose
**Dependencies:** None (can start during Phase 1/2)
**Can Parallel With:** All Phase 2 work

**Tasks:**
- [ ] Obtain/create professional headshot photo
- [ ] Collect SubStack RSS feed URLs:
  - Resilient Tomorrow feed URL
  - Operational Intelligence feed URL
- [ ] Gather AI project assets:
  - AI Memory System screenshots, diagrams, demo videos
  - Local LLM Setup architecture diagrams, screenshots
- [ ] Collect additional project assets:
  - NeighborhoodShare screenshots
  - Home Management System screenshots
  - Other project visuals
- [ ] Optimize all images (WebP format, compression)
- [ ] Organize assets in Ghost media library

**Deliverables:**
- Professional headshot ready
- All project assets collected and optimized
- SubStack feed URLs documented

---

### 3.2 Homepage Content
**Agent Type:** general-purpose
**Dependencies:** 2.6 (Homepage template), 3.1 (Assets ready)
**Can Parallel With:** 3.3, 3.4

**Tasks:**
- [ ] Write homepage hero section:
  - Professional tagline emphasizing AI/ML expertise
  - Elevator pitch (1-2 sentences) highlighting AI capabilities
  - Primary CTA (e.g., "View AI Projects")
- [ ] Create Featured Projects section:
  - Select 3-4 projects (AI projects first: AI Memory System, Local LLM Setup)
  - Write brief descriptions for each
  - Add explicit AI project labels/tags
- [ ] Write Professional Summary:
  - Key skills with AI/ML prominently featured
  - Specific callouts: AI implementation, LLM integration, prompt engineering
- [ ] Add Recent Content section placeholder
- [ ] Add Contact CTA
- [ ] Insert headshot/header image
- [ ] Publish homepage

**Deliverables:**
- Homepage published with all sections
- AI expertise clearly highlighted
- Professional presentation

---

### 3.3 About Page
**Agent Type:** general-purpose
**Dependencies:** 2.6 (About template), 3.1 (Headshot)
**Can Parallel With:** 3.2, 3.4, 3.5

**Tasks:**
- [ ] Write About page content:
  - Personal background and story
  - Professional journey with emphasis on AI/ML transition
  - Current focus areas: AI/ML exploration, practical AI implementations, LLM workflows, self-hosted AI infrastructure
  - Clear statement about AI expertise for employers
- [ ] Add professional photo/headshot
- [ ] Add links to social profiles and SubStacks
- [ ] Optimize for SEO (meta description, Open Graph tags)
- [ ] Publish About page

**Deliverables:**
- About page published
- AI expertise emphasized
- Social links included

---

### 3.4 Resume/CV Page
**Agent Type:** general-purpose
**Dependencies:** 2.6 (Resume template)
**Can Parallel With:** 3.2, 3.3, 3.5

**Tasks:**
- [ ] Write Resume/CV content:
  - Professional career history with AI/ML experience highlighted
  - Skills section with prominent AI/ML subsection:
    - AI/ML frameworks (LangChain, OpenAI API, local LLM deployment)
    - Prompt engineering and LLM integration
    - AI workflow automation
    - Self-hosted AI infrastructure
    - Practical AI application development
  - Education and certifications (AI-related training)
  - Visual emphasis on AI capabilities
- [ ] Create downloadable PDF version of resume
- [ ] Add Schema.org structured data for search engines
- [ ] Configure resume download tracking in analytics
- [ ] Optimize for SEO
- [ ] Publish Resume/CV page

**Deliverables:**
- Resume/CV page published
- PDF download available
- AI skills prominently featured
- Structured data implemented

---

### 3.5 Contact Page
**Agent Type:** general-purpose
**Dependencies:** 2.6 (Contact template), 1.6 (Email configured)
**Can Parallel With:** 3.2, 3.3, 3.4

**Tasks:**
- [ ] Create contact form with fields:
  - Name (required)
  - Email (required)
  - Subject (optional)
  - Message (required)
- [ ] Implement spam protection (honeypot or reCAPTCHA)
- [ ] Configure email routing to Mike's email
- [ ] Add success/error messaging
- [ ] Add privacy notice
- [ ] Integrate Cal.com for meeting scheduling
- [ ] Add Cal.com link/widget to contact page
- [ ] Test contact form submission
- [ ] Test email delivery
- [ ] Publish Contact page

**Deliverables:**
- Contact form functional and tested
- Cal.com integration working
- Spam protection active

---

### 3.6 AI Memory System Case Study (CRITICAL - PRIORITY 1)
**Agent Type:** general-purpose
**Dependencies:** 2.6 (Case study template), 3.1 (AI project assets)
**Can Parallel With:** 3.7 (other case studies)

**Tasks:**
- [ ] Write AI Memory System case study following template:
  - **Problem**: Challenge or need addressed
  - **Approach**: Strategy and methodology
  - **Solution**: Implementation details, technologies used
  - **AI/ML Components**: Models used, training approaches, AI tooling, prompt engineering, LLM integration
  - **Results**: Outcomes, learnings, impact
  - **Technical Details**: Architecture, code samples
  - **Links**: Live demos, repositories
- [ ] Add project visuals (screenshots, demos, diagrams)
- [ ] Add AI project badge/tag/icon
- [ ] Optimize images
- [ ] Add SEO metadata emphasizing AI/ML skills
- [ ] Add Schema.org CreativeWork structured data
- [ ] Publish case study

**Deliverables:**
- AI Memory System case study published
- AI/ML implementation expertise demonstrated
- Featured prominently on Projects page

---

### 3.7 Local LLM Setup Case Study (CRITICAL - PRIORITY 2)
**Agent Type:** general-purpose
**Dependencies:** 2.6 (Case study template), 3.1 (AI project assets)
**Can Parallel With:** 3.6, 3.8, 3.9

**Tasks:**
- [ ] Write Local LLM Setup case study following template:
  - **Problem**: Need for self-hosted AI infrastructure
  - **Approach**: Infrastructure planning and design
  - **Solution**: Implementation details, technologies, hardware
  - **AI/ML Components**: LLM models deployed, serving infrastructure, optimization
  - **Results**: Performance metrics, cost savings, capabilities
  - **Technical Details**: Architecture diagrams, configuration
  - **Links**: Documentation, related resources
- [ ] Add architecture diagrams and screenshots
- [ ] Add AI project badge/tag/icon
- [ ] Optimize images
- [ ] Add SEO metadata emphasizing AI infrastructure expertise
- [ ] Add Schema.org structured data
- [ ] Publish case study

**Deliverables:**
- Local LLM Setup case study published
- AI infrastructure expertise demonstrated
- Technical depth showcased

---

### 3.8 NeighborhoodShare Case Study (HIGH PRIORITY)
**Agent Type:** general-purpose
**Dependencies:** 2.6 (Case study template), 3.1 (Project assets)
**Can Parallel With:** 3.6, 3.7, 3.9, 3.10

**Tasks:**
- [ ] Write NeighborhoodShare case study following template
- [ ] Add project visuals
- [ ] Optimize images
- [ ] Add SEO metadata
- [ ] Add Schema.org structured data
- [ ] Publish case study

**Deliverables:**
- NeighborhoodShare case study published
- Breadth of skills demonstrated

---

### 3.9 Additional Case Studies (MEDIUM PRIORITY - 1-2 for launch)
**Agent Type:** general-purpose
**Dependencies:** 2.6 (Case study template), 3.1 (Project assets)
**Can Parallel With:** Other case studies in 3.8, 3.10

**Projects (select 1-2 for initial launch):**
- [ ] Home Management System (highlight AI integrations if any)
- [ ] Resilient Tomorrow (SubStack and associated work)
- [ ] AirPusher/AirShip involvement
- [ ] Burning Man projects

**Tasks (per case study):**
- [ ] Write case study following template
- [ ] Add visuals
- [ ] Optimize images
- [ ] Add SEO metadata
- [ ] Publish

**Deliverables:**
- 1-2 additional case studies published
- Diverse project portfolio shown

---

### 3.10 Projects Landing Page
**Agent Type:** general-purpose
**Dependencies:** 3.6, 3.7 (AI case studies), 3.8, 3.9 (additional case studies)

**Tasks:**
- [ ] Create Projects landing page
- [ ] Implement project gallery/grid layout
- [ ] Add AI Projects filter or dedicated section
- [ ] Feature AI projects prominently at top
- [ ] Add project cards with:
  - Project titles
  - Brief descriptions
  - Visual thumbnails
  - AI project badges/tags
  - Links to full case studies
- [ ] Organize projects by category or importance
- [ ] Add SEO metadata
- [ ] Publish Projects page

**Deliverables:**
- Projects landing page published
- AI projects featured prominently
- Easy navigation to all case studies

---

## Phase 4: Integrations & Features
**Priority:** HIGH (Launch important but not blocking)
**Dependencies:** Phase 3 (Core content)
**Parallelization:** HIGH - most tasks independent

### 4.1 SubStack RSS Integration - Resilient Tomorrow
**Agent Type:** general-purpose or Plan (depending on approach)
**Dependencies:** 2.6 (Templates), 3.1 (RSS feed URL)
**Can Parallel With:** 4.2, 4.3

**Tasks:**
- [ ] Choose integration approach:
  - Custom Ghost integration
  - Theme modification
  - Python RSS parser script
- [ ] Implement RSS feed fetching for Resilient Tomorrow
- [ ] Create dedicated page at `/resilient-tomorrow`
- [ ] Display feed content:
  - Post titles
  - Publication dates
  - Excerpts
  - Links to full articles on SubStack
- [ ] Implement caching to avoid rate limiting
- [ ] Set up daily update schedule
- [ ] Add error handling for feed unavailability
- [ ] Test feed display and updates
- [ ] Publish SubStack feed page

**Deliverables:**
- Resilient Tomorrow feed integrated
- Page published and updating daily
- Caching implemented

---

### 4.2 SubStack RSS Integration - Operational Intelligence
**Agent Type:** general-purpose or Plan
**Dependencies:** 2.6 (Templates), 3.1 (RSS feed URL)
**Can Parallel With:** 4.1, 4.3

**Tasks:**
- [ ] Implement RSS feed fetching for Operational Intelligence
- [ ] Create dedicated page at `/operational-intelligence`
- [ ] Display feed content with separate branding from Resilient Tomorrow
- [ ] Implement caching
- [ ] Set up daily update schedule
- [ ] Add error handling
- [ ] Test feed display
- [ ] Publish SubStack feed page

**Deliverables:**
- Operational Intelligence feed integrated
- Page published with distinct branding
- Daily updates functional

---

### 4.3 SEO & Schema.org Implementation
**Agent Type:** general-purpose
**Dependencies:** Phase 3 (Content created)
**Can Parallel With:** 4.1, 4.2, 4.4

**Tasks:**
- [ ] Add meta descriptions to all pages
- [ ] Implement Open Graph tags for social sharing on all pages
- [ ] Add Schema.org structured data:
  - Person (Mike Jones)
  - Article (for activity feed posts, case studies)
  - CreativeWork (for projects)
  - SocialMediaPosting (for activity feed - post-launch)
- [ ] Create XML sitemap
- [ ] Configure robots.txt
- [ ] Verify canonical links for SubStack content
- [ ] Ensure proper heading hierarchy (H1-H6) across all pages
- [ ] Test structured data with Google Rich Results Test
- [ ] Submit sitemap to search engines

**Deliverables:**
- All pages SEO-optimized
- Structured data implemented and validated
- Sitemap submitted

---

### 4.4 AEO (ActivityPub Engagement Optimization)
**Agent Type:** general-purpose
**Dependencies:** 2.4 (ActivityPub configured), Phase 3 (Content)
**Can Parallel With:** 4.1, 4.2, 4.3

**Tasks:**
- [ ] Optimize ActivityPub actor metadata for discoverability
- [ ] Implement rich preview cards for Fediverse sharing
- [ ] Develop hashtag strategy for content discovery
- [ ] Complete Fediverse profile (@mike@MikeJones.online):
  - Profile bio
  - Avatar
  - Header image
  - Links
- [ ] Verify WebFinger configuration
- [ ] Optimize post formatting for Mastodon/Fediverse display
- [ ] Test Fediverse post previews
- [ ] Document hashtag strategy for future content

**Deliverables:**
- ActivityPub profile complete
- Fediverse-optimized content display
- Hashtag strategy documented

---

### 4.5 Performance Optimization
**Agent Type:** general-purpose
**Dependencies:** Phase 3 (Content created)
**Can Parallel With:** 4.1, 4.2, 4.3, 4.4

**Tasks:**
- [ ] Optimize all images (WebP format, compression, lazy loading)
- [ ] Configure browser caching headers
- [ ] Implement CDN (optional but recommended)
- [ ] Minimize CSS/JS
- [ ] Test page load times on 4G connection
- [ ] Run Lighthouse audits (target: 90+ on all metrics)
- [ ] Optimize for mobile performance
- [ ] Implement performance monitoring
- [ ] Address any performance bottlenecks

**Deliverables:**
- Page load time < 3 seconds on 4G
- Lighthouse scores 90+ across all categories
- CDN configured (if used)

---

## Phase 5: Testing & Quality Assurance
**Priority:** CRITICAL (Pre-launch blocking)
**Dependencies:** Phases 1-4 (All features complete)
**Parallelization:** MEDIUM - can distribute testing tasks

### 5.1 Cross-Browser Testing
**Agent Type:** general-purpose
**Dependencies:** All content and features complete
**Can Parallel With:** 5.2, 5.3

**Tasks:**
- [ ] Test on Chrome/Edge (latest 2 versions)
- [ ] Test on Firefox (latest 2 versions)
- [ ] Test on Safari (latest 2 versions)
- [ ] Verify all functionality works across browsers:
  - Navigation
  - Contact form
  - Dark mode toggle
  - Image display
  - External links
- [ ] Document and fix any browser-specific issues
- [ ] Re-test fixes

**Deliverables:**
- Site functional on all major browsers
- Browser-specific issues resolved

---

### 5.2 Mobile Responsiveness Testing
**Agent Type:** general-purpose
**Dependencies:** All content and features complete
**Can Parallel With:** 5.1, 5.3

**Tasks:**
- [ ] Test on mobile devices (320px - 768px)
- [ ] Test on tablets (768px - 1024px)
- [ ] Test on desktop (1024px+)
- [ ] Verify responsive design elements:
  - Navigation (hamburger menu)
  - Images and galleries
  - Typography scaling
  - Touch targets (minimum 44px)
  - Form inputs
  - Project cards/layouts
- [ ] Test on iOS Safari
- [ ] Test on Chrome Mobile
- [ ] Test on Firefox Mobile
- [ ] Document and fix responsive issues
- [ ] Re-test fixes

**Deliverables:**
- Site fully responsive across all screen sizes
- Mobile UX optimized

---

### 5.3 Accessibility Testing
**Agent Type:** general-purpose
**Dependencies:** All content complete
**Can Parallel With:** 5.1, 5.2, 5.4

**Tasks:**
- [ ] Verify WCAG 2.1 Level AA compliance:
  - Semantic HTML structure
  - Proper heading hierarchy
  - Alt text for all images
  - Keyboard navigation support
  - Color contrast (4.5:1 minimum)
  - Skip navigation links
  - ARIA labels where appropriate
- [ ] Test with screen reader (NVDA or VoiceOver)
- [ ] Run automated accessibility audit (axe DevTools or Lighthouse)
- [ ] Test keyboard-only navigation
- [ ] Document and fix accessibility issues
- [ ] Re-test with screen reader

**Deliverables:**
- WCAG 2.1 Level AA compliance achieved
- Screen reader testing passed
- Keyboard navigation functional

---

### 5.4 ActivityPub Federation Testing
**Agent Type:** general-purpose
**Dependencies:** 2.4 (ActivityPub configured), Phase 3 (Content)
**Can Parallel With:** 5.1, 5.2, 5.3

**Tasks:**
- [ ] Create test Mastodon account
- [ ] Follow @mike@MikeJones.online from Mastodon
- [ ] Publish test post and verify it appears in Mastodon timeline
- [ ] Test Fediverse engagement (likes, boosts, replies)
- [ ] Verify engagement displays on site
- [ ] Test WebFinger lookup
- [ ] Test federation with other ActivityPub platforms (Pixelfed, etc.)
- [ ] Verify follower count display
- [ ] Document any federation issues
- [ ] Fix federation problems
- [ ] Re-test

**Deliverables:**
- ActivityPub federation fully functional
- Posts appearing in Fediverse timelines
- Engagement displaying correctly

---

### 5.5 Contact Form & Email Testing
**Agent Type:** general-purpose
**Dependencies:** 3.5 (Contact page), 1.6 (Email delivery)
**Can Parallel With:** 5.1, 5.2, 5.3, 5.4

**Tasks:**
- [ ] Test contact form submission with valid data
- [ ] Test form validation (required fields)
- [ ] Verify spam protection working (honeypot or reCAPTCHA)
- [ ] Confirm emails delivered to Mike's inbox
- [ ] Test success/error messaging
- [ ] Test from multiple browsers
- [ ] Test from mobile devices
- [ ] Verify email formatting and content
- [ ] Test Cal.com integration and scheduling flow
- [ ] Document any email delivery issues

**Deliverables:**
- Contact form fully functional
- Email delivery confirmed
- Cal.com integration working

---

### 5.6 Security Verification
**Agent Type:** general-purpose
**Dependencies:** Phase 1 (Infrastructure)
**Can Parallel With:** 5.1, 5.2, 5.3

**Tasks:**
- [ ] Verify HTTPS on all pages
- [ ] Test SSL certificate validity
- [ ] Verify HTTP to HTTPS redirect
- [ ] Check for mixed content warnings
- [ ] Verify CSRF protection on forms
- [ ] Test spam prevention on contact form
- [ ] Review database security (strong passwords, limited access)
- [ ] Verify backup system is running
- [ ] Test backup restoration
- [ ] Run security headers check (securityheaders.com)
- [ ] Document security configuration

**Deliverables:**
- All security measures verified
- Backups tested and functional
- Security headers optimized

---

### 5.7 Launch Checklist Verification
**Agent Type:** general-purpose
**Dependencies:** All Phase 5 testing tasks

**Tasks:**
- [ ] Verify all critical pages published:
  - Home
  - About
  - Resume/CV
  - Contact
  - AI Memory System case study
  - Local LLM Setup case study
  - Projects landing page
  - SubStack feeds
- [ ] Verify contact form tested and working
- [ ] Verify SSL certificate active
- [ ] Verify DNS propagated
- [ ] Verify analytics configured and tracking
- [ ] Verify ActivityPub federation tested
- [ ] Verify mobile responsive design
- [ ] Verify browser compatibility across all targets
- [ ] Verify performance benchmarks met (Lighthouse 90+)
- [ ] Verify backup system tested
- [ ] Verify 404 page configured
- [ ] Verify SEO metadata complete on all pages
- [ ] Document launch readiness status

**Deliverables:**
- Complete launch checklist
- All items verified or documented exceptions
- Launch readiness confirmed

---

## Phase 6: Launch
**Priority:** CRITICAL
**Dependencies:** Phase 5 (All testing complete)

### 6.1 Pre-Launch Final Verification
**Agent Type:** general-purpose
**Dependencies:** 5.7 (Launch checklist complete)

**Tasks:**
- [ ] Final review of all content for typos/errors
- [ ] Final test of all critical paths:
  - Homepage → Projects → Case Study
  - Homepage → Resume → Contact
  - Homepage → SubStack feeds
- [ ] Final performance check
- [ ] Final security check
- [ ] Final mobile check
- [ ] Confirm monitoring is active
- [ ] Confirm analytics is tracking
- [ ] Create pre-launch backup

**Deliverables:**
- Site ready for public launch
- All systems verified
- Pre-launch backup created

---

### 6.2 Launch Execution
**Agent Type:** general-purpose
**Dependencies:** 6.1 (Pre-launch verification)

**Tasks:**
- [ ] Announce on ActivityPub/Fediverse
- [ ] Share with personal network
- [ ] Update social profiles with website link
- [ ] Submit to search engines (Google Search Console, Bing Webmaster)
- [ ] Monitor for immediate issues
- [ ] Respond to any launch day problems
- [ ] Document launch date and initial metrics

**Deliverables:**
- Site publicly launched
- Initial promotion complete
- Monitoring active

---

### 6.3 Post-Launch Monitoring Setup
**Agent Type:** general-purpose
**Dependencies:** 6.2 (Launch complete)

**Tasks:**
- [ ] Set up uptime monitoring (UptimeRobot or similar)
- [ ] Configure SSL certificate expiration alerts
- [ ] Set up backup success notifications
- [ ] Configure ActivityPub federation health monitoring
- [ ] Set up analytics review schedule
- [ ] Document monitoring dashboards and alerts

**Deliverables:**
- Comprehensive monitoring active
- Alert notifications configured
- Monitoring documentation complete

---

## Phase 7: Post-Launch Enhancements
**Priority:** MEDIUM (Ongoing improvements after launch)
**Dependencies:** Phase 6 (Site launched)
**Parallelization:** HIGH - independent feature additions

### 7.1 Remaining Project Case Studies
**Agent Type:** general-purpose
**Dependencies:** Launch complete
**Can Parallel With:** 7.2, 7.3

**Projects to Complete:**
- [ ] Home Management System case study
- [ ] Resilient Tomorrow case study
- [ ] AirPusher/AirShip case study
- [ ] Burning Man projects case study

**Tasks (per case study):**
- [ ] Write case study following established template
- [ ] Add visuals
- [ ] Optimize images
- [ ] Add SEO metadata
- [ ] Publish and add to Projects page

**Deliverables:**
- Complete project portfolio published
- All major projects documented

---

### 7.2 Activity Feed Implementation
**Agent Type:** Plan → general-purpose
**Dependencies:** Launch complete
**Can Parallel With:** 7.1, 7.3

**Note:** This is the social media replacement feature - short updates that federate to Fediverse.

**Tasks:**
- [ ] Plan Activity Feed architecture and approach
- [ ] Design Activity Feed page layout
- [ ] Implement topic-based filtering:
  - Personal life updates
  - Resilient Tomorrow content
  - Velocity Partners / Operational Intelligence
  - General tech/AI work
- [ ] Configure ActivityPub auto-publishing for feed posts
- [ ] Set up Ghost mobile app for quick posting
- [ ] Create posting workflow documentation
- [ ] Add Activity Feed to navigation
- [ ] Test federation of Activity Feed posts
- [ ] Create initial activity posts
- [ ] Publish Activity Feed page

**Deliverables:**
- Activity Feed live and functional
- Topic filtering working
- Federated posting tested
- Social media replacement ready

---

### 7.3 Python Integration for SubStack Enhancement
**Agent Type:** general-purpose
**Dependencies:** 4.1, 4.2 (SubStack feeds working)
**Can Parallel With:** 7.1, 7.2

**Tasks:**
- [ ] Create Python virtual environment
- [ ] Develop Python RSS parser for enhanced SubStack integration
- [ ] Implement advanced caching mechanism
- [ ] Add content analysis or enhancement features
- [ ] Create automation scripts for feed updates
- [ ] Set up scheduled execution
- [ ] Test Python integrations
- [ ] Document Python scripts and setup

**Deliverables:**
- Python integrations enhance SubStack feeds
- Automated scripts running
- Documentation complete

---

### 7.4 Additional Integrations & Features
**Agent Type:** Plan → general-purpose
**Dependencies:** Launch complete
**Can Parallel With:** All Phase 7 work

**Future Integrations (as needed):**
- [ ] Bluesky cross-posting integration
- [ ] GitHub integration (display repositories and contributions)
- [ ] LinkedIn cross-posting
- [ ] Enhanced calendar/booking system features
- [ ] Additional social platform integrations

**Tasks (per integration):**
- [ ] Plan integration approach
- [ ] Implement integration
- [ ] Test functionality
- [ ] Document integration
- [ ] Publish/activate

**Deliverables:**
- Additional integrations as prioritized
- Enhanced platform connectivity

---

### 7.5 Content & SEO Optimization
**Agent Type:** general-purpose
**Dependencies:** Launch complete, analytics data available
**Can Parallel With:** All Phase 7 work

**Tasks:**
- [ ] Review analytics for popular content
- [ ] Identify underperforming pages
- [ ] Optimize content based on user behavior
- [ ] Enhance SEO for target keywords
- [ ] Add internal linking between related content
- [ ] Create additional content as needed
- [ ] Expand AI project showcases as new projects develop
- [ ] Regular content updates and refreshes

**Deliverables:**
- Ongoing content optimization
- Improved search rankings
- Enhanced user engagement

---

## Agent Type Reference

**Agent assignments by capability:**

### general-purpose Agent
**Use for:** Most tasks requiring execution, configuration, content creation, testing
- Infrastructure setup and server configuration
- Ghost CMS installation and configuration
- Theme customization and setup
- Content creation (pages, case studies)
- Integration implementations
- Testing tasks
- Deployment and monitoring

### Plan Agent
**Use for:** Complex features requiring design and implementation planning
- Complex custom integrations (if SubStack RSS needs custom solution)
- Activity Feed architecture
- Future features with multiple implementation approaches

### Explore Agent
**Use for:** Understanding existing codebases and structures
- Ghost theme structure exploration
- Understanding Ghost plugin architecture
- Investigating Ghost API capabilities

### Bash Agent
**Use for:** Git operations, command execution, deployment scripts
- Git commits for configuration changes
- Server command execution
- Deployment script execution

### code-reviewer Agent
**Use for:** Quality assurance on custom code
- Review custom Ghost theme modifications
- Review integration code
- Security review of custom scripts

---

## Parallelization Strategy

### Maximum Parallel Workstreams:

**During Phase 1 (Foundation):**
- 1-2 agents: Infrastructure tasks are mostly sequential

**During Phase 2 (Configuration):**
- 4-5 agents: Theme customization, ActivityPub, analytics, navigation, templates

**During Phase 3 (Content):**
- 6-8 agents: Homepage, About, Resume, Contact, multiple case studies simultaneously

**During Phase 4 (Integrations):**
- 4-5 agents: Both SubStack feeds, SEO, AEO, performance optimization

**During Phase 5 (Testing):**
- 4-6 agents: Cross-browser, mobile, accessibility, federation, security testing

**During Phase 7 (Post-Launch):**
- 3-5 agents: Additional case studies, Activity Feed, Python integrations, optimization

---

## Priority Summary

### CRITICAL (Must Complete for Launch):
- **Phase 1:** All infrastructure and hosting setup
- **Phase 2:** Ghost configuration, theme, navigation, ActivityPub
- **Phase 3:** Core pages (Home, About, Resume, Contact) + AI case studies (AI Memory System, Local LLM Setup) + 1-2 additional case studies
- **Phase 4:** SubStack integrations, SEO/AEO, performance optimization
- **Phase 5:** All testing and verification
- **Phase 6:** Launch execution and monitoring

### HIGH PRIORITY (Launch Important, Not Blocking):
- Remaining integrations (analytics, Cal.com)
- Additional case studies (NeighborhoodShare)
- Complete SEO implementation

### MEDIUM PRIORITY (Post-Launch):
- **Phase 7:** Activity Feed implementation
- Remaining project case studies
- Python integrations
- Additional platform integrations
- Ongoing optimization

---

## Success Criteria Reminders

**At Launch:**
- Site is live and accessible via HTTPS
- All critical content published with AI projects prominently featured
- Contact form functional
- ActivityPub federation working
- Mobile responsive
- Performance benchmarks met (Lighthouse 90+)
- SEO basics implemented

**Post-Launch (First 3 Months):**
- 500+ unique visitors
- ActivityPub followers: 50+
- Contact form submissions: 5-10 quality inquiries
- AI project page engagement tracked
- Professional opportunities generated, particularly AI/ML-related

**Long-Term:**
- Regular content publishing (Activity Feed)
- Growing Fediverse audience
- Professional opportunities through site
- Site demonstrates AI/ML expertise effectively
- Low maintenance overhead maintained

---

## Notes for Agents

1. **Each task is designed to be autonomous:** Tasks include sufficient context for an agent to complete without human intervention, except for content requiring Mike's input (personal stories, specific project details).

2. **Dependencies are explicit:** Do not start a task until its dependencies are marked complete.

3. **Parallel execution is encouraged:** When multiple tasks have the same dependencies and no blocking relationship, they should be executed concurrently.

4. **Documentation is critical:** Every task should produce documentation (inline comments, setup docs, configuration notes) for future reference.

5. **Testing is non-negotiable:** All features must be tested before marking complete.

6. **AI/ML emphasis throughout:** Remember that showcasing AI expertise is the PRIMARY career goal. All content should emphasize AI capabilities prominently.

7. **Communicate blockers immediately:** If a task cannot be completed due to missing information or unexpected issues, document and escalate rather than guessing.

---

**End of Roadmap**
