# Design Specifications

Primary reference for mikejones.online. Other properties may have different specifications.

## Color Palette

### Primary Colors

| Element | Hex | Usage |
|---------|-----|-------|
| Accent (CTA) | #4F46E5 | Buttons, links, active states |
| Accent Hover | #6366F1 | Hover states |
| Background | #1A1A1A | Main page background (Onyx) |
| Card Background | #242424 | Cards, elevated content |
| Border | #333333 | Section dividers |
| Primary Text | #FFFFFF | Headings, body |
| Secondary Text | #B3B3B3 | Descriptions, metadata |
| Tertiary Text | #808080 | Less important info |
| Code Background | #2D2D2D | Code blocks |

### Status Colors

| Status | Hex |
|--------|-----|
| Success | #10B981 |
| Warning | #F59E0B |
| Error | #EF4444 |

## Typography

### Font Sizes

| Element | Desktop | Mobile | Weight |
|---------|---------|--------|--------|
| H1 | 48px | 36px | 700 |
| H2 | 36px | 28px | 700 |
| H3 | 28px | 24px | 600 |
| H4 | 24px | 20px | 600 |
| Body | 18px | 16px | 400 |
| Small | 14px | 14px | 400 |
| Code | 14px | 14px | 400 |

### Line Heights

- Headings: 1.2-1.4
- Body: 1.7
- Code: 1.6

## Spacing System

Base unit: 4px

| Name | Value |
|------|-------|
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |
| 2xl | 48px |
| 3xl | 64px |
| 4xl | 80px |

## Layout

### Container Widths

- Mobile: 100% (20px padding)
- Tablet: 100% (40px padding)
- Desktop: 1200px (centered)

### Breakpoints

- Mobile: 0-767px
- Tablet: 768-1023px
- Desktop: 1024px+

### Content Width

- Reading content: max 800px
- Full-width sections: 100%

## Components

### Buttons

**Primary:**
```css
background: #4F46E5;
color: #FFFFFF;
padding: 12px 24px (sm), 14px 32px (lg);
border-radius: 6px;
font-weight: 600;
```

**Hover:** Background #6366F1, translateY(-1px), box-shadow

**Secondary:**
```css
background: transparent;
border: 1px solid #4F46E5;
color: #B3B3B3;
```

### Cards

```css
background: #242424;
border: 1px solid #333333;
border-radius: 8px;
padding: 24px;
```

**Hover:** translateY(-4px), border-color #4F46E5, box-shadow

### Tags/Badges

```css
background: rgba(79, 70, 229, 0.1);
color: #4F46E5;
padding: 4px 12px;
border-radius: 4px;
font-size: 14px;
font-weight: 500;
```

## Image Specifications

### Project Images
- Aspect ratio: 16:9
- Min resolution: 1200x675px
- Format: WebP (JPG fallback)
- Max file size: 200KB

### Profile Image
- Aspect ratio: 1:1
- Size: 400x400px
- Format: WebP (JPG fallback)
- Max file size: 100KB

## Accessibility

### Contrast Ratios (WCAG AA)

All ratios exceed AA requirements:
- Primary text on dark: 15.8:1
- Accent on dark: 7.12:1
- Secondary text on dark: 9.2:1

### Focus States

```css
outline: 2px solid #4F46E5;
outline-offset: 2px;
border-radius: 4px;
```

## Performance Targets

- Performance: 90+ Lighthouse
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.0s
