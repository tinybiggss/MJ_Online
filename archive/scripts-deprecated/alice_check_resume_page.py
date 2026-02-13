#!/usr/bin/env python3
"""Check current resume page content."""

import asyncio
import sys
import os
import jwt
from datetime import datetime as dt
from dotenv import load_dotenv
import httpx
import json

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


async def check_page():
    """Check resume page content."""

    token = generate_ghost_token()
    headers = {'Authorization': f'Ghost {token}'}

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{GHOST_API_URL}/ghost/api/admin/pages/slug/resume/?formats=html,lexical",
            headers=headers
        )

        if response.status_code != 200:
            print(f"❌ Failed: {response.status_code}")
            print(response.text)
            return

        result = response.json()
        page = result['pages'][0]

        print(f"Page ID: {page['id']}")
        print(f"Title: {page['title']}")
        print(f"Status: {page['status']}")
        print(f"\nHTML length: {len(page.get('html', ''))} chars")
        print(f"Lexical length: {len(page.get('lexical', ''))} chars")
        print(f"\nHTML preview (first 500 chars):")
        print(page.get('html', '')[:500])
        print(f"\n\nLexical preview (first 500 chars):")
        print(page.get('lexical', '')[:500])


if __name__ == "__main__":
    asyncio.run(check_page())
