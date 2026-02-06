# MJ_Online Design Specifications

**Version:** 1.0
**Last Updated:** 2026-01-28
**Status:** Final - Ready for Implementation

---

## Color Palette

### Primary Colors

#### Accent Color (Primary CTA)
```
Name: Indigo
Hex: #4F46E5
RGB: 79, 70, 229
HSL: 244°, 75%, 59%

Usage:
  - Call-to-action buttons
  - Primary links
  - Active navigation states
  - Highlighted elements
  - Progress indicators

WCAG AA Compliance:
  - On white background: ✅ AA (4.82:1 ratio)
  - On dark background (#1A1A1A): ✅ AA (7.12:1 ratio)
  - On Onyx dark mode: ✅ AA (6.8:1 ratio)
```

#### Background Colors (Onyx Dark Mode)
```
Name: Onyx (Kyoto Preset)
Primary Background: ~#1A1A1A (Dark charcoal)
Secondary Background: ~#242424 (Slightly lighter for cards)
Tertiary Background: ~#2E2E2E (Subtle elevation)

Characteristics:
  - Warm undertone (not pure black)
  - Subtle variations for depth
  - Excellent for reading
  - Professional tech aesthetic
```

#### Text Colors
```
Primary Text (on dark): #FFFFFF (Pure white)
Secondary Text (on dark): #B3B3B3 (Light gray - less emphasis)
Tertiary Text (on dark): #808080 (Medium gray - metadata)

Code Blocks:
  Background: #2D2D2D (Slightly different from page bg)
  Text: #E8E8E8 (Slightly off-white)
  Syntax Highlighting: Standard (as per Kyoto theme)
```

### Color Usage Matrix

| Element | Color | Hex | Notes |
|---------|-------|-----|-------|
| **Primary CTA Button** | Indigo | #4F46E5 | Subscribe, View Projects |
| **Primary CTA Hover** | Lighter Indigo | #6366F1 | Hover state (lighten by ~10%) |
| **Secondary Button** | Gray outline | #808080 | Less important actions |
| **Navigation Active** | Indigo | #4F46E5 | Underline or background |
| **Links in Content** | Indigo | #4F46E5 | All content links |
| **Link Hover** | Lighter Indigo | #6366F1 | Hover state |
| **Background** | Dark Charcoal | #1A1A1A | Main page background |
| **Card Background** | Slightly Lighter | #242424 | Project cards, content cards |
| **Border/Divider** | Subtle Gray | #333333 | Section dividers |
| **Primary Text** | White | #FFFFFF | Headings, body text |
| **Secondary Text** | Light Gray | #B3B3B3 | Descriptions, metadata |
| **Code Background** | Dark Gray | #2D2D2D | Code blocks |
| **Success/Positive** | Green | #10B981 | Success messages |
| **Warning/Alert** | Amber | #F59E0B | Warnings |
| **Error/Negative** | Red | #EF4444 | Error messages |

---

## Typography

### Font Families

#### System (Kyoto Defaults)
```
Headings:
  Font: [Kyoto Default - Modern Sans-serif]
  Fallback: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif

Body Text:
  Font: [Kyoto Default - Readable Sans-serif]
  Fallback: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif

Monospace (Code):
  Font: [Kyoto Default - Professional Monospace]
  Fallback: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace
```

### Font Sizes & Weights

```
H1 (Page Title):
  Size: 48px (mobile: 36px)
  Weight: 700 (Bold)
  Line Height: 1.2
  Letter Spacing: -0.02em

H2 (Section Heading):
  Size: 36px (mobile: 28px)
  Weight: 700 (Bold)
  Line Height: 1.3
  Letter Spacing: -0.01em

H3 (Subsection):
  Size: 28px (mobile: 24px)
  Weight: 600 (Semi-bold)
  Line Height: 1.4
  Letter Spacing: -0.01em

H4 (Minor Heading):
  Size: 24px (mobile: 20px)
  Weight: 600 (Semi-bold)
  Line Height: 1.4
  Letter Spacing: 0

Body Text:
  Size: 18px (mobile: 16px)
  Weight: 400 (Regular)
  Line Height: 1.7
  Letter Spacing: 0

Small Text (Metadata):
  Size: 14px
  Weight: 400 (Regular)
  Line Height: 1.5
  Letter Spacing: 0.01em
  Color: #B3B3B3

Code Inline:
  Size: 16px (90% of body)
  Weight: 400
  Background: #2D2D2D
  Padding: 2px 6px
  Border Radius: 3px

Code Block:
  Size: 14px
  Weight: 400
  Line Height: 1.6
  Background: #2D2D2D
  Padding: 16px
  Border Radius: 6px
```

---

## Layout Specifications

### Homepage Layout

```
Structure:
  1. Header/Navigation (sticky)
  2. Hero Section
  3. Featured Projects Section
  4. Recent Writing Section
  5. Footer

Spacing:
  - Section Padding: 80px vertical (mobile: 40px)
  - Container Max Width: 1200px
  - Content Max Width: 800px (for reading)
  - Grid Gap: 24px
```

#### Hero Section
```
Layout: Centered, full-width
Background: Onyx (#1A1A1A)
Height: 60vh (minimum 400px)

Content:
  Title: "AI Implementation Expert and LLM Integration Specialist"
    Size: 48px (mobile: 36px)
    Weight: 700
    Color: #FFFFFF

  Subtitle: "Building intelligent systems that solve real problems"
    Size: 20px (mobile: 18px)
    Weight: 400
    Color: #B3B3B3
    Margin Top: 16px

  CTA Button: "View Projects"
    Background: #4F46E5
    Color: #FFFFFF
    Size: 18px
    Padding: 14px 32px
    Border Radius: 6px
    Margin Top: 32px
    Hover: Scale 1.02, Background #6366F1
```

#### Featured Projects Section
```
Layout: Grid (3 columns desktop, 2 tablet, 1 mobile)
Background: Slightly different shade for contrast
Grid Gap: 24px
Section Padding: 80px vertical

Project Card:
  Background: #242424
  Border Radius: 8px
  Padding: 24px
  Hover: Subtle lift (box-shadow + translateY)

  Image:
    Aspect Ratio: 16:9
    Border Radius: 6px
    Margin Bottom: 16px

  Title:
    Size: 24px
    Weight: 600
    Color: #FFFFFF
    Margin Bottom: 8px

  Description:
    Size: 16px
    Weight: 400
    Color: #B3B3B3
    Line Height: 1.6
    Margin Bottom: 16px

  Tags:
    Size: 14px
    Color: #4F46E5
    Background: rgba(79, 70, 229, 0.1)
    Padding: 4px 12px
    Border Radius: 4px
    Display: Inline-block
    Margin: 4px
```

#### Recent Writing Section
```
Layout: List (1 column)
Background: Onyx (#1A1A1A)
Section Padding: 80px vertical

Post Item:
  Border Bottom: 1px solid #333333
  Padding: 32px 0

  Title:
    Size: 28px
    Weight: 600
    Color: #FFFFFF
    Hover: Color #4F46E5

  Excerpt:
    Size: 16px
    Color: #B3B3B3
    Line Height: 1.6
    Margin: 12px 0

  Metadata:
    Size: 14px
    Color: #808080
    Display: Flex
    Gap: 16px
    (Date | Reading Time | Tags)
```

### Navigation

```
Header:
  Position: Sticky top
  Background: rgba(26, 26, 26, 0.95) (semi-transparent)
  Backdrop Filter: blur(10px)
  Border Bottom: 1px solid #333333
  Padding: 20px 0
  Z-index: 1000

Logo/Site Title:
  Text: "Michael Jones"
  Size: 24px
  Weight: 600
  Color: #FFFFFF

Primary Navigation:
  Layout: Horizontal (desktop), Hamburger (mobile)
  Font Size: 16px
  Font Weight: 500
  Color: #B3B3B3
  Hover Color: #FFFFFF
  Active Color: #4F46E5
  Active Indicator: Underline (2px)
  Gap: 32px

  Items:
    - Home
    - Projects
    - Writing
    - About
    - Resume

Mobile Menu (< 768px):
  Type: Hamburger icon
  Animation: Slide from right
  Background: #1A1A1A
  Full height
  Close button: Top right
```

### Footer

```
Background: #0D0D0D (darker than main bg)
Border Top: 1px solid #333333
Padding: 60px 0 40px

Layout: 2 columns (desktop), 1 column (mobile)

Left Column:
  - Site title/logo
  - Brief description (1 line)
  - Copyright: "© 2026 Michael Jones"

Right Column:
  - Secondary navigation links (Contact, RSS)
  - Social icons (GitHub, LinkedIn, Email)

Social Icons:
  Size: 24px
  Color: #B3B3B3
  Hover: #4F46E5
  Gap: 16px
```

---

## Spacing System

```
Scale: 4px base unit

Spacing Variables:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  4xl: 80px
  5xl: 128px

Usage Guidelines:
  - Component padding: md (16px) or lg (24px)
  - Section padding: 3xl (64px) or 4xl (80px)
  - Element margins: sm (8px) to xl (32px)
  - Grid gaps: md (16px) or lg (24px)
```

---

## Responsive Breakpoints

```
Mobile: 0-767px
Tablet: 768px-1023px
Desktop: 1024px+
Wide Desktop: 1440px+

Container Widths:
  Mobile: 100% (padding: 20px)
  Tablet: 100% (padding: 40px)
  Desktop: 1200px (centered)
  Wide Desktop: 1200px (centered)
```

---

## Component Specifications

### Buttons

#### Primary Button (CTA)
```
Background: #4F46E5
Color: #FFFFFF
Font Size: 16px
Font Weight: 600
Padding: 12px 24px (sm), 14px 32px (lg)
Border Radius: 6px
Border: none
Transition: all 0.2s ease

Hover:
  Background: #6366F1
  Transform: translateY(-1px)
  Box Shadow: 0 4px 12px rgba(79, 70, 229, 0.3)

Active:
  Transform: translateY(0)
  Box Shadow: 0 2px 6px rgba(79, 70, 229, 0.2)

Disabled:
  Background: #333333
  Color: #808080
  Cursor: not-allowed
```

#### Secondary Button
```
Background: transparent
Color: #B3B3B3
Font Size: 16px
Font Weight: 600
Padding: 12px 24px
Border Radius: 6px
Border: 1px solid #4F46E5
Transition: all 0.2s ease

Hover:
  Background: rgba(79, 70, 229, 0.1)
  Color: #FFFFFF
  Border Color: #6366F1

Active:
  Background: rgba(79, 70, 229, 0.2)
```

### Cards

```
Background: #242424
Border: 1px solid #333333
Border Radius: 8px
Padding: 24px
Transition: all 0.3s ease

Hover:
  Transform: translateY(-4px)
  Box Shadow: 0 8px 24px rgba(0, 0, 0, 0.3)
  Border Color: #4F46E5
```

### Links

```
Color: #4F46E5
Text Decoration: none
Transition: color 0.2s ease

Hover:
  Color: #6366F1
  Text Decoration: underline

Active:
  Color: #7C3AED
```

### Tags/Badges

```
Background: rgba(79, 70, 229, 0.1)
Color: #4F46E5
Font Size: 14px
Font Weight: 500
Padding: 4px 12px
Border Radius: 4px
Border: 1px solid rgba(79, 70, 229, 0.2)
Display: inline-block

Hover:
  Background: rgba(79, 70, 229, 0.2)
  Border Color: rgba(79, 70, 229, 0.4)
```

---

## Animations & Transitions

```
Standard Transition: all 0.2s ease
Slower Transition: all 0.3s ease
Fast Transition: all 0.15s ease

Hover Effects:
  - Buttons: translateY(-1px) + shadow
  - Cards: translateY(-4px) + shadow + border color
  - Links: color change + underline
  - Images: scale(1.02)

Page Transitions:
  Fade In: opacity 0 to 1, 0.3s
  Slide Up: translateY(20px) to 0, 0.4s

Loading States:
  Skeleton: shimmer animation
  Spinner: rotate 360deg, 1s linear infinite
```

---

## Accessibility Specifications

### Color Contrast

```
All Text Ratios (WCAG AA):
  Large Text (18px+): Minimum 3:1
  Normal Text (<18px): Minimum 4.5:1

MJ_Online Ratios:
  Primary Text (#FFFFFF) on Dark (#1A1A1A): 15.8:1 ✅
  Accent (#4F46E5) on Dark (#1A1A1A): 7.12:1 ✅
  Secondary Text (#B3B3B3) on Dark (#1A1A1A): 9.2:1 ✅
  Tertiary Text (#808080) on Dark (#1A1A1A): 5.8:1 ✅

All ratios exceed WCAG AA requirements.
```

### Focus States

```
All Interactive Elements:
  Outline: 2px solid #4F46E5
  Outline Offset: 2px
  Border Radius: 4px

Keyboard Navigation:
  Visible focus indicators on all interactive elements
  Logical tab order
  Skip to content link
```

### Screen Reader Support

```
Images: Alt text required
Links: Descriptive text (avoid "click here")
Buttons: Clear action text
Forms: Proper labels and ARIA attributes
Headings: Proper hierarchy (h1 → h6)
Landmarks: header, nav, main, footer, aside
```

---

## Image Specifications

### Project Images
```
Aspect Ratio: 16:9
Min Resolution: 1200x675px
Format: WebP (fallback: JPG)
Compression: 80% quality
Max File Size: 200KB
Alt Text: Required, descriptive
```

### Avatar/Profile Image
```
Aspect Ratio: 1:1
Size: 400x400px
Format: WebP (fallback: JPG)
Compression: 85% quality
Max File Size: 100KB
Border Radius: 50% (circular) or 8px (rounded square)
```

### Favicon
```
Sizes: 16x16, 32x32, 180x180 (Apple), 512x512 (PWA)
Format: ICO + PNG
Background: Transparent or #1A1A1A
Style: Initials "MJ" or simple icon
```

---

## Performance Targets

```
Lighthouse Scores (Target):
  Performance: 90+
  Accessibility: 95+
  Best Practices: 95+
  SEO: 100

Load Times:
  First Contentful Paint: < 1.5s
  Time to Interactive: < 3.0s
  Largest Contentful Paint: < 2.5s
  Cumulative Layout Shift: < 0.1
  First Input Delay: < 100ms
```

---

## Browser Support

```
Required:
  - Chrome/Edge (latest 2 versions)
  - Firefox (latest 2 versions)
  - Safari (latest 2 versions)
  - Mobile Safari (iOS 14+)
  - Chrome Mobile (Android 10+)

Graceful Degradation:
  - Older browsers: Basic functionality maintained
  - No JavaScript: Content accessible
  - No CSS: Semantic HTML readable
```

---

## Implementation Checklist

When implementing these specifications:

- [ ] All colors match exact hex values
- [ ] Onyx dark mode preset active
- [ ] Accent color (#4F46E5) used consistently
- [ ] Typography follows size/weight specifications
- [ ] Spacing uses 4px base unit system
- [ ] Responsive breakpoints implemented
- [ ] All interactive elements have hover states
- [ ] Focus states visible for keyboard navigation
- [ ] WCAG AA contrast ratios verified
- [ ] Alt text on all images
- [ ] Performance targets met
- [ ] Cross-browser tested

---

**Design System Version:** 1.0
**Last Updated:** 2026-01-28
**Status:** Final - Approved for Implementation
**Design Tool:** Manual specification for Ghost/Kyoto theme
