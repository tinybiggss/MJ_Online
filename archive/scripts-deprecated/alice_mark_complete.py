#!/usr/bin/env python3
"""Alice - Formally mark completed tasks in NATS."""

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent / "agent_coordination"))
from agent_coordination.client import WorkerClient


async def mark_completed_tasks():
    """Mark tasks as complete in NATS."""

    print("\n" + "="*80)
    print("📊 ALICE - MARKING COMPLETED TASKS IN NATS")
    print("="*80 + "\n")

    async with WorkerClient("Alice") as worker:
        await worker.register(description="Web Content Builder - Updating task status")

        # Task 1: Resume Download Button (qa-critical-1)
        print("📋 Task 1: qa-critical-1 (Resume Download Button)")
        try:
            await worker.claim_task("qa-critical-1")
            print("   ✅ Claimed")

            result = {
                "summary": "Resume download button added successfully",
                "status": "completed",
                "pdf_url": "https://www.mikejones.online/content/files/2026/02/Mike_Jones_PTPM.pdf",
                "page_url": "https://www.mikejones.online/resume/",
                "features": [
                    "PDF uploaded to Ghost CDN (369KB)",
                    "Download button added using Lexical format",
                    "Analytics tracking configured (gtag + plausible)",
                    "Beautiful gradient design with hover effects",
                    "Live and verified working"
                ],
                "completed_by": "Alice",
                "completion_date": "2026-02-11"
            }

            await worker.complete_task("qa-critical-1", result=result)
            print("   ✅ Marked complete\n")

        except Exception as e:
            print(f"   ⚠️  Error: {str(e)}\n")

        # Task 2: Resume Download Button (resume-button-final) - DUPLICATE
        print("📋 Task 2: resume-button-final (Duplicate - same work)")
        try:
            await worker.claim_task("resume-button-final")
            print("   ✅ Claimed")

            result = {
                "summary": "Resume download button already completed (same as qa-critical-1)",
                "status": "completed",
                "pdf_url": "https://www.mikejones.online/content/files/2026/02/Mike_Jones_PTPM.pdf",
                "page_url": "https://www.mikejones.online/resume/",
                "note": "This was a duplicate task - work already completed",
                "completed_by": "Alice",
                "completion_date": "2026-02-11"
            }

            await worker.complete_task("resume-button-final", result=result)
            print("   ✅ Marked complete\n")

        except Exception as e:
            print(f"   ⚠️  Error: {str(e)}\n")

        # Task 3: Writing Navigation (qa-critical-2-v2) - REQUIRES MANUAL
        print("📋 Task 3: qa-critical-2-v2 (Writing Navigation)")
        try:
            await worker.claim_task("qa-critical-2-v2")
            print("   ✅ Claimed")

            result = {
                "summary": "Writing navigation analyzed - requires manual Ghost Admin UI update",
                "status": "requires_manual_completion",
                "issue": "Ghost API returned 403 Forbidden (owner permissions required)",
                "manual_steps": [
                    "1. Login to Ghost Admin: https://mikejones-online.ghost.io/ghost/",
                    "2. Go to Settings → Navigation",
                    "3. Find 'Writing' menu item",
                    "4. Change label to 'Substack'",
                    "5. Change URL to 'https://resilienttomorrow.substack.com'",
                    "6. Save changes"
                ],
                "estimated_time": "2-3 minutes",
                "api_limitation": "Navigation settings require owner-level permissions",
                "analyzed_by": "Alice",
                "analysis_date": "2026-02-11"
            }

            await worker.complete_task("qa-critical-2-v2", result=result)
            print("   ✅ Marked complete (with manual steps required)\n")

        except Exception as e:
            print(f"   ⚠️  Error: {str(e)}\n")

        # Send coordination message
        await worker.send_coordination_message(
            "📊 Alice completed NATS task status update:\n\n"
            "✅ qa-critical-1: Resume download button - COMPLETE\n"
            "✅ resume-button-final: Duplicate task - COMPLETE\n"
            "⚠️  qa-critical-2-v2: Writing navigation - Analyzed, requires manual update\n\n"
            "All assigned tasks processed. Standing by for next assignment."
        )

        await worker.heartbeat(status="idle", current_task=None)

        print("="*80)
        print("✅ ALL TASKS MARKED IN NATS")
        print("="*80)
        print("\nSummary:")
        print("  ✅ 2 tasks completed (resume button + duplicate)")
        print("  ⚠️  1 task needs manual completion (writing nav)")
        print("  📊 All work properly tracked in NATS")


if __name__ == "__main__":
    asyncio.run(mark_completed_tasks())
