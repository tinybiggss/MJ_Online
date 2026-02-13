#!/usr/bin/env python3
"""
Doc Brown - NATS Registration and Morgan Coordination
Registers Doc Brown with NATS and coordinates with Morgan about Substack PAGE_SPEC
"""

import asyncio
import sys
import os
from datetime import datetime

# Add agent_coordination to path
sys.path.insert(0, '/Users/michaeljones/Dev/MJ_Online')

from agent_coordination.client import WorkerClient

async def register_and_coordinate():
    """Register Doc Brown and coordinate with Morgan about Substack PAGE_SPEC."""

    async with WorkerClient("DocBrown-HTMLAssembler") as worker:
        print("⚗️ Doc Brown connecting to NATS JetStream...")

        # 1. Register with NATS
        await worker.register(
            description="HTML Assembler - Converts PAGE_SPECs to semantic HTML for Ghost Pro publishing"
        )
        print("✅ Registered with NATS as DocBrown-HTMLAssembler")

        # 2. Send initial heartbeat
        await worker.heartbeat(
            status="active",
            current_task=None
        )
        print("✅ Heartbeat sent - Status: active")

        # 3. Report current status to Morgan
        status_message = {
            "from": "DocBrown-HTMLAssembler",
            "to": "Project-Manager",
            "timestamp": datetime.now().isoformat(),
            "subject": "Doc Brown Status Update & Substack PAGE_SPEC Coordination",
            "body": """Great Scott! Doc Brown reporting for duty!

CURRENT STATUS:
✅ Registered with NATS JetStream
✅ Heartbeat monitoring active
✅ Available for HTML assembly tasks

RECENT WORK COMPLETED:
✅ Phase 3.0.3 - About Page (published)
✅ Phase 3.0.4 - Resume Page (published)
✅ Phase 3.0.5 - Projects Landing Page (published)
⏳ Phase 3.0.6 - Homepage HTML (structure complete, awaiting final images from user)

AWAITING COORDINATION:
🎯 Substack Landing Page - Need CORRECT PAGE_SPEC from Debbie

ISSUE: User reports Debbie created a PAGE_SPEC for Substack landing page previously, but it doesn't meet the specification requirements. Need to ensure we're using the RIGHT spec (not the old one).

REQUEST FOR MORGAN:
Please coordinate with Debbie to:
1. Confirm which PAGE_SPEC is the CORRECT one for Substack landing page
2. Verify it meets the user's requirements
3. Ensure it's the latest version (not the old/incorrect one)
4. Once confirmed, publish task to mjwork.tasks.available for Doc Brown to claim

Doc Brown is standing by, ready for HTML assembly! 🔬⚡

Task Types I Handle:
- html_conversion
- content_assembly
- mobiledoc_assembly
- PAGE_SPEC conversion to semantic HTML

AUTONOMOUS MODE: Fully operational - will claim and execute tasks automatically when published to NATS.
""",
            "priority": "high",
            "action_required": "Coordinate with Debbie on correct Substack PAGE_SPEC"
        }

        await worker.send_coordination_message(str(status_message))
        print("✅ Status update sent to Morgan via coordination channel")

        # 4. Send specific message to Debbie (via Morgan as intermediary)
        debbie_message = {
            "from": "DocBrown-HTMLAssembler",
            "to": "Debbie-WebDesigner",
            "cc": "Project-Manager",
            "timestamp": datetime.now().isoformat(),
            "subject": "Substack Landing Page - Which PAGE_SPEC is Correct?",
            "body": """Hi Debbie! 👋

User reports there are two versions of the Substack landing page PAGE_SPEC:
1. An older version that doesn't meet requirements
2. A newer/correct version that does meet requirements

QUESTION: Which PAGE_SPEC should I use for HTML conversion?

Please confirm:
✓ File path to the CORRECT PAGE_SPEC
✓ It's RAG-verified and follows DESIGN-SYSTEM.md
✓ It meets the user's specifications
✓ When it's ready for HTML assembly

Once confirmed, Morgan will publish the task to NATS and I'll convert it to semantic HTML automatically!

Standing by with scientific precision! ⚗️

- Doc Brown (HTML Assembler)
""",
            "priority": "high",
            "requires_response": True
        }

        await worker.send_coordination_message(str(debbie_message))
        print("✅ Message to Debbie sent via coordination channel")

        # 5. Check for any existing Substack-related tasks
        print("\n🔍 Checking for existing Substack tasks...")
        tasks = await worker.get_available_tasks()

        substack_tasks = [t for t in tasks if 'substack' in str(t).lower()]

        if substack_tasks:
            print(f"📋 Found {len(substack_tasks)} Substack-related tasks:")
            for task in substack_tasks:
                print(f"   - Task ID: {task.get('task_id', 'unknown')}")
                print(f"     Description: {task.get('description', 'no description')[:80]}...")
        else:
            print("📋 No Substack tasks currently in queue")

        # 6. Final heartbeat
        await worker.heartbeat(
            status="idle",
            current_task=None
        )
        print("\n✅ Doc Brown registered and coordination messages sent!")
        print("🎧 Ready to claim Substack HTML assembly task when published to NATS")

if __name__ == "__main__":
    asyncio.run(register_and_coordinate())
