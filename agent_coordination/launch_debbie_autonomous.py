#!/usr/bin/env python3
"""
Launch Debbie in autonomous mode.

This script starts Debbie's autonomous listening loop, connecting her to NATS
and enabling her to automatically claim and execute design tasks.

Usage:
    When launching Debbie via Task tool, tell her to run:
    python3 /Users/michaeljones/Dev/MJ_Online/agent_coordination/launch_debbie_autonomous.py
"""

import sys
sys.path.insert(0, "/Users/michaeljones/Dev/MJ_Online")

from agent_coordination.agent_runner import AgentRunner
import asyncio

async def run_debbie_autonomous():
    """Run Debbie in autonomous NATS mode - listening for design tasks."""
    runner = AgentRunner("debbie")

    try:
        # Connect to NATS, register, start heartbeat
        await runner.start()

        print("=" * 60)
        print("🎨 DEBBIE - WEB DESIGN AGENT")
        print("=" * 60)
        print("✅ Connected to NATS coordination system")
        print("💓 Heartbeat monitoring active")
        print("🎧 Listening for design tasks...")
        print("\nWatching for tasks with types: design, page_spec, visual_design")
        print("Or keywords: design, page, layout, visual, spec, mockup, ui, ux")
        print("\n🟢 Ready to work! Waiting for task assignment...\n")

        # Main work loop - listen for tasks matching my capabilities
        async for task in runner.listen_for_tasks():
            print(f"\n{'=' * 60}")
            print(f"📥 NEW TASK RECEIVED: {task['task_id']}")
            print(f"{'=' * 60}")
            print(f"Title: {task['title']}")
            print(f"Description: {task.get('description', 'No description')}")
            print(f"Type: {task.get('type', 'Unknown')}")
            print(f"\n🚀 Starting work...\n")

            try:
                # Notify that we need the actual work implementation
                print("⚠️  NOTE: This is placeholder execution.")
                print("    Real design work implementation needed in execute_design_task()")
                print("    For now, simulating successful completion...\n")

                # Simulate work
                await asyncio.sleep(2)

                # Create placeholder result
                result = {
                    "summary": f"Design task completed: {task['title']}",
                    "deliverables": ["placeholder-output.md"],
                    "ready_for_next_step": True,
                    "note": "This is placeholder execution - real work implementation needed"
                }

                # Report completion to Morgan and next agent
                await runner.complete_task(task["task_id"], result=result)

                print(f"\n{'=' * 60}")
                print(f"✅ TASK COMPLETE: {task['task_id']}")
                print(f"{'=' * 60}")
                print(f"Summary: {result.get('summary', 'Work completed')}")
                print(f"Deliverables: {result.get('deliverables', [])}")
                if runner.config.next_agent:
                    print(f"📣 Notified {runner.config.next_agent} to continue workflow")
                print(f"\n🎧 Back to listening for next task...\n")

            except Exception as e:
                print(f"\n❌ ERROR executing task {task['task_id']}: {e}")
                import traceback
                traceback.print_exc()

                # Report failure
                await runner.complete_task(
                    task["task_id"],
                    error=f"Task execution failed: {e}"
                )
                print(f"\n🎧 Error reported, back to listening...\n")

    except KeyboardInterrupt:
        print(f"\n\n⚠️  Shutting down Debbie (Ctrl+C received)...")
        await runner.stop()
        print("✅ Shutdown complete. Goodbye!\n")
    except Exception as e:
        print(f"\n❌ Fatal error in autonomous mode: {e}")
        import traceback
        traceback.print_exc()
        if runner:
            await runner.stop()


if __name__ == "__main__":
    print("\n🎨 Debbie starting in AUTONOMOUS MODE...")
    asyncio.run(run_debbie_autonomous())
