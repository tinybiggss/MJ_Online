# Ghost Pro Setup Guide - Tasks 2-4

**Purpose:** Step-by-step browser automation guide for Ghost Pro configuration
**Tasks:** 2 (Domain), 3 (Email), 4 (Settings)
**Status:** Ready for execution once browser connection established

---

## Task 2: Configure Custom Domain (MikeJones.online)

### Part A: Ghost Pro Domain Configuration

**Navigate to:** Ghost Pro Admin → Settings → Domain

**Steps:**
1. Open Ghost Pro admin dashboard (should already be open)
2. Navigate to Settings → General
3. Locate "Publication info" section
4. Find "Site domain" setting
5. Click "Change domain"
6. Enter: `mikejones.online` (or `www.mikejones.online` if preferred)
7. Save changes
8. Note the DNS records provided by Ghost (CNAME or A records)

**Expected DNS Records from Ghost:**
- CNAME record pointing to Ghost servers
- Or A record with IP address
- TXT record for verification (if provided)

### Part B: GoDaddy DNS Configuration

**Navigate to:** GoDaddy Dashboard → My Products → Domains → mikejones.online → DNS

**Steps:**
1. Open GoDaddy account (should already be open)
2. Go to My Products
3. Click on "DNS" next to MikeJones.online domain
4. Configure DNS records based on Ghost's requirements:

**Option 1: Root domain (mikejones.online)**
- Type: A
- Name: @
- Value: [IP from Ghost]
- TTL: 600 seconds (or default)

**Option 2: WWW subdomain (www.mikejones.online)**
- Type: CNAME
- Name: www
- Value: [CNAME target from Ghost]
- TTL: 600 seconds

**Option 3: Both (recommended)**
- A record for root domain (@)
- CNAME for www pointing to root
- Or follow Ghost's specific instructions

**Verification Steps:**
1. Save DNS changes in GoDaddy
2. Return to Ghost Pro admin
3. Click "Verify DNS" or wait for automatic verification
4. DNS propagation can take 10 minutes to 48 hours (typically 1-2 hours)

**Testing:**
```bash
# Check DNS propagation
dig mikejones.online
dig www.mikejones.online

# Or use online tools
# https://dnschecker.org
```

---

## Task 3: Configure Email Delivery

**Navigate to:** Ghost Pro Admin → Settings → Email newsletter

### Ghost Pro Built-in Email Service

Ghost Pro includes Mailgun integration by default for all tiers. No additional configuration required for basic email functionality.

**Steps:**
1. Navigate to Settings → Email newsletter
2. Verify sender email address
3. Configure "Default email address" (e.g., `hello@mikejones.online`)
4. Configure "Support email address" (e.g., `support@mikejones.online`)
5. Add "Reply-to email" if different from sender

**Email Sending Options:**

**Option A: Use Ghost Pro's Built-in Mailgun (Recommended)**
- Included in all Ghost Pro plans
- No setup required
- Reliable delivery
- Good for starting out

**Option B: Custom Mailgun Account (Optional - for higher volume)**
- Sign up at mailgun.com
- Get API credentials
- Add to Ghost: Settings → Email newsletter → Mailgun settings
- Benefits: Higher sending limits, detailed analytics

**Option C: Other Email Services (Advanced)**
- Ghost supports SMTP configuration
- Settings → Email newsletter → SMTP
- Can use SendGrid, AWS SES, etc.

**For MJ_Online Initial Launch:**
Use Ghost Pro's built-in email service (Option A) for simplicity.

**Configuration:**
1. Set sender name: "Michael Jones" or "MJ_Online"
2. Set sender email: `hello@mikejones.online` (or noreply@)
3. Set support email: `support@mikejones.online` (or same as sender)
4. Test email delivery:
   - Settings → Email newsletter → Send test email
   - Enter your personal email
   - Verify receipt

**Email Domain Authentication (Important for Deliverability):**
1. Ghost provides DNS records for email authentication
2. Add these to GoDaddy DNS:
   - SPF record (TXT)
   - DKIM record (TXT)
   - DMARC record (TXT)
3. Located in: Settings → Email newsletter → Email authentication
4. Copy each record and add to GoDaddy DNS

---

## Task 4: Configure Initial Ghost Pro Settings

**Navigate to:** Ghost Pro Admin → Settings

### General Settings

**Settings → General:**

1. **Title & Description:**
   - Site title: "Michael Jones" or "MJ_Online"
   - Site description: "AI researcher, software engineer, and builder of intelligent systems"

2. **Timezone:**
   - Set to: "America/Los_Angeles" (or user's actual timezone)
   - Used for scheduling posts and analytics

3. **Publication Language:**
   - Language: English
   - Locale: en-US

4. **Meta Data:**
   - Site meta title: "Michael Jones - AI Implementation Expert and LLM Integration Specialist"
   - Site meta description: "Portfolio and writings on artificial intelligence, machine learning, and software engineering"

5. **Social Accounts:**
   - Twitter/X: @[username] (if available)
   - Facebook: [URL] (if available)
   - GitHub: https://github.com/[username]
   - LinkedIn: https://linkedin.com/in/[username]
   - Note: Actual usernames to be provided by user

### Design Settings

**Settings → Design:**

1. **Branding:**
   - Upload logo (if available) - can skip for now
   - Upload icon/favicon (if available) - can skip for now
   - Accent color: Choose AI-forward color (suggest: #4F46E5 or similar tech blue)

2. **Navigation:**
   - Primary navigation:
     - Home (/)
     - Projects (/tag/projects/)
     - Writing (/tag/writing/)
     - About (/about/)
     - Resume (/resume/)
   - Secondary navigation:
     - Contact (/contact/)
     - RSS Feed (/rss/)

3. **Theme:**
   - Default theme: Casper (Ghost default) initially
   - Will be replaced after Theme Research completion (Task 5)
   - After theme decision: Settings → Design → Change theme

### Membership & Access

**Settings → Membership:**

1. **Subscription Access:**
   - For now: Keep default (Free access)
   - Future: Can enable paid subscriptions when ready

2. **Portal Settings:**
   - Enable membership: Yes (for newsletter subscriptions)
   - Configure sign-up options:
     - Free newsletter subscription: Enabled
     - Allow comments: Enabled (if desired)

### Newsletter Settings

**Settings → Newsletter:**

1. **Default Newsletter:**
   - Name: "MJ_Online Newsletter" or "AI Insights"
   - Description: "Updates on AI research, projects, and insights"
   - Subscribe on signup: Yes

2. **Email Design:**
   - Header: Use site title and description
   - Footer: Include social links and unsubscribe

### Integrations

**Settings → Integrations:**

1. **Analytics:**
   - Ghost Analytics: Enabled (built-in)
   - External analytics: Can add later (Google Analytics 4, Plausible, etc.)

2. **ActivityPub:**
   - Enable after ActivityPub research (Task 8) completion
   - Settings → ActivityPub → Enable
   - Configure federation settings based on Task 8 recommendations

3. **Comments:**
   - Use Ghost native comments (default)
   - Or integrate Disqus/other if preferred

### Code Injection

**Settings → Code injection:**

Skip for now - used for:
- Custom analytics scripts
- Custom fonts
- Custom CSS/JavaScript
- Can configure later as needed

---

## Verification Checklist

After completing Tasks 2-4, verify:

### Domain (Task 2):
- [ ] Custom domain configured in Ghost
- [ ] DNS records added to GoDaddy
- [ ] Domain verification successful in Ghost
- [ ] Site accessible at mikejones.online
- [ ] SSL certificate active (https://)
- [ ] WWW redirect configured (if applicable)

### Email (Task 3):
- [ ] Sender email configured
- [ ] Support email configured
- [ ] Email authentication DNS records added
- [ ] Test email sent and received successfully
- [ ] Email deliverability verified (check spam folder)

### Settings (Task 4):
- [ ] Site title and description set
- [ ] Timezone configured correctly
- [ ] Social accounts linked
- [ ] Navigation menus configured
- [ ] Accent color set
- [ ] Membership/newsletter enabled
- [ ] Portal settings configured

---

## Common Issues & Troubleshooting

### Domain Issues:
- **DNS not propagating:** Wait 1-2 hours, check with `dig` or dnschecker.org
- **SSL certificate pending:** Ghost provisions automatically, may take 10-30 minutes
- **WWW not redirecting:** Add CNAME record for www subdomain

### Email Issues:
- **Test emails going to spam:** Add SPF/DKIM/DMARC records to GoDaddy DNS
- **Email not sending:** Verify sender email is from custom domain
- **Authentication failing:** Double-check DNS TXT records copied exactly

### Settings Issues:
- **Navigation not saving:** Check for special characters or invalid URLs
- **Theme not applying:** Ensure theme is compatible with Ghost 6.x
- **Portal not showing:** Check Settings → Membership → Portal enabled

---

## Next Steps After Tasks 2-4

Once browser tasks are complete:

1. **Wait for Theme Research (Task 5):** Agent Beta completing
2. **Wait for ActivityPub Research (Task 8):** Agent Beta completing
3. **Select and Install Theme:** Based on Task 5 recommendations
4. **Configure ActivityPub:** Based on Task 8 recommendations
5. **Create Content:** About page (Task 6 ✓), Resume (Task 7 ✓)
6. **Publish Initial Content:** Add about-page.md and resume-cv.md to Ghost
7. **Test ActivityPub:** Verify federation working
8. **Launch:** Announce site to network

---

## API Alternative (If Browser Unavailable)

Ghost Admin API could potentially be used for some configurations:

**Endpoints:**
- `POST /ghost/api/admin/settings/` - Update settings
- `GET /ghost/api/admin/site/` - Get site info
- `POST /ghost/api/admin/posts/` - Create posts

**However:** Domain configuration, DNS setup, and some settings require Ghost Admin UI access. Browser automation is the most reliable approach for initial setup.

**API Documentation:** https://ghost.org/docs/admin-api/

---

**Status:** This guide is ready. Browser automation can execute Tasks 2-4 once extension connection is established.
