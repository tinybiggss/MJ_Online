#!/usr/bin/env python3
"""
Alice - Web-Content-Builder-Agent
Specialized in Ghost Pro publishing, content creation, and site management.
"""

import asyncio
import sys
from pathlib import Path
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from agent_coordination.client import WorkerClient


async def main():
    """Alice's main registration and coordination loop."""

    agent_name = "Alice"
    agent_role = "Web-Content-Builder-Agent"

    print(f"\n{'='*80}")
    print(f"  {agent_name} - {agent_role}")
    print(f"{'='*80}\n")
    print("Connecting to NATS coordination system...")

    async with WorkerClient(agent_name) as worker:
        # Register with NATS
        await worker.register(
            description=f"{agent_role}: Ghost Pro content publishing, web page creation, SEO optimization, content strategy, RAG verification",
            capabilities=[
                'ghost-pro',
                'content-creation',
                'seo-optimization',
                'rag-validation',
                'content-strategy',
                'phase-3-specialist'
            ]
        )

        # Announce availability to Project Manager
        await worker.send_coordination_message(
            f"""
╔══════════════════════════════════════════════════════════════════════════════╗
║                   ALICE - WEB CONTENT BUILDER AGENT ONLINE                   ║
╚══════════════════════════════════════════════════════════════════════════════╝

Agent: {agent_name}
Role: {agent_role}
Status: ✅ Active and ready for work
Focus: Phase 3 - Core Content Creation

Capabilities:
  • Ghost Pro content publishing
  • Web page creation and editing
  • SEO optimization and meta tags
  • RAG knowledge base validation
  • Content strategy and planning
  • Professional terminology enforcement

Ready to receive task assignments from Project Manager.

Awaiting instructions...
            """
        )

        print(f"✅ {agent_name} registered successfully!")
        print(f"📋 Role: {agent_role}")
        print(f"🎯 Focus: Phase 3 - Core Content Creation")
        print(f"📡 Status: Awaiting PM assignment")
        print(f"🌐 Dashboard: http://localhost:8001\n")
        print("Press Ctrl+C to disconnect.\n")

        try:
            # Keep connection alive with periodic status checks
            while True:
                # Check for available tasks
                tasks = await worker.get_available_tasks(limit=10)

                if tasks:
                    print(f"\n📬 {len(tasks)} task(s) available in queue")
                    print("⏳ Waiting for Project Manager assignment...\n")

                await asyncio.sleep(30)

        except KeyboardInterrupt:
            print(f"\n\n👋 {agent_name} signing off...")
            await worker.send_coordination_message(f"{agent_name} going offline.")


if __name__ == "__main__":
    asyncio.run(main())
