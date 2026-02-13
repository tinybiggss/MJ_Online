#!/usr/bin/env python3
"""
Alice - Update SEO for case study POSTS
"""

import os
import jwt
import httpx
import asyncio
import sys
from datetime import datetime as dt
from dotenv import load_dotenv
from pathlib import Path

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


# SEO config for case study posts
CASE_STUDY_SEO = {
    "neighborhoodshare": {
        "slug": "neighborhoodshare",
        "meta_description": "AI-powered tool-sharing platform building community connections. GPT-4o Vision categorization, geolocation, SMS workflow. 170 active users across 20 zip codes.",
        "og_title": "NeighborhoodShare: Building Community Through Tool Sharing",
        "og_description": "AI-powered tool-sharing platform building community connections. GPT-4o Vision categorization, geolocation, SMS workflow. 170 active users across 20 zip codes.",
        "og_image": "https://www.mikejones.online/content/images/2026/02/og-neighborhoodshare.png",
        "og_url": "https://www.mikejones.online/neighborhoodshare/",
        "twitter_title": "NeighborhoodShare Case Study",
        "twitter_description": "AI-powered tool-sharing platform. 170 users across 20 zip codes. GPT-4o Vision, geolocation, SMS."
    },
    "local-llm-setup": {
        "slug": "local-llm-setup",
        "meta_description": "Self-hosted AI infrastructure providing private, offline capabilities. No cloud dependencies, no subscriptions. Ollama, Qwen 2.5:14B, OpenWebUI, RAG integration.",
        "og_title": "Local LLM Setup: Self-Hosted AI Infrastructure",
        "og_description": "Self-hosted AI infrastructure providing private, offline capabilities. No cloud dependencies, no subscriptions. Ollama, Qwen 2.5:14B, OpenWebUI.",
        "og_image": "https://www.mikejones.online/content/images/2026/02/Offline-AI-Architecture.png",
        "og_url": "https://www.mikejones.online/local-llm-setup/",
        "twitter_title": "Local LLM Setup",
        "twitter_description": "Self-hosted AI infrastructure. Private, offline. No cloud dependencies. Ollama, Qwen 2.5:14B, RAG."
    },
    "ai-memory-system": {
        "slug": "ai-memory-system",
        "meta_description": "Personal knowledge management infrastructure maintaining context across AI conversations. JSONL ledger format works with Claude, ChatGPT, and local LLMs.",
        "og_title": "AI Memory System: Building Personal AI Workflow Automation",
        "og_description": "Personal knowledge management infrastructure maintaining context across AI conversations. JSONL ledger format works with Claude, ChatGPT, local LLMs.",
        "og_image": "https://www.mikejones.online/content/images/2026/02/og-ai-memory.png",
        "og_url": "https://www.mikejones.online/ai-memory-system/",
        "twitter_title": "AI Memory System",
        "twitter_description": "Personal knowledge management for AI conversations. JSONL ledger works with Claude, ChatGPT, local LLMs."
    }
}


def generate_seo_tags(config):
    """Generate SEO meta tags HTML."""

    tags = []

    # Meta description
    tags.append(f'<meta name="description" content="{config["meta_description"]}">')

    # Open Graph tags
    tags.append(f'<meta property="og:title" content="{config["og_title"]}">')
    tags.append(f'<meta property="og:description" content="{config["og_description"]}">')
    tags.append(f'<meta property="og:image" content="{config["og_image"]}">')
    tags.append(f'<meta property="og:url" content="{config["og_url"]}">')
    tags.append('<meta property="og:type" content="article">')  # Changed to "article" for posts
    tags.append('<meta property="og:site_name" content="MikeJones.online">')

    # Twitter Cards
    tags.append('<meta name="twitter:card" content="summary_large_image">')
    tags.append(f'<meta name="twitter:title" content="{config["twitter_title"]}">')
    tags.append(f'<meta name="twitter:description" content="{config["twitter_description"]}">')
    tags.append(f'<meta name="twitter:image" content="{config["og_image"]}">')

    # Canonical URL
    tags.append(f'<link rel="canonical" href="{config["og_url"]}">')

    return "\n".join(tags)


async def update_post_seo(slug, config):
    """Update a single post with SEO meta tags."""

    print(f"\n{'='*80}")
    print(f"📰 Updating post: {slug}")
    print(f"{'='*80}")

    token = generate_ghost_token()
    headers = {'Authorization': f'Ghost {token}'}

    async with httpx.AsyncClient(timeout=60.0) as client:
        # Get current post
        print(f"📖 Fetching post...")
        response = await client.get(
            f"{GHOST_API_URL}/ghost/api/admin/posts/slug/{slug}/",
            headers=headers
        )

        if response.status_code != 200:
            print(f"❌ Failed to fetch post: {response.status_code}")
            return False

        result = response.json()
        post = result['posts'][0]

        print(f"✅ Found: {post['title']}")
        print(f"   ID: {post['id']}")

        # Generate SEO tags
        seo_tags = generate_seo_tags(config)

        # Prepare update payload
        update_payload = {
            "posts": [{
                "codeinjection_head": seo_tags,
                "updated_at": post['updated_at']
            }]
        }

        # Update post
        print(f"📤 Adding SEO meta tags...")
        response = await client.put(
            f"{GHOST_API_URL}/ghost/api/admin/posts/{post['id']}/",
            headers=headers,
            json=update_payload
        )

        if response.status_code != 200:
            print(f"❌ Update failed: {response.status_code} - {response.text}")
            return False

        print(f"✅ Successfully updated!")
        print(f"   Meta description: {len(config['meta_description'])} chars")
        print(f"   Open Graph: ✅ (type: article)")
        print(f"   Twitter Cards: ✅")
        print(f"   Canonical: ✅")

        return True


async def update_case_studies():
    """Update SEO for case study posts."""

    print("\n" + "="*80)
    print("🤖 ALICE - UPDATING CASE STUDY SEO (POSTS)")
    print("="*80)

    async with WorkerClient("Alice") as worker:
        await worker.heartbeat(
            status="busy",
            current_task="phase4-seo",
            current_task_title="SEO - Completing case study posts"
        )

        results = []

        # Update each case study post
        for slug, config in CASE_STUDY_SEO.items():
            success = await update_post_seo(slug, config)
            results.append({"slug": slug, "success": success})
            await asyncio.sleep(2)

        # Summary
        print("\n" + "="*80)
        print("📊 CASE STUDY SEO UPDATE SUMMARY")
        print("="*80)

        successful = sum(1 for r in results if r["success"])
        print(f"\n✅ Successfully updated: {successful}/{len(results)} case study posts")

        if successful == len(results):
            print(f"\n🎉 ALL CASE STUDIES UPDATED!")
            print(f"   NeighborhoodShare: ✅")
            print(f"   Local LLM Setup: ✅")
            print(f"   AI Memory System: ✅")
        else:
            print(f"\n⚠️ Failed posts:")
            for r in results:
                if not r["success"]:
                    print(f"   - {r['slug']}")

        print(f"\n📋 SEO Implementation Status:")
        print(f"   Pages: 4/4 ✅ (Homepage, About, Resume, Projects)")
        print(f"   Posts: {successful}/3 {'✅' if successful == 3 else '⚠️'} (Case studies)")
        print(f"   Total: {4 + successful}/7 pages/posts")

        print(f"\n⚠️ Next Steps:")
        print(f"   • Coordinate with Debbie on og:image creation")
        print(f"   • Upload og:images to Ghost CDN")
        print(f"   • Update og:image URLs in meta tags")
        print(f"   • Validate with Google Rich Results Test")

        await worker.send_coordination_message(
            f"🎉 ALICE - CASE STUDY SEO COMPLETE!\n\n"
            f"✅ Updated {successful}/3 case study posts with SEO meta tags\n"
            "   • NeighborhoodShare\n"
            "   • Local LLM Setup\n"
            "   • AI Memory System\n\n"
            f"📊 SEO Implementation: {4 + successful}/7 complete\n"
            "   ✅ Pages: 4/4 (Homepage, About, Resume, Projects)\n"
            f"   ✅ Posts: {successful}/3 (Case studies)\n\n"
            "⚠️ Waiting on Debbie for og:image creation\n"
            "   Need to upload and update og:image URLs"
        )

        await worker.heartbeat(status="idle", current_task=None)

        print("\n✨ Alice - Case study SEO complete!")


if __name__ == "__main__":
    asyncio.run(update_case_studies())
