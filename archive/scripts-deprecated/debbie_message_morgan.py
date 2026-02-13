#!/usr/bin/env python3
"""
Debbie sends coordination message to Morgan
"""

import asyncio
import sys
sys.path.insert(0, "/Users/michaeljones/Dev/MJ_Online")

from agent_coordination.client import WorkerClient

async def message_morgan():
    """Send coordination message to Morgan."""
    print("="*80)
    print("DEBBIE → MORGAN: COORDINATION MESSAGE")
    print("="*80)

    async with WorkerClient("debbie") as worker:
        # Send coordination message
        print("\nSending message to Morgan...")
        await worker.send_coordination_message(
            "Debbie → Morgan: Hey Morgan! Mike asked me to review your new PAGE_SPEC design for the Substack page. Looking for your PAGE_SPEC now to compare with my navigation fix approach. User wants BOTH Substacks highlighted (Resilient Tomorrow + Organizational Intelligence) - visible, understood, pleasing. Working autonomously on this evaluation now. 🎨"
        )

        print("✅ Message sent to coordination channel")
        print("\nMorgan will see this message on the NATS coordination channel")
        print("Dashboard: http://localhost:8001")

if __name__ == "__main__":
    asyncio.run(message_morgan())
