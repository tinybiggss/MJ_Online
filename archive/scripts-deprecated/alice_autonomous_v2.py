#!/usr/bin/env python3
"""
Alice - Autonomous Mode V2
Coordinates with Morgan (PM) and executes tasks in priority order
"""

import asyncio
import sys
import os
from pathlib import Path
from datetime import datetime
from dotenv import load_dotenv

sys.path.insert(0, str(Path(__file__).parent / "agent_coordination"))
from agent_coordination.client import WorkerClient, MonitorClient

load_dotenv()


async def check_for_debbie_spec():
    """Check for Debbie's latest Substack landing page spec."""

    print("\n🔍 Checking for Debbie's Substack PAGE_SPEC...")

    design_path = Path("/Users/michaeljones/Dev/MJ_Online/design")

    # Look for Substack-related PAGE_SPECs
    specs = []
    if design_path.exists():
        for spec_file in design_path.glob("PAGE_SPEC-*.md"):
            if "substack" in spec_file.name.lower() or "writing" in spec_file.name.lower():
                stat = spec_file.stat()
                specs.append({
                    "file": spec_file,
                    "name": spec_file.name,
                    "modified": datetime.fromtimestamp(stat.st_mtime),
                    "size": stat.st_size
                })

    if specs:
        # Sort by modification time (newest first)
        specs.sort(key=lambda x: x["modified"], reverse=True)

        print(f"\n📄 Found {len(specs)} Substack-related PAGE_SPEC(s):")
        for i, spec in enumerate(specs):
            print(f"   {i+1}. {spec['name']}")
            print(f"      Modified: {spec['modified'].strftime('%Y-%m-%d %H:%M:%S')}")
            print(f"      Size: {spec['size']} bytes")

        # Return the newest one
        latest = specs[0]
        print(f"\n✅ Latest spec: {latest['name']}")
        print(f"   Modified: {latest['modified'].strftime('%Y-%m-%d %H:%M:%S')}")

        return latest
    else:
        print("   ⚠️  No Substack PAGE_SPEC found yet")
        print("   📋 Debbie may still be working on it")
        return None


async def coordinate_with_morgan():
    """Send coordination message to Morgan asking for task priorities."""

    async with WorkerClient("Alice") as worker:
        await worker.send_coordination_message(
            "🤖 ALICE - AUTONOMOUS MODE V2 STARTING\n\n"
            "@Morgan - Requesting task coordination:\n\n"
            "Current situation:\n"
            "  - Mike updated navigation: 'Writing' → 'Substack'\n"
            "  - Debbie is designing /substack landing page (2 publications: Resilient Tomorrow + Org Intelligence)\n"
            "  - Need to get LATEST PAGE_SPEC from Debbie (not old version)\n\n"
            "Questions for Morgan:\n"
            "  1. What are current task priorities?\n"
            "  2. Should I wait for Debbie's spec or work on other Phase 4 tasks?\n"
            "  3. Any tasks I should tackle first?\n\n"
            "Available in queue:\n"
            "  - phase4-seo (SEO audit)\n"
            "  - phase4-substack-resilient (awaiting Debbie's spec)\n"
            "  - phase4-substack-opint (awaiting Debbie's spec)\n"
            "  - phase4-social-links (social media links)\n\n"
            "Standing by for Morgan's guidance on priorities!"
        )

        print("✅ Coordination message sent to Morgan")


async def check_available_tasks():
    """Check what tasks are available in NATS queue."""

    print("\n📋 Checking available tasks in NATS queue...")

    async with MonitorClient() as monitor:
        available = await monitor.get_all_tasks(status="available")

        if available:
            print(f"\n✅ Found {len(available)} available tasks:\n")

            # Group by priority
            critical = []
            high = []
            medium = []
            normal = []

            for task in available:
                priority = task.get('priority', 'normal')
                if priority == 'critical':
                    critical.append(task)
                elif priority == 'high':
                    high.append(task)
                elif priority == 'medium':
                    medium.append(task)
                else:
                    normal.append(task)

            if critical:
                print(f"🔴 CRITICAL ({len(critical)}):")
                for task in critical:
                    print(f"   - {task['task_id']}: {task['title'][:60]}")

            if high:
                print(f"\n🟠 HIGH ({len(high)}):")
                for task in high:
                    print(f"   - {task['task_id']}: {task['title'][:60]}")

            if medium:
                print(f"\n🟡 MEDIUM ({len(medium)}):")
                for task in medium:
                    print(f"   - {task['task_id']}: {task['title'][:60]}")

            if normal:
                print(f"\n⚪ NORMAL ({len(normal)}):")
                for task in normal:
                    print(f"   - {task['task_id']}: {task['title'][:60]}")

            return available
        else:
            print("✅ No available tasks in queue")
            return []


async def wait_for_coordination():
    """Wait a bit for Morgan to respond, then check for guidance."""

    print("\n⏳ Waiting for Morgan's coordination response (30 seconds)...")
    await asyncio.sleep(30)

    print("\n📬 Checking for coordination messages...")

    async with MonitorClient() as monitor:
        messages = await monitor.get_messages(channel="coordination", limit=10)

        if messages:
            print(f"\n💬 Recent coordination messages ({len(messages)}):")
            for msg in messages[-5:]:  # Show last 5
                agent = msg.get('agent_id', 'Unknown')
                content = msg.get('content', '')
                timestamp = msg.get('timestamp', '')

                # Look for Morgan's responses
                if 'morgan' in agent.lower():
                    print(f"\n📨 From {agent} ({timestamp}):")
                    print(f"   {content[:200]}...")
        else:
            print("   No recent coordination messages")


async def autonomous_execution():
    """Main autonomous execution loop."""

    print("\n" + "="*80)
    print("🤖 ALICE - AUTONOMOUS MODE V2")
    print("="*80)

    async with WorkerClient("Alice") as worker:
        # Register
        await worker.register(
            description="Web Content Builder - Autonomous V2 - Coordinating with Morgan"
        )
        await worker.heartbeat(status="active", current_task=None)

        print("\n✅ Registered with NATS")
        print("✅ Heartbeat active\n")

        # Step 1: Coordinate with Morgan
        print("="*80)
        print("STEP 1: COORDINATE WITH MORGAN")
        print("="*80)
        await coordinate_with_morgan()

        # Step 2: Check for Debbie's spec
        print("\n" + "="*80)
        print("STEP 2: CHECK FOR DEBBIE'S SUBSTACK SPEC")
        print("="*80)
        debbie_spec = await check_for_debbie_spec()

        # Step 3: Check available tasks
        print("\n" + "="*80)
        print("STEP 3: CHECK AVAILABLE TASKS")
        print("="*80)
        available_tasks = await check_available_tasks()

        # Step 4: Wait for Morgan's guidance
        print("\n" + "="*80)
        print("STEP 4: WAIT FOR MORGAN'S COORDINATION")
        print("="*80)
        await wait_for_coordination()

        # Step 5: Determine what to work on
        print("\n" + "="*80)
        print("STEP 5: DETERMINE NEXT ACTIONS")
        print("="*80)

        if debbie_spec:
            print(f"\n✅ Debbie's spec is ready: {debbie_spec['name']}")
            print("   📋 Can proceed with Substack landing page workflow")

            await worker.send_coordination_message(
                f"📄 Alice found Debbie's spec: {debbie_spec['name']}\n"
                f"   Modified: {debbie_spec['modified'].strftime('%Y-%m-%d %H:%M:%S')}\n\n"
                "@Morgan - Ready to proceed with Substack landing page:\n"
                "  1. Review Debbie's PAGE_SPEC\n"
                "  2. Upload any required logos/images\n"
                "  3. Coordinate with Doc Brown for HTML assembly\n"
                "  4. Publish page via Ghost Admin API\n\n"
                "Awaiting Morgan's approval to proceed!"
            )

            print("\n✅ Coordination message sent")
            print("⏸️  Waiting for Morgan's approval to proceed with Substack page")

        else:
            print("\n⚠️  Debbie's spec not ready yet")
            print("📋 Can work on other Phase 4 tasks while waiting:")

            # Suggest alternatives
            alternative_tasks = [
                "phase4-seo (SEO audit - can be done independently)",
                "phase4-social-links (social media links - quick win)"
            ]

            print("\n💡 Suggested alternative tasks:")
            for task in alternative_tasks:
                print(f"   - {task}")

            await worker.send_coordination_message(
                "⏸️  Alice autonomous mode - PAUSED\n\n"
                "Status:\n"
                "  - Debbie's Substack spec not found yet (still in progress)\n"
                "  - Available tasks checked\n"
                "  - Awaiting Morgan's guidance on priorities\n\n"
                "@Morgan - Options:\n"
                "  A. Wait for Debbie's spec (stay idle)\n"
                "  B. Work on phase4-seo (SEO audit)\n"
                "  C. Work on phase4-social-links (social media)\n"
                "  D. Other task?\n\n"
                "Standing by for direction!"
            )

            print("\n✅ Coordination message sent")
            print("⏸️  Paused - waiting for Morgan's direction")

        # Step 6: Maintain heartbeat while waiting
        await worker.heartbeat(
            status="idle",
            current_task=None,
            needs_approval=True,
            approval_message="Awaiting Morgan's guidance on task priorities"
        )

        print("\n" + "="*80)
        print("✅ AUTONOMOUS MODE - COORDINATION PHASE COMPLETE")
        print("="*80)
        print("\n📊 Summary:")
        print(f"   - Coordinated with Morgan: ✅")
        print(f"   - Checked for Debbie's spec: {'✅' if debbie_spec else '⏳ In progress'}")
        print(f"   - Available tasks: {len(available_tasks)}")
        print(f"   - Status: {'Ready to proceed' if debbie_spec else 'Awaiting direction'}")
        print("\n✨ Alice standing by for Morgan's guidance")
        print("📊 Dashboard: http://localhost:8001")


if __name__ == "__main__":
    asyncio.run(autonomous_execution())
