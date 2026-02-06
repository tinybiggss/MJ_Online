#!/usr/bin/env python3
"""
Alice - Persistent Web-Content-Builder-Agent with Heartbeat
Stays online, sends heartbeats, monitors for PM assignments.
"""

import asyncio
import sys
from pathlib import Path
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from agent_coordination.client import WorkerClient


class AliceAgent:
    """Alice - Web Content Builder Agent with persistent heartbeat."""

    def __init__(self):
        self.agent_name = "Alice"
        self.worker = None
        self.current_task = None

    async def run(self):
        """Main agent loop with heartbeat."""
        async with WorkerClient(self.agent_name) as worker:
            self.worker = worker

            # Register
            await worker.register(
                description='Web-Content-Builder-Agent: Ghost Pro publishing, content creation, SEO, RAG validation - Phase 3 specialist',
                capabilities=['ghost-pro', 'content-creation', 'rag-validation', 'seo-optimization', 'phase-3-specialist']
            )

            print(f"\n{'='*80}")
            print(f"  ALICE - WEB CONTENT BUILDER AGENT")
            print(f"{'='*80}")
            print(f"✅ Registered with NATS")
            print(f"🎯 Focus: Phase 3 - Core Content Creation")
            print(f"📡 Dashboard: http://localhost:8001")
            print(f"💓 Heartbeat: Active (every 30s)")
            print(f"\nPress Ctrl+C to stop\n")

            # Send initial heartbeat
            await worker.heartbeat(status="active", current_task=None)
            print(f"[{datetime.now().strftime('%H:%M:%S')}] 💓 Heartbeat sent: active")

            # Announce availability
            await worker.send_coordination_message('''
╔══════════════════════════════════════════════════════════════════════════════╗
║                   ALICE - WEB CONTENT BUILDER AGENT ONLINE                   ║
╚══════════════════════════════════════════════════════════════════════════════╝

Agent: Alice
Role: Web-Content-Builder-Agent
Status: ✅ Active and ready for work
Focus: Phase 3 - Core Content Creation

Capabilities:
  • Ghost Pro content publishing
  • Web page creation and editing
  • SEO optimization and meta tags
  • RAG knowledge base validation
  • Content strategy and planning

Ready to receive task assignments from Project Manager.
Awaiting Phase 3 instructions...
            ''')
            print(f"[{datetime.now().strftime('%H:%M:%S')}] 📨 Announced availability to PM")

            # Main loop - send heartbeats every 30 seconds
            try:
                heartbeat_count = 0
                while True:
                    await asyncio.sleep(30)

                    # Send heartbeat
                    heartbeat_count += 1
                    await worker.heartbeat(
                        status="idle" if not self.current_task else "busy",
                        current_task=self.current_task
                    )

                    print(f"[{datetime.now().strftime('%H:%M:%S')}] 💓 Heartbeat #{heartbeat_count} sent: {'idle' if not self.current_task else 'busy'}")

                    # Every 5th heartbeat (2.5 minutes), check for tasks
                    if heartbeat_count % 5 == 0:
                        tasks = await worker.get_available_tasks(limit=5)
                        if tasks:
                            print(f"[{datetime.now().strftime('%H:%M:%S')}] 📬 {len(tasks)} tasks available in queue")

            except KeyboardInterrupt:
                print(f"\n[{datetime.now().strftime('%H:%M:%S')}] 👋 Shutting down...")
                await worker.send_coordination_message(f"{self.agent_name} going offline.")
                await worker.heartbeat(status="offline", current_task=None)


async def main():
    """Entry point."""
    alice = AliceAgent()
    await alice.run()


if __name__ == "__main__":
    asyncio.run(main())
