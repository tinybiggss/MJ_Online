#!/usr/bin/env python3
"""Morgan - Autonomous Orchestrator (Continuous Monitoring Mode)."""

import asyncio
import sys
from datetime import datetime
from pathlib import Path

sys.path.insert(0, "/Users/michaeljones/Dev/MJ_Online")

from agent_coordination.client import WorkerClient


class AutonomousOrchestrator:
    """Morgan running in autonomous orchestration mode."""

    def __init__(self):
        self.processed_tasks = set()
        self.last_status_update = None
        self.monitoring = True

    async def run(self):
        """Main orchestration loop."""
        async with WorkerClient("morgan-orchestrator") as worker:
            # Initial registration
            await worker.register(
                description="Autonomous PM orchestrator - continuous monitoring"
            )

            print("🤖 Morgan Autonomous Orchestrator - STARTED")
            print(f"⏰ Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            print("📊 Dashboard: http://localhost:8001")
            print("💓 Heartbeat: Every 30 seconds")
            print("🔄 Monitoring: Every 10 seconds")
            print()

            heartbeat_counter = 0

            while self.monitoring:
                try:
                    # Send heartbeat every 3 cycles (30 seconds)
                    heartbeat_counter += 1
                    if heartbeat_counter >= 3:
                        await worker.heartbeat(
                            status="active",
                            current_task="orchestration-monitoring"
                        )
                        heartbeat_counter = 0

                    # Monitor task queue
                    await self.monitor_tasks(worker)

                    # Check for agent status changes
                    await self.check_agent_health(worker)

                    # Wait before next cycle
                    await asyncio.sleep(10)

                except KeyboardInterrupt:
                    print("\n🛑 Orchestrator shutting down gracefully...")
                    await worker.send_coordination_message(
                        "🛑 Morgan orchestrator shutting down - manual stop requested"
                    )
                    break

                except Exception as e:
                    print(f"⚠️ Error in orchestration loop: {e}")
                    await worker.send_coordination_message(
                        f"⚠️ Morgan orchestrator error: {e}"
                    )
                    await asyncio.sleep(10)

    async def monitor_tasks(self, worker):
        """Monitor task queue for completions and dependencies."""
        try:
            import httpx
            async with httpx.AsyncClient() as client:
                response = await client.get("http://localhost:8001/api/tasks", timeout=5.0)
                tasks = response.json()

                # Check for newly completed tasks
                for task in tasks:
                    task_id = task.get('task_id')
                    status = task.get('status')

                    if status == 'completed' and task_id not in self.processed_tasks:
                        await self.handle_task_completion(worker, task)
                        self.processed_tasks.add(task_id)

                # Check for available tasks (log periodically)
                available_tasks = [t for t in tasks if t.get('status') == 'available']
                if available_tasks:
                    now = datetime.now()
                    if not self.last_status_update or (now - self.last_status_update).seconds > 300:
                        task_list = ", ".join([t.get('task_id') for t in available_tasks])
                        print(f"📋 Available tasks: {task_list}")
                        self.last_status_update = now

        except Exception as e:
            print(f"⚠️ Error monitoring tasks: {e}")

    async def handle_task_completion(self, worker, task):
        """Handle task completion - update dependencies and notify team."""
        task_id = task.get('task_id')
        title = task.get('title')
        owner = task.get('owner', 'unknown')

        print(f"✅ Task completed: {task_id} by {owner}")

        # Send coordination message
        await worker.send_coordination_message(
            f"✅ TASK COMPLETE: {task_id}\n"
            f"Title: {title}\n"
            f"Completed by: {owner}\n"
            f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
            f"Checking for unblocked tasks..."
        )

        # Check if this unblocks other tasks
        await self.check_unblocked_tasks(worker, task_id)

    async def check_unblocked_tasks(self, worker, completed_task_id):
        """Check if completing this task unblocks others."""
        try:
            import httpx
            async with httpx.AsyncClient() as client:
                response = await client.get("http://localhost:8001/api/tasks", timeout=5.0)
                tasks = response.json()

                # Find tasks blocked by the completed task
                unblocked = []
                for task in tasks:
                    blocked_by = task.get('blocked_by', [])
                    if completed_task_id in blocked_by:
                        # Check if all dependencies are now cleared
                        all_clear = all(
                            self.is_task_completed(tasks, dep_id)
                            for dep_id in blocked_by
                        )
                        if all_clear:
                            unblocked.append(task.get('task_id'))

                if unblocked:
                    task_list = ", ".join(unblocked)
                    print(f"🔓 Unblocked tasks: {task_list}")
                    await worker.send_coordination_message(
                        f"🔓 Tasks unblocked by {completed_task_id}:\n{task_list}\n\n"
                        f"These tasks are now available for agents to claim!"
                    )

        except Exception as e:
            print(f"⚠️ Error checking unblocked tasks: {e}")

    def is_task_completed(self, tasks, task_id):
        """Check if a task is completed."""
        for task in tasks:
            if task.get('task_id') == task_id:
                return task.get('status') == 'completed'
        return False

    async def check_agent_health(self, worker):
        """Check agent heartbeats and health status."""
        try:
            import httpx
            async with httpx.AsyncClient() as client:
                response = await client.get("http://localhost:8001/api/agents", timeout=5.0)
                agents = response.json()

                # Look for agents that might need attention
                for agent in agents:
                    agent_id = agent.get('agent_id')
                    status = agent.get('status')
                    last_heartbeat = agent.get('last_heartbeat')

                    # Log if agent appears stuck (would need more sophisticated checking)
                    # For now, just ensure we're aware of all agents

        except Exception as e:
            # Silent fail - agent health is informational
            pass


async def main():
    """Launch autonomous orchestrator."""
    orchestrator = AutonomousOrchestrator()
    await orchestrator.run()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n✅ Orchestrator stopped")
