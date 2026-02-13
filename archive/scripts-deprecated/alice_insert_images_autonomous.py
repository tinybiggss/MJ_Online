#!/usr/bin/env python3
"""
Alice - Insert Images into Articles (Autonomous)
Add uploaded images to Local LLM and NeighborhoodShare articles
"""

import asyncio
import sys
import os
import jwt
import json
from pathlib import Path
from datetime import datetime as dt
from dotenv import load_dotenv
import httpx

sys.path.insert(0, str(Path(__file__).parent / "agent_coordination"))
from agent_coordination.client import WorkerClient

load_dotenv()
GHOST_ADMIN_API_KEY = os.getenv('GHOST_ADMIN_API_KEY')
GHOST_API_URL = os.getenv('GHOST_API_URL')


def generate_ghost_token():
    """Generate JWT token for Ghost Admin API."""
    key_id, secret = GHOST_ADMIN_API_KEY.split(':')
    iat = int(dt.now().timestamp())
    header = {'alg': 'HS256', 'typ': 'JWT', 'kid': key_id}
    payload = {'iat': iat, 'exp': iat + 5 * 60, 'aud': '/admin/'}
    token = jwt.encode(payload, bytes.fromhex(secret), algorithm='HS256', headers=header)
    return token


async def insert_local_llm_diagram():
    """Insert workflow diagram into Local LLM article."""

    print("\n" + "="*80)
    print("TASK: INSERT LOCAL LLM WORKFLOW DIAGRAM")
    print("="*80)

    diagram_url = "https://www.mikejones.online/content/images/2026/02/OfflineAI-Session-Workflow-1.png"

    print(f"\n📋 Article: local-llm-infrastructure")
    print(f"📸 Diagram: {diagram_url}")

    token = generate_ghost_token()
    headers = {'Authorization': f'Ghost {token}'}

    async with httpx.AsyncClient(timeout=60.0) as client:
        # Get article
        print("\n📖 Fetching article...")
        response = await client.get(
            f"{GHOST_API_URL}/ghost/api/admin/posts/slug/local-llm-infrastructure/?formats=lexical",
            headers=headers
        )

        if response.status_code != 200:
            raise Exception(f"Failed to fetch article: {response.status_code}")

        result = response.json()
        post = result['posts'][0]

        print(f"✅ Article found: {post['title']}")
        print(f"   Current lexical length: {len(post['lexical'])} chars")

        # Parse Lexical content
        lexical = json.loads(post['lexical'])

        # Create image card for the workflow diagram
        image_card = {
            "type": "image",
            "version": 1,
            "src": diagram_url,
            "alt": "OfflineAI Session Workflow - Request routing and response flow",
            "caption": "Session workflow showing how requests are routed through the AI Memory System",
            "width": 1200,
            "height": 800
        }

        # Insert near the end of the article (before conclusion if present)
        # For now, insert at a reasonable position (e.g., after 70% of content)
        children = lexical['root']['children']
        insert_pos = int(len(children) * 0.7)  # 70% through the article

        children.insert(insert_pos, image_card)

        # Update lexical
        lexical['root']['children'] = children
        new_lexical = json.dumps(lexical)

        print(f"   New lexical length: {len(new_lexical)} chars")
        print(f"   Inserted diagram at position {insert_pos}")

        # Update article
        print("\n📤 Updating article...")
        update_payload = {
            "posts": [{
                "lexical": new_lexical,
                "updated_at": post['updated_at']
            }]
        }

        response = await client.put(
            f"{GHOST_API_URL}/ghost/api/admin/posts/{post['id']}/",
            headers=headers,
            json=update_payload
        )

        if response.status_code != 200:
            raise Exception(f"Update failed: {response.status_code} - {response.text}")

        print(f"✅ Article updated successfully!")
        print(f"   URL: https://www.mikejones.online/local-llm-infrastructure/")

        return {
            "article": "local-llm-infrastructure",
            "images_added": 1,
            "status": "completed"
        }


async def insert_neighborhoodshare_screenshots():
    """Insert screenshots into NeighborhoodShare article."""

    print("\n" + "="*80)
    print("TASK: INSERT NEIGHBORHOODSHARE SCREENSHOTS")
    print("="*80)

    screenshots = [
        {
            "url": "https://www.mikejones.online/content/images/2026/02/Home-Tool-Selection-1.png",
            "alt": "NeighborhoodShare home page showing tool selection interface",
            "caption": "Main interface for browsing and selecting tools from the community"
        },
        {
            "url": "https://www.mikejones.online/content/images/2026/02/Add-Tool-AI-2-2.png",
            "alt": "AI-powered tool cataloging interface",
            "caption": "AI-assisted tool cataloging with automatic metadata extraction"
        },
        {
            "url": "https://www.mikejones.online/content/images/2026/02/Admin-Prod-4-AIMonitoring.png",
            "alt": "Admin dashboard showing AI monitoring metrics",
            "caption": "Real-time AI monitoring dashboard tracking system performance"
        },
        {
            "url": "https://www.mikejones.online/content/images/2026/02/Tool-Detail-Owner.png",
            "alt": "Tool detail page showing owner information",
            "caption": "Detailed tool page with availability calendar and owner contact"
        },
        {
            "url": "https://www.mikejones.online/content/images/2026/02/LandingPage.png",
            "alt": "NeighborhoodShare landing page",
            "caption": "Landing page showcasing the platform's value proposition"
        }
    ]

    print(f"\n📋 Article: neighborhoodshare")
    print(f"📸 Screenshots to insert: {len(screenshots)}")

    token = generate_ghost_token()
    headers = {'Authorization': f'Ghost {token}'}

    async with httpx.AsyncClient(timeout=60.0) as client:
        # Get article
        print("\n📖 Fetching article...")
        response = await client.get(
            f"{GHOST_API_URL}/ghost/api/admin/posts/slug/neighborhoodshare/?formats=lexical",
            headers=headers
        )

        if response.status_code == 404:
            # Try alternate slugs
            alt_slugs = [
                "neighborhoodshare-ai-powered-community-tool-sharing-platform",
                "neighborhoodshare-case-study"
            ]

            for alt_slug in alt_slugs:
                response = await client.get(
                    f"{GHOST_API_URL}/ghost/api/admin/posts/slug/{alt_slug}/?formats=lexical",
                    headers=headers
                )
                if response.status_code == 200:
                    break

        if response.status_code != 200:
            raise Exception(f"Failed to fetch article: {response.status_code}")

        result = response.json()
        post = result['posts'][0]

        print(f"✅ Article found: {post['title']}")
        print(f"   Slug: {post['slug']}")
        print(f"   Current lexical length: {len(post['lexical'])} chars")

        # Parse Lexical content
        lexical = json.loads(post['lexical'])
        children = lexical['root']['children']

        # Insert screenshots at strategic points (distribute throughout article)
        positions = [
            int(len(children) * 0.2),  # 20% - early
            int(len(children) * 0.4),  # 40% - mid-early
            int(len(children) * 0.6),  # 60% - mid-late
            int(len(children) * 0.8),  # 80% - late
            int(len(children) * 0.9)   # 90% - near end
        ]

        # Insert in reverse order to maintain positions
        for i, screenshot in enumerate(reversed(screenshots)):
            image_card = {
                "type": "image",
                "version": 1,
                "src": screenshot["url"],
                "alt": screenshot["alt"],
                "caption": screenshot["caption"],
                "width": 1200,
                "height": 800
            }

            pos = positions[len(screenshots) - 1 - i]
            children.insert(pos, image_card)
            print(f"   ✅ Inserted screenshot {len(screenshots) - i} at position {pos}")

        # Update lexical
        lexical['root']['children'] = children
        new_lexical = json.dumps(lexical)

        print(f"\n   New lexical length: {len(new_lexical)} chars")

        # Update article
        print("\n📤 Updating article...")
        update_payload = {
            "posts": [{
                "lexical": new_lexical,
                "updated_at": post['updated_at']
            }]
        }

        response = await client.put(
            f"{GHOST_API_URL}/ghost/api/admin/posts/{post['id']}/",
            headers=headers,
            json=update_payload
        )

        if response.status_code != 200:
            raise Exception(f"Update failed: {response.status_code} - {response.text}")

        print(f"✅ Article updated successfully!")
        print(f"   URL: {post['url']}")

        return {
            "article": post['slug'],
            "images_added": len(screenshots),
            "status": "completed"
        }


async def insert_images_workflow():
    """Execute image insertion workflow."""

    print("\n" + "="*80)
    print("🤖 ALICE - IMAGE INSERTION (AUTONOMOUS)")
    print("="*80)

    async with WorkerClient("Alice") as worker:
        await worker.heartbeat(
            status="busy",
            current_task="qa-images-insertion",
            current_task_title="Inserting images into Local LLM and NeighborhoodShare articles"
        )

        await worker.send_coordination_message(
            "🤖 ALICE - STARTING IMAGE INSERTION\n\n"
            "Tasks:\n"
            "  1. qa-img-2: Insert workflow diagram into Local LLM article\n"
            "  2. qa-img-4: Insert screenshots into NeighborhoodShare article\n\n"
            "Using Lexical format to insert images at strategic positions\n"
            "Estimated time: 10-15 minutes"
        )

        results = []

        try:
            # Task 1: Local LLM diagram
            llm_result = await insert_local_llm_diagram()
            results.append(llm_result)

            await worker.send_coordination_message(
                f"✅ Task 1 Complete: Local LLM diagram inserted\n"
                f"   Article: {llm_result['article']}\n"
                f"   Images added: {llm_result['images_added']}"
            )

            await asyncio.sleep(2)

            # Task 2: NeighborhoodShare screenshots
            ns_result = await insert_neighborhoodshare_screenshots()
            results.append(ns_result)

            await worker.send_coordination_message(
                f"✅ Task 2 Complete: NeighborhoodShare screenshots inserted\n"
                f"   Article: {ns_result['article']}\n"
                f"   Images added: {ns_result['images_added']}"
            )

            # Final summary
            print("\n" + "="*80)
            print("✅ ALL IMAGE INSERTIONS COMPLETE")
            print("="*80)

            total_images = sum(r['images_added'] for r in results)

            print(f"\n📊 Summary:")
            print(f"   Articles updated: {len(results)}")
            print(f"   Total images inserted: {total_images}")

            for result in results:
                print(f"\n   • {result['article']}: {result['images_added']} image(s)")

            await worker.send_coordination_message(
                f"🎉 ALICE - IMAGE INSERTION COMPLETE!\n\n"
                f"✅ Updated {len(results)} articles with {total_images} images\n"
                f"   - Local LLM: 1 diagram\n"
                f"   - NeighborhoodShare: 5 screenshots\n\n"
                f"Both articles now have visual content!\n\n"
                f"Alice ready for next task."
            )

            await worker.heartbeat(status="idle", current_task=None)

            print("\n✨ Alice autonomous image insertion complete!")

        except Exception as e:
            error_msg = f"Image insertion failed: {str(e)}"
            print(f"\n❌ ERROR: {error_msg}")
            await worker.report_error(error_msg)
            await worker.heartbeat(status="idle", current_task=None)
            raise


if __name__ == "__main__":
    asyncio.run(insert_images_workflow())
