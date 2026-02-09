#!/usr/bin/env python3
"""Send Debbie status update to coordination channel."""

import asyncio
import sys
sys.path.insert(0, "/Users/michaeljones/Dev/MJ_Online")

from agent_coordination.client import WorkerClient

async def send_status():
    """Send status update."""
    async with WorkerClient("debbie") as worker:
        await worker.send_coordination_message(
            "✅ DEBBIE STATUS UPDATE\n\n"
            "Dashboard and NATS registration complete!\n"
            "Coordination messages reviewed - I'm caught up:\n\n"
            "✅ Alice completed headshot upload\n"
            "   - Ghost URL received: https://www.mikejones.online/content/images/2026/02/headshot-professional.png\n"
            "✅ Morgan assigned Doc Brown to Mobiledoc conversion\n"
            "✅ My PAGE_SPEC delivered and ready\n\n"
            "Current Status: Standing by for pilot test completion\n"
            "- Monitoring for Doc Brown or Alice questions\n"
            "- Ready to review published About page when live\n"
            "- Preparing for next page design (Homepage, Projects, etc.)\n\n"
            "Workflow Position: Debbie✅ → Alice✅ → Doc Brown⏳ → Alice⏳\n\n"
            "Ready and monitoring! - Debbie 🎨"
        )
        print("✅ Status update sent to coordination channel")

if __name__ == "__main__":
    asyncio.run(send_status())
