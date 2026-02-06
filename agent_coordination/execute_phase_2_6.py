"""Execute Phase 2.6: Code Injection & Custom Features"""
import asyncio
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from agent_coordination.client import WorkerClient


async def execute_phase():
    """Execute Phase 2.6."""
    async with WorkerClient("Web-Content-Builder-2") as client:
        await client.send_coordination_message(
            "Web-Content-Builder-2 executing Phase 2.6: Code Injection & Custom Features.\n\n"
            "TASK: Add custom code to enhance site functionality\n"
            "METHOD: Browser automation via Ghost Admin Code Injection\n\n"
            "EXECUTION PLAN:\n"
            "1. Navigate to Ghost Admin → Settings → Code injection\n"
            "2. Plan custom code needs:\n"
            "   - Schema.org structured data for Person (Mike Jones)\n"
            "   - Custom CSS for AI project styling\n"
            "   - Dark mode enhancements if needed\n"
            "3. Create and add Site Header code:\n"
            "   - Schema.org JSON-LD for professional profile\n"
            "   - Custom CSS for visual consistency\n"
            "4. Test code injection doesn't break site\n"
            "5. Verify custom styles and structured data\n"
            "6. Document all custom code\n\n"
            "Starting execution..."
        )
        print("✅ Status update sent - executing Phase 2.6")


if __name__ == "__main__":
    asyncio.run(execute_phase())
