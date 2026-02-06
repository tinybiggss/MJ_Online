"""Python client library for agents to interact with the coordination system."""

import asyncio
import httpx
from typing import Optional, AsyncIterator
from datetime import datetime
from .models import Task, TaskStatus


class WorkerClient:
    """Client for worker agents to claim and complete tasks."""

    def __init__(self, agent_id: str, base_url: str = "http://localhost:8001"):
        """
        Initialize the worker client.

        Args:
            agent_id: Unique identifier for this agent
            base_url: Base URL of the coordination API server
        """
        self.agent_id = agent_id
        self.base_url = base_url.rstrip('/')
        self.client = httpx.AsyncClient(base_url=self.base_url, timeout=30.0)

    async def __aenter__(self):
        """Async context manager entry."""
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit."""
        await self.client.aclose()

    async def register(self, description: Optional[str] = None, capabilities: list[str] = None):
        """
        Register this agent with the coordination system.

        Args:
            description: Optional description of the agent
            capabilities: List of agent capabilities
        """
        response = await self.client.post(
            "/api/agents/register",
            json={
                "agent_id": self.agent_id,
                "description": description,
                "capabilities": capabilities or []
            }
        )
        response.raise_for_status()
        return response.json()

    async def get_available_tasks(self, limit: int = 100) -> list[dict]:
        """
        Get list of available tasks that can be claimed.

        Args:
            limit: Maximum number of tasks to retrieve

        Returns:
            List of available tasks
        """
        response = await self.client.get(
            "/api/tasks/available",
            params={"limit": limit}
        )
        response.raise_for_status()
        return response.json()

    async def claim_task(self, task_id: str) -> dict:
        """
        Claim a task for this agent.

        Args:
            task_id: ID of the task to claim

        Returns:
            Task details
        """
        response = await self.client.post(
            f"/api/tasks/{task_id}/claim",
            json={"agent_id": self.agent_id}
        )
        response.raise_for_status()
        return response.json()

    async def complete_task(self, task_id: str, result: Optional[dict] = None, error: Optional[str] = None) -> dict:
        """
        Mark a task as completed.

        Args:
            task_id: ID of the task to complete
            result: Optional result data
            error: Optional error message if task failed

        Returns:
            Completion response
        """
        response = await self.client.post(
            f"/api/tasks/{task_id}/complete",
            json={
                "agent_id": self.agent_id,
                "success": error is None,
                "result": result,
                "error": error
            }
        )
        response.raise_for_status()
        return response.json()

    async def send_coordination_message(self, content: str):
        """Send a coordination message to other agents."""
        response = await self.client.post(
            "/api/messages",
            json={
                "agent_id": self.agent_id,
                "channel": "coordination",
                "content": content
            }
        )
        response.raise_for_status()
        return response.json()

    async def report_error(self, content: str):
        """Report an error."""
        response = await self.client.post(
            "/api/messages",
            json={
                "agent_id": self.agent_id,
                "channel": "errors",
                "content": content
            }
        )
        response.raise_for_status()
        return response.json()

    async def heartbeat(
        self,
        status: str = "active",
        current_task: Optional[str] = None,
        current_task_title: Optional[str] = None,
        needs_approval: bool = False,
        approval_message: Optional[str] = None
    ):
        """
        Send a heartbeat to show agent is alive.

        Args:
            status: Agent status (active, idle, busy, offline)
            current_task: Current task ID being worked on
            current_task_title: Human-readable title of current task
            needs_approval: Whether agent needs user approval/attention
            approval_message: Message explaining what needs approval
        """
        response = await self.client.post(
            "/api/agents/heartbeat",
            json={
                "agent_id": self.agent_id,
                "status": status,
                "current_task": current_task,
                "current_task_title": current_task_title,
                "needs_approval": needs_approval,
                "approval_message": approval_message
            }
        )
        response.raise_for_status()
        return response.json()

    async def watch_tasks(self) -> AsyncIterator[dict]:
        """
        Watch for new available tasks in real-time.

        Yields:
            Task dictionaries as they become available
        """
        # Poll for tasks (WebSocket streaming would be better but HTTP polling works)
        while True:
            tasks = await self.get_available_tasks(limit=10)
            for task in tasks:
                yield task
            await asyncio.sleep(2)  # Poll every 2 seconds


class TaskPublisher:
    """Client for publishing tasks to the queue (used by orchestrator)."""

    def __init__(self, base_url: str = "http://localhost:8001"):
        """
        Initialize the task publisher.

        Args:
            base_url: Base URL of the coordination API server
        """
        self.base_url = base_url.rstrip('/')
        self.client = httpx.AsyncClient(base_url=self.base_url, timeout=30.0)

    async def __aenter__(self):
        """Async context manager entry."""
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit."""
        await self.client.aclose()

    async def publish_task(self, task_data: dict) -> dict:
        """
        Publish a new task to the queue.

        Args:
            task_data: Task data including task_id, title, description, etc.

        Returns:
            Publication response
        """
        response = await self.client.post(
            "/api/tasks",
            json=task_data
        )
        response.raise_for_status()
        return response.json()


class MonitorClient:
    """Client for monitoring tasks and agents (used by orchestrator/dashboard)."""

    def __init__(self, base_url: str = "http://localhost:8001"):
        """
        Initialize the monitor client.

        Args:
            base_url: Base URL of the coordination API server
        """
        self.base_url = base_url.rstrip('/')
        self.client = httpx.AsyncClient(base_url=self.base_url, timeout=30.0)

    async def __aenter__(self):
        """Async context manager entry."""
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit."""
        await self.client.aclose()

    async def get_all_tasks(self, status: Optional[str] = None) -> list[dict]:
        """
        Get all tasks, optionally filtered by status.

        Args:
            status: Optional status filter (available, claimed, completed, failed)

        Returns:
            List of tasks
        """
        params = {}
        if status:
            params["status"] = status

        response = await self.client.get("/api/tasks", params=params)
        response.raise_for_status()
        return response.json()

    async def get_task_status(self, task_id: str) -> dict:
        """
        Get status of a specific task.

        Args:
            task_id: Task ID

        Returns:
            Task details
        """
        response = await self.client.get(f"/api/tasks/{task_id}")
        response.raise_for_status()
        return response.json()

    async def get_agents(self) -> list[dict]:
        """
        Get list of registered agents.

        Returns:
            List of agents
        """
        response = await self.client.get("/api/agents")
        response.raise_for_status()
        return response.json()

    async def get_messages(self, channel: str, limit: int = 100) -> list[dict]:
        """
        Get messages from a channel.

        Args:
            channel: Channel name (coordination, errors, status)
            limit: Maximum number of messages

        Returns:
            List of messages
        """
        response = await self.client.get(
            f"/api/messages/{channel}",
            params={"limit": limit}
        )
        response.raise_for_status()
        return response.json()
