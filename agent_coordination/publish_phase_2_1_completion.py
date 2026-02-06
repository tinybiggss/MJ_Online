"""Publish Phase 2.1 completion status to NATS coordination channel."""

import asyncio
from datetime import datetime
from nats_client import NATSCoordinationClient
from models import Message

async def publish_completion():
    """Publish Phase 2.1 theme selection completion."""

    client = NATSCoordinationClient()

    try:
        await client.connect()

        # Create completion message
        message = Message(
            agent_id="agent-theme-selector",
            channel="coordination",
            content="""
Phase 2.1: Theme Selection & Installation - DOCUMENTATION COMPLETE

Status: Recommendation ready for user review

Selected Theme: Kyoto by Themex Studio ($89)

Key Decisions:
- Kyoto chosen for best balance of portfolio features, dark mode (8 presets), and value
- Professional design specifically for developers and makers
- Ghost 6.x compatible, ensuring ActivityPub integration
- Lifetime updates, saving 10-20 hours of custom development

Documents Created:
1. /Users/michaeljones/Dev/MJ_Online/plans/theme-selection-decision.md
2. /Users/michaeljones/Dev/MJ_Online/plans/kyoto-installation-guide.md

Next Steps Required:
1. User to purchase Kyoto theme from https://themex.studio/kyoto/
2. User to install theme via Ghost Admin
3. User to configure dark mode preset (recommend: Onyx)
4. Proceed to Phase 2.2: Content Structure

Browser Automation: User declined browser access, manual installation required

Investment: $89 one-time (excellent ROI - saves development time worth $500-1000)

Agent Notes:
- Theme research already completed by Agent-Beta
- Recommendation based on comprehensive analysis of 10 themes
- Installation guide provides step-by-step instructions
- All Phase 2.1 objectives met except actual installation (user action required)
            """.strip(),
            timestamp=datetime.utcnow()
        )

        # Publish to coordination channel
        result = await client.publish_message(message)

        print("✓ Phase 2.1 completion published to NATS coordination channel")
        print(f"  Sequence: {result['sequence']}")
        print(f"  Stream: {result['stream']}")
        print(f"  Timestamp: {result['timestamp']}")

    except Exception as e:
        print(f"✗ Error publishing completion: {e}")
        print("  Note: This is expected if NATS server is not running")
        print("  The documentation is complete regardless of NATS status")
    finally:
        await client.disconnect()


if __name__ == "__main__":
    print("Publishing Phase 2.1 completion to NATS coordination channel...")
    asyncio.run(publish_completion())
