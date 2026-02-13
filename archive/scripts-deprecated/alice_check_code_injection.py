#!/usr/bin/env python3
"""
Alice - Check code injection on /writing page
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


async def check_code_injection():
    """Check code injection on /writing page."""
    token = generate_ghost_token()
    headers = {'Authorization': f'Ghost {token}'}

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.get(
            f"{GHOST_API_URL}/ghost/api/admin/pages/slug/writing/",
            headers=headers
        )

        if response.status_code == 200:
            result = response.json()
            page = result['pages'][0]

            print(f"✅ Found page: {page['title']}")
            print(f"\n📋 Code Injection:")
            print(f"   codeinjection_head: {len(page.get('codeinjection_head', '') or '')} chars")
            print(f"   codeinjection_foot: {len(page.get('codeinjection_foot', '') or '')} chars")

            if page.get('codeinjection_head'):
                print(f"\n🔍 HEAD Code Injection:")
                head_code = page['codeinjection_head']
                print(head_code[:1000] if len(head_code) > 1000 else head_code)

                # Save to file for inspection
                with open('/tmp/writing_page_head_injection.html', 'w') as f:
                    f.write(head_code)
                print(f"\n✅ Saved to /tmp/writing_page_head_injection.html")

            if page.get('codeinjection_foot'):
                print(f"\n🔍 FOOT Code Injection:")
                foot_code = page['codeinjection_foot']

                # Check for syntax errors in the JavaScript
                lines = foot_code.split('\n')
                print(f"   Total lines: {len(lines)}")

                # Look for the RSS feed loading code
                if 'loadRSSFeed' in foot_code or 'allorigins' in foot_code:
                    print(f"\n   ✅ Found RSS feed loading code!")

                    # Check for common syntax errors
                    issues = []
                    for i, line in enumerate(lines):
                        line_num = i + 1
                        # Check for unclosed strings
                        if line.count('"') % 2 != 0 and not line.strip().endswith('\\'):
                            issues.append(f"Line {line_num}: Possible unclosed string")
                        if line.count("'") % 2 != 0 and not line.strip().endswith('\\'):
                            issues.append(f"Line {line_num}: Possible unclosed string")

                    if issues:
                        print(f"\n   ⚠️ Potential issues found:")
                        for issue in issues:
                            print(f"      {issue}")

                # Save to file
                with open('/tmp/writing_page_foot_injection.html', 'w') as f:
                    f.write(foot_code)
                print(f"\n✅ Saved to /tmp/writing_page_foot_injection.html")

                # Show first 50 lines
                print(f"\n📄 First 50 lines:")
                for i, line in enumerate(lines[:50]):
                    print(f"   {i+1:3d}: {line}")

            return page
        else:
            print(f"❌ Failed to fetch page: {response.status_code}")
            return None


if __name__ == "__main__":
    asyncio.run(check_code_injection())
