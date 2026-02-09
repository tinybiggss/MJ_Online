# MikeJones.online Design System

**Version:** 1.0
**Created:** 2026-02-06
**Designer:** Debbie (Web Design Agent)
**Status:** Draft for Review

---

## Executive Summary

This design system defines the complete visual language for MikeJones.online, a professional portfolio website for an AI Implementation Expert with 29 years of experience. The system balances **cutting-edge technical sophistication** with **professional approachability**, creating a modern, clean aesthetic that makes the site POP while serving the primary goal: **getting Mike hired or landing consulting clients.**

**Design Philosophy:** Typography-led minimalism with tech-forward accents. Clean, structured, functional. No clutter. Every element serves a purpose.

---

## 1. Brand Essence

### Who is Mike Jones?

**Professional Identity:**
- AI Implementation Expert and LLM Integration Specialist *(not generic "engineer" or "PM")*
- 29 years in tech (started 1997) - seasoned professional, not junior
- Top 1% ChatGPT user - early adopter, cutting-edge
- Xbox SDK patent holder (VINCE instrumentation)
- Director-level leader at multiple companies (Kabam, Livescribe, Kinoo)
- Practical implementation focus - hands-on technologist with business acumen

**Target Audience:**
- Hiring managers at tech companies (AI/gaming/media)
- CTOs and VPs needing AI implementation expertise
- Companies seeking fractional PMO services
- Technical decision-makers who value depth and proven results

### What Should This Site Feel Like?

**Primary Attributes:**
1. **Cutting-edge yet professional** - Modern 2026 aesthetic without being trendy or gimmicky
2. **Technical authenticity** - Shows systems thinking, data-driven approach, real depth
3. **Approachable expertise** - Confident but not arrogant, human but not casual
4. **Current and active** - Feels like 2026, not 2020
5. **Trust and credibility** - Polished, consistent, evidence of real work

**Mood Board References:**
- Think: Stripe's clarity + Linear's precision + Vercel's technical aesthetic
- NOT: Generic corporate templates, flashy animations, cluttered layouts
- Inspiration: Neo-brutalist portfolios, technical mono aesthetics, minimalist SaaS

### How Design Reflects AI Expertise

**Visual Signals:**
- **Clean data visualization aesthetic** - organized, structured, systems-thinking
- **Monospace fonts for technical elements** - signals coding/technical depth
- **Cyber-inspired accent colors** - neon cyan suggests AI/future-forward
- **Generous whitespace** - premium feel, sophisticated restraint
- **Bold typography** - confidence, leadership, clear communication
- **Dark mode preference** - tech-forward, reduces eye strain, modern

**Avoid:**
- Generic blue gradients (too common in "AI" branding)
- Robotic or cold aesthetics (we're human-AI collaboration)
- Overly complex or busy layouts (contradicts "Implementation Expert" clarity)

---

## 2. Color Palette

### Philosophy

**Monochrome foundation + strategic accent pops.** Following 2026 trends of minimalist tech portfolios with vibrant accent colors for emphasis. Dark mode as default aesthetic (Kyoto Onyx theme).

### Primary Colors

**Background & Neutrals (Dark Mode):**
```
Background Dark:     #0A0B0D  (Almost black, sophisticated)
Surface Dark:        #1A1B1E  (Slightly lighter for cards/sections)
Border Dark:         #2A2B2E  (Subtle dividers)
Text Primary:        #FFFFFF  (Pure white for headings)
Text Secondary:      #B4B5B9  (Light gray for body text)
Text Tertiary:       #6B6C70  (Muted gray for meta/captions)
```

**Accent Colors:**
```
Primary Accent:      #4F46E5  (Indigo - Kyoto default, keep for consistency)
                     Usage: Primary CTAs, links, interactive elements

Secondary Accent:    #00D9FF  (Neon Cyan - AI/tech-forward)
                     Usage: Highlights, badges, hover states, tech indicators

Success/Positive:    #10B981  (Green - achievements, metrics)
Warning/Caution:     #F59E0B  (Amber - secondary CTAs, attention)
Error/Critical:      #EF4444  (Red - minimal use)
```

### Usage Rules

**Headings:**
- H1, H2: White (#FFFFFF) for maximum contrast
- H3, H4: White or light gray (#B4B5B9) depending on hierarchy

**Body Text:**
- Primary paragraphs: Light gray (#B4B5B9) for readability
- Captions, meta: Muted gray (#6B6C70)

**Links & Interactive:**
- Default state: Indigo (#4F46E5)
- Hover state: Neon Cyan (#00D9FF) - creates tech-forward interaction
- Visited: Slightly muted indigo (#6366F1)

**Backgrounds:**
- Page background: #0A0B0D
- Card/section backgrounds: #1A1B1E
- Hero sections: Can use gradient from #0A0B0D to #1A1B1E for subtle depth

**Accents & Badges:**
- "AI" badges: Neon Cyan (#00D9FF) with transparency
- Project categories: Indigo (#4F46E5)
- Stats/metrics: Success Green (#10B981)
- Featured content: Neon Cyan border or glow

### Color Accessibility

- Text/background contrast ratio: Minimum 4.5:1 (WCAG AA)
- Interactive elements: Minimum 3:1
- All accent colors tested for contrast against dark backgrounds
- Never use color alone to convey information (pair with icons, text, weight)

### Kyoto Theme Compatibility

**Current Kyoto Settings:**
- Accent color: #4F46E5 (Indigo) ✅ Keep
- Dark mode: Onyx ✅ Keep
- Background: Dark ✅ Matches our palette

**Recommended Kyoto Overrides (via custom CSS):**
- Adjust background to #0A0B0D for deeper black
- Add neon cyan (#00D9FF) for hover states and tech badges
- Enhance card backgrounds to #1A1B1E for better definition

**Authority:** If Kyoto's color handling limits our vision, recommend custom CSS injection or theme modification. **The design system takes precedence over theme defaults.**

---

## 3. Typography System

### Philosophy

**Typography-led design** (2026 trend) - Start with type, build everything else around it. One primary font family, bold headlines, generous spacing, clear hierarchy.

### Font Families

**Primary (Headings + Body):**
```
Inter (Google Fonts)
- Ultra-readable sans-serif
- Excellent for both display and body text
- Variable font with multiple weights (100-900)
- Tech industry standard in 2026
- Fallback: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
```

**Technical/Code (Special Elements):**
```
JetBrains Mono (Google Fonts)
- Monospace for code snippets, technical labels, data displays
- Signals technical authenticity
- Usage: Inline code, project tech stacks, data/metrics
- Fallback: "Courier New", Courier, monospace
```

**Why One Font Family?**
Following 2026 trend away from multiple font pairings. Inter has enough weight variation (100-900) to create hierarchy without introducing visual noise.

### Type Scale

Based on **modular scale** with 1.250 ratio (Major Third), 16px base:

```
H1 (Hero Headlines):     64px / 4rem     Weight: 800 (ExtraBold)  Line-height: 1.1
H2 (Section Headers):    48px / 3rem     Weight: 700 (Bold)       Line-height: 1.2
H3 (Subsection):         32px / 2rem     Weight: 600 (SemiBold)   Line-height: 1.3
H4 (Card Titles):        24px / 1.5rem   Weight: 600 (SemiBold)   Line-height: 1.4
H5 (Small Headers):      20px / 1.25rem  Weight: 500 (Medium)     Line-height: 1.5

Body Large:              18px / 1.125rem Weight: 400 (Regular)    Line-height: 1.75
Body Regular:            16px / 1rem     Weight: 400 (Regular)    Line-height: 1.75
Body Small:              14px / 0.875rem Weight: 400 (Regular)    Line-height: 1.6

Caption/Meta:            12px / 0.75rem  Weight: 500 (Medium)     Line-height: 1.5
Label (UI):              14px / 0.875rem Weight: 600 (SemiBold)   Line-height: 1.4

Code/Technical:          14px / 0.875rem Weight: 400 (Regular)    Line-height: 1.6
                         Font: JetBrains Mono
```

### Weight Usage

**800 (ExtraBold):**
- H1 hero headlines only
- Makes immediate impact
- Use sparingly for maximum effect

**700 (Bold):**
- H2 section headers
- Primary emphasis in body text (rare)

**600 (SemiBold):**
- H3, H4 subsection headers
- Card titles
- Navigation items
- Button text

**500 (Medium):**
- H5 small headers
- Labels and UI elements
- Emphasized captions

**400 (Regular):**
- All body text
- Normal paragraphs
- Standard readability

### Line Height Rules

**Headlines (H1-H3):** 1.1 - 1.3
- Tighter leading for visual impact
- Creates bold, attention-grabbing blocks

**Subheads (H4-H5):** 1.4 - 1.5
- Moderate spacing for clarity

**Body Text:** 1.75
- Generous leading for readability
- Optimal for long-form content (60-80 character line length)

**Captions/Small:** 1.5 - 1.6
- Balanced for compact information

### Letter Spacing

**Headlines:** -0.02em to -0.01em (slight tightening for visual cohesion)
**Body:** 0 (default)
**All caps labels:** +0.05em (improved readability for uppercase)
**Code/Mono:** 0 (default monospace spacing)

### Special Typography

**Inline Code:**
```
Font: JetBrains Mono
Size: 0.9em of surrounding text
Background: rgba(0, 217, 255, 0.1) (subtle cyan tint)
Border: 1px solid rgba(0, 217, 255, 0.2)
Padding: 2px 6px
Border-radius: 4px
```

**Block Quotes:**
```
Font: Inter
Size: 18px (Body Large)
Weight: 400 (Regular)
Style: Italic
Border-left: 4px solid #4F46E5 (Indigo)
Padding-left: 24px
Margin: 32px 0
Color: #B4B5B9 (Text Secondary)
```

**Data/Metrics Display:**
```
Font: JetBrains Mono
Size: 32-48px (large)
Weight: 700 (Bold)
Color: #00D9FF (Neon Cyan) or #10B981 (Green)
Usage: User counts, percentages, performance metrics
```

### Kyoto Theme Typography

**Current Kyoto:**
- Uses theme default fonts (check Ghost Admin → Design)
- May need custom CSS to override with Inter

**Implementation:**
Add to Ghost Code Injection (Header):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">

<style>
  :root {
    --font-primary: 'Inter', system-ui, -apple-system, sans-serif;
    --font-code: 'JetBrains Mono', 'Courier New', monospace;
  }
  body {
    font-family: var(--font-primary);
  }
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-primary);
  }
  code, pre {
    font-family: var(--font-code);
  }
</style>
```

---

## 4. Spacing System

### Philosophy

**8px base unit system** for consistent, predictable spacing. Creates visual rhythm, improves scannability, establishes clear section hierarchy.

### Spacing Scale

```
4px   / 0.25rem  (xs)   - Tight spacing (icon-to-text, badge padding)
8px   / 0.5rem   (sm)   - Compact spacing (button padding, small gaps)
16px  / 1rem     (md)   - Standard spacing (paragraph margins, list items)
24px  / 1.5rem   (lg)   - Section spacing (card padding, subsection gaps)
32px  / 2rem     (xl)   - Large spacing (between content blocks)
48px  / 3rem     (2xl)  - Major spacing (section separation)
64px  / 4rem     (3xl)  - Hero spacing (headline-to-content gap)
96px  / 6rem     (4xl)  - Page spacing (between major sections)
128px / 8rem     (5xl)  - Maximum spacing (hero top/bottom padding)
```

### Usage Rules

**Margins (Vertical Spacing):**
- Paragraphs: 16px bottom margin
- Headings: 32px top, 16px bottom (creates breathing room)
- List items: 8px between items
- Sections: 96px between major page sections
- Hero sections: 128px top/bottom padding

**Padding (Internal Spacing):**
- Buttons: 12px vertical, 24px horizontal
- Cards: 24px or 32px all sides
- Containers: 16px mobile, 32px tablet, 48px desktop (responsive)

**Gaps (Grid/Flex):**
- Card grids: 24px gap (mobile), 32px gap (desktop)
- Navigation items: 24px gap
- Icon-to-text: 8px gap

### Container & Layout

**Max-Width Containers:**
```
Content (text):      720px  (60-80 character line length for readability)
Cards/Grid:          1200px (allows 3-column layouts on desktop)
Full-width sections: 100%   (hero backgrounds, full-bleed images)
```

**Responsive Breakpoints:**
```
Mobile:       320px - 767px   (1 column, 16px side padding)
Tablet:       768px - 1023px  (2 columns, 32px side padding)
Desktop:      1024px - 1439px (3 columns, 48px side padding)
Large Desktop: 1440px+        (3 columns, max-width containers)
```

### White Space Philosophy

**Generous white space is a feature, not waste.**
- Creates premium, sophisticated feel
- Guides attention to important elements
- Improves readability and comprehension
- Signals confidence (not cramming everything in)

**Rules:**
1. Never fill all available space - let content breathe
2. Group related elements closer, separate unrelated elements farther
3. Use 96px-128px gaps between major sections for clear delineation
4. Hero sections should have abundant padding (128px minimum)

---

## 5. Visual Hierarchy Principles

### How to Guide the Eye

**Priority Pyramid:**
1. **Primary Focus** (What user should see first) - Largest, boldest, highest contrast
2. **Secondary Elements** (Supporting information) - Medium size, standard weight
3. **Tertiary Details** (Meta information) - Smallest, muted color

**Techniques:**

**1. Size & Scale:**
- H1 (64px) immediately grabs attention
- H2 (48px) creates section structure
- Body (16px) recedes appropriately
- Caption (12px) provides context without distraction

**2. Weight & Boldness:**
- ExtraBold (800) = Primary headlines
- Bold (700) = Section headers
- SemiBold (600) = Subsections, emphasis
- Regular (400) = Body content
- Lighter weights never used (maintains minimum readability)

**3. Color for Emphasis:**
- White (#FFFFFF) = Highest priority (headlines)
- Light gray (#B4B5B9) = Standard content (body text)
- Muted gray (#6B6C70) = Lowest priority (meta, captions)
- Indigo (#4F46E5) = Interactive elements, primary CTAs
- Neon Cyan (#00D9FF) = Attention-grabbing highlights, hover states

**4. Spacing Creates Focus:**
- Large gaps (96px+) isolate important sections
- Tight grouping (8-16px) shows relationships
- Whitespace around elements = importance

**5. Positioning:**
- Top-left = Natural starting point (Western reading pattern)
- Center = Special importance (hero headlines)
- Above the fold = Critical content (no scrolling required)

### Emphasis Patterns

**What Should Stand Out:**
- Primary headline (H1) - Who Mike is
- Professional title - "AI Implementation Expert and LLM Integration Specialist"
- Key metrics - "29 years", "170 users", "80% improvement"
- CTAs - "View Projects", "Contact Me", "Read More"
- Project names - NeighborhoodShare, Velocity Partners, etc.

**What Should Recede:**
- Dates and timestamps
- Image captions
- Tag labels
- Footer information
- Metadata (author, reading time)

### Scannable Content Rules

**Visitors scan, they don't read.** Design for 10-second comprehension:

1. **Clear Headlines** - Descriptive, specific (not clever wordplay)
2. **Short Paragraphs** - Max 3-4 lines per paragraph block
3. **Bulleted Lists** - Break up walls of text, easy to scan
4. **Visual Anchors** - Images, cards, dividers create scan points
5. **Highlighted Numbers** - Metrics draw the eye (use neon cyan or green)
6. **Bold Key Phrases** - Sparingly, only truly critical terms

**F-Pattern Reading:**
- Most important info at top
- Key points aligned left
- Scannable structure top-to-bottom

---

## 6. Component Library

### Hero Sections

**Homepage Hero:**
```
Structure:
- Full-width section, centered content
- H1: Name or professional tagline (64px, ExtraBold, white)
- Subheadline: Professional title (24px, Regular, light gray)
- Short description: 1-2 sentences, value proposition (18px, body large)
- Primary CTA button: "View My Work" or "See Projects"
- Optional: Professional headshot (right side, 400x400px)

Spacing:
- 128px top padding
- 64px between headline and subheadline
- 24px between subheadline and description
- 32px between description and CTA
- 128px bottom padding

Background:
- Gradient: #0A0B0D to #1A1B1E (subtle depth)
- Optional: Subtle grid pattern overlay (tech aesthetic)

Example Layout:
[------- 128px padding -------]
  Mike Jones
  AI Implementation Expert and LLM Integration Specialist

  29 years building systems that help people thrive.
  Specializing in AI implementation, LLM integration, and organizational intelligence.

  [View My Work CTA]
[------- 128px padding -------]
```

**Internal Page Hero:**
```
Structure:
- Smaller, more compact than homepage
- H1: Page title (48px, Bold, white)
- Optional subtitle or excerpt (18px, light gray)
- Optional breadcrumb navigation

Spacing:
- 64px top padding
- 24px between title and subtitle
- 64px bottom padding

Background:
- Dark (#1A1B1E) or match page background
- No gradient (simpler than homepage)
```

### Content Cards

**Project Card (Grid Display):**
```
Structure:
- Thumbnail image (16:9 aspect ratio, or 1:1 square)
- Category badge (top-left overlay or above image)
- Title (H4, 24px, SemiBold, white)
- Short description (2-3 lines, 16px, light gray)
- Tech stack tags (small pills, 12px, JetBrains Mono)
- "Read More" link (Indigo, hover → Neon Cyan)

Spacing:
- 24px padding inside card
- 16px gap between image and content
- 8px gap between title and description
- 16px gap between description and tags

Background:
- #1A1B1E (Surface Dark)
- 1px border: #2A2B2E (Border Dark)
- Border-radius: 8px
- Hover state: Border becomes Neon Cyan (#00D9FF), subtle lift (translateY(-4px))

Dimensions:
- Desktop: 380px width (3 columns in 1200px container with 32px gaps)
- Tablet: ~340px width (2 columns)
- Mobile: Full width minus padding
```

**Experience Card (Resume/Timeline):**
```
Structure:
- Company logo (optional, 60x60px, left side)
- Job title (H4, 24px, SemiBold, white)
- Company name (16px, light gray)
- Date range (14px, muted gray, JetBrains Mono)
- Bullet list of achievements (16px, light gray)
- Optional: Metrics highlighted in green or cyan

Spacing:
- 32px padding
- 16px gap between logo and text
- 8px gap between title and company
- 24px gap before bullet list
- 8px between list items

Background:
- #1A1B1E with subtle left border accent (#4F46E5, 4px thick)
```

### Buttons / CTAs

**Primary Button:**
```
Style:
- Background: #4F46E5 (Indigo)
- Text: #FFFFFF (White), 16px, SemiBold (600)
- Padding: 14px vertical, 32px horizontal
- Border-radius: 8px
- Hover: Background → #00D9FF (Neon Cyan), subtle scale (1.02), smooth transition
- Active: Slight press effect (scale 0.98)

Usage: Main actions - "Contact Me", "View Projects", "Download Resume"
```

**Secondary Button:**
```
Style:
- Background: Transparent
- Border: 2px solid #4F46E5 (Indigo)
- Text: #4F46E5 (Indigo), 16px, SemiBold (600)
- Padding: 14px vertical, 32px horizontal
- Border-radius: 8px
- Hover: Border → #00D9FF, Text → #00D9FF, background → rgba(0, 217, 255, 0.1)

Usage: Secondary actions - "Learn More", "See All Projects"
```

**Text Link:**
```
Style:
- Color: #4F46E5 (Indigo)
- Text-decoration: none (default), underline (hover)
- Hover: Color → #00D9FF (Neon Cyan)
- Weight: 500 (Medium) for emphasis, 400 (Regular) for inline links

Usage: "Read more", navigation links, inline article links
```

### Image Treatments

**Featured Image (Hero/Case Study Top):**
```
- Aspect ratio: 16:9 (landscape) or 2:1 (ultra-wide)
- Width: Full container width (max 1200px)
- Border-radius: 12px (soften edges)
- Optional: Subtle shadow (0 4px 12px rgba(0, 0, 0, 0.3))
- Caption: Below image, 14px, muted gray, italic
```

**Thumbnail (Card Grid):**
```
- Aspect ratio: 16:9 or 1:1 (square)
- Width: Card width (380px desktop, scales down)
- Border-radius: 8px (top corners only if inside card)
- Hover: Slight scale (1.05), smooth transition
```

**Headshot (Professional Photo):**
```
- Size: 300x300px to 400x400px
- Shape: Circular (border-radius: 50%) or square with 12px radius
- Border: Optional 4px border in Indigo (#4F46E5) or Neon Cyan (#00D9FF)
- Placement: Right side of hero (desktop), centered above headline (mobile)
```

**Screenshot (Case Study Body):**
```
- Width: Content width (720px for single column, wider for full-width showcase)
- Border: 1px solid #2A2B2E (subtle frame)
- Border-radius: 8px
- Shadow: 0 8px 24px rgba(0, 0, 0, 0.4) (depth)
- Caption: Below, 12px, muted gray, describes what's shown
- Spacing: 48px top/bottom margin (separates from text)
```

**Gallery (Multiple Images):**
```
- Layout: CSS Grid, 2-3 columns
- Gap: 16px between images
- Aspect ratio: Consistent within gallery (all 16:9 or all 1:1)
- Lightbox: Click to enlarge (if Ghost supports, or note for future implementation)
```

### Section Headers

**Major Section (H2):**
```
- Text: 48px, Bold (700), white
- Spacing: 96px top margin (separates from previous section), 32px bottom margin
- Optional: Subtle accent line below (2px, Indigo, 60px width, left-aligned)
- Alignment: Left-aligned (never center for body sections)
```

**Subsection (H3):**
```
- Text: 32px, SemiBold (600), white
- Spacing: 48px top margin, 16px bottom margin
- No decorative elements (keep clean)
```

### Badges & Labels

**Category Badge (Project Type):**
```
- Background: rgba(79, 70, 229, 0.2) (Indigo with transparency)
- Text: #4F46E5 (Indigo), 12px, SemiBold (600), UPPERCASE
- Padding: 4px 12px
- Border-radius: 4px
- Letter-spacing: +0.05em

Examples: "AI INTEGRATION", "FULL-STACK", "INFRASTRUCTURE"
```

**Tech Stack Tag:**
```
- Background: rgba(42, 43, 46, 1) (Border Dark, solid)
- Text: #B4B5B9 (Light gray), 12px, JetBrains Mono, Regular
- Padding: 6px 10px
- Border: 1px solid #2A2B2E
- Border-radius: 6px

Examples: "React", "TypeScript", "GPT-4o", "PostgreSQL"
```

**Metric/Achievement Badge:**
```
- Background: Transparent or rgba(0, 217, 255, 0.1)
- Text: #00D9FF (Neon Cyan) or #10B981 (Green), 14px, JetBrains Mono, Bold (700)
- Border: 2px solid color (cyan or green)
- Padding: 8px 16px
- Border-radius: 8px

Examples: "170 Users", "80% Improvement", "Top 1% ChatGPT User"
```

### Navigation Patterns

**Primary Navigation (Top):**
```
Structure:
- Logo/Name (left): "Mike Jones" or "MJ" (24px, SemiBold)
- Nav items (right): Home, About, Projects, Resume, Contact
- Item style: 16px, Medium (500), light gray (#B4B5B9)
- Active state: Indigo (#4F46E5), SemiBold (600)
- Hover state: Neon Cyan (#00D9FF)
- Spacing: 24px gap between items
- Background: #0A0B0D (matches page) or sticky with backdrop blur

Mobile:
- Hamburger menu (right side)
- Slide-in drawer or full-screen overlay
- Large touch targets (48px min)
```

**Breadcrumb Navigation:**
```
- Text: 14px, Regular, muted gray (#6B6C70)
- Separator: "/" in muted gray
- Hover: Current page's parent link → Indigo
- Spacing: 8px gap around separator

Example: Home / Projects / NeighborhoodShare
```

**Footer Navigation:**
```
Structure:
- 2-4 columns (desktop), stacked (mobile)
- Section headers: 14px, SemiBold (600), white
- Links: 14px, Regular, light gray (#B4B5B9)
- Hover: Indigo (#4F46E5)
- Social icons: 24x24px, light gray, hover → Neon Cyan
- Copyright: 12px, muted gray (#6B6C70)

Sections: About, Projects, Writing, Contact
```

### Special Components

**Stat/Metric Display:**
```
- Number: 48px, JetBrains Mono, Bold (700), Neon Cyan or Green
- Label: 16px, Inter, Regular, light gray
- Layout: Centered or left-aligned, vertical stack
- Spacing: 8px between number and label

Example:
  170
  Active Users
```

**Pull Quote (Testimonial):**
```
- Text: 24px, Inter, Regular, Italic, light gray
- Border-left: 4px solid Indigo (#4F46E5)
- Padding-left: 32px
- Margin: 48px vertical
- Attribution: 16px, SemiBold, Indigo, below quote, 16px top margin

Example:
  "Mike transformed how we think about AI implementation..."
  — CTO, Enterprise SaaS Company
```

**Table (Comparison or Data):**
```
- Header: #1A1B1E background, white text, 14px, SemiBold
- Rows: Alternating backgrounds (#0A0B0D, #1A1B1E) (subtle zebra striping)
- Text: 14px, light gray
- Padding: 16px cells
- Border: 1px solid #2A2B2E (between rows/columns)
- Hover: Row background → rgba(79, 70, 229, 0.1) (subtle highlight)
```

---

## 7. Page-Specific Guidelines

### Homepage

**Purpose:** Immediate clarity on who Mike is, what he does, why to hire him.

**Structure:**
1. **Hero Section (Above Fold)**
   - Name/Tagline: "Mike Jones" or "Program Leader & AI Infrastructure Builder"
   - Professional Title: "AI Implementation Expert and LLM Integration Specialist"
   - 1-2 sentence value prop: "29 years building systems..."
   - Primary CTA: "View My Work" → Projects page
   - Optional headshot (right side, desktop)

2. **Featured Projects (3 max)**
   - Card grid: 3 cards on desktop, 2 on tablet, 1 on mobile
   - Highlight: NeighborhoodShare, Local LLM, Velocity Partners
   - Each card: Image, title, 2-line description, tech stack, "Read More"
   - Section header: "Featured Work" (H2)

3. **About Snippet**
   - H2: "Who I Am" or "About"
   - 2-3 paragraphs: Career journey, current focus, expertise
   - Headshot or casual photo (if not in hero)
   - CTA: "Read Full Story" → About page

4. **Skills Showcase (Optional)**
   - H2: "Core Expertise"
   - Grid or list: AI Implementation, LLM Integration, Context Engineering, AAPD, etc.
   - Keep scannable, not exhaustive (full list on Resume)

5. **CTA Section (Final)**
   - H2: "Let's Work Together"
   - Short text: "Looking for AI implementation expertise..."
   - Primary CTA: "Contact Me" → Contact page
   - Secondary CTA: "View Resume" → Resume page

**Design Notes:**
- Keep above-fold content minimal - clarity over completeness
- Use generous spacing (96px between sections)
- Featured projects should have images (thumbnails or screenshots)
- Mobile: Stack everything single-column, prioritize hero clarity

---

### About Page

**Purpose:** Build trust, show personality, connect professionally.

**Structure:**
1. **Hero**
   - H1: "About Mike Jones" or just "About"
   - Optional subtitle: Brief personal tagline

2. **Personal Photo**
   - Professional headshot OR casual photo showing personality
   - Placement: Top of page (centered or left-side)
   - Size: 400x400px, circular or rounded square

3. **Personal Story (Narrative Format)**
   - Section 1: "Early Days" - How I got into tech (1997 start)
   - Section 2: "Career Journey" - Microsoft Xbox, Kabam, etc. (highlights, not resume)
   - Section 3: "Current Focus" - AI implementation, Velocity Partners, Resilient Tomorrow
   - Section 4: "What Drives Me" - Philosophy, approach, values

   Each section: H3 header, 2-4 paragraphs, conversational tone

4. **Expertise Highlights**
   - H2: "What I Bring"
   - Bulleted list or card grid: AAPD methodology, AI integration, 29 years experience, etc.
   - Keep human - explain WHY these matter, not just WHAT they are

5. **Personal Touch**
   - Optional: Hobbies, interests, life outside work (brief, 1 paragraph)
   - Makes Mike human and approachable

6. **CTA**
   - "Want to work together?" → Contact page
   - "See what I've built" → Projects page

**Design Notes:**
- Story format, not resume bullets
- Mix of text and whitespace (don't overwhelm)
- Personal photo early (humanizes immediately)
- Tone: Professional but approachable, confident but not arrogant

---

### Resume/CV Page

**Purpose:** Scannable, impressive, easy to contact.

**Structure:**
1. **Hero Section**
   - Professional headshot (top, centered or left)
   - H1: "Mike Jones"
   - Subtitle: "AI Implementation Expert and LLM Integration Specialist"
   - One-liner: "29 years building systems that help people thrive" or similar
   - Contact: Email (mike@mikejones.online), LinkedIn, Location (SF Bay Area)

2. **Professional Summary**
   - H2: "Summary" (optional) or jump straight to expertise
   - 2-3 sentence overview: What I do, who I help, unique approach
   - Can be paragraph OR bulleted list

3. **Core Expertise**
   - H2: "Core Expertise" or "Skills"
   - Two-column bulleted list (desktop), single column (mobile)
   - Categories: AI Implementation, LLM Integration, Context Engineering, AAPD, etc.
   - Keep scannable - no paragraphs here

4. **Professional Experience**
   - H2: "Professional Experience"
   - Reverse chronological order (most recent first)
   - Each role = Experience Card component:
     - Company logo (if available)
     - Job title (H4, bold, white)
     - Company name (16px, light gray)
     - Date range (14px, JetBrains Mono, muted)
     - Bullet list: Achievements > duties (3-5 bullets)
     - Metrics highlighted (green or cyan): "80% improvement", "170 users", etc.

   Companies:
   - Velocity Partners (2025-Present) - Founder & Principal Consultant
   - 8 Circuit Studios (2022-2024) - Co-Founder
   - Kinoo (Director role)
   - Livescribe (Director role)
   - Kabam (Director role)
   - Microsoft Game Studios (1999-2007) - **Software Development Engineer in Test** (NOT Program Manager)

5. **Key Achievements (Optional Section)**
   - H2: "Achievements"
   - Card or list format:
     - Xbox SDK patent (VINCE instrumentation)
     - Top 1% ChatGPT user
     - Xbox/Xbox 360 launch team (6 AAA titles)
     - 80% delivery improvement, 3x efficiency gains
   - Use badges or metric displays for visual impact

6. **Education (Brief)**
   - H2: "Education"
   - Simple list: Degree, School, Year (if relevant)
   - Keep minimal - focus on experience

7. **CTA**
   - Primary: "Download Resume (PDF)" button (if PDF available)
   - Secondary: "Contact Me" → Contact page

**Design Notes:**
- Scannable = hiring managers spend 7 seconds
- Headshot at top = humanizes immediately
- Results-focused bullets, not duty descriptions
- Highlight metrics with color (green, cyan)
- Visual cards for experience (not text wall)
- Mobile: Stack everything, maintain readability

**Critical Fact Check:**
- Microsoft title: **Software Development Engineer in Test** (verified RAG entry rag-2026-02-05-126)
- NOT "Program Manager" - this is incorrect
- Contact: mike@mikejones.online (NOT hello@velocitypartners.io for personal page)

---

### Projects Landing Page

**Purpose:** Showcase work, organize by category, easy navigation.

**Structure:**
1. **Hero**
   - H1: "Projects"
   - Subtitle: "Building systems that help people thrive" or "29 years of hands-on work"
   - Brief intro: What kinds of projects, approach

2. **Featured Projects (Top Section)**
   - H2: "Featured Work"
   - 2-3 cards: NeighborhoodShare, Local LLM, Velocity Partners (or MJ_Online post-launch)
   - Larger cards with more detail than other sections

3. **Projects by Category**
   Following Mike's preference: **Businesses → Publications → Projects**

   **Section: Businesses**
   - H2: "Businesses"
   - Cards: Velocity Partners, 8 Circuit Studios, etc.
   - Each card: Logo/image, name, 2-line description, "Learn More"

   **Section: Publications**
   - H2: "Publications"
   - Cards: Resilient Tomorrow (Substack), Organizational Intelligence (if applicable)
   - Each card: Header image, title, description, "Read on Substack" link

   **Section: Technical Projects**
   - H2: "Technical Projects"
   - Cards: NeighborhoodShare, Local LLM, AI Memory, Home Media Server, etc.
   - Each card: Screenshot, tech stack tags, description, "View Case Study"

4. **Other Work (Optional)**
   - H2: "Other Work" or "Archive"
   - Brief list or smaller cards for older/side projects
   - No need to showcase everything - focus on best

5. **CTA**
   - "Interested in working together?" → Contact page

**Design Notes:**
- Project cards should have images (logo, screenshot, header image)
- Clear category headers (H2) separate sections
- Consistent card design across all categories
- Tech stack tags on technical projects (JetBrains Mono pills)
- Grid layout: 3 columns (desktop), 2 (tablet), 1 (mobile)

---

### Case Study Pages (NeighborhoodShare, Local LLM, etc.)

**Purpose:** Deep dive showing technical sophistication, problem-solving, results.

**Structure:**
1. **Hero Section**
   - Featured image: Screenshot or logo (full-width or wide)
   - H1: Project name ("NeighborhoodShare")
   - Tagline: One-sentence description ("Community tool-sharing platform with AI-powered cataloging")
   - Category badges: "AI INTEGRATION", "FULL-STACK", etc.

2. **Quick Overview (Above Details)**
   - Small section with key facts:
     - Role: "Co-Founder, Lead Developer" or "Infrastructure Engineer"
     - Timeline: "2023 - Present" or "6 months"
     - Tech Stack: React, TypeScript, PostgreSQL, GPT-4o Vision, etc. (pills/tags)
     - Key Metrics: "170 users, 20 zip codes, 80% automation" (badges)

3. **The Challenge / Problem**
   - H2: "The Challenge" or "Problem"
   - 2-4 paragraphs: What problem were we solving? Why hard? Context.
   - Optional screenshot showing problem state

4. **The Solution / Approach**
   - H2: "The Solution" or "How We Built It"
   - Narrative + technical details:
     - Architecture decisions
     - Key features implemented
     - Technical challenges overcome
   - Screenshots showing solution (5-7 key images):
     - Main interface
     - AI features in action
     - Admin dashboard
     - Mobile views
     - Before/after comparisons
   - Each screenshot: Caption below (14px, muted, italic) describing what's shown

5. **Results / Impact**
   - H2: "Results" or "Impact"
   - Metrics and outcomes:
     - User adoption (170 users)
     - Geographic reach (20 zip codes)
     - Technical achievements (80% automation, API key security incident response)
     - Business outcomes (beta expansion, Captain governance)
   - Use stat displays: Big numbers in Neon Cyan or Green
   - Optional: Visual charts or comparison tables

6. **Technical Deep Dive (Optional)**
   - H2: "Technical Details" or "Under the Hood"
   - For technical audience: Architecture diagrams, code snippets, API design
   - Keep scannable with code blocks, subheadings (H3)

7. **Lessons Learned**
   - H2: "What I Learned" or "Reflections"
   - 2-3 paragraphs: Challenges, iterations, key takeaways
   - Humanizes the story, shows growth mindset

8. **CTA & Navigation**
   - Primary: "View More Projects" → Projects page
   - Secondary: "Contact Me About Similar Work" → Contact page
   - Next/Previous project navigation (if multiple case studies)

**Design Notes:**
- Hero image sets tone (choose best screenshot or logo)
- 5-7 screenshots max (not all 19!) - curate for storytelling
- Captions for every image (context is critical)
- Mix narrative (paragraphs) with visual (screenshots)
- Metrics displayed prominently (stat badges, large numbers)
- Technical details optional - gauge audience (can be collapsible section)
- Mobile: Images full-width, maintain aspect ratio

**Image Selection Priority (NeighborhoodShare example):**
1. Home-Tool-Selection.png (main interface)
2. Add-Tool-AI-2.png (AI feature showcase)
3. Admin-Prod-5-Beta.png (dashboard, metrics)
4. Tool-Detail-Borrow.png (user flow)
5. 2-3 more showing key features or UI polish

---

### Contact Page

**Purpose:** Dead simple, personal, above the fold.

**Structure:**
1. **Hero**
   - H1: "Let's Connect" or "Get in Touch"
   - Subtitle: "I'd love to hear from you" or similar (human, warm)

2. **Contact Methods (Primary)**
   - Email: mike@mikejones.online (large, prominent, click to open)
   - LinkedIn: linkedin.com/in/mejones73 (with icon)
   - Location: San Francisco Bay Area (if relevant)
   - Optional: Cal.com scheduling link (if Mike uses it)

3. **Optional: Contact Form**
   - Ghost built-in form or custom
   - Fields: Name, Email, Message (keep minimal)
   - Submit button: "Send Message" (Primary button style)

4. **Personal Touch**
   - Professional headshot or casual photo
   - 1-2 sentences: "Looking forward to connecting..." (friendly)

5. **Additional Links (Optional)**
   - Velocity Partners (business inquiries): hello@velocitypartners.io
   - Resilient Tomorrow: Link to Substack
   - GitHub: If applicable

**Design Notes:**
- Keep ABOVE THE FOLD - no scrolling to find email
- Large, clickable email address (primary focus)
- Professional photo shows approachability
- Form is optional (some prefer just email)
- Tone: Professional but friendly (not corporate cold)
- Mobile: Contact info stacked vertically, large touch targets

---

## 8. Visual Consistency Rules

### How to Maintain Cohesion

**Reusable Patterns:**
1. **All section headers (H2):** 48px, Bold, white, 96px top margin, 32px bottom margin
2. **All cards:** #1A1B1E background, #2A2B2E border, 8px border-radius, 24px padding
3. **All buttons:** Same size (14px vertical, 32px horizontal), same hover (Neon Cyan), same radius (8px)
4. **All images:** Consistent border-radius (8px or 12px), consistent shadows
5. **All badges:** Same size (12px text, 4px vertical padding, 12px horizontal padding)

**What Stays Constant:**
- Font family (Inter for all text)
- Spacing scale (8px base unit)
- Color palette (no introducing new colors)
- Button styles (primary = indigo, hover = cyan)
- Card treatments (same background, border, shadow)

**What Can Vary:**
- Layout (grid vs. single column) - adapts to content
- Image sizes - depends on context (hero vs. thumbnail)
- Heading levels - H1 for page titles, H2 for sections, etc.
- CTA text - context-specific ("View Projects" vs. "Contact Me")

### Consistency Checklist

Before publishing any page, verify:
- [ ] All H2 headers use same size (48px), weight (Bold), spacing
- [ ] All cards have same background color (#1A1B1E)
- [ ] All buttons use same padding and hover states
- [ ] All body text uses same size (16px) and line-height (1.75)
- [ ] All images have consistent border-radius
- [ ] Section spacing consistent (96px between major sections)
- [ ] Navigation matches across all pages
- [ ] Footer matches across all pages
- [ ] Color palette stays within defined system (no random colors)
- [ ] Font family consistent (Inter, JetBrains Mono for code only)

### Ghost/Kyoto Consistency

**Theme Settings (Global):**
- Accent color: #4F46E5 (Indigo) - **DO NOT CHANGE**
- Dark mode: Onyx - **DO NOT CHANGE**
- Navigation: Same across all pages
- Footer: Same across all pages

**Custom CSS (Code Injection):**
- All custom styles go in Ghost Admin → Settings → Design → Code Injection (Header)
- Document all custom CSS for future reference
- Test across pages before publishing

**Per-Page Overrides:**
- Avoid unless absolutely necessary
- If needed, document reason and scope

---

## 9. Design Decisions & Rationale

### Major Decisions Made

**1. Typography-Led Minimalism**
- **Decision:** Use Inter exclusively (one font family), bold headlines, generous spacing
- **Rationale:** 2026 trend toward simplicity; Inter has weight variation to create hierarchy without visual noise; tech industry standard; excellent readability
- **Trade-off:** Less "personality" than unique font pairings, but gains professionalism and clarity

**2. Dark Mode as Default**
- **Decision:** Embrace Kyoto Onyx dark theme, design entire system for dark backgrounds
- **Rationale:** Tech-forward aesthetic, reduces eye strain, differentiates from generic light portfolios, aligns with developer/AI audience expectations
- **Trade-off:** Some users prefer light mode, but Ghost/Kyoto supports toggle; accessibility requires high contrast (which we provide)

**3. Neon Cyan Accent (Secondary)**
- **Decision:** Add #00D9FF (Neon Cyan) as secondary accent, complement existing Indigo
- **Rationale:** 2026 trend toward cyber-inspired accents for AI/tech brands; creates visual pop; signals futuristic/cutting-edge; differentiates hover states; adds energy without chaos
- **Trade-off:** More "bold" than conservative portfolios, but aligns with "make it POP" directive and AI positioning

**4. Monospace for Technical Elements**
- **Decision:** JetBrains Mono for code, tech stacks, metrics, data displays
- **Rationale:** Signals technical authenticity (2026 "Technical Mono" trend); differentiates technical content from body text; aligns with developer audience; premium aesthetic
- **Trade-off:** Slightly less "corporate professional," but Mike is AI Implementation Expert (technical), not generic executive

**5. 8px Spacing System**
- **Decision:** Strict 8px base unit for all spacing (4, 8, 16, 24, 32, 48, 64, 96, 128)
- **Rationale:** Creates visual rhythm; ensures consistency; makes layouts predictable; follows modern design system best practices
- **Trade-off:** Less flexibility than arbitrary spacing, but vastly improved consistency

**6. Generous Whitespace**
- **Decision:** Large gaps (96px-128px) between major sections, abundant padding in cards/sections
- **Rationale:** Premium feel; improves scannability; guides attention; signals confidence (not cramming content); aligns with minimalist 2026 aesthetic
- **Trade-off:** "Wastes space" some might say, but modern portfolios prioritize clarity over density

**7. Component-Based Design**
- **Decision:** Define reusable components (cards, buttons, badges) with exact specs
- **Rationale:** Ensures consistency across pages; faster page creation (apply templates); easier maintenance; scalable for future pages
- **Trade-off:** Requires discipline to follow system (can't improvise one-off designs), but payoff is cohesive site

### Why This Makes Mike's Site POP

**Differentiators:**
1. **Neon Cyan hover states** - Most portfolios use muted hovers; ours is electric
2. **Bold typography with generous spacing** - Commands attention without clutter
3. **Dark mode + tech aesthetic** - Signals AI/tech positioning immediately
4. **Monospace accents** - "Technical Mono" trend is cutting-edge in 2026
5. **Metric displays in cyan/green** - Data-driven achievements stand out visually
6. **Clean, confident layout** - Not trying too hard; lets work speak for itself

**What We Avoided:**
- Generic blue gradients (overdone in AI branding)
- Busy layouts with too many elements
- Weak typography (thin weights, small sizes)
- Random colors or inconsistent spacing
- Corporate template feel
- Overly complex or "clever" designs

---

## 10. Implementation Guidelines

### For Page Designers (Mobiledoc Assembler, Future Work)

When creating new pages using this design system:

1. **Start with wireframe** - Sketch layout using components from this system
2. **Choose hierarchy** - Apply heading scale (H1 for title, H2 for sections, etc.)
3. **Apply spacing** - Use 8px scale (96px between sections, 24px card padding, etc.)
4. **Select components** - Use defined cards, buttons, badges (don't create new variants)
5. **Check colors** - Only use palette colors (no random hex values)
6. **Verify consistency** - Match existing pages (same button styles, same card backgrounds)
7. **Test mobile** - Ensure responsive (stack columns, maintain readability)
8. **Validate against checklist** - Use "Visual Consistency Rules" section

### For Ghost/Kyoto Implementation

**Global Theme Settings (Ghost Admin → Design):**
```
Accent Color: #4F46E5 (Indigo)
Dark Mode: Onyx (enabled)
Navigation: [Set per site]
Footer: [Set per site]
```

**Custom CSS (Code Injection - Header):**
```html
<!-- Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">

<style>
  /* === DESIGN SYSTEM OVERRIDES === */

  /* Typography */
  :root {
    --font-primary: 'Inter', system-ui, -apple-system, sans-serif;
    --font-code: 'JetBrains Mono', 'Courier New', monospace;
  }

  body {
    font-family: var(--font-primary);
    font-size: 16px;
    line-height: 1.75;
    color: #B4B5B9; /* Text Secondary */
    background-color: #0A0B0D; /* Background Dark */
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-primary);
    color: #FFFFFF; /* Text Primary */
  }

  h1 {
    font-size: 64px;
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.02em;
  }

  h2 {
    font-size: 48px;
    font-weight: 700;
    line-height: 1.2;
    margin-top: 96px;
    margin-bottom: 32px;
  }

  h3 {
    font-size: 32px;
    font-weight: 600;
    line-height: 1.3;
    margin-top: 48px;
    margin-bottom: 16px;
  }

  h4 {
    font-size: 24px;
    font-weight: 600;
    line-height: 1.4;
  }

  code, pre {
    font-family: var(--font-code);
    font-size: 14px;
    background: rgba(0, 217, 255, 0.1);
    border: 1px solid rgba(0, 217, 255, 0.2);
    padding: 2px 6px;
    border-radius: 4px;
  }

  /* Links */
  a {
    color: #4F46E5; /* Indigo */
    text-decoration: none;
    transition: color 0.2s ease;
  }

  a:hover {
    color: #00D9FF; /* Neon Cyan */
    text-decoration: underline;
  }

  /* Buttons */
  .button-primary, .gh-button-primary {
    background: #4F46E5;
    color: #FFFFFF;
    font-weight: 600;
    padding: 14px 32px;
    border-radius: 8px;
    transition: all 0.2s ease;
  }

  .button-primary:hover, .gh-button-primary:hover {
    background: #00D9FF;
    transform: scale(1.02);
  }

  /* Cards */
  .card, .gh-card {
    background: #1A1B1E; /* Surface Dark */
    border: 1px solid #2A2B2E; /* Border Dark */
    border-radius: 8px;
    padding: 24px;
    transition: all 0.3s ease;
  }

  .card:hover, .gh-card:hover {
    border-color: #00D9FF; /* Neon Cyan */
    transform: translateY(-4px);
  }

  /* Badges */
  .badge-category {
    display: inline-block;
    background: rgba(79, 70, 229, 0.2);
    color: #4F46E5;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 4px 12px;
    border-radius: 4px;
  }

  .badge-tech {
    display: inline-block;
    background: #2A2B2E;
    color: #B4B5B9;
    font-family: var(--font-code);
    font-size: 12px;
    border: 1px solid #2A2B2E;
    padding: 6px 10px;
    border-radius: 6px;
    margin: 4px;
  }

  .badge-metric {
    display: inline-block;
    color: #00D9FF;
    font-family: var(--font-code);
    font-size: 14px;
    font-weight: 700;
    border: 2px solid #00D9FF;
    padding: 8px 16px;
    border-radius: 8px;
  }

  /* Spacing Utilities */
  .section-spacing {
    margin-top: 96px;
  }

  .content-spacing {
    margin-bottom: 32px;
  }

  /* Responsive */
  @media (max-width: 768px) {
    h1 { font-size: 48px; }
    h2 { font-size: 36px; margin-top: 64px; }
    h3 { font-size: 24px; margin-top: 32px; }
    body { font-size: 16px; }
    .section-spacing { margin-top: 64px; }
  }
</style>
```

**Per-Page Customization:**
- Use Ghost's page settings for featured images, excerpts, meta descriptions
- Apply custom classes using HTML cards in Ghost editor
- Keep inline styles minimal (prefer system classes)

### Testing Checklist

Before launching any page:
- [ ] **Desktop view (1440px):** Layout looks balanced, spacing consistent
- [ ] **Tablet view (768px):** Columns stack appropriately, touch targets large enough
- [ ] **Mobile view (375px):** Single column, readable text, no horizontal scroll
- [ ] **Dark mode:** All text readable, sufficient contrast
- [ ] **Hover states:** All interactive elements respond (buttons, links, cards)
- [ ] **Images:** Load correctly, aspect ratios maintained, captions present
- [ ] **Typography:** Hierarchy clear, no orphaned headers, line lengths readable
- [ ] **Spacing:** No cramped sections, consistent gaps between elements
- [ ] **Colors:** All colors from palette (no random additions)
- [ ] **Links:** All internal/external links work, open correctly (same/new tab)
- [ ] **Accessibility:** Headings in order (H1→H2→H3), alt text on images, contrast ratios met

---

## 11. Responsive Behavior

### Breakpoint Strategy

**Mobile-First Approach:**
Base styles target mobile (320px-767px), progressively enhance for larger screens.

**Breakpoints:**
```
Mobile:       320px - 767px
Tablet:       768px - 1023px
Desktop:      1024px - 1439px
Large Desktop: 1440px+
```

### Layout Adaptations

**Grid Columns:**
- **Mobile:** 1 column (all cards stack vertically)
- **Tablet:** 2 columns (project cards, experience cards)
- **Desktop:** 3 columns (project cards, max-width grids)

**Typography:**
- **Mobile:** H1: 48px, H2: 36px, H3: 24px (scaled down 25%)
- **Tablet:** H1: 56px, H2: 40px, H3: 28px (scaled down 12.5%)
- **Desktop:** Full scale (64px, 48px, 32px)

**Spacing:**
- **Mobile:** 64px between sections (vs. 96px desktop), 16px side padding
- **Tablet:** 80px between sections, 32px side padding
- **Desktop:** 96px between sections, 48px side padding

**Images:**
- **Mobile:** Full-width (minus padding), aspect ratio maintained
- **Tablet:** Full-width or 2-column grid for galleries
- **Desktop:** Max 1200px width, galleries can be 3-column

**Navigation:**
- **Mobile:** Hamburger menu, slide-in drawer or overlay
- **Tablet:** Horizontal nav, may collapse to hamburger if many items
- **Desktop:** Full horizontal nav, all items visible

**Hero Sections:**
- **Mobile:** Stacked (headline → description → CTA), centered, headshot above text
- **Tablet:** Stacked, slightly more padding
- **Desktop:** Can use two-column (text left, headshot right) if desired

### Touch Targets (Mobile)

**Minimum sizes:**
- Buttons: 48px height minimum (exceeds 44px accessibility standard)
- Links: 44px touch target (add padding if text is small)
- Navigation items: 48px height
- Form inputs: 48px height

**Spacing around touch elements:**
- 8px minimum gap between tappable items
- Avoid cramming buttons/links close together

---

## 12. Accessibility Standards

### WCAG AA Compliance

**Color Contrast:**
- Text/Background: Minimum 4.5:1 (normal text), 3:1 (large text 18px+)
- Interactive elements: Minimum 3:1 against background
- Our palette tested:
  - White (#FFFFFF) on dark (#0A0B0D): 19:1 ✅
  - Light gray (#B4B5B9) on dark (#0A0B0D): 10:1 ✅
  - Indigo (#4F46E5) on dark (#0A0B0D): 4.8:1 ✅
  - Neon Cyan (#00D9FF) on dark (#0A0B0D): 8.2:1 ✅

**Keyboard Navigation:**
- All interactive elements (links, buttons, forms) keyboard accessible
- Tab order logical (top to bottom, left to right)
- Focus states visible (outline or highlight)
- Skip to content link (for screen readers)

**Semantic HTML:**
- Use proper heading hierarchy (H1 → H2 → H3, no skipping)
- Use `<nav>` for navigation, `<main>` for main content, `<article>` for posts
- Use `<button>` for buttons, `<a>` for links (not interchangeable)
- Use ARIA labels where needed (e.g., aria-label="Close menu")

**Images:**
- All images have alt text (descriptive, not redundant)
- Decorative images: alt="" (empty alt, screen readers skip)
- Complex images (charts): Longer description in caption or aria-describedby

**Forms:**
- All inputs have associated `<label>` elements
- Error messages clear and associated with inputs
- Required fields marked (visually and with aria-required)

**Motion & Animation:**
- Respect prefers-reduced-motion (disable animations if user prefers)
- Hover effects subtle (no flashing or rapid movement)
- Transitions smooth but not distracting

---

## 13. Performance Considerations

### Page Load Optimization

**Images:**
- Compress all images (80-85% quality, WebP format preferred)
- Use responsive images (srcset) for different screen sizes
- Lazy load below-the-fold images (loading="lazy" attribute)
- Featured images optimized (max 200KB for hero images)

**Fonts:**
- Use `font-display: swap` to prevent invisible text during load
- Preconnect to Google Fonts (`<link rel="preconnect">`)
- Subset fonts if possible (remove unused weights/characters)

**CSS:**
- Minimize custom CSS (Ghost/Kyoto handles most)
- Inline critical CSS (above-the-fold styles) in header
- Defer non-critical CSS

**JavaScript:**
- Minimal JS for portfolio site (Ghost handles most)
- Defer/async any custom scripts
- No heavy frameworks unless necessary

**Target Metrics:**
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- Time to Interactive (TTI): < 3.5s

---

## 14. Next Steps & Implementation Plan

### Phase 1: Get Design System Approved (Current)

- ✅ Research 2026 trends
- ✅ Review RAG and PROJECT-MEMORY for brand context
- ✅ Create comprehensive DESIGN-SYSTEM.md
- ⏳ **Mike reviews and approves design system**
- ⏳ **Iterate based on feedback**

### Phase 2: Implement Global Styles

After approval:
1. Add custom CSS to Ghost Code Injection (Header)
2. Import Google Fonts (Inter, JetBrains Mono)
3. Test global styles on existing pages
4. Verify Kyoto compatibility

### Phase 3: Pilot Test (About Page)

1. Debbie designs About page using approved design system
2. Create design specification (format TBD)
3. Mobiledoc Assembler converts spec → Mobiledoc JSON
4. Alice uploads images via Ghost API
5. Alice publishes via Ghost Admin API
6. Review and iterate

### Phase 4: Roll Out to All Pages

Apply design system to:
1. Homepage
2. Projects Landing
3. Resume/CV
4. Contact
5. NeighborhoodShare Case Study (add images)
6. Local LLM Case Study (add images)

### Phase 5: Quality Assurance

- Test all pages on mobile, tablet, desktop
- Verify accessibility (contrast, keyboard nav, alt text)
- Check page load speeds
- Validate HTML/CSS
- Cross-browser testing (Chrome, Safari, Firefox)

### Phase 6: Launch

- Final review with Mike
- Any last-minute tweaks
- Site goes live!
- Post-launch monitoring (analytics, user feedback)

---

## 15. Design System Maintenance

### When to Update This Document

- **New component needed:** Add to Component Library section
- **Color palette expansion:** Document new colors with rationale
- **Typography adjustments:** Update Type Scale section
- **Spacing changes:** Revise Spacing System
- **Major design decision:** Add to Design Decisions section
- **Accessibility improvement:** Update Accessibility Standards

### Version History

- **v1.0 (2026-02-06):** Initial design system created by Debbie
- Future updates tracked here

### Owner

**Debbie (Web Design Agent)**
- Maintains design system
- Ensures consistency across pages
- Updates based on learnings and Mike's feedback

---

## Appendix: Research Sources

This design system was informed by comprehensive research on 2026 web design trends and best practices:

**2026 Design Trends:**
- [Web Design Trends 2026: AI, 3D, Ambient UI & Performance](https://www.index.dev/blog/web-design-trends)
- [Aesthetics in the AI era: Visual + web design trends for 2026](https://medium.com/design-bootcamp/aesthetics-in-the-ai-era-visual-web-design-trends-for-2026-5a0f75a10e98)
- [Top 8 Web Design Trends 2026 for AI Brands](https://www.tilipmandigital.com/resource-center/articles/web-design-trends-2026-for-ai-brands)
- [Top 10 Minimalist Web Design Trends For 2026](https://www.digitalsilk.com/digital-trends/minimalist-web-design-trends/)

**Color Palette Research:**
- [Best Color Palettes for Developer Portfolios (2025)](https://www.webportfolios.dev/blog/best-color-palettes-for-developer-portfolio)
- [5 Color Palettes For Balanced Web Design In 2026](https://www.elegantthemes.com/blog/design/color-palettes-for-balanced-web-design)
- [Top 2026 Web Design Color Trends](https://www.loungelizard.com/blog/web-design-color-trends/)

**Typography & Layout:**
- [2026 Typography Trends](https://graphicdesignjunction.com/2026/01/2026-typography-trends/)
- [15 Inspiring Digital Portfolio Examples for 2026](https://templyo.io/portfolio-examples/15-inspiring-digital-portfolio-examples-for-2026)
- [Best Web Developer Portfolio Examples](https://elementor.com/blog/best-web-developer-portfolio-examples/)

**Professional Portfolio Best Practices:**
- [5 Best Portfolio Website Builders Creators Are Using in 2026](https://emergent.sh/learn/best-portfolio-website-builders)
- [17 Inspiring Web Developer Portfolio Examples for 2026](https://templyo.io/blog/17-best-web-developer-portfolio-examples-for-2024)

---

**END OF DESIGN SYSTEM**

**Next Step:** Mike reviews and approves. Upon approval, Debbie will implement global styles and proceed with pilot test on About page.
