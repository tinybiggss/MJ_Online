"""
Agent configuration for NATS-enabled autonomous agents.

Defines capabilities, task filters, and metadata for each agent type.
"""

from typing import List, Dict, Optional, Callable
from dataclasses import dataclass


@dataclass
class AgentConfig:
    """Configuration for an autonomous agent."""

    # Agent identity
    agent_name: str
    subagent_type: str  # For Task tool invocation
    description: str
    capabilities: List[str]

    # Task filtering
    task_types: List[str]  # Explicit task types this agent handles
    keywords: List[str]    # Keywords to match in task title/description

    # Workflow
    next_agent: Optional[str] = None  # Which agent to notify after completion

    def matches_task(self, task: Dict) -> bool:
        """
        Determine if this agent should handle a given task.

        Args:
            task: Task dictionary with fields like task_id, title, description, type

        Returns:
            True if agent should claim this task
        """
        # Check explicit task type
        if task.get("type") in self.task_types:
            return True

        # Check keywords in title/description
        title = task.get("title", "").lower()
        description = task.get("description", "").lower()

        for keyword in self.keywords:
            if keyword.lower() in title or keyword.lower() in description:
                return True

        return False


# Agent configurations
AGENT_CONFIGS = {
    "debbie": AgentConfig(
        agent_name="Debbie",
        subagent_type="debbie",
        description="Expert web designer, information architect, and Ghost/Kyoto theme specialist",
        capabilities=[
            "visual_design",
            "information_architecture",
            "ghost_platform",
            "kyoto_theme",
            "rag_verification",
            "image_placement",
            "web_design_trends",
            "portfolio_websites"
        ],
        task_types=["design", "page_spec", "visual_design"],
        keywords=["design", "page", "layout", "visual", "spec", "mockup", "ui", "ux"],
        next_agent="mobiledoc-assembler"
    ),

    "mobiledoc-assembler": AgentConfig(
        agent_name="Doc-Brown",
        subagent_type="mobiledoc-assembler",
        description="Mobiledoc JSON assembler - converts design specs to Ghost-compatible format",
        capabilities=[
            "mobiledoc_assembly",
            "json_generation",
            "ghost_api",
            "content_structure"
        ],
        task_types=["mobiledoc_conversion", "mobiledoc"],
        keywords=["mobiledoc", "PAGE_SPEC", "convert", "assembly", "json"],
        next_agent="web-content-builder"
    ),

    "web-content-builder": AgentConfig(
        agent_name="Alice",
        subagent_type="web-content-builder",
        description="Web content builder - publishes to Ghost Pro via API",
        capabilities=[
            "ghost_publishing",
            "image_upload",
            "api_integration",
            "content_management"
        ],
        task_types=["publishing", "content", "upload"],
        keywords=["publish", "ghost", "upload", "image", "api", "content"],
        next_agent=None  # End of workflow
    ),

    "pm": AgentConfig(
        agent_name="Morgan",
        subagent_type="pm",
        description="Project Manager - coordinates agents, maintains roadmap, orchestrates workflows",
        capabilities=[
            "task_coordination",
            "roadmap_management",
            "workflow_orchestration",
            "project_memory"
        ],
        task_types=["coordination", "planning", "roadmap"],
        keywords=["coordinate", "plan", "roadmap", "manage", "orchestrate"],
        next_agent=None  # PM doesn't hand off
    ),
}


def get_agent_config(agent_name: str) -> Optional[AgentConfig]:
    """
    Get configuration for an agent by name.

    Args:
        agent_name: Agent identifier (e.g., "debbie", "mobiledoc-assembler")

    Returns:
        AgentConfig if found, None otherwise
    """
    return AGENT_CONFIGS.get(agent_name.lower())


def list_agents() -> List[str]:
    """Get list of all configured agent names."""
    return list(AGENT_CONFIGS.keys())
