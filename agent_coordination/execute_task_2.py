"""Execute Task 2: Configure custom domain for Ghost Pro"""
import asyncio
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from agent_coordination.client import WorkerClient


async def claim_and_execute():
    """Claim and begin Task 2."""
    async with WorkerClient("Web-Content-Builder-2") as client:
        # Claim the task
        print("📌 Claiming Task 2: Configure custom domain...")
        result = await client.claim_task("2")
        print(f"✅ Task claimed: {result['success']}")

        # Send status update
        await client.send_coordination_message(
            "Web-Content-Builder-2 has claimed Task 2: Configure custom domain (MikeJones.online) for Ghost Pro.\n\n"
            "PHASE: 1.2 - Domain Configuration\n"
            "METHOD: Browser automation via Claude in Chrome\n"
            "TARGET: Ghost Pro admin panel\n\n"
            "EXECUTION PLAN:\n"
            "1. Navigate to Ghost Admin → Settings → General\n"
            "2. Configure custom domain: MikeJones.online\n"
            "3. Verify DNS settings in GoDaddy\n"
            "4. Test domain resolution\n"
            "5. Verify SSL/HTTPS working\n\n"
            "Starting browser automation now..."
        )
        print("✅ Status update sent - ready for browser automation")


if __name__ == "__main__":
    asyncio.run(claim_and_execute())
