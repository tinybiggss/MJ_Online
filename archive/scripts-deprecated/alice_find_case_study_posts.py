#!/usr/bin/env python3
"""
Alice - Find case study posts
"""

import os
import jwt
import httpx
import asyncio
from datetime import datetime as dt
from dotenv import load_dotenv

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


async def find_posts():
    """Find all posts and look for case studies."""

    token = generate_ghost_token()
    headers = {'Authorization': f'Ghost {token}'}

    async with httpx.AsyncClient(timeout=60.0) as client:
        # Get all posts
        response = await client.get(
            f"{GHOST_API_URL}/ghost/api/admin/posts/?limit=50",
            headers=headers
        )

        if response.status_code != 200:
            print(f"❌ Failed to fetch posts: {response.status_code}")
            return

        result = response.json()
        posts = result['posts']

        print(f"\n{'='*80}")
        print(f"📰 ALL POSTS ({len(posts)})")
        print(f"{'='*80}\n")

        # Look for case study posts
        case_studies = []

        for post in posts:
            title = post['title']
            slug = post['slug']
            url = post['url']

            # Check if it's a case study
            if any(keyword in title.lower() for keyword in ['neighborhoodshare', 'local llm', 'ai memory', 'infrastructure']):
                case_studies.append({
                    'title': title,
                    'slug': slug,
                    'url': url,
                    'status': post['status']
                })

        if case_studies:
            print(f"🔍 CASE STUDY POSTS:")
            for cs in case_studies:
                print(f"\n   Title: {cs['title']}")
                print(f"   Slug: {cs['slug']}")
                print(f"   URL: {cs['url']}")
                print(f"   Status: {cs['status']}")
        else:
            print("⚠️ No case study posts found matching keywords")

        # Show all posts for reference
        print(f"\n\n📋 ALL POSTS:")
        for post in posts:
            print(f"\n   {post['title']}")
            print(f"      slug: {post['slug']}")
            print(f"      status: {post['status']}")


if __name__ == "__main__":
    asyncio.run(find_posts())
