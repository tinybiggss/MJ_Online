#!/usr/bin/env python3
"""
Alice - Fetch /writing page (Lexical format) to fix JavaScript error
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
    """Fetch the /writing page with Lexical format."""
    token = generate_ghost_token()
    headers = {'Authorization': f'Ghost {token}'}

    async with httpx.AsyncClient(timeout=60.0) as client:
        # Get page with all formats
        response = await client.get(
            f"{GHOST_API_URL}/ghost/api/admin/pages/slug/writing/?formats=html,lexical",
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
            print(f"   Lexical length: {len(page.get('lexical', ''))} chars")

            # Parse Lexical content
            if page.get('lexical'):
                lexical = json.loads(page['lexical'])

                # Save full Lexical JSON for inspection
                with open('/tmp/writing_page_lexical.json', 'w') as f:
                    json.dump(lexical, f, indent=2)

                print(f"\n✅ Saved Lexical JSON to /tmp/writing_page_lexical.json")

                # Find HTML cards in the Lexical structure
                html_cards = []
                children = lexical.get('root', {}).get('children', [])

                for i, child in enumerate(children):
                    if child.get('type') == 'html':
                        html_content = child.get('html', '')
                        html_cards.append((i, html_content))
                        print(f"\n📋 Found HTML card at index {i}:")
                        print(f"   Length: {len(html_content)} chars")

                        # Check for line 987 in this HTML
                        html_lines = html_content.split('\n')
                        if len(html_lines) >= 987:
                            print(f"   ⚠️ This HTML card has {len(html_lines)} lines (contains line 987)")
                            print(f"\n🔍 Line 987 context (lines 980-995):")
                            for j in range(max(0, 980), min(len(html_lines), 995)):
                                line_num = j + 1
                                marker = ">>> " if line_num == 987 else "    "
                                print(f"{marker}{line_num:4d}: {html_lines[j][:120]}")

                # Save the largest HTML card for inspection
                if html_cards:
                    largest_card = max(html_cards, key=lambda x: len(x[1]))
                    with open('/tmp/writing_page_html_card.html', 'w') as f:
                        f.write(largest_card[1])
                    print(f"\n✅ Saved largest HTML card to /tmp/writing_page_html_card.html")
                    print(f"   Card index: {largest_card[0]}")
                    print(f"   Lines: {len(largest_card[1].split(chr(10)))}")

            return page
        else:
            print(f"❌ Failed to fetch page: {response.status_code}")
            print(f"   Response: {response.text}")
            return None


if __name__ == "__main__":
    asyncio.run(fetch_writing_page())
