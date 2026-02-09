#!/usr/bin/env python3
"""
Demo autonomous agent showing how to use the agent_runner library.

This demonstrates the pattern that real agents (Debbie, Doc Brown, etc.)
will use to operate autonomously with NATS integration.

Usage:
    python demo_autonomous_agent.py --agent debbie
    python demo_autonomous_agent.py --agent mobiledoc-assembler
"""

import asyncio
import argparse
import logging
import sys
from pathlib import Path
from typing import Dict

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from agent_coordination.agent_runner import AgentRunner

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


async def simulate_work(agent_name: str, task: Dict) -> Dict:
    """
    Simulate agent doing work on a task.

    In a real agent, this would be the actual work logic
    (design, mobiledoc conversion, publishing, etc.)

    Args:
        agent_name: Name of the agent
        task: Task dictionary

    Returns:
        Result dictionary
    """
    logger.info(f"🚀 {agent_name} starting work on: {task['title']}")
    logger.info(f"   Description: {task['description']}")

    # Simulate work taking time
    await asyncio.sleep(3)

    # Create result
    result = {
        "status": "completed",
        "summary": f"{agent_name} successfully completed {task['title']}",
        "task_id": task["task_id"],
        "deliverables": [
            f"{task['task_id']}_output.json",
            f"{task['task_id']}_report.md"
        ],
        "notes": f"Simulated work for demonstration purposes"
    }

    logger.info(f"✅ {agent_name} completed work successfully")

    return result


async def run_demo_agent(agent_name: str):
    """
    Run a demo autonomous agent.

    Args:
        agent_name: Name of agent to run (e.g., "debbie", "mobiledoc-assembler")
    """
    logger.info(f"=" * 60)
    logger.info(f"STARTING AUTONOMOUS AGENT: {agent_name.upper()}")
    logger.info(f"=" * 60)

    runner = AgentRunner(agent_name)

    try:
        # Start the runner (connects to NATS, starts heartbeat)
        await runner.start()

        logger.info(f"\n🎧 {runner.config.agent_name} is now listening for tasks...")
        logger.info(f"   Task types: {runner.config.task_types}")
        logger.info(f"   Keywords: {runner.config.keywords}")
        logger.info(f"   Next agent: {runner.config.next_agent or 'None (end of workflow)'}")
        logger.info(f"\nWaiting for work to be assigned...\n")

        # Main work loop - listen for tasks
        async for task in runner.listen_for_tasks():
            logger.info(f"\n{'=' * 60}")
            logger.info(f"📥 RECEIVED TASK: {task['task_id']}")
            logger.info(f"{'=' * 60}")

            try:
                # Execute the work (in real agent, this would be actual work logic)
                result = await simulate_work(runner.config.agent_name, task)

                # Report completion (this notifies Morgan and next agent)
                await runner.complete_task(task["task_id"], result=result)

                logger.info(f"\n✅ Task {task['task_id']} completed and reported")
                logger.info(f"   Result: {result['summary']}")
                logger.info(f"   Deliverables: {result['deliverables']}")

                if runner.config.next_agent:
                    logger.info(f"   📣 Notified {runner.config.next_agent} to continue workflow")

                logger.info(f"\n🎧 {runner.config.agent_name} returned to listening state...\n")

            except Exception as e:
                logger.error(f"❌ Error executing task {task['task_id']}: {e}", exc_info=True)

                # Report failure
                await runner.complete_task(
                    task["task_id"],
                    error=f"Task execution failed: {e}"
                )

    except KeyboardInterrupt:
        logger.info(f"\n\n⚠️  Received interrupt signal (Ctrl+C)")
        logger.info(f"Shutting down {agent_name}...")
    except Exception as e:
        logger.error(f"Fatal error in agent runner: {e}", exc_info=True)
    finally:
        # Clean shutdown
        await runner.stop()
        logger.info(f"\n{'=' * 60}")
        logger.info(f"AGENT SHUTDOWN COMPLETE: {agent_name.upper()}")
        logger.info(f"{'=' * 60}\n")


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Run a demo autonomous agent with NATS integration"
    )
    parser.add_argument(
        "--agent",
        type=str,
        required=True,
        choices=["debbie", "mobiledoc-assembler", "web-content-builder", "pm"],
        help="Name of agent to run"
    )

    args = parser.parse_args()

    # Run the agent
    asyncio.run(run_demo_agent(args.agent))


if __name__ == "__main__":
    main()
