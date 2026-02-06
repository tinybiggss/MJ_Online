# MJ_Online Website Requirements Specification

**Project Name:** MJ_Online Personal Website
**Domain:** MikeJones.online
**Version:** 1.0
**Date:** 2026-01-20
**Project Type:** Career Portfolio & Federated Personal Publishing Platform

---

## 1. Executive Summary

### 1.1 Project Overview
MJ_Online is a personal website and career portfolio for Mike Jones that serves as a centralized hub for professional accomplishments, project showcases, and content syndication. The site will enable visitors to explore Mike's career journey while providing subscription capabilities through ActivityPub federation, allowing followers from the Fediverse (Mastodon, etc.) to receive updates.

### 1.2 Primary Goals
1. **Career Portfolio** (Primary): Demonstrate professional skills, accomplishments, and projects to potential employers/clients, with particular emphasis on AI implementation and LLM integration expertise and practical AI implementation experience
2. **Content Aggregation**: Centralize feeds from multiple SubStack publications
3. **Social Federation** (Secondary): Enable audience building through ActivityPub integration
4. **Skills Demonstration**: Showcase web development, technical capabilities, and AI expertise through the website itself and featured projects

### 1.3 Success Criteria
- Site launches within 1-2 weeks
- Professional presentation suitable for career advancement
- Functional ActivityPub integration allowing Fediverse users to follow the site
- Low maintenance overhead after initial setup
- Responsive design working across all devices

---

## 2. Stakeholders & Users

### 2.1 Primary Stakeholder
- **Mike Jones**: Site owner, content publisher, career professional

### 2.2 Target Audiences

**Primary Audience: Employers & Professional Contacts (60%)**
- Hiring managers and recruiters
- Potential clients and collaborators
- Professional network connections
- **Needs**: Quick understanding of skills, credibility, contact method
- **Behavior**: Brief visits, focused on specific projects/resume

**Secondary Audience: Content Followers (30%)**
- SubStack readers
- Fediverse users interested in Mike's writing
- **Needs**: New content notifications, easy content access
- **Behavior**: Recurring visits, subscription-based engagement

**Tertiary Audience: Technical Peers (10%)**
- Developers and technical professionals
- **Needs**: Deep dives into projects, technical details
- **Behavior**: Thorough exploration of case studies and implementations

---

## 3. Functional Requirements

### 3.1 Core Content Management

#### 3.1.1 Content Publishing System
- **CMS Platform**: Ghost CMS (self-hosted)
- **Editor**: Native Ghost editor for creating/editing content
- **Content Types**:
  - **Activity Feed** posts (short updates, milestones, personal updates)
  - Project case studies (in-depth, polished writeups)
  - Static pages (About, Resume, Contact)
- **Draft/Publish workflow**: Standard Ghost publishing workflow
- **Media Management**: Image uploads, optimization, galleries for project showcases
- **Mobile Publishing**: Ghost mobile app for on-the-go updates to Activity Feed

#### 3.1.2 SubStack Integration
**Requirement**: Display content from two SubStack publications

**SubStack 1: Resilient Tomorrow**
- Dedicated page at `/resilient-tomorrow` or similar
- RSS feed integration to pull latest posts
- Display: Post titles, publication dates, excerpts, links to full articles on SubStack
- Update frequency: Check for new content daily

**SubStack 2: Operational Intelligence for Velocity Partners**
- Dedicated page at `/operational-intelligence` or similar
- Same RSS integration pattern as above
- Separate branding/presentation from Resilient Tomorrow

**Technical Approach**:
- Custom Ghost integration or theme modification
- RSS feed parsing (Python script or Ghost integration)
- Cached feed content to avoid rate limiting

#### 3.1.3 Activity Feed (Post-Launch Priority)
**Purpose**: Replace traditional social media (Facebook, Instagram, TikTok) with owned feed that federates to where people already are.

**Content Types**:
- Short updates about current work
- Project milestones and accomplishments
- Personal life updates
- Links to things built/published with context
- Photos and media (similar to Instagram/TikTok posts)

**Topic-Based Filtering**:
- Personal life updates
- Resilient Tomorrow content
- Velocity Partners / Operational Intelligence
- General tech/AI work
- Users can subscribe to specific topics of interest

**Federation & Distribution**:
- ActivityPub integration (Fediverse/Mastodon) - built into Ghost
- Appears in followers' timelines automatically
- Future: Cross-posting to other platforms if needed

**Content Creation**:
- Web interface for longer updates
- Ghost mobile app for quick posts on-the-go
- Low-friction posting experience

**Distinction from Case Studies**:
- Activity Feed: Short, informal, frequent updates
- Case Studies: In-depth, polished, comprehensive project writeups
- Case study announcements can appear in Activity Feed

**Implementation Note**: This is a **post-launch feature**. Initial launch focuses on portfolio content (case studies, About, Resume). Activity Feed can be added after core site is established.

### 3.2 Portfolio & Project Showcase

#### 3.2.1 Project Case Studies
**Format**: In-depth case study pages for each major project

**Required Projects to Showcase**:
1. **AI Memory System** (personal AI workflow) - **PRIORITY: Demonstrates AI implementation and LLM integration skills**
2. **Local LLM Setup** (self-hosted AI infrastructure) - **PRIORITY: Demonstrates AI infrastructure expertise**
3. Resilient Tomorrow (SubStack publication and associated work - may include AI applications)
4. NeighborhoodShare
5. Home Management System (family project - highlight any AI integrations)
6. AirPusher/AirShip involvement
7. Burning Man projects/involvement

**Note**: AI-related projects should be prominently featured and given priority treatment to showcase AI implementation and LLM integration expertise to potential employers.

**Case Study Template Structure**:
- Project title and summary
- **Problem**: Challenge or need addressed
- **Approach**: Strategy and methodology
- **Solution**: Implementation details, technologies used
- **AI & LLM Integration Components** (where applicable): Models used, training approaches, AI tooling, prompt engineering, LLM integration
- **Results**: Outcomes, learnings, impact
- **Visuals**: Screenshots, demos, diagrams
- **Technical Details**: Architecture notes, code samples (where appropriate)
- **Links**: Live demos, repositories, related content

**For AI Projects**: Emphasize practical AI implementation, model selection rationale, challenges overcome, and measurable outcomes to demonstrate hands-on AI expertise.

#### 3.2.2 Resume/CV Section
- Dedicated page at `/resume` or `/cv`
- Professional career history with AI implementation and LLM integration experience highlighted
- **Skills and technologies** with prominent AI & LLM Integration section:
  - AI and LLM frameworks and tools (e.g., LangChain, OpenAI API, local LLM deployment)
  - Prompt engineering and LLM integration
  - AI workflow automation
  - Self-hosted AI infrastructure
  - Practical AI application development
- Education and certifications (including AI-related training)
- Downloadable PDF version
- Structured data (Schema.org) for search engines
- **Visual emphasis** on AI capabilities to ensure visibility to recruiters and hiring managers

#### 3.2.3 About Page
- Personal background and story
- Professional journey overview with emphasis on transition into AI implementation and context engineering work
- **Current focus areas and interests**: Highlight AI implementation exploration, practical AI implementations, LLM workflows, and self-hosted AI infrastructure as primary professional focus
- Photo/headshot
- Links to social profiles and SubStacks
- **Clear statement** about AI expertise and hands-on experience for potential employers

### 3.3 ActivityPub Federation

#### 3.3.1 Fediverse Integration
**Platform**: Native Ghost ActivityPub support (introduced 2024)

**Required Functionality**:
1. **Followable Account**:
   - Site acts as an ActivityPub actor
   - Users can follow `@mike@MikeJones.online` from Mastodon, Pixelfed, etc.

2. **Auto-Publishing**:
   - New posts (activity feed updates, case studies) automatically appear in followers' Fediverse timelines
   - Control over what gets published (all posts vs. tagged posts)
   - Topic-based filtering for selective content federation

3. **Engagement Display**:
   - Show Fediverse likes, boosts, and replies on post pages
   - Display follower count

4. **Cross-Posting** (Future/Optional):
   - Ability to cross-post to other platforms (Bluesky, etc.)
   - May require third-party integrations or custom development

#### 3.3.2 Traditional Syndication
- RSS/Atom feeds for all content
- Email newsletter option (Ghost built-in)

### 3.4 User Interaction

#### 3.4.1 Contact & Scheduling
**Contact Form**:
- Dedicated contact page at `/contact`
- Form fields:
  - Name (required)
  - Email (required)
  - Subject (optional)
  - Message (required)
  - Simple spam protection (honeypot or reCAPTCHA)
- Email delivery to Mike's email address
- Success/error messaging
- Privacy notice

**Meeting Scheduling**:
- Integration with Cal.com for meeting requests
- Link to schedule meetings/consultations
- Display on Contact page and potentially in hero/CTA sections
- Clear availability and meeting type options

#### 3.4.2 Navigation
- Clear, persistent navigation menu
- Mobile-responsive hamburger menu
- Key sections easily accessible:
  - Home
  - Projects
  - Resume
  - SubStacks (dropdown or dedicated links)
  - About
  - Contact
- Footer with social links and copyright

### 3.5 Search & Discovery

#### 3.5.1 SEO & AEO Requirements

**Traditional SEO (Search Engine Optimization)**:
- Semantic HTML structure
- Meta descriptions for all pages
- Open Graph tags for social sharing
- Schema.org structured data for:
  - Person (Mike Jones)
  - Article (activity feed posts, case studies)
  - CreativeWork (projects)
  - SocialMediaPosting (for activity feed content)
- XML sitemap
- robots.txt

**AEO (ActivityPub/Fediverse Engagement Optimization)**:
- Proper ActivityPub actor metadata for discoverability
- Rich preview cards when posts are shared in Fediverse
- Hashtag strategy for Fediverse content discovery
- Profile completeness for Fediverse identity (@mike@MikeJones.online)
- WebFinger configuration for proper federation
- Optimized post formatting for Mastodon/Fediverse display

**SubStack Content Optimization**:
- When displaying SubStack RSS content, include proper meta tags
- Canonical links back to original SubStack posts
- Author attribution and publication date
- Rich snippets for aggregated content
- Clear distinction between original and syndicated content for search engines

#### 3.5.2 Analytics
- Privacy-respecting analytics (Plausible, Simple Analytics, or Ghost built-in)
- Track:
  - Page views
  - Popular content
  - Traffic sources
  - Basic user engagement

---

## 4. Technical Requirements

### 4.1 Platform & Hosting

#### 4.1.1 CMS Platform
- **Software**: Ghost CMS (latest stable version)
- **Language**: Node.js (Ghost core)
- **Database**: MySQL or SQLite (Ghost manages all database structure internally)
- **Rationale**: Native ActivityPub, professional themes, fast deployment
- **Database Note**: Ghost handles all database schemas, migrations, and structure automatically. No custom database design needed. While Supabase could theoretically be used, Ghost's built-in MySQL/SQLite integration is recommended for simplicity and official support.

#### 4.1.2 Hosting Infrastructure
- **Budget**: $15-30/month
- **Recommended Options**:
  - **DigitalOcean Droplet** (2GB RAM minimum) - VPS hosting provider
  - **Linode VPS** (now Akamai Cloud) - Alternative VPS hosting provider
  - **Ghost(Pro)** - Managed Ghost hosting (simplest, higher cost ~$25-50/month)
- **What You're Hosting**:
  - Ghost CMS application (Node.js)
  - MySQL or SQLite database (all data lives here)
  - Static assets (images, themes, uploaded content)
  - Web server (Nginx)
- **Requirements**:
  - Ubuntu 22.04 LTS or similar
  - SSL/TLS certificate (Let's Encrypt)
  - Domain configured (MikeJones.online)
  - Automated backups
  - Email delivery (SendGrid, Mailgun, or SMTP)
- **Database Hosting Note**: The database runs on the same VPS server. No separate database hosting (like Supabase) needed since Ghost manages its own database.

#### 4.1.3 Domain & DNS
- **Domain**: MikeJones.online (already owned)
- **DNS Configuration**:
  - A record pointing to hosting server
  - CNAME for www subdomain
  - MX records if hosting email
  - TXT records for email authentication (SPF, DKIM)

### 4.2 Performance Requirements

- **Page Load Time**: < 3 seconds on 4G connection
- **Lighthouse Score**: 90+ for Performance, Accessibility, Best Practices, SEO
- **Image Optimization**: WebP format with fallbacks, lazy loading
- **Caching**: Browser caching, CDN (optional but recommended)
- **Mobile Performance**: Optimized for mobile-first experience

### 4.3 Security Requirements

- **HTTPS**: Required for all pages (Let's Encrypt SSL)
- **Ghost Updates**: Regular security updates applied
- **Form Security**: CSRF protection, spam prevention
- **Database Security**: Strong passwords, limited access
- **Backup Strategy**:
  - Daily automated backups
  - Off-site backup storage
  - Tested restoration process

### 4.4 Browser & Device Support

**Desktop Browsers** (latest 2 versions):
- Chrome/Edge
- Firefox
- Safari

**Mobile Browsers**:
- iOS Safari
- Chrome Mobile
- Firefox Mobile

**Screen Sizes**:
- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

### 4.5 Accessibility Requirements

- **WCAG 2.1 Level AA Compliance**:
  - Semantic HTML
  - Proper heading hierarchy
  - Alt text for all images
  - Keyboard navigation support
  - Sufficient color contrast (4.5:1 minimum)
  - Skip navigation links
  - ARIA labels where appropriate
- **Screen Reader Testing**: Test with NVDA or VoiceOver

---

## 5. Design & User Experience

### 5.1 Visual Design

#### 5.1.1 Design Style
- **Aesthetic**: Modern tech portfolio with AI-forward presentation
- **Characteristics**:
  - Clean, professional appearance
  - Code-inspired elements (monospace fonts for technical content)
  - Dark mode option/toggle
  - Tech-forward but not overwhelming
  - Typography-focused with generous whitespace
  - **Visual indicators for AI-related content** (badges, tags, or icons to highlight AI projects)
  - Design language that communicates technical sophistication and AI expertise

#### 5.1.2 Color Palette
- Professional tech colors (to be defined in design phase)
- High contrast for readability
- Dark mode palette
- Consistent accent colors for CTAs and links

#### 5.1.3 Typography
- Primary font: Modern sans-serif (Inter, SF Pro, or similar)
- Monospace font for code/technical elements
- Readable body text size (16-18px minimum)
- Clear hierarchy (H1-H6)

#### 5.1.4 Layout Approach
- Responsive grid system
- Card-based layouts for project galleries
- Full-width hero sections
- Contained content width (max 1200px) for readability
- Sticky navigation

### 5.2 User Experience

#### 5.2.1 Information Architecture
```
Home
├── About
├── Projects
│   ├── AI Memory System ⭐ (Featured AI Project)
│   ├── Local LLM Setup ⭐ (Featured AI Project)
│   ├── Resilient Tomorrow
│   ├── NeighborhoodShare
│   ├── Home Management System
│   ├── AirPusher/AirShip
│   └── Burning Man Projects
├── SubStacks
│   ├── Resilient Tomorrow Feed
│   └── Operational Intelligence Feed
├── Activity Feed (Post-Launch)
│   ├── All Updates
│   ├── Personal
│   ├── Resilient Tomorrow
│   └── Velocity Partners
├── Resume/CV
└── Contact
```

**Navigation Notes**:
- Consider a dedicated "AI Projects" filter or section in the Projects area to make AI work immediately visible to potential employers
- Activity Feed can be added post-launch as social media replacement
- Topic filtering allows subscribers to choose what updates they want to follow

#### 5.2.2 Homepage Design
**Purpose**: Immediate professional impression + easy navigation

**Key Elements**:
1. **Hero Section**:
   - Professional headshot or header image
   - Name and professional tagline emphasizing AI implementation and LLM integration expertise
   - Brief elevator pitch (1-2 sentences) highlighting AI capabilities
   - Primary CTA (e.g., "View AI Projects" or "Download Resume")

2. **Featured Projects** (3-4 highlights):
   - **PRIORITY**: Lead with AI projects (AI Memory System, Local LLM Setup)
   - Visual cards with project titles, brief descriptions
   - Explicit labels/tags for AI-related projects
   - Links to full case studies

3. **Recent Content**:
   - Latest activity feed posts or SubStack articles (post-launch)
   - Follow/subscribe CTA for ActivityPub

4. **Professional Summary**:
   - **Key skills and expertise areas with AI implementation prominently featured**
   - Specific callouts: AI implementation, LLM integration, prompt engineering, self-hosted AI infrastructure
   - Link to full resume

5. **Contact CTA**:
   - Prominent contact button or form

#### 5.2.3 Navigation Patterns
- Persistent top navigation
- Clear visual hierarchy
- Active page indication
- Mobile-optimized menu
- Footer navigation for secondary links

### 5.3 Content Strategy

#### 5.3.1 Writing Tone & Voice
- **Professional but personable**
- Clear and direct
- Technical when appropriate, accessible when needed
- First-person narrative for About/Activity Feed
- Third-person for Resume
- Case studies: Mix of narrative storytelling and technical detail

#### 5.3.2 Content Priorities
1. **Launch Content** (Week 1-2):
   - About page (emphasizing AI expertise)
   - Resume/CV (with AI skills prominently featured)
   - **3-4 key project case studies with AI projects prioritized**:
     - AI Memory System (MUST HAVE at launch)
     - Local LLM Setup (MUST HAVE at launch)
     - 1-2 additional projects showing breadth
   - Contact form
   - SubStack feed integrations

2. **Post-Launch Content** (Ongoing):
   - Remaining project case studies
   - **Activity Feed implementation** - social media replacement with topic-based filtering
   - Content updates and refinements
   - Additional AI project showcases as developed
   - Regular activity updates once feed is implemented

---

## 6. Integration Requirements

### 6.1 Third-Party Integrations

#### 6.1.1 SubStack RSS Feeds
- Parse RSS feeds from both SubStack publications
- Cache content to reduce API calls
- Update schedule: Daily or on-demand
- Error handling for feed unavailability

#### 6.1.2 ActivityPub (Ghost Native)
- Configure Ghost's built-in ActivityPub support
- Test federation with Mastodon instances
- Monitor federation health

#### 6.1.3 Email Delivery
- Transactional emails (contact form)
- Newsletter capability (Ghost built-in)
- Service options: SendGrid, Mailgun, AWS SES
- SPF/DKIM configuration

#### 6.1.4 Analytics
- Privacy-focused analytics integration
- Options: Plausible, Simple Analytics, or Ghost Analytics
- GDPR-compliant

### 6.2 Future Integrations (Post-Launch)

- **Bluesky Cross-posting**: Bridge to AT Protocol
- **GitHub Integration**: Display repositories and contributions
- **LinkedIn**: Cross-post professional updates
- **Calendar**: Availability/booking system for consultations

---

## 7. Content Requirements

### 7.1 Required Pages at Launch

| Page | Priority | Content Status |
|------|----------|----------------|
| Home | Critical | To be created |
| About (with AI emphasis) | Critical | To be created |
| Resume/CV (with AI skills featured) | Critical | To be created |
| Contact | Critical | To be created |
| **AI Memory System (case study)** | **Critical** | **To be created - PRIORITY for AI demonstration** |
| **Local LLM Setup (case study)** | **Critical** | **To be created - PRIORITY for AI demonstration** |
| Resilient Tomorrow (SubStack feed) | High | Integration needed |
| Operational Intelligence (SubStack feed) | High | Integration needed |
| NeighborhoodShare (case study) | High | To be created |
| Home Management System (case study) | Medium | To be created |

### 7.2 Content Assets Needed

**Before Launch**:
- Professional headshot/photo
- **AI project screenshots and demos** (priority)
- **AI Memory System documentation and visuals**
- **Local LLM Setup architecture diagrams and screenshots**
- Resume content (text) with AI skills prominently featured
- About page content (text) emphasizing AI expertise
- SubStack RSS feed URLs

**Nice to Have**:
- AI project demo videos showing workflow in action
- Architecture diagrams for AI infrastructure
- Code samples for AI implementations and technical deep-dives
- Before/after comparisons showing AI impact on workflows

---

## 8. Deployment & Maintenance

### 8.1 Deployment Requirements

#### 8.1.1 Initial Setup
1. Provision hosting server
2. Configure domain DNS
3. Install Ghost CMS
4. Configure SSL certificate
5. Set up email delivery
6. Configure backups
7. Install and customize theme
8. Configure ActivityPub
9. Create content
10. Test all functionality
11. Launch

#### 8.1.2 Launch Checklist
- [ ] All critical pages published
- [ ] Contact form tested
- [ ] SSL certificate active
- [ ] DNS propagated
- [ ] Analytics configured
- [ ] ActivityPub federation tested
- [ ] Mobile responsive verified
- [ ] Browser compatibility tested
- [ ] Performance benchmarks met
- [ ] Backup system verified
- [ ] 404 page configured
- [ ] SEO metadata complete

### 8.2 Maintenance Plan

#### 8.2.1 Regular Maintenance
- **Weekly**: Content updates, respond to contact form submissions
- **Monthly**: Ghost security updates, review analytics
- **Quarterly**: Content refresh, backup verification
- **Annually**: Domain renewal, hosting review, major content updates

#### 8.2.2 Monitoring
- Uptime monitoring (UptimeRobot or similar)
- SSL certificate expiration alerts
- Backup success notifications
- ActivityPub federation health

---

## 9. Success Metrics & KPIs

### 9.1 Launch Metrics (First 3 Months)

**Traffic**:
- Target: 500+ unique visitors
- Source diversity: Direct, search, social, referral

**Engagement**:
- Average time on site: > 2 minutes
- Bounce rate: < 60%
- Pages per session: > 2

**Social**:
- ActivityPub followers: 50+ (first 3 months)
- Fediverse engagement: Likes, boosts, replies on published content

**Professional**:
- Contact form submissions: 5-10 quality inquiries
- Resume downloads: Track via analytics
- **AI-specific engagement**: Track visits to AI project pages, time spent on AI case studies
- **AI opportunity generation**: Inquiries specifically mentioning AI implementation and LLM integration expertise

### 9.2 Long-Term Success Indicators

- Regular content publishing cadence (especially AI-related content)
- Growing ActivityPub follower base
- **Professional opportunities generated through site, particularly AI implementation roles**
- Positive feedback from visitors
- Low maintenance time required
- **Site effectively demonstrates AI implementation and LLM integration expertise and technical skills to employers**
- Recognition as an AI practitioner through project showcases
- Inbound interest specifically citing AI projects or capabilities

---

## 10. Risks & Constraints

### 10.1 Technical Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Ghost ActivityPub bugs | High | Test thoroughly, have RSS fallback |
| Hosting downtime | Medium | Choose reliable provider, monitoring |
| SSL certificate expiration | High | Automated renewal (Let's Encrypt) |
| SubStack feed changes | Low | Monitor feeds, error handling |
| Theme customization complexity | Medium | Start with existing theme, minimal customizations |

### 10.2 Constraints

**Timeline**: 1-2 weeks to launch
- Limits custom development
- Must use existing Ghost themes/features
- Python integrations deferred to post-launch

**Budget**: $15-30/month hosting
- Rules out premium managed services
- Self-hosted Ghost on VPS
- May need to manage server administration

**Skills Demonstration**:
- Ghost is Node.js, not Python (per preference)
- Can add Python integrations post-launch for SubStack parsing, automation

**Maintenance Time**:
- Minimal ongoing maintenance desired
- Ghost reduces maintenance burden vs. custom solution

---

## 11. Open Questions & Decisions Needed

### 11.1 Content Decisions
- [ ] Exact SubStack RSS feed URLs
- [ ] Professional headshot/photo selection
- [ ] Project prioritization for case studies
- [ ] About page narrative and tone

### 11.2 Technical Decisions
- [ ] Ghost theme selection (default Casper, or premium theme?)
- [ ] Hosting provider (DigitalOcean, Linode, or Ghost Pro?)
- [ ] Analytics tool (Plausible, Simple Analytics, Ghost Analytics?)
- [ ] Email delivery service (SendGrid, Mailgun, SMTP?)

### 11.3 Design Decisions
- [ ] Color palette finalization
- [ ] Dark mode: Toggle or automatic?
- [ ] Logo or text-based branding?
- [ ] Photography/imagery style for project showcases

---

## 12. Technical Stack Summary

| Component | Technology | Rationale |
|-----------|------------|-----------|
| **CMS** | Ghost (Node.js) | Native ActivityPub, professional themes, fast launch |
| **Hosting** | VPS (DigitalOcean/Linode) | Budget-friendly, full control, $15-30/month |
| **Database** | MySQL or SQLite | Ghost default, reliable |
| **Web Server** | Nginx | Ghost recommendation, performance |
| **SSL** | Let's Encrypt | Free, automated renewal |
| **Email** | SendGrid/Mailgun | Reliable transactional email delivery |
| **Analytics** | Plausible or Ghost Analytics | Privacy-focused, GDPR-compliant |
| **Federation** | ActivityPub (Ghost native) | Native integration, no plugins |
| **Backups** | Automated daily (rsync/borg) | Data protection, disaster recovery |

### 12.1 Future Python Integrations (Post-Launch)
- SubStack RSS parser/aggregator
- Custom automation scripts
- Data analysis on analytics
- Additional integrations as needed

---

## 13. Project Timeline

### Phase 1: Setup (Days 1-3)
- Provision hosting
- Install Ghost
- Configure domain and SSL
- Set up email delivery
- Configure backups

### Phase 2: Design & Configuration (Days 4-7)
- Select and install theme
- Customize colors/branding
- Configure ActivityPub
- Set up navigation structure
- Create page templates

### Phase 3: Content Creation (Days 8-12)
- Write About page
- Create Resume/CV
- Write 3-4 project case studies
- Set up SubStack feeds
- Configure contact form

### Phase 4: Testing & Launch (Days 13-14)
- Cross-browser testing
- Mobile responsiveness testing
- ActivityPub federation testing
- Performance optimization
- SEO verification
- **LAUNCH**

### Post-Launch (Ongoing)
- Add remaining project case studies
- **Implement Activity Feed** for social media replacement
- Begin posting regular activity updates
- Iterate on design
- Add Python integrations for enhanced SubStack integration
- Add topic-based filtering for Activity Feed
- Monitor and optimize

---

## 14. Appendices

### 14.1 Glossary

- **ActivityPub**: W3C protocol for decentralized social networking
- **Fediverse**: Network of interconnected servers using ActivityPub (Mastodon, Pixelfed, etc.)
- **Ghost**: Open-source publishing platform built on Node.js
- **RSS**: Really Simple Syndication, feed format for content distribution
- **VPS**: Virtual Private Server, hosting environment

### 14.2 References

**Research Sources:**
- [ActivityPub - W3C](https://www.w3.org/TR/activitypub/)
- [ActivityPub on Ghost](https://ghost.org/changelog/activitypub/)
- [Ghost Documentation](https://ghost.org/docs/)
- [ActivityPub vs AT Protocol Comparison](https://berjon.com/ap-at/)

### 14.3 Related Documents

- `/plans/` - This directory for additional planning documents
- `/devlog/` - Development log entries as features are built
- Future: Technical architecture document
- Future: Content style guide

---

**Document Version History:**

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-01-20 | Initial requirements specification | Claude (Web Requirements Collector) |
| 1.1 | 2026-01-26 | Updated to emphasize AI/ML skills throughout - elevated AI projects to Critical priority, added AI-specific sections to resume/about/homepage, updated content priorities and success metrics to highlight AI expertise for potential employers | Claude Code |
| 1.2 | 2026-01-26 | Added Activity Feed section (post-launch social media replacement), integrated Cal.com for meeting scheduling, expanded SEO to include AEO (ActivityPub/Fediverse optimization), clarified database hosting (Ghost manages internally, no Supabase needed), updated all references from "blog" to "activity feed" | Claude Code |

---

**Approval & Sign-off:**

This requirements specification document represents the complete functional and technical requirements for the MJ_Online website project based on stakeholder interviews conducted on 2026-01-20.

Next Steps:
1. Review and approve this specification
2. Make any necessary revisions
3. Proceed with technical implementation planning
4. Begin Phase 1: Setup
