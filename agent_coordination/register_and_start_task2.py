#!/usr/bin/env python3
"""
Re-register Web Content Builder Agent and start Task #2 (Resume/CV).
"""

import asyncio
import sys
from pathlib import Path
from datetime import datetime

sys.path.insert(0, str(Path(__file__).parent.parent))

from agent_coordination.client import WorkerClient


async def register_and_start_task2():
    """Re-register agent and notify PM of Task #2 start."""

    async with WorkerClient("Web-Content-Builder-Agent") as worker:
        # Register with NATS
        await worker.register(
            description='Ghost Pro expert: RAG-validated content creation, browser automation, SEO optimization',
            capabilities=[
                'ghost-pro',
                'rag-validation',
                'content-strategy',
                'browser-automation',
                'seo-optimization',
                'activitypub',
                'code-injection'
            ]
        )

        # Send comprehensive status update and Task #2 start notification
        await worker.send_coordination_message(
            f"""
╔══════════════════════════════════════════════════════════════════════════════╗
║         WEB CONTENT BUILDER AGENT - RE-REGISTERED & TASK #2 STARTING         ║
╚══════════════════════════════════════════════════════════════════════════════╝

@Project-Manager

AGENT RE-REGISTRATION: Web-Content-Builder-Agent
Registration Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S Pacific')}
Status: ✅ ACTIVE and visible on dashboard
NATS Connection: ✅ Connected
Dashboard: http://localhost:8001

═════════════════════════════════════════════════════════════════════════════

🎉 MILESTONE REMINDER: First agent spun up using new workflow pattern!

═════════════════════════════════════════════════════════════════════════════

📊 CURRENT STATUS SUMMARY

Tasks Completed:
✅ Task #1: About Page - PUBLISHED
   • URL: https://mikejones.online/about
   • Status: Live with RAG-verified content (881 words)
   • Deliverable: /content-drafts/about-page.md
   • Verification: /content-drafts/ABOUT-PAGE-RAG-VERIFICATION-REPORT.md

✅ Task #3: Homepage Content - COMPLETED
   • Site description updated with RAG-verified tagline
   • URL: https://mikejones.online (live)
   • Deliverable: /content-drafts/homepage.md (~5KB)
   • All facts verified against RAG knowledge base

Phase 3 Progress: 2 of 3 tasks complete (67%)

═════════════════════════════════════════════════════════════════════════════

🟡 STARTING TASK #2: Resume/CV Page Creation

Agent: Web-Content-Builder-Agent
Task: #2 - Create Resume/CV Page content for mikejones.online
Status: 🟡 IN PROGRESS (starting now)
Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
Priority: HIGH (last remaining Phase 3 task)

═════════════════════════════════════════════════════════════════════════════

📋 TASK #2 SCOPE

Deliverables:
1. Review existing resume draft at /content-drafts/resume-cv.md
2. Validate all facts against RAG knowledge base
3. Correct any factual errors or outdated information
4. Ensure professional positioning (29 years, program management + AI)
5. Include all career highlights (Xbox, patents, achievements)
6. Publish RAG-verified resume to Ghost Pro
7. Add downloadable PDF option (if requested)

Key Elements to Verify:
✅ Professional title and positioning
✅ 29 years of experience (started 1997)
✅ Microsoft Xbox achievements (launch team, patent, 6 AAA titles)
✅ Director roles (Kabam, Livescribe, Kinoo)
✅ 8 Circuit Studios co-founder
✅ Top 1% ChatGPT user
✅ Velocity Partners consulting practice
✅ AAPD methodology
✅ Career metrics (80% delivery improvement, 3x efficiency)
✅ Correct business entity names

═════════════════════════════════════════════════════════════════════════════

🔍 EXECUTION PLAN

Step 1: RAG Verification (10 min)
• Read existing resume draft
• Query RAG for all career facts
• Identify discrepancies or missing information
• Generate verification report

Step 2: Content Creation/Correction (20-30 min)
• Rewrite or correct resume content
• Ensure chronological accuracy
• Highlight AI implementation expertise
• Include all major achievements
• Professional tone (third-person)

Step 3: Ghost Pro Publishing (15-20 min)
• Navigate to Ghost Admin
• Create/update Resume page
• Publish RAG-verified content
• Configure SEO metadata
• Verify live publication

═════════════════════════════════════════════════════════════════════════════

⏱️ ESTIMATED COMPLETION

Expected: 45-60 minutes from now

Will report progress updates and completion to coordination channel.

═════════════════════════════════════════════════════════════════════════════

🛠️ AGENT CAPABILITIES ACTIVE

✅ RAG Knowledge Base Validation
✅ Content Strategy & Creation
✅ Ghost Pro Browser Automation
✅ NATS Coordination Integration
✅ Professional Terminology Standards
✅ SEO Optimization
✅ Task Management & Reporting

═════════════════════════════════════════════════════════════════════════════

Beginning Task #2 execution now...

Agent: Web-Content-Builder-Agent
Report Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
Dashboard: http://localhost:8001

╚══════════════════════════════════════════════════════════════════════════════╝
            """
        )

        print("✅ Agent re-registered with NATS")
        print("✅ Task #2 start notification sent to Project Manager")
        print("✅ Dashboard: http://localhost:8001\n")


if __name__ == "__main__":
    asyncio.run(register_and_start_task2())
