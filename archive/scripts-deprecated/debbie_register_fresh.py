#!/usr/bin/env python3
"""
Debbie - Fresh NATS registration attempt
"""

import asyncio
import sys
sys.path.insert(0, "/Users/michaeljones/Dev/MJ_Online")

from agent_coordination.client import WorkerClient

async def register():
    """Register with NATS coordination system."""
    print("="*80)
    print("DEBBIE - FRESH NATS REGISTRATION")
    print("="*80)

    async with WorkerClient("debbie") as worker:
        # Register
        print("\n[Step 1/3] Registering with NATS...")
        await worker.register(
            description="Web Design Agent - Design System Architect & UX Specialist"
        )
        print("✅ Registration successful")

        # Send initial heartbeat
        print("\n[Step 2/3] Sending initial heartbeat...")
        await worker.heartbeat(
            status="active",
            current_task=None,
            current_task_title=None
        )
        print("💓 Heartbeat sent")

        # Send coordination message
        print("\n[Step 3/3] Sending coordination message...")
        await worker.send_coordination_message(
            "🎨 Debbie re-registered with NATS coordination system. "
            "SEO audit complete (deliverable: /SEO-AUDIT-REPORT-2026-02-11.md). "
            "Ready for new tasks!"
        )
        print("📣 Coordination message sent")

        print(f"\n{'='*80}")
        print("✅ NATS REGISTRATION COMPLETE")
        print(f"{'='*80}")
        print("\n📊 Agent Status:")
        print("   Agent ID: debbie")
        print("   Status: Active")
        print("   Current Task: None")
        print("   Ready: Yes")
        print("\n🎨 Debbie registered and ready!")

if __name__ == "__main__":
    asyncio.run(register())
