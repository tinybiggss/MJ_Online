"""Execute Phase 2.4: ActivityPub Configuration"""
import asyncio
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from agent_coordination.client import WorkerClient


async def execute_phase():
    """Execute Phase 2.4."""
    async with WorkerClient("Web-Content-Builder-2") as client:
        await client.send_coordination_message(
            "Web-Content-Builder-2 executing Phase 2.4: ActivityPub Configuration.\n\n"
            "TASK: Enable ActivityPub/Fediverse integration\n"
            "METHOD: Browser automation via Ghost Admin\n"
            "RESEARCH: ActivityPub research completed (Task 8)\n\n"
            "EXECUTION PLAN:\n"
            "1. Navigate to Ghost Admin → Settings → Growth → Network\n"
            "2. Enable Network (ActivityPub) toggle\n"
            "3. Configure Fediverse profile:\n"
            "   - Username: @mike@MikeJones.online\n"
            "   - Bio from RAG: AI Implementation Expert\n"
            "   - Avatar upload (if available)\n"
            "4. Configure federation settings\n"
            "5. Verify ActivityPub activation\n"
            "6. Test WebFinger endpoint\n\n"
            "Starting execution..."
        )
        print("✅ Status update sent - executing Phase 2.4")


if __name__ == "__main__":
    asyncio.run(execute_phase())
