#!/usr/bin/env python3
"""
Alice - Fetch /writing page to fix JavaScript error
"""

import os
import jwt
import json
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


async def fetch_writing_page():
    """Fetch the /writing page (Substack landing page)."""
    token = generate_ghost_token()
    headers = {'Authorization': f'Ghost {token}'}

    async with httpx.AsyncClient(timeout=60.0) as client:
        # Try to get page by slug "writing"
        response = await client.get(
            f"{GHOST_API_URL}/ghost/api/admin/pages/slug/writing/",
            headers=headers
        )

        if response.status_code == 200:
            result = response.json()
            page = result['pages'][0]

            print(f"✅ Found page: {page['title']}")
            print(f"   Slug: {page['slug']}")
            print(f"   URL: {page['url']}")
            print(f"   ID: {page['id']}")
            print(f"   HTML length: {len(page.get('html', ''))} chars")

            # Save HTML to file for inspection
            with open('/tmp/writing_page.html', 'w') as f:
                f.write(page.get('html', ''))

            print(f"\n✅ Saved HTML to /tmp/writing_page.html")

            # Check for line 987 and surrounding context
            html_lines = page.get('html', '').split('\n')
            print(f"\n📊 Total lines: {len(html_lines)}")

            if len(html_lines) >= 987:
                print(f"\n🔍 Line 987 context (lines 980-995):")
                for i in range(max(0, 980), min(len(html_lines), 995)):
                    line_num = i + 1
                    marker = ">>> " if line_num == 987 else "    "
                    print(f"{marker}{line_num:4d}: {html_lines[i][:100]}")

            return page
        else:
            print(f"❌ Failed to fetch page: {response.status_code}")
            print(f"   Response: {response.text}")
            return None


if __name__ == "__main__":
    asyncio.run(fetch_writing_page())
