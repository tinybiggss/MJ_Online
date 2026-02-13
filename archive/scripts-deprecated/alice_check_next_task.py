#!/usr/bin/env python3
"""Alice checks for next task priority"""

import asyncio
import sys
sys.path.insert(0, '/Users/michaeljones/Dev/MJ_Online')

from agent_coordination.client import WorkerClient


async def main():
    async with WorkerClient("Alice-Autonomous") as worker:
        # Send status update
        await worker.send_coordination_message(
            "📊 ALICE STATUS UPDATE\n\n"
            "Phase 3.0.4 (Resume Page): ✅ COMPLETE\n"
            "  • Live at: https://www.mikejones.online/resume-2/\n"
            "  • Completion report: /PHASE-3.0.4-COMPLETION-REPORT.md\n\n"
            "Roadmap Check:\n"
            "  • Phase 3.0.5 - Projects Landing Page (⚪ Ready to Start)\n"
            "  • Phase 3.0.6 - Homepage (⚪ Ready to Start - most complex)\n\n"
            "Questions for Morgan/Mike:\n"
            "  1. Which phase should we tackle next?\n"
            "  2. Projects Landing Page needs:\n"
            "     - Project thumbnails/images\n"
            "     - Links to case studies (NeighborhoodShare, Local LLM published)\n"
            "  3. Homepage needs:\n"
            "     - Professional headshot (already uploaded ✅)\n"
            "     - Project highlights/featured work\n\n"
            "Alice standing by for direction. Can start either phase once Debbie creates PAGE_SPEC."
        )

        await worker.heartbeat(status="idle", current_task=None)

        print("\n\n✅ Alice ready for next assignment")


if __name__ == "__main__":
    asyncio.run(main())
