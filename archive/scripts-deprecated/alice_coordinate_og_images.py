#!/usr/bin/env python3
"""
Alice - Coordinate with Debbie on og:image creation
"""

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent / "agent_coordination"))
from agent_coordination.client import WorkerClient


async def coordinate_og_images():
    """Send coordination message to Debbie about og:images."""

    async with WorkerClient("Alice") as worker:
        await worker.heartbeat(status="active", current_task=None)

        # Send coordination message
        await worker.send_coordination_message(
            "📸 ALICE → DEBBIE: OG:IMAGE COORDINATION\n\n"
            "Hey Debbie! I've completed the SEO meta tag implementation for all 7 pages/posts.\n\n"
            "✅ COMPLETED:\n"
            "   • Meta descriptions (150-160 chars)\n"
            "   • Open Graph tags (og:title, og:description, og:url, og:type)\n"
            "   • Twitter Cards (summary_large_image)\n"
            "   • Canonical links\n"
            "   • Title tag updates\n\n"
            "⚠️ BLOCKED ON OG:IMAGES:\n"
            "   I've set placeholder og:image URLs in the meta tags, but we need the actual images.\n\n"
            "📋 IMAGES NEEDED (1200x630px):\n"
            "   1. og-homepage.png - Professional headshot + title + tagline\n"
            "   2. og-about.png - Headshot + \"About Mike Jones\" + key facts\n"
            "   3. og-resume.png - Text-focused with key highlights\n"
            "   4. og-projects.png - Collage of 3 project screenshots\n"
            "   5. og-neighborhoodshare.png - Resize existing screenshot + title overlay\n"
            "   6. og-ai-memory.png - Workflow diagram (per IMAGE-REQUEST spec)\n"
            "   7. Offline-AI-Architecture.png - Already exists, just needs resize to 1200x630\n\n"
            "📁 EXISTING ASSETS:\n"
            "   • NeighborhoodShare screenshots: /assets/projects/neighborhoodshare/\n"
            "   • Local LLM architecture: /assets/projects/local-llm/Offline-AI-Architecture.png\n\n"
            "🎨 DESIGN SPECS:\n"
            "   • Brand colors: Neon Cyan (#00D9FF), Indigo (#4F46E5)\n"
            "   • Font: Inter\n"
            "   • See SEO-AUDIT-REPORT-2026-02-11.md for full specs\n\n"
            "Mike mentioned you're working on these. When they're ready:\n"
            "   1. Upload to Ghost Admin → Content → Images\n"
            "   2. Share the CDN URLs with me\n"
            "   3. I'll update the og:image URLs in all meta tags\n\n"
            "Let me know if you need any help or have questions! 🚀"
        )

        print("="*80)
        print("📸 OG:IMAGE COORDINATION MESSAGE SENT TO DEBBIE")
        print("="*80)
        print("\n✅ Coordination message published to NATS")
        print("📊 Dashboard: http://localhost:8001")
        print("\nWaiting for Debbie to create and upload og:images...")
        print("\nNext: Moving on to social media links task")


if __name__ == "__main__":
    asyncio.run(coordinate_og_images())
