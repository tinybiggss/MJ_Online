# NeighborhoodShare Screenshot Descriptions

**Project:** NeighborhoodShare - Community Tool Sharing Platform
**Documentation Date:** 2026-02-04
**Total Screenshots:** 18 screenshots + 2 logos + 1 landing page PDF
**Purpose:** Reference guide for web content creation and case study development

---

## Screenshot Inventory

### Authentication & Onboarding

**`login.png`**
- **Description:** Login page with email/password fields
- **Features Shown:** Email field, password field, "Forgot password?" link, green "Login" button
- **Context:** Standard authentication entry point
- **Database:** N/A (pre-authentication)

**`registration.png`**
- **Description:** Registration page accessed from login screen
- **Features Shown:** Registration form for new users
- **Context:** User signup flow, captures initial profile information
- **Database:** Creates new user record in PostgreSQL

**`landing-page.png`**
- **Description:** Public landing page (neighborhoodshare.app)
- **Features Shown:** Hero section with "Welcome to NeighborhoodShare", tagline "Share Resources, Build Community", "Sign Up Free" and "Log In" buttons
- **Context:** First impression for new visitors, explains value proposition
- **Additional:** Full landing page content available in `neighborhood-share.pdf`
- **Database:** N/A (pre-authentication)

---

## Main Application Screens

**`home-tool-selection.png`**
- **Description:** Home page/dashboard after login - primary tool browsing interface
- **Features Shown:**
  - Location indicator: "5 miles searching near San Jose, CA"
  - Grid of available tools with photos (DeWalt tools, etc.)
  - Tool cards showing: item photo, name, category tag, condition
  - Top navigation: "Add Tool", "My Borrowed Tools", "My Lent Tools" buttons
  - Notification bell icon (shows badge count when notifications present)
- **Context:** Main user interface, shows tools available within user's search radius
- **Database:** Production (showing real tools from beta users)
- **User Flow:** This is where borrowers discover and select tools to request

---

## Tool Management - Adding Items

**`add-tool-ai.png`**
- **Description:** AI-powered tool entry screen (first page)
- **Features Shown:**
  - "AI-Powered" tab selected (vs "Manual" tab)
  - Image upload area with drag-and-drop functionality
  - Text: "Snap photos of your item from multiple angles"
  - Recommendation: Add at least 2-4 images, including any text/labels on the item
- **Context:** First step in AI-assisted tool cataloging
- **User Flow:** User uploads 2-4 photos → AI processes → auto-fills details
- **Database:** N/A (pre-submission)

**`add-tool-ai-2.png`**
- **Description:** AI-powered tool entry screen (second page, after AI processing)
- **Features Shown:**
  - Auto-populated fields from AI analysis:
    - **Tool Name:** Automatically identified
    - **Category:** Auto-selected from dropdown (Electrical Tools, Power Tools, etc.)
    - **Brand:** Identified from photos (DeWalt, Milwaukee, even sewing machine models)
    - **Power Type:** Battery/Electric/Manual detected
    - **Condition:** AI-assessed (New, Like New, Good, Fair, Poor)
    - **Location:** Auto-filled from user profile
    - **Description:** AI-generated description (user can edit)
  - Big green "Add to Tool Library" button
- **Context:** After 30-60 second AI processing, form auto-populates
- **Technical Note:** Uses OpenAI GPT-4o Vision API
- **User Flow:** Review AI suggestions → edit if needed → submit
- **Database:** Creates new item record when submitted

**`add-tool-manual.png`**
- **Description:** Manual tool entry screen
- **Features Shown:**
  - "Manual" tab selected
  - All fields blank for user to fill in manually
  - Same fields as AI version, but no auto-population
- **Context:** Alternative for users who prefer manual entry or when AI can't identify item
- **User Flow:** User manually enters all tool details → submit

---

## Tool Detail Screens

**`tool-detail-borrow.png`**
- **Description:** Tool detail page as seen by potential borrower
- **Features Shown:**
  - Tool photos (swipeable carousel)
  - Tool details: name, category, brand, power type, condition, description, model
  - **Borrow Request Section:**
    - Text box: "Tell the lender about your project" (for borrower message)
    - Calendar picker: Select pickup date
    - Calendar picker: Select return date
    - "Submit Borrow Request" button
- **Context:** Borrower clicks tool from home page → sees this detail view
- **User Flow:** Fill in dates + message → submit request → triggers notification to lender
- **Database:** Creates loan record with status="requested"

**`tool-detail-owner.png`**
- **Description:** Tool detail page as seen by tool owner
- **Features Shown:**
  - Same tool details as borrower view
  - **Owner Actions Section (replaces borrow calendar):**
    - Grayed out section with message: "This is your tool"
    - "Manage My Tools" button → allows editing tool details or setting availability
    - Option to mark tool as "Not Available" with optional return date
- **Context:** Owner clicks their own tool from home page
- **User Flow:** Owner can edit details, update photos, or toggle availability
- **Database:** Updates item record

---

## User Profile

**`profile-1.png`**
- **Description:** User profile page (top section)
- **Features Shown:**
  - User avatar/initial circle
  - Display name
  - Join date, borrow count, lend count
  - **Identity & Authentication section:**
    - First name, last name fields
    - Display name field (how user appears to community)
- **Context:** User clicks profile icon → manages account settings
- **Database:** User table

**`profile-2.png`**
- **Description:** User profile page (middle section, below fold)
- **Features Shown:**
  - **Location Information section:**
    - Street address
    - City, State, ZIP code
    - "Public Location Display" (shows city/state only to protect privacy)
    - Toggle: "Hide exact address from other users" (privacy control)
    - **Search Radius slider:** 5 miles (adjustable)
    - Description: "Close proximity: Mostly walkable or very short drives in dense urban areas"
- **Context:** Location settings determine which tools user sees and who can see their tools
- **Technical Note:** Radius affects geolocation queries for tool discovery

**`profile-3.png`**
- **Description:** User profile page (bottom section)
- **Features Shown:**
  - **Notification Settings:**
    - Email notifications toggle
    - SMS notifications toggle (opt-in, costs apply via Twilio)
  - **Account Statistics:**
    - Total borrows completed
    - Total lends completed
    - Account status (verified/unverified)
  - "View Complete Borrowing and Lending History" link
- **Context:** User preferences for notification delivery channels
- **Database:** User preferences stored in profile

---

## Admin Dashboard - Development Environment

**`admin-dev-1-users.png`**
- **Description:** Admin dashboard - User management (development database)
- **Features Shown:**
  - **BIG GREEN BOX:** "DEVELOPMENT DATABASE" warning
  - **Menu tabs:** Users, Tools, Requests, AI Monitoring, Beta Management
  - **Users tab highlighted**
  - **User table columns:**
    - User ID
    - User Name
    - Email
    - Location (city, state)
    - Beta Status (approved/pending)
    - Account Status (verified/unverified)
    - Borrowed/Lent count
    - **Action buttons:**
      - Make Admin (promotes to super admin)
      - Block (prevents login, keeps data)
      - Verify Email (resends verification email)
      - Activate (bypasses email verification for testing)
      - Delete (removes user permanently)
- **Context:** Admin testing environment, can break things safely
- **Database:** Development schema (public schema in PostgreSQL)
- **User:** Super admin only

---

## Admin Dashboard - Production Environment

**`admin-prod-1-users.png`**
- **Description:** Admin dashboard - User management (production database)
- **Features Shown:**
  - **BIG RED BOX:** "PRODUCTION DATABASE - YOU ARE OPERATING ON LIVE DATA" warning
  - Same user management table as dev, but with real user data
  - Screenshot cropped to hide private user information
- **Context:** Live user management, changes affect real users
- **Database:** Production schema in PostgreSQL
- **User:** Super admin only

**`admin-prod-2-tools.png`**
- **Description:** Admin dashboard - Tools management (production database)
- **Features Shown:**
  - **Tools tab highlighted**
  - **Tool table columns:**
    - Tool ID
    - Name (AI-generated names)
    - Category (AI-identified)
    - Location (owner's city)
    - Status (Available, Checked Out, etc.)
    - **Action buttons:**
      - Edit (opens tool edit form)
      - Delete (removes tool permanently)
- **Context:** Manage all tools in platform, moderate content
- **Database:** Production - all tools shown were AI-categorized
- **Note:** All visible tools entered using AI feature

**`admin-prod-3-requests.png`**
- **Description:** Admin dashboard - Loan requests tracking (production)
- **Features Shown:**
  - **Requests tab highlighted**
  - **Request table columns:**
    - Tool name (e.g., "D-handled garden spade")
    - Borrower username
    - Status (Requested, Approved, Checked Out, Overdue, Returned-Pending Confirmation)
    - Pickup date
    - Return date
    - Actions (edit status, resolve disputes)
- **Context:** Monitor all active loans, resolve disputes manually
- **Example shown:** Tool returned by borrower, awaiting lender confirmation
- **Database:** Loans/borrowings table (production)

**`admin-prod-4-ai-monitoring.png`**
- **Description:** Admin dashboard - AI API usage monitoring (production)
- **Features Shown:**
  - **AI Monitoring tab highlighted**
  - **Security metrics:**
    - Users actively using database repeatedly (potential abuse)
    - Blocked users count
    - Blocked IPs count
    - Users exceeding request limits
  - Rate limiting enforcement display
- **Context:** Added after API key theft incident ($50 in unauthorized charges)
- **Purpose:** Prevent API abuse, monitor for suspicious usage patterns
- **Security:** 10 queries/hour limit per verified registered user

**`admin-prod-5-beta.png`**
- **Description:** Admin dashboard - Beta rollout management (production)
- **Features Shown:**
  - **Beta Management tab highlighted**
  - **Key Metrics Dashboard:**
    - **Total Users on Platform:** 170
    - **Active Zip Codes:** 20 (neighborhoods with active communities)
    - **Total Interested:** 82 (signups waiting for neighborhood activation)
    - **Ready to Activate:** Zip codes with 20+ users + captain
    - **Watch List - Captains Needed:** Zip codes with 15+ users, no captain yet
    - **Needs More Users:** Zip codes near 15 users, need one more push
  - **Action Buttons:**
    - "Manage Zip Codes" → manually add/activate zip codes
    - "Check Readiness" → dashboard showing zip codes ready for activation
- **Context:** Geographic expansion strategy, track community building progress
- **Captain System:** Neighborhood moderators who authorize new users and manage local disputes
- **Activation Criteria:** 20 users in zip code OR 18 in primary + 2 in adjacent zip code (within 5 miles)
- **Database:** Beta management tables tracking zip codes and captain assignments

---

## Support & Help

**`support-page-content.png`**
- **Description:** Support page content
- **Features Shown:**
  - Help documentation
  - FAQ section
  - Contact information
- **Context:** Accessed from "Support Us" link on home page
- **Purpose:** User self-service help resources

**`question-icon-menu.png`**
- **Description:** Help menu dropdown (? icon)
- **Features Shown:**
  - **"Provide Feedback"** → links to feedback form
  - **Email:** support@neighborhoodshare.app
  - **"About NeighborhoodShare"** → about page
  - **"Interactive Tours"** → onboarding tutorial system
    - Homepage tour
    - Profile page tour
    - Tool management tour
    - Borrowing and lending tour
  - **"Reset All Tours"** → restart tutorials (useful for testing or re-onboarding)
- **Context:** Available from all logged-in pages
- **Interactive Tours:** First-time user onboarding, highlights buttons and explains functionality

---

## Logos & Branding

**`NeighborhoodShare house Logo.png`**
- **Description:** House icon logo (standalone)
- **Design:** Simple house shape with upward arrow inside
- **Color:** Teal/green
- **Usage:** App icon, favicon, watermark
- **File Size:** ~90KB

**`NeighborhoodShare words Logo.png`**
- **Description:** House logo + "NeighborhoodShare" wordmark
- **Design:** House icon with brand name
- **Color:** Teal/green
- **Usage:** Main logo for headers, landing page, marketing
- **File Size:** ~86KB

---

## Landing Page Reference

**`neighborhood-share.pdf`**
- **Description:** Complete marketing website content (8 pages)
- **Purpose:** Full landing page design reference created with Gamma
- **Content Sections:**
  1. Hero: "Together, We Have Everything We Need"
  2. Platform overview and value proposition
  3. How it works (4-step process)
  4. Tool categories (gardening, crafting, kitchen, bike, educational, auto)
  5. Why it strengthens communities (save money, reduce waste, build connections)
  6. Features overview (AI recognition, email/SMS, local-only radius, trust features)
  7. Beta signup and zip code activation
  8. Footer (contact, Resilient Tomorrow link, Jones Collaboration Co.)
- **Technical Integration:** Embedded in Replit app via iframe
- **File Size:** 2.7MB

---

## Screenshots by User Flow

### New User Journey
1. `landing-page.png` → Public landing page
2. `registration.png` → Create account
3. `login.png` → First login
4. Interactive tours launch (see `question-icon-menu.png`)
5. `home-tool-selection.png` → Browse available tools

### Adding a Tool (Lender)
1. Click "Add Tool" from home page
2. `add-tool-ai.png` → Upload photos
3. Wait 30-60 seconds for AI processing
4. `add-tool-ai-2.png` → Review AI-generated details
5. Submit → Tool appears on `home-tool-selection.png`

### Borrowing a Tool
1. `home-tool-selection.png` → Browse tools
2. Click tool → `tool-detail-borrow.png`
3. Fill calendar + message → Submit request
4. Lender receives notification
5. Lender approves → Both receive notifications
6. Pickup day → Both confirm pickup
7. Return day → Both confirm return

### Admin Operations
1. Admin user sees admin button in profile
2. Click admin → Choose environment (dev/prod)
3. **Development work:** `admin-dev-1-users.png` (green box)
4. **Production work:** `admin-prod-1-users.png` through `admin-prod-5-beta.png` (red warning box)

---

## Database Context

### Development Database (Green Box)
- **Schema:** `public` in Neon PostgreSQL
- **Purpose:** Safe testing environment
- **Data:** Test users, sample tools
- **Screenshots:** `admin-dev-1-users.png`

### Production Database (Red Box)
- **Schema:** `production` in Neon PostgreSQL
- **Purpose:** Live user data
- **Data:** Real users (170 total), real tools (~75-80 items)
- **Screenshots:** All `admin-prod-*.png` files
- **Security:** Big red warning banner on all admin pages

---

## Key Stats Visible in Screenshots

**From `admin-prod-5-beta.png`:**
- **170 total users** signed up
- **20 active zip codes**
- **82 interested users** waiting for activation
- **~75-80 tools** listed (mostly by founder)

**From `home-tool-selection.png`:**
- Location-based tool discovery (2-mile radius in screenshot)
- Real tool photos from beta users
- Tool categories: Power Tools, Electrical Tools, etc.

---

## Technical Features Demonstrated

**AI Categorization** (`add-tool-ai-2.png`):
- GPT-4o Vision API identifies:
  - Tool type (drill, saw, router, etc.)
  - Brand (DeWalt, Milwaukee, even sewing machine models)
  - Power type (battery, electric, manual)
  - Condition assessment (New, Like New, Good, Fair, Poor)

**Location Privacy** (`profile-2.png`):
- Exact address hidden from other users until loan approved
- Public display shows only "San Jose, CA"
- Search radius adjustable (5 miles shown)

**Notification System** (`home-tool-selection.png`):
- Bell icon with badge count
- In-app notifications
- Email + SMS delivery (user preference)

**Security Monitoring** (`admin-prod-4-ai-monitoring.png`):
- Rate limiting: 10 queries/hour per verified user
- Blocked IPs and users tracking
- API abuse detection

**Beta Expansion Strategy** (`admin-prod-5-beta.png`):
- Geographic zip code clustering
- 20+ user activation threshold
- Captain-based community moderation
- Adjacent zip code aggregation (5-mile radius)

---

## Notes for Web Content Creation

**Screenshot Selection for Case Study:**

**Must Include:**
1. `home-tool-selection.png` - Shows polished UI and real tools
2. `add-tool-ai-2.png` - Demonstrates AI categorization feature
3. `admin-prod-5-beta.png` - Shows sophisticated beta management system
4. `tool-detail-borrow.png` - Shows borrowing workflow

**Optional (depending on case study focus):**
5. `admin-prod-4-ai-monitoring.png` - Security incident response
6. `profile-2.png` - Location privacy controls
7. `landing-page.png` or use PDF for hero image

**Visual Design Notes:**
- Color scheme: Teal/green primary, clean white backgrounds
- Modern, minimal UI
- Mobile-responsive (though screenshots show desktop views)
- Beta badge visible in screenshots

**Privacy Considerations:**
- `admin-prod-1-users.png` cropped to hide user data
- Use production screenshots to show real functionality
- Development screenshots safe to show (test data only)

---

**Document Status:** Complete
**Last Updated:** 2026-02-04
**For:** Task 3.8 - NeighborhoodShare Case Study (Technical Documentation)
**Next Step:** Handoff to Alice (Web-Content-Builder) for case study creation
