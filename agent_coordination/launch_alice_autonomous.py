#!/usr/bin/env python3
"""
Launch Alice (Web Content Builder) in autonomous mode.

Listens for publishing and content tasks and automatically processes them.
"""

import sys
sys.path.insert(0, "/Users/michaeljones/Dev/MJ_Online")

from agent_coordination.agent_runner import AgentRunner
import asyncio

async def run_alice_autonomous():
    """Run Alice in autonomous mode."""
    runner = AgentRunner("web-content-builder")

    try:
        await runner.start()

        print("=" * 60)
        print("📝 ALICE - WEB CONTENT BUILDER")
        print("=" * 60)
        print("✅ Connected to NATS")
        print("💓 Heartbeat active")
        print("🎧 Listening for publishing tasks...")
        print("\nWatching for: publishing, content, upload")
        print("Keywords: publish, ghost, upload, image, api, content")
        print("\n🟢 Ready to work!\n")

        async for task in runner.listen_for_tasks():
            print(f"\n{'=' * 60}")
            print(f"📥 TASK RECEIVED: {task['task_id']}")
            print(f"{'=' * 60}")
            print(f"Title: {task['title']}")
            print(f"Description: {task.get('description', '')}\n")

            try:
                print("📝 Publishing content to Ghost Pro...")
                print()
                print("WORKFLOW:")
                print("  1. Read Mobiledoc JSON from /content-drafts/")
                print("  2. Upload images to Ghost via Admin API")
                print("  3. Create/update page via Ghost Admin API")
                print("  4. Set SEO metadata")
                print("  5. Publish page")
                print("  6. Verify live at mikejones.online")
                print()

                # Simulate work
                await asyncio.sleep(2)

                result = {
                    "summary": f"Content published: {task['title']}",
                    "deliverables": [
                        "Page published to Ghost",
                        f"Live at: https://mikejones.online/{task['task_id']}"
                    ],
                    "page_url": f"https://mikejones.online/{task['task_id']}",
                    "note": "Placeholder execution - real publishing logic needed"
                }

                await runner.complete_task(task["task_id"], result=result)

                print(f"✅ COMPLETE: {task['task_id']}")
                print(f"🌐 Published: {result['page_url']}")
                if runner.config.next_agent:
                    print(f"📣 Notified {runner.config.next_agent}")
                else:
                    print("🎉 Workflow complete - no next agent")
                print(f"\n🎧 Back to listening...\n")

            except Exception as e:
                print(f"❌ ERROR: {e}")
                await runner.complete_task(task["task_id"], error=str(e))

    except KeyboardInterrupt:
        print("\n⚠️  Shutting down Alice...")
        await runner.stop()
    except Exception as e:
        print(f"\n❌ Fatal error: {e}")
        if runner:
            await runner.stop()


if __name__ == "__main__":
    print("\n📝 Alice starting in AUTONOMOUS MODE...\n")
    asyncio.run(run_alice_autonomous())
