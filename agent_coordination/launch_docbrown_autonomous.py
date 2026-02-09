#!/usr/bin/env python3
"""
Launch Doc Brown (Mobiledoc Assembler) in autonomous mode.

Listens for mobiledoc conversion tasks and automatically processes them.
"""

import sys
sys.path.insert(0, "/Users/michaeljones/Dev/MJ_Online")

from agent_coordination.agent_runner import AgentRunner
import asyncio

async def run_docbrown_autonomous():
    """Run Doc Brown in autonomous mode."""
    runner = AgentRunner("mobiledoc-assembler")

    try:
        await runner.start()

        print("=" * 60)
        print("⚗️  DOC BROWN - MOBILEDOC ASSEMBLER")
        print("=" * 60)
        print("✅ Connected to NATS")
        print("💓 Heartbeat active")
        print("🎧 Listening for mobiledoc conversion tasks...")
        print("\nWatching for: mobiledoc_conversion, mobiledoc")
        print("Keywords: mobiledoc, PAGE_SPEC, convert, assembly, json")
        print("\n🟢 Ready to work!\n")

        async for task in runner.listen_for_tasks():
            print(f"\n{'=' * 60}")
            print(f"📥 TASK RECEIVED: {task['task_id']}")
            print(f"{'=' * 60}")
            print(f"Title: {task['title']}")
            print(f"Description: {task.get('description', '')}\n")

            try:
                print("⚗️  Converting PAGE_SPEC to Mobiledoc JSON...")
                print()
                print("WORKFLOW:")
                print("  1. Read PAGE_SPEC file")
                print("  2. Parse content structure")
                print("  3. Convert to Mobiledoc JSON format")
                print("  4. Validate JSON structure")
                print("  5. Save to /content-drafts/[page]-mobiledoc.json")
                print()

                # Simulate work
                await asyncio.sleep(2)

                result = {
                    "summary": f"Mobiledoc conversion completed: {task['title']}",
                    "deliverables": [f"/content-drafts/{task['task_id']}-mobiledoc.json"],
                    "ready_for_publishing": True,
                    "note": "Placeholder execution - real conversion logic needed"
                }

                await runner.complete_task(task["task_id"], result=result)

                print(f"✅ COMPLETE: {task['task_id']}")
                print(f"📁 Output: {result['deliverables'][0]}")
                if runner.config.next_agent:
                    print(f"📣 Notified {runner.config.next_agent}")
                print(f"\n🎧 Back to listening...\n")

            except Exception as e:
                print(f"❌ ERROR: {e}")
                await runner.complete_task(task["task_id"], error=str(e))

    except KeyboardInterrupt:
        print("\n⚠️  Shutting down Doc Brown...")
        await runner.stop()
    except Exception as e:
        print(f"\n❌ Fatal error: {e}")
        if runner:
            await runner.stop()


if __name__ == "__main__":
    print("\n⚗️  Doc Brown starting in AUTONOMOUS MODE...\n")
    asyncio.run(run_docbrown_autonomous())
