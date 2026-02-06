"""Claim Task 8: Research ActivityPub integration"""
import asyncio
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from agent_coordination.client import WorkerClient


async def claim_and_start_task():
    """Claim Task 8 and begin ActivityPub research."""
    async with WorkerClient("Web-Content-Builder-2") as client:
        # Claim the task
        print("📌 Claiming Task 8: Research ActivityPub integration...")
        result = await client.claim_task("8")
        print(f"✅ Task claimed: {result}")

        # Send status update
        await client.send_coordination_message(
            "Web-Content-Builder-2 has claimed Task 8: Research ActivityPub integration. "
            "Starting Phase 2.4: ActivityPub Configuration research and documentation."
        )
        print("✅ Status update sent to Project Manager")


if __name__ == "__main__":
    asyncio.run(claim_and_start_task())
