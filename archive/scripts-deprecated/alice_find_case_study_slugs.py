#!/usr/bin/env python3
"""
Alice - Find correct slugs for case study pages
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


async def find_pages():
    """Find all pages and their slugs."""

    token = generate_ghost_token()
    headers = {'Authorization': f'Ghost {token}'}

    async with httpx.AsyncClient(timeout=60.0) as client:
        # Get all pages
        response = await client.get(
            f"{GHOST_API_URL}/ghost/api/admin/pages/?limit=50",
            headers=headers
        )

        if response.status_code != 200:
            print(f"❌ Failed to fetch pages: {response.status_code}")
            return

        result = response.json()
        pages = result['pages']

        print(f"\n{'='*80}")
        print(f"📄 ALL PAGES ({len(pages)})")
        print(f"{'='*80}\n")

        # Look for case study pages
        case_studies = []

        for page in pages:
            title = page['title']
            slug = page['slug']
            url = page['url']

            # Check if it's a case study
            if any(keyword in title.lower() for keyword in ['neighborhoodshare', 'local llm', 'ai memory', 'case study', 'project']):
                case_studies.append({
                    'title': title,
                    'slug': slug,
                    'url': url
                })

        print(f"🔍 CASE STUDY PAGES:")
        for cs in case_studies:
            print(f"\n   Title: {cs['title']}")
            print(f"   Slug: {cs['slug']}")
            print(f"   URL: {cs['url']}")

        # Show all pages for reference
        print(f"\n\n📋 ALL PAGES:")
        for page in pages:
            print(f"\n   {page['title']}")
            print(f"      slug: {page['slug']}")
            print(f"      url: {page['url']}")


if __name__ == "__main__":
    asyncio.run(find_pages())
