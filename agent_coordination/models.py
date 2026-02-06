"""Data models for agent coordination and task queue."""

from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel, Field


TaskStatus = Literal["available", "claimed", "completed", "failed"]
ChannelType = Literal["tasks", "coordination", "errors", "status"]


class Task(BaseModel):
    """Task model for work queue."""
    task_id: str = Field(..., description="Unique task identifier")
    title: str = Field(..., description="Task title")
    description: str = Field(..., description="Detailed task description")
    status: TaskStatus = Field(default="available", description="Task status")
    owner: Optional[str] = Field(None, description="Agent that claimed this task")
    blocked_by: list[str] = Field(default_factory=list, description="Task IDs that block this task")
    priority: str = Field(default="medium", description="Task priority: low, medium, high")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    claimed_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    result: Optional[dict] = None
    error: Optional[str] = None


class Message(BaseModel):
    """Generic message model for agent communication."""
    agent_id: str = Field(..., description="Agent identifier")
    channel: ChannelType = Field(..., description="Channel name")
    content: str = Field(..., description="Message content")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    message_id: Optional[str] = None


class AgentRegistration(BaseModel):
    """Agent registration model."""
    agent_id: str = Field(..., min_length=1, max_length=50, description="Unique agent ID")
    description: Optional[str] = Field(None, max_length=200, description="Agent description")
    capabilities: list[str] = Field(default_factory=list, description="Agent capabilities")


class AgentHeartbeat(BaseModel):
    """Agent heartbeat for health monitoring."""
    agent_id: str
    status: Literal["active", "idle", "busy", "offline"]
    current_task: Optional[str] = None
    current_task_title: Optional[str] = None
    needs_approval: bool = False
    approval_message: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class TaskClaim(BaseModel):
    """Task claim event."""
    task_id: str
    agent_id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class TaskCompletion(BaseModel):
    """Task completion event."""
    task_id: str
    agent_id: str
    success: bool
    result: Optional[dict] = None
    error: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
