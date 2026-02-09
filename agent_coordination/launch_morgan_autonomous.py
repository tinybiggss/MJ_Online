#!/usr/bin/env python3
"""
Launch Morgan (Project Manager) in autonomous mode.

Monitors task completions and orchestrates workflows automatically.
"""

import sys
sys.path.insert(0, "/Users/michaeljones/Dev/MJ_Online")

from agent_coordination.agent_runner import AgentRunner
from agent_coordination.client import TaskPublisher, MonitorClient
import asyncio
from datetime import datetime

async def run_morgan_autonomous():
    """Run Morgan in autonomous mode - workflow orchestration."""
    runner = AgentRunner("pm")

    try:
        await runner.start()

        print("=" * 60)
        print("📊 MORGAN - PROJECT MANAGER (ORCHESTRATOR)")
        print("=" * 60)
        print("✅ Connected to NATS")
        print("💓 Heartbeat active")
        print("🎧 Monitoring workflow completions...")
        print("\nWatching for: Task completions, agent coordination")
        print("Role: Orchestrate workflows, update roadmap, publish next tasks")
        print("\n🟢 Ready to coordinate!\n")

        # Morgan's main loop: monitor completions and orchestrate
        async with MonitorClient() as monitor, TaskPublisher() as publisher:

            # Track what tasks have been processed
            processed_tasks = set()

            while True:
                # Check for completed tasks
                tasks = await monitor.get_all_tasks(status="completed")

                for task in tasks:
                    task_id = task["task_id"]

                    # Skip if already processed
                    if task_id in processed_tasks:
                        continue

                    print(f"\n📥 TASK COMPLETED: {task_id}")
                    print(f"   By: {task.get('owner', 'Unknown')}")
                    print(f"   Title: {task.get('title', 'Untitled')}")

                    # Mark as processed
                    processed_tasks.add(task_id)

                    # Orchestrate next step based on task type
                    await orchestrate_next_step(task, publisher, runner)

                # Update heartbeat
                await runner.heartbeat(
                    status="active",
                    current_task=f"Monitoring {len(processed_tasks)} completed tasks"
                )

                # Poll every 10 seconds
                await asyncio.sleep(10)

    except KeyboardInterrupt:
        print("\n⚠️  Shutting down Morgan...")
        await runner.stop()
    except Exception as e:
        print(f"\n❌ Fatal error: {e}")
        import traceback
        traceback.print_exc()
        if runner:
            await runner.stop()


async def orchestrate_next_step(completed_task, publisher, runner):
    """Determine and publish next task in workflow."""

    task_id = completed_task["task_id"]
    task_type = completed_task.get("type", "")
    result = completed_task.get("result", {})

    print(f"\n🤔 Orchestrating next step for {task_id}...")

    # Design task completed → Publish mobiledoc conversion task
    if task_type == "design" or "design" in task_id.lower():
        if result.get("ready_for_next_step"):
            print("   → Design complete, publishing Mobiledoc conversion task")

            next_task = {
                "task_id": f"mobiledoc-{task_id}",
                "title": f"Convert {completed_task['title']} to Mobiledoc",
                "description": f"Convert PAGE_SPEC from {task_id} to Mobiledoc JSON format for Ghost publishing.",
                "type": "mobiledoc_conversion",
                "status": "available",
                "priority": "high",
                "created_at": datetime.now().isoformat(),
                "owner": None,
                "blocked_by": []
            }

            await publisher.publish_task(next_task)
            print(f"   ✅ Published: {next_task['task_id']}")

            await runner.send_coordination_message(
                f"Morgan: Published mobiledoc conversion task {next_task['task_id']} "
                f"following completion of design task {task_id}"
            )

    # Mobiledoc conversion completed → Publish publishing task
    elif task_type == "mobiledoc_conversion" or "mobiledoc" in task_id.lower():
        if result.get("ready_for_publishing"):
            print("   → Mobiledoc complete, publishing Ghost publishing task")

            next_task = {
                "task_id": f"publish-{task_id}",
                "title": f"Publish {completed_task['title']} to Ghost",
                "description": f"Publish Mobiledoc JSON from {task_id} to Ghost Pro via Admin API.",
                "type": "publishing",
                "status": "available",
                "priority": "high",
                "created_at": datetime.now().isoformat(),
                "owner": None,
                "blocked_by": []
            }

            await publisher.publish_task(next_task)
            print(f"   ✅ Published: {next_task['task_id']}")

            await runner.send_coordination_message(
                f"Morgan: Published publishing task {next_task['task_id']} "
                f"following Mobiledoc conversion {task_id}"
            )

    # Publishing completed → Workflow done
    elif task_type == "publishing" or "publish" in task_id.lower():
        print("   → Publishing complete - workflow finished!")
        print("   📊 Updating roadmap...")

        await runner.send_coordination_message(
            f"Morgan: Workflow complete for {task_id}. "
            f"Page published to {result.get('page_url', 'Ghost Pro')}"
        )

        # TODO: Update roadmap file
        print("   ⚠️  TODO: Update /plans/roadmap.md with completion status")

    else:
        print(f"   ℹ️  No automatic next step defined for type: {task_type}")


if __name__ == "__main__":
    print("\n📊 Morgan starting in AUTONOMOUS MODE (Orchestrator)...\n")
    asyncio.run(run_morgan_autonomous())
