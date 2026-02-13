"""FastAPI server for agent coordination system."""

import asyncio
import logging
from fastapi import FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse
from contextlib import asynccontextmanager
from typing import Optional

from models import (
    Task, Message, AgentRegistration, AgentHeartbeat,
    TaskClaim, TaskCompletion, TaskStatus, ChannelType
)
from nats_client import NATSCoordinationClient
from task_deduplicator import deduplicate_tasks

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Global NATS client
nats_client: Optional[NATSCoordinationClient] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle manager for the FastAPI app."""
    global nats_client

    # Startup
    logger.info("Starting Agent Coordination Server...")
    nats_client = NATSCoordinationClient()

    try:
        await nats_client.connect()
        logger.info("Connected to NATS successfully")
    except Exception as e:
        logger.error(f"Failed to connect to NATS: {e}")
        logger.error("Make sure NATS server is running and stream MJ_ONLINE_WORK exists")
        raise

    yield

    # Shutdown
    logger.info("Shutting down...")
    if nats_client:
        await nats_client.disconnect()


app = FastAPI(
    title="MJ_Online Agent Coordination API",
    description="NATS-based task queue and agent coordination system",
    version="1.0.0",
    lifespan=lifespan
)


# API Endpoints

@app.post("/api/tasks")
async def publish_task(task: Task):
    """Publish a new task to the queue."""
    try:
        result = await nats_client.publish_task(task)
        logger.info(f"Task {task.task_id} published: {task.title}")
        return {
            "success": True,
            "task_id": task.task_id,
            **result
        }
    except Exception as e:
        logger.error(f"Error publishing task: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/tasks")
async def get_tasks(status: Optional[TaskStatus] = None, limit: int = 100):
    """Get tasks, optionally filtered by status (deduplicated)."""
    try:
        tasks = await nats_client.get_tasks(status=status, limit=limit)
        task_dicts = [task.model_dump(mode='json') for task in tasks]

        # Deduplicate tasks (keep only latest version of each task_id)
        deduplicated = deduplicate_tasks(task_dicts)

        return deduplicated
    except Exception as e:
        logger.error(f"Error getting tasks: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/tasks/available")
async def get_available_tasks(limit: int = 100):
    """Get available tasks that can be claimed (deduplicated)."""
    try:
        tasks = await nats_client.get_tasks(status="available", limit=limit)
        task_dicts = [task.model_dump(mode='json') for task in tasks]

        # Deduplicate tasks first
        deduplicated = deduplicate_tasks(task_dicts)

        # Filter out tasks that are blocked
        available_tasks = []
        for task in deduplicated:
            if not task.get('blocked_by'):
                available_tasks.append(task)
        return available_tasks
    except Exception as e:
        logger.error(f"Error getting available tasks: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/tasks/{task_id}")
async def get_task(task_id: str):
    """Get a specific task by ID (returns latest version)."""
    try:
        tasks = await nats_client.get_tasks(limit=1000)
        task_dicts = [task.model_dump(mode='json') for task in tasks]

        # Deduplicate to get only latest versions
        deduplicated = deduplicate_tasks(task_dicts)

        # Find the specific task
        for task in deduplicated:
            if task['task_id'] == task_id:
                return task

        raise HTTPException(status_code=404, detail="Task not found")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting task {task_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/tasks/{task_id}/claim")
async def claim_task(task_id: str, request: Request):
    """Claim a task for an agent."""
    try:
        claim = await request.json()
        agent_id = claim.get("agent_id")
        if not agent_id:
            raise HTTPException(status_code=400, detail="agent_id is required")

        # Get the task (deduplicated)
        tasks = await nats_client.get_tasks(status="available", limit=1000)
        task_dicts = [task.model_dump(mode='json') for task in tasks]
        deduplicated = deduplicate_tasks(task_dicts)

        task_dict = None
        for t in deduplicated:
            if t['task_id'] == task_id:
                task_dict = t
                break

        if not task_dict:
            raise HTTPException(status_code=404, detail="Task not found or already claimed")

        # Convert back to Task object
        task = Task(**task_dict)

        # Check if task is blocked
        if task.blocked_by:
            raise HTTPException(status_code=400, detail=f"Task is blocked by: {task.blocked_by}")

        # Update task
        from datetime import datetime
        task.status = "claimed"
        task.owner = agent_id
        task.claimed_at = datetime.utcnow()

        # Publish updated task
        await nats_client.publish_task(task)

        logger.info(f"Task {task_id} claimed by {agent_id}")

        return {
            "success": True,
            "task_id": task_id,
            "agent_id": agent_id,
            "task": task.model_dump(mode='json')
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error claiming task {task_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/tasks/{task_id}/complete")
async def complete_task(task_id: str, request: Request):
    """Mark a task as completed."""
    try:
        completion = await request.json()
        agent_id = completion.get("agent_id")
        success = completion.get("success", True)
        result = completion.get("result")
        error = completion.get("error")

        if not agent_id:
            raise HTTPException(status_code=400, detail="agent_id is required")

        # Get the task (deduplicated)
        tasks = await nats_client.get_tasks(status="claimed", limit=1000)
        task_dicts = [task.model_dump(mode='json') for task in tasks]
        deduplicated = deduplicate_tasks(task_dicts)

        task_dict = None
        for t in deduplicated:
            if t['task_id'] == task_id:
                task_dict = t
                break

        if not task_dict:
            raise HTTPException(status_code=404, detail="Task not found or not claimed")

        # Convert back to Task object
        task = Task(**task_dict)

        # Check owner
        if task.owner != agent_id:
            raise HTTPException(status_code=403, detail="Task claimed by different agent")

        # Update task
        from datetime import datetime
        task.status = "completed" if success else "failed"
        task.completed_at = datetime.utcnow()
        task.result = result
        task.error = error

        # Publish updated task
        await nats_client.publish_task(task)

        logger.info(f"Task {task_id} completed by {agent_id} (success: {success})")

        return {
            "success": True,
            "task_id": task_id,
            "agent_id": agent_id,
            "task": task.model_dump(mode='json')
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error completing task {task_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/messages")
async def send_message(message: Message):
    """Send a message to a channel."""
    try:
        result = await nats_client.publish_message(message)
        logger.info(f"Message from {message.agent_id} sent to {message.channel}")
        return {
            "success": True,
            **result
        }
    except Exception as e:
        logger.error(f"Error sending message: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/messages/{channel}")
async def get_messages(channel: ChannelType, limit: int = 100):
    """Get messages from a channel."""
    try:
        messages = await nats_client.get_messages(channel=channel, limit=limit)
        return [msg.model_dump(mode='json') for msg in messages]
    except Exception as e:
        logger.error(f"Error getting messages from {channel}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# Agent management
registered_agents = {}


@app.post("/api/agents/register")
async def register_agent(registration: AgentRegistration):
    """Register an agent."""
    registered_agents[registration.agent_id] = {
        "agent_id": registration.agent_id,
        "description": registration.description,
        "capabilities": registration.capabilities,
        "registered_at": registration.model_dump(mode='json')
    }
    logger.info(f"Agent registered: {registration.agent_id}")
    return {"success": True, "agent_id": registration.agent_id}


@app.post("/api/agents/heartbeat")
async def agent_heartbeat(heartbeat: AgentHeartbeat):
    """Receive agent heartbeat."""
    if heartbeat.agent_id in registered_agents:
        registered_agents[heartbeat.agent_id]["last_heartbeat"] = heartbeat.timestamp.isoformat()
        registered_agents[heartbeat.agent_id]["status"] = heartbeat.status
        registered_agents[heartbeat.agent_id]["current_task"] = heartbeat.current_task
        registered_agents[heartbeat.agent_id]["current_task_title"] = heartbeat.current_task_title
        registered_agents[heartbeat.agent_id]["needs_approval"] = heartbeat.needs_approval
        registered_agents[heartbeat.agent_id]["approval_message"] = heartbeat.approval_message
    return {"success": True}


@app.get("/api/agents")
async def get_agents(include_stale: bool = False):
    """
    Get list of registered agents.

    Args:
        include_stale: If False (default), filter out agents that haven't sent
                      heartbeat in the last 90 seconds (considered offline/stale).
    """
    from datetime import datetime, timedelta

    agents = list(registered_agents.values())

    if not include_stale:
        # Filter out stale agents (no heartbeat in last 90 seconds)
        now = datetime.now()
        active_agents = []

        for agent in agents:
            if "last_heartbeat" in agent and agent["last_heartbeat"]:
                try:
                    last_seen = datetime.fromisoformat(agent["last_heartbeat"])
                    time_since_heartbeat = (now - last_seen).total_seconds()

                    # Only include agents that have sent heartbeat within last 90 seconds
                    if time_since_heartbeat < 90:
                        active_agents.append(agent)
                    else:
                        logger.info(f"Filtering out stale agent {agent.get('agent_id')} (last seen {time_since_heartbeat:.0f}s ago)")
                except ValueError:
                    # Invalid timestamp, skip this agent
                    logger.warning(f"Invalid timestamp for agent {agent.get('agent_id')}")
                    pass
            else:
                # No heartbeat at all, skip
                logger.warning(f"Agent {agent.get('agent_id')} has no heartbeat timestamp")

        return active_agents

    return agents


@app.delete("/api/agents/{agent_id}")
async def remove_agent(agent_id: str):
    """Remove a registered agent."""
    if agent_id in registered_agents:
        agent_info = registered_agents.pop(agent_id)
        logger.info(f"Agent removed: {agent_id}")
        return {"success": True, "agent_id": agent_id, "removed": agent_info}
    else:
        raise HTTPException(status_code=404, detail=f"Agent {agent_id} not found")


@app.post("/api/agents/cleanup")
async def cleanup_agents(request: Request):
    """Remove all agents except those in the keep_agents list."""
    try:
        body = await request.json()
        keep_agents = body.get("keep_agents", [])

        agents_to_remove = [agent_id for agent_id in registered_agents.keys() if agent_id not in keep_agents]
        removed_agents = []

        for agent_id in agents_to_remove:
            agent_info = registered_agents.pop(agent_id)
            removed_agents.append(agent_id)
            logger.info(f"Agent removed during cleanup: {agent_id}")

        return {
            "success": True,
            "removed_count": len(removed_agents),
            "removed_agents": removed_agents,
            "kept_agents": keep_agents
        }
    except Exception as e:
        logger.error(f"Error during agent cleanup: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# Web dashboard
@app.get("/", response_class=HTMLResponse)
async def dashboard():
    """Serve the web dashboard."""
    try:
        with open("static/index.html", "r") as f:
            return HTMLResponse(content=f.read())
    except FileNotFoundError:
        return HTMLResponse(content="""
            <html>
                <head><title>Agent Coordination</title></head>
                <body>
                    <h1>MJ_Online Agent Coordination System</h1>
                    <p>Dashboard coming soon!</p>
                    <p>API docs: <a href="/docs">/docs</a></p>
                </body>
            </html>
        """)


@app.get("/messages.html", response_class=HTMLResponse)
async def messages_page():
    """Serve the messages page."""
    try:
        with open("static/messages.html", "r") as f:
            return HTMLResponse(content=f.read())
    except FileNotFoundError:
        return HTMLResponse(content="""
            <html>
                <head><title>Messages</title></head>
                <body>
                    <h1>Messages page not found</h1>
                    <p><a href="/">Return to Dashboard</a></p>
                </body>
            </html>
        """)


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "nats_connected": nats_client.nc is not None if nats_client else False
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
