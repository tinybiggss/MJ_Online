#!/usr/bin/env python3
"""
Debbie creates NATS task for OG image file creation
(Phase 1 of SEO implementation)
"""

import asyncio
import sys
from datetime import datetime
sys.path.insert(0, "/Users/michaeljones/Dev/MJ_Online")

from agent_coordination.client import TaskPublisher

async def create_ogimage_task():
    """Create task for OG image creation."""
    print("="*80)
    print("DEBBIE - CREATING OG IMAGE TASK")
    print("="*80)

    async with TaskPublisher() as publisher:
        task_data = {
            "task_id": "phase4-seo-ogimages",
            "title": "Phase 4 SEO: Create 7 OG Image Files (1200x630px)",
            "description": """Create Open Graph image files for social media sharing optimization.

**Background:**
SEO audit (deliverable: /SEO-AUDIT-REPORT-2026-02-11.md) identified critical gap:
NO og:image tags on any pages = social media previews show nothing = 1/10 social sharing score.

This is PHASE 1 (Critical) of 5-phase SEO implementation plan.

**Requirements:**

**Image Specifications:**
- Dimensions: 1200x630px (Facebook/LinkedIn/Twitter optimal)
- Format: PNG or JPG (PNG preferred for quality)
- File size: Under 1MB each (optimization required)
- Safe area: Keep critical content within center 1200x600px (Twitter crops edges)

**7 Images to Create:**

1. **Homepage OG Image** (mikejones.online/)
   - Headline: "Mike Jones - AI Implementation Expert"
   - Subheading: "29 Years in Tech | LLM Integration Specialist"
   - Visual: Professional, modern, tech-forward aesthetic
   - Brand: Neon Cyan (#00D9FF) accent color

2. **About Page OG Image** (/about/)
   - Headline: "About Mike Jones"
   - Subheading: "AI Implementation Expert & LLM Integration Specialist"
   - Visual: Professional portrait-style (use headshot if available)
   - Brand: Consistent with design system

3. **Resume Page OG Image** (/resume/)
   - Headline: "Mike Jones - Resume"
   - Subheading: "29 Years | Xbox, Kabam, Livescribe | AI Expert"
   - Visual: Career timeline or achievement highlights
   - Brand: Professional, credible

4. **Projects Page OG Image** (/projects/)
   - Headline: "Projects - Mike Jones"
   - Subheading: "AI Memory System | Local LLM | NeighborhoodShare"
   - Visual: Grid or showcase of project logos/screenshots
   - Brand: Tech-forward, innovative

5. **NeighborhoodShare Case Study OG Image**
   - Headline: "NeighborhoodShare - Tool Lending Platform"
   - Subheading: "Community Resilience | React + Node.js"
   - Visual: App screenshot or concept visualization
   - Brand: Community-focused, warm

6. **Local LLM Setup Case Study OG Image**
   - Headline: "Offline AI System Setup"
   - Subheading: "Complete Local LLM Configuration Guide"
   - Visual: System architecture or terminal/code aesthetic
   - Brand: Technical, practical

7. **AI Memory System Case Study OG Image**
   - Headline: "AI Memory System"
   - Subheading: "RAG-Powered Persistent Context for Claude"
   - Visual: Data flow diagram or AI/memory concept
   - Brand: Innovative, AI-forward

**Design Guidelines:**

**Typography:**
- Primary font: Inter (design system standard)
- Headline: Bold, 72-96px
- Subheading: Regular, 36-48px
- High contrast text (white on dark or dark on light)

**Color Palette:**
- Neon Cyan: #00D9FF (primary accent, CTAs, highlights)
- Charcoal: #1A1A1A (dark backgrounds)
- Off-White: #F5F5F5 (light backgrounds)
- Indigo: #4F46E5 (Velocity Partners brand color - use sparingly)

**Layout:**
- Left or center-aligned text
- Generous white space
- Brand consistency across all 7 images
- Professional polish (no stock photo clichés)

**Tools Recommended:**
- Canva Pro (templates available for 1200x630)
- Figma (design system consistency)
- Adobe Photoshop/Illustrator (if available)

**Asset Sources:**
- Mike's headshot: (check /assets/ directory)
- Project screenshots: (check /assets/projects/)
- Velocity Partners logo: /assets/brand/VP v2 Final.png
- Resilient Tomorrow branding: (use Neon Cyan)

**Deliverables:**

**Files to create:**
1. `og-image-homepage.png` (1200x630px)
2. `og-image-about.png` (1200x630px)
3. `og-image-resume.png` (1200x630px)
4. `og-image-projects.png` (1200x630px)
5. `og-image-neighborhoodshare.png` (1200x630px)
6. `og-image-local-llm.png` (1200x630px)
7. `og-image-ai-memory.png` (1200x630px)

**Upload to Ghost CDN:**
- Use Ghost Admin API: POST /ghost/api/admin/images/upload/
- Or use Ghost Admin UI: Settings → Labs → Upload images
- Collect CDN URLs for each image (needed for Phase 2 meta tag implementation)

**Output:**
- File: `/og-images-cdn-urls.json` with mapping:
  ```json
  {
    "homepage": "https://cdn.ghost.io/.../og-image-homepage.png",
    "about": "https://cdn.ghost.io/.../og-image-about.png",
    ...
  }
  ```

**Quality Checklist:**
- [ ] All images exactly 1200x630px
- [ ] File sizes under 1MB each
- [ ] Text readable at thumbnail size (200x105px preview)
- [ ] Consistent branding across all 7 images
- [ ] High contrast (pass accessibility check)
- [ ] No copyright violations (all assets original or licensed)
- [ ] Professional polish (no design mistakes or typos)

**Testing:**
After upload, test with:
- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/
- Twitter Card Validator: https://cards-dev.twitter.com/validator

**Dependencies:**
- SEO Audit Report: /SEO-AUDIT-REPORT-2026-02-11.md (context)
- Design System: (follow design system color/typography standards)
- Assets: Check /assets/ directory for existing images/logos

**Blocks:**
- Phase 2: Add OG meta tags (blocked until these images exist + uploaded)

**Priority:** HIGH - Critical for social sharing optimization (+900% improvement)

**Estimated Time:** 2-3 hours
- Image creation: 1.5-2 hours (7 images @ 15-20 min each)
- Upload + URL collection: 30 minutes
- Testing: 30 minutes

**Assignee Recommendation:** Alice (has design tools + Ghost API access)

**Success Criteria:**
- 7 high-quality og:images created and uploaded
- All CDN URLs documented in /og-images-cdn-urls.json
- Images tested and displaying correctly in social debuggers
- Ready for Phase 2 meta tag implementation
""",
            "status": "available",
            "owner": None,
            "blocked_by": [],
            "priority": "high",
            "created_at": datetime.utcnow().isoformat()
        }

        print("\n[Step 1/3] Publishing task to NATS...")
        print(f"   Task ID: {task_data['task_id']}")
        print(f"   Title: {task_data['title']}")
        print(f"   Priority: {task_data['priority']}")

        result = await publisher.publish_task(task_data)

        print(f"✅ Task published successfully")
        print(f"   Sequence: {result.get('sequence')}")
        print(f"   Stream: {result.get('stream')}")

        print(f"\n{'='*80}")
        print("✅ OG IMAGE TASK CREATED")
        print(f"{'='*80}")
        print("\n📊 Task Summary:")
        print("   Task ID: phase4-seo-ogimages")
        print("   Images: 7 (1200x630px each)")
        print("   Priority: HIGH")
        print("   Assignee: Alice (recommended)")
        print("   Estimated: 2-3 hours")
        print("\n📋 Deliverables:")
        print("   • 7 og:image PNG files")
        print("   • Uploaded to Ghost CDN")
        print("   • URLs in /og-images-cdn-urls.json")
        print("\n🎯 This is Phase 1 of SEO implementation")
        print("   (Blocks Phase 2: Add OG meta tags)")
        print("\n🎨 Task ready for claiming!")

if __name__ == "__main__":
    asyncio.run(create_ogimage_task())
