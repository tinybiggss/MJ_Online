# Ghost Pro Features Reference

Quick reference for Ghost CMS features relevant to content creation and management.

## Ghost Editor

### Content Blocks

| Block Type | Usage |
|------------|-------|
| Text | Standard paragraphs, basic formatting |
| Heading | H2-H6 (H1 reserved for title) |
| Image | Single images, upload or URL |
| Gallery | Multiple images in grid |
| Markdown | Full markdown support |
| HTML | Raw HTML for custom elements |
| Divider | Section breaks |
| Bookmark | Rich link previews |
| Code | Syntax-highlighted code blocks |
| Video | Embed YouTube, Vimeo |
| Audio | Audio file embedding |
| File | File attachments |
| Product | Product cards |
| Toggle | Expandable content sections |
| Callout | Highlighted info boxes |
| Button | CTA buttons |

### Keyboard Shortcuts

- `/` - Open block menu
- `Ctrl+K` - Add link
- `Ctrl+Alt+1` through `6` - Heading levels
- `Ctrl+Shift+K` - Code formatting

## Publishing Workflow

### Post States

1. **Draft** - Work in progress, not visible
2. **Scheduled** - Set to publish at future time
3. **Published** - Live on site
4. **Unpublished** - Was published, now hidden

### Pre-Publish Checklist

1. **Post Settings (sidebar):**
   - Featured image set
   - Excerpt written (or auto-generated)
   - Tags added
   - Author correct
   - Published date set

2. **Meta Data:**
   - Meta title (50-60 chars)
   - Meta description (150-160 chars)
   - Canonical URL (if needed)

3. **Social Sharing:**
   - Twitter/X card preview
   - Facebook/OG preview
   - Custom images if needed

4. **URL:**
   - Slug is clean and keyword-rich
   - No special characters

## Tags System

### Tag Categories (for mikejones.online)

| Tag | Purpose |
|-----|---------|
| projects | Portfolio case studies |
| writing | Blog posts, articles |
| ai | AI-related content |
| python | Python-specific content |
| tutorial | How-to content |
| update | Site/project updates |

### Tag Best Practices

- Use lowercase
- Hyphenate multi-word: `machine-learning`
- 2-5 tags per post
- First tag determines URL for tag-based routing

## Navigation Configuration

**Location:** Settings → Navigation

### Primary Navigation

- Maximum 5-6 items recommended
- Visible on all pages
- Mobile: Becomes hamburger menu

### Secondary Navigation

- Appears in footer
- Utility links: RSS, Contact, Privacy

### Navigation Item Format

- Label: Display text
- URL: Can be relative (/about/) or absolute

## Code Injection

**Location:** Settings → Code Injection

### Site Header (CSS)

- Loads in `<head>`
- Use for: Custom styles, fonts, CSS overrides

### Site Footer (JS)

- Loads before `</body>`
- Use for: Analytics, interactive features, tracking

### Per-Post Code

- Open post settings
- "Code injection" section
- Useful for post-specific scripts

## Members & Subscriptions

### Membership Tiers

- **Free** - Basic access
- **Paid** - Premium content (optional)

### Sign-up Forms

- Built into theme
- Newsletter popup option
- Landing page creation

### ActivityPub (Federation)

**Location:** Settings → Membership → Network

- Toggle ActivityPub on/off
- Update bio and profile
- Posts auto-federate to followers

## Analytics

**Location:** Dashboard or dedicated Analytics section

### Built-in Metrics

- Total members
- Free vs paid breakdown
- Page views
- Top posts
- Email performance

### Key Metrics for Career Site

- **Resume page views** - Recruiter interest indicator
- **Project case study views** - Portfolio engagement
- **Traffic sources** - Where visitors find you
- **Time on page** - Content quality indicator

## Media Management

### Image Optimization

Ghost automatically:
- Generates responsive sizes
- Converts to WebP (with fallbacks)
- Lazy loads images

### File Uploads

**Allowed file types:**
- Images: jpg, png, gif, svg, webp, ico
- Files: pdf, doc, docx, xls, xlsx, ppt, pptx
- Media: mp4, webm, ogv, mp3

**Upload limits:** Check Ghost Pro plan

## Theme Customization

### Design Settings

**Location:** Settings → Design → Customize

| Setting | mikejones.online Value |
|---------|----------------------|
| Color preset | Onyx |
| Accent color | #4F46E5 |

### What's Customizable (Kyoto)

- Brand colors
- Typography options
- Homepage layout
- Post layout
- Navigation style
- Footer content

## Import/Export

### Content Export

**Location:** Settings → Import/Export

- Exports all content as JSON
- Includes posts, pages, tags, settings
- Does NOT include: Theme, members, custom code

### Backup Schedule

- Ghost Pro: Automatic daily backups
- Manual: Export before major changes

## Integrations

### Built-in

- Unsplash (images)
- Zapier (automation)
- Slack (notifications)

### Custom Integrations

**Location:** Settings → Integrations

- Create API keys for custom apps
- Content API (read-only)
- Admin API (read-write)
