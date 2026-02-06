"""Execute Task 4: Configure initial Ghost Pro settings"""
import asyncio
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from agent_coordination.client import WorkerClient


async def claim_and_execute():
    """Claim and begin Task 4."""
    async with WorkerClient("Web-Content-Builder-2") as client:
        # Claim the task
        print("📌 Claiming Task 4: Configure initial Ghost Pro settings...")
        result = await client.claim_task("4")
        print(f"✅ Task claimed: {result['success']}")

        # Send status update
        await client.send_coordination_message(
            "Web-Content-Builder-2 has claimed Task 4: Configure initial Ghost Pro settings.\n\n"
            "PHASE: 1.4 - Initial Settings Configuration\n"
            "METHOD: Browser automation via Claude in Chrome\n"
            "TARGET: Ghost Pro admin panel → Settings → General\n\n"
            "EXECUTION PLAN:\n"
            "1. Verify publication title: MikeJones.online\n"
            "2. Verify site description from RAG\n"
            "3. Check timezone: Pacific Time (US & Canada)\n"
            "4. Configure social accounts (if not set)\n"
            "5. Verify all general settings\n"
            "6. Save configuration\n\n"
            "Starting browser automation now..."
        )
        print("✅ Status update sent - ready for execution")


if __name__ == "__main__":
    asyncio.run(claim_and_execute())
