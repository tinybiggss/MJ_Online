"""Execute Task 3: Configure email delivery for Ghost Pro"""
import asyncio
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from agent_coordination.client import WorkerClient


async def claim_and_execute():
    """Claim and begin Task 3."""
    async with WorkerClient("Web-Content-Builder-2") as client:
        # Claim the task
        print("📌 Claiming Task 3: Configure email delivery...")
        result = await client.claim_task("3")
        print(f"✅ Task claimed: {result['success']}")

        # Send status update
        await client.send_coordination_message(
            "Web-Content-Builder-2 has claimed Task 3: Configure email delivery for Ghost Pro.\n\n"
            "PHASE: 1.3 - Email Delivery Configuration\n"
            "METHOD: Browser automation via Claude in Chrome\n"
            "TARGET: Ghost Pro admin panel → Settings → Email newsletter\n\n"
            "EXECUTION PLAN:\n"
            "1. Navigate to Ghost Admin → Settings → Email newsletter\n"
            "2. Review current email configuration\n"
            "3. Configure Mailgun integration (if needed)\n"
            "4. Set sender address and domain\n"
            "5. Test email delivery\n"
            "6. Verify newsletter functionality\n\n"
            "Starting browser automation now..."
        )
        print("✅ Status update sent - ready for execution")


if __name__ == "__main__":
    asyncio.run(claim_and_execute())
