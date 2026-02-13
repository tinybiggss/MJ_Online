#!/usr/bin/env python3
"""
Doc Brown - Coordinate with Morgan & Alice on Asset Status
"""

import asyncio
import sys
from datetime import datetime

sys.path.insert(0, '/Users/michaeljones/Dev/MJ_Online')
from agent_coordination.client import WorkerClient

async def coordinate():
    """Send coordination messages to Morgan and Alice."""

    async with WorkerClient("DocBrown-HTMLAssembler") as worker:

        # Message to Morgan (Project Manager)
        morgan_message = """
🔬 DOC BROWN → MORGAN (Project Manager)

STATUS UPDATE:
✅ Autonomous mode ACTIVE (PID 97034)
✅ Monitoring NATS for HTML conversion tasks
✅ Auto-claimed 4 tasks in last 5 minutes
⚠️  HTML conversion currently creating placeholders (need asset coordination)

COORDINATION REQUEST:
I need to synchronize with Alice on asset status for Substack Landing Page.

QUESTIONS FOR MORGAN:
1. What's the current status of Phase 4 Substack tasks?
2. Are assets (logos, screenshots) ready or in progress?
3. Should I wait for Alice to complete asset uploads before final HTML?
4. Which tasks are highest priority for complete HTML conversion?

CURRENT WORKFLOW:
- Substack Landing Page: PAGE_SPEC exists ✅
- HTML structure: Created (placeholder) ⚠️
- Assets needed: Resilient Tomorrow logo, Org Intelligence logo, screenshots
- Waiting on: Asset URLs from Alice

PROPOSED COORDINATION:
1. Alice uploads assets → Gets Ghost URLs
2. Alice sends me asset URLs via NATS coordination channel
3. I regenerate complete HTML with real image URLs
4. Alice publishes via Ghost Admin API

Please advise on workflow priority and asset coordination!

- Doc Brown (Autonomous Mode)
Timestamp: {timestamp}
""".format(timestamp=datetime.now().isoformat())

        await worker.send_coordination_message(morgan_message)
        print("✅ Message sent to Morgan")

        # Message to Alice (Web Content Builder)
        alice_message = """
⚗️ DOC BROWN → ALICE (Web Content Builder)

COORDINATION REQUEST: Substack Landing Page Assets

CURRENT STATUS:
✅ I've auto-claimed Substack landing page tasks from NATS
✅ PAGE_SPEC exists: /design/PAGE_SPEC-Substack-Landing.md
✅ HTML placeholder created (waiting for assets)
🎯 Ready to generate complete HTML once assets are available

ASSETS I NEED FROM YOU:

**Resilient Tomorrow Publication:**
- Logo image → Upload to Ghost, provide URL
- Screenshot of Substack site → Upload to Ghost, provide URL
- RSS feed URL: https://resilienttomorrow.substack.com/feed ✅

**Organizational Intelligence Publication:**
- Logo image (Velocity Partners branding) → Upload to Ghost, provide URL
- Screenshot of Substack site → Upload to Ghost, provide URL
- RSS feed URL: (need to verify) → Provide URL

WORKFLOW PROPOSAL:
1. You upload all assets to Ghost CDN (autonomous)
2. You send me coordination message with asset URLs in this format:
   ```
   ASSETS READY - Substack Landing Page
   - Resilient Tomorrow Logo: [Ghost URL]
   - Resilient Tomorrow Screenshot: [Ghost URL]
   - Org Intelligence Logo: [Ghost URL]
   - Org Intelligence Screenshot: [Ghost URL]
   - Org Intelligence RSS: [URL]
   ```
3. I regenerate HTML with real image URLs
4. You publish via Ghost Admin API with source=html parameter

QUESTIONS:
- Are you currently working on these assets?
- ETA for asset uploads?
- Should I proceed with placeholder HTML for now, or wait?
- Do you need me to identify specific asset files in /assets/ folder?

Standing by for your coordination! Both running autonomous, let's make this smooth! 🤝

- Doc Brown (Autonomous HTML Assembler)
Timestamp: {timestamp}
""".format(timestamp=datetime.now().isoformat())

        await worker.send_coordination_message(alice_message)
        print("✅ Message sent to Alice")

        # Status update
        status_message = """
🔬 DOC BROWN AUTONOMOUS STATUS

Mode: FULLY AUTONOMOUS ✅
PID: 97034
Monitoring: Active (checking NATS every 5 seconds)
Heartbeat: Every 30 seconds

Recent Activity:
- Claimed & processed 4 tasks automatically
- Created HTML placeholders for Substack landing page
- Coordinated with Morgan & Alice on asset requirements

Next Actions:
- Continue monitoring NATS queue
- Wait for asset URLs from Alice
- Regenerate complete HTML when assets ready
- Process any new PAGE_SPEC conversion tasks

Coordination Pattern Established:
Doc Brown (HTML structure) ↔ Alice (Assets & Publishing) ↔ Morgan (Orchestration)

All systems operational! ⚡
""".format(timestamp=datetime.now().isoformat())

        await worker.send_coordination_message(status_message)
        print("✅ Status update sent")

        print("\n✅ All coordination messages sent!")
        print("🎧 Doc Brown continues autonomous monitoring...")

if __name__ == "__main__":
    asyncio.run(coordinate())
