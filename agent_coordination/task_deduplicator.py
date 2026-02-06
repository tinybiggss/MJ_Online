"""Utility to deduplicate tasks from NATS JetStream."""

from typing import List
from datetime import datetime

try:
    from models import Task
except ImportError:
    from agent_coordination.models import Task


def deduplicate_tasks(tasks: List[Task | dict]) -> List[Task | dict]:
    """
    Deduplicate tasks by task_id, keeping only the latest version by TIMESTAMP.

    NATS JetStream is append-only, so task updates create new messages.
    This function keeps only the NEWEST version of each task_id (by timestamp).

    The "latest" timestamp is determined by:
    1. completed_at if present (final state)
    2. claimed_at if present (mid state)
    3. created_at otherwise (initial state)

    The NEWEST message (by timestamp) wins, regardless of status.

    Args:
        tasks: List of Task objects or dicts (may contain duplicates)

    Returns:
        List of Task objects or dicts with duplicates removed (newest version only)
    """
    task_map = {}

    for task in tasks:
        # Handle both Task objects and dicts
        if isinstance(task, dict):
            task_id = task['task_id']
            completed_at = task.get('completed_at')
            claimed_at = task.get('claimed_at')
            created_at = task.get('created_at')
        else:
            task_id = task.task_id
            completed_at = task.completed_at
            claimed_at = task.claimed_at
            created_at = task.created_at

        # Determine task's "latest" timestamp (the most recent action taken on this task)
        if completed_at:
            latest_timestamp = completed_at if isinstance(completed_at, datetime) else datetime.fromisoformat(completed_at)
        elif claimed_at:
            latest_timestamp = claimed_at if isinstance(claimed_at, datetime) else datetime.fromisoformat(claimed_at)
        else:
            latest_timestamp = created_at if isinstance(created_at, datetime) else datetime.fromisoformat(created_at)

        # If this is first time seeing this task_id, add it
        if task_id not in task_map:
            task_map[task_id] = {
                'task': task,
                'timestamp': latest_timestamp
            }
        else:
            # If we've seen this task_id before, keep the NEWEST one (by timestamp)
            existing = task_map[task_id]

            # Newer timestamp wins (regardless of status)
            if latest_timestamp > existing['timestamp']:
                task_map[task_id] = {
                    'task': task,
                    'timestamp': latest_timestamp
                }

    # Extract deduplicated tasks
    deduplicated = [entry['task'] for entry in task_map.values()]

    return deduplicated


def get_task_by_id(tasks: List[Task | dict], task_id: str) -> Task | dict | None:
    """
    Get a specific task by ID from a list (after deduplication).

    Args:
        tasks: List of Task objects
        task_id: Task ID to find

    Returns:
        Task object if found, None otherwise
    """
    deduplicated = deduplicate_tasks(tasks)

    for task in deduplicated:
        tid = task['task_id'] if isinstance(task, dict) else task.task_id
        if tid == task_id:
            return task

    return None


def get_tasks_by_status(tasks: List[Task | dict], status: str) -> List[Task | dict]:
    """
    Get tasks filtered by status (after deduplication).

    Args:
        tasks: List of Task objects
        status: Status to filter by (available, claimed, completed, failed)

    Returns:
        List of tasks with matching status
    """
    deduplicated = deduplicate_tasks(tasks)

    result = []
    for task in deduplicated:
        task_status = task['status'] if isinstance(task, dict) else task.status
        if task_status == status:
            result.append(task)
    return result


def summarize_tasks(tasks: List[Task | dict]) -> dict:
    """
    Summarize task queue status.

    Args:
        tasks: List of Task objects (will be deduplicated)

    Returns:
        Dictionary with summary statistics
    """
    deduplicated = deduplicate_tasks(tasks)

    summary = {
        'total_tasks': len(deduplicated),
        'total_duplicates': len(tasks) - len(deduplicated),
        'by_status': {
            'available': 0,
            'claimed': 0,
            'completed': 0,
            'failed': 0
        },
        'by_owner': {}
    }

    for task in deduplicated:
        # Handle both dict and Task object
        if isinstance(task, dict):
            status = task['status']
            owner = task.get('owner')
        else:
            status = task.status
            owner = task.owner

        # Count by status
        summary['by_status'][status] = summary['by_status'].get(status, 0) + 1

        # Count by owner
        if owner:
            summary['by_owner'][owner] = summary['by_owner'].get(owner, 0) + 1

    return summary
