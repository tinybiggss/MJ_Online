"""
Agent runner library for NATS-enabled autonomous agents.

Provides the listening loop, heartbeat management, and task coordination
that agents use to operate autonomously.

Usage in agent definition:
    ```python
    from agent_coordination.agent_runner import AgentRunner

    # Start listening for work
    runner = AgentRunner("debbie")
    await runner.start()

    # Main work loop
    async for task in runner.listen_for_tasks():
        # Do the actual work
        result = await do_agent_work(task)

        # Report completion and notify next agent
        await runner.complete_task(task["task_id"], result)
    ```
"""

import asyncio
import logging
from typing import Optional, Dict, AsyncIterator
from datetime import datetime

try:
    from .client import WorkerClient
    from .agent_configs import get_agent_config, AgentConfig
except ImportError:
    # If relative imports fail, try absolute imports
    from agent_coordination.client import WorkerClient
    from agent_coordination.agent_configs import get_agent_config, AgentConfig

logger = logging.getLogger(__name__)


class AgentRunner:
    """
    Runner for autonomous agents with NATS integration.

    Handles:
    - NATS connection and registration
    - Heartbeat monitoring (every 30s)
    - Task watching and filtering
    - Completion reporting
    - Workflow orchestration (notifying next agent)
    """

    def __init__(self, agent_name: str):
        """
        Initialize agent runner.

        Args:
            agent_name: Name of the agent (e.g., "debbie", "mobiledoc-assembler")
        """
        self.agent_name = agent_name.lower()
        self.config = get_agent_config(self.agent_name)

        if not self.config:
            raise ValueError(f"No configuration found for agent: {agent_name}")

        self.worker: Optional[WorkerClient] = None
        self.heartbeat_task: Optional[asyncio.Task] = None
        self.current_task_id: Optional[str] = None
        self.is_running = False

    async def start(self):
        """
        Start the agent runner.

        Connects to NATS, registers agent, and starts heartbeat loop.
        """
        logger.info(f"Starting agent runner for {self.config.agent_name}")

        # Create NATS client
        self.worker = WorkerClient(self.config.agent_name)

        # Register with NATS
        await self.worker.register(
            description=self.config.description,
            capabilities=self.config.capabilities
        )
        logger.info(f"✅ {self.config.agent_name} registered with NATS")

        # Start heartbeat loop
        self.heartbeat_task = asyncio.create_task(self._heartbeat_loop())
        logger.info(f"💓 Heartbeat loop started for {self.config.agent_name}")

        # Send initial heartbeat
        await self.worker.heartbeat(status="idle", current_task=None)

        self.is_running = True
        logger.info(f"🎧 {self.config.agent_name} ready and listening for work...")

    async def stop(self):
        """Stop the agent runner and cleanup."""
        logger.info(f"Stopping agent runner for {self.config.agent_name}")

        self.is_running = False

        # Cancel heartbeat loop
        if self.heartbeat_task:
            self.heartbeat_task.cancel()
            try:
                await self.heartbeat_task
            except asyncio.CancelledError:
                pass

        # Send final heartbeat
        if self.worker:
            await self.worker.heartbeat(status="offline", current_task=None)
            await self.worker.client.aclose()

        logger.info(f"✅ {self.config.agent_name} stopped cleanly")

    async def _heartbeat_loop(self):
        """Background task that sends heartbeats every 30 seconds."""
        while self.is_running:
            try:
                status = "busy" if self.current_task_id else "idle"
                await self.worker.heartbeat(
                    status=status,
                    current_task=self.current_task_id
                )
                await asyncio.sleep(30)
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Heartbeat error for {self.config.agent_name}: {e}")
                await asyncio.sleep(30)

    async def listen_for_tasks(self) -> AsyncIterator[Dict]:
        """
        Listen for tasks matching this agent's capabilities.

        Yields:
            Task dictionaries that match this agent's filter
        """
        if not self.is_running:
            raise RuntimeError("Agent runner not started. Call start() first.")

        logger.info(f"👂 {self.config.agent_name} watching for tasks matching: {self.config.task_types}")

        # Poll for available tasks
        while self.is_running:
            try:
                tasks = await self.worker.get_available_tasks(limit=20)

                for task in tasks:
                    # Filter by agent capabilities
                    if self.config.matches_task(task):
                        logger.info(f"🎯 {self.config.agent_name} found matching task: {task['task_id']}")

                        # Claim the task
                        await self.worker.claim_task(task["task_id"])
                        self.current_task_id = task["task_id"]

                        # Update heartbeat to show busy
                        await self.worker.heartbeat(
                            status="busy",
                            current_task=task["task_id"],
                            current_task_title=task.get("title", "Untitled task")
                        )

                        # Send coordination message
                        await self.worker.send_coordination_message(
                            f"{self.config.agent_name} claimed task {task['task_id']}: {task.get('title', 'Untitled')}"
                        )

                        # Yield task to agent for execution
                        yield task

                # Sleep before next poll
                await asyncio.sleep(5)  # Poll every 5 seconds

            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Error in task listening loop: {e}")
                await self.worker.report_error(f"Task listening error: {e}")
                await asyncio.sleep(10)

    async def complete_task(
        self,
        task_id: str,
        result: Optional[Dict] = None,
        error: Optional[str] = None
    ):
        """
        Mark task as complete and notify next agent in workflow.

        Args:
            task_id: ID of completed task
            result: Optional result data
            error: Optional error message if task failed
        """
        success = error is None

        # Report completion to NATS
        await self.worker.complete_task(task_id, result=result, error=error)

        # Clear current task
        self.current_task_id = None

        # Update heartbeat
        await self.worker.heartbeat(status="idle", current_task=None)

        if success:
            logger.info(f"✅ {self.config.agent_name} completed task {task_id}")

            # Send coordination message
            summary = result.get("summary", "Task completed") if result else "Task completed"
            await self.worker.send_coordination_message(
                f"{self.config.agent_name} completed task {task_id}: {summary}"
            )

            # Notify next agent in workflow if exists
            if self.config.next_agent:
                await self._notify_next_agent(task_id, result)
        else:
            logger.error(f"❌ {self.config.agent_name} failed task {task_id}: {error}")
            await self.worker.report_error(
                f"{self.config.agent_name} failed task {task_id}: {error}"
            )

    async def _notify_next_agent(self, completed_task_id: str, result: Optional[Dict]):
        """
        Notify next agent in workflow that work is ready.

        Args:
            completed_task_id: ID of the task that just completed
            result: Result data from completed task
        """
        next_agent = self.config.next_agent

        logger.info(f"📣 Notifying {next_agent} that {completed_task_id} is complete")

        # Send coordination message to next agent
        await self.worker.send_coordination_message(
            f"@{next_agent}: Task {completed_task_id} completed by {self.config.agent_name}. "
            f"Ready for next step. Result: {result}"
        )

    async def request_approval(self, message: str):
        """
        Request user approval/attention via dashboard.

        Args:
            message: Message explaining what needs approval
        """
        await self.worker.heartbeat(
            status="busy",
            current_task=self.current_task_id,
            needs_approval=True,
            approval_message=message
        )

        logger.warning(f"🚨 {self.config.agent_name} requesting approval: {message}")

    async def send_message(self, message: str):
        """
        Send coordination message to other agents.

        Args:
            message: Message to send
        """
        await self.worker.send_coordination_message(
            f"{self.config.agent_name}: {message}"
        )


async def run_agent(agent_name: str, work_function):
    """
    Convenience function to run an agent with a work function.

    Args:
        agent_name: Name of agent to run
        work_function: Async function that takes a task dict and returns a result dict

    Example:
        ```python
        async def do_design_work(task):
            # Execute design work
            return {"summary": "Design completed", "files": [...]}

        await run_agent("debbie", do_design_work)
        ```
    """
    runner = AgentRunner(agent_name)

    try:
        await runner.start()

        async for task in runner.listen_for_tasks():
            try:
                # Execute the work function
                result = await work_function(task)

                # Report success
                await runner.complete_task(task["task_id"], result=result)

            except Exception as e:
                # Report failure
                logger.error(f"Error executing task: {e}", exc_info=True)
                await runner.complete_task(
                    task["task_id"],
                    error=str(e)
                )

    except KeyboardInterrupt:
        logger.info(f"Received interrupt signal, shutting down {agent_name}...")
    finally:
        await runner.stop()
