#!/usr/bin/env python3
"""Alice - Upload RT logo and update page."""

import asyncio
import sys
import os
import jwt
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
    """Generate JWT token."""
    key_id, secret = GHOST_ADMIN_API_KEY.split(':')
    iat = int(dt.now().timestamp())
    header = {'alg': 'HS256', 'typ': 'JWT', 'kid': key_id}
    payload = {'iat': iat, 'exp': iat + 5 * 60, 'aud': '/admin/'}
    return jwt.encode(payload, bytes.fromhex(secret), algorithm='HS256', headers=header)


async def upload_and_update():
    """Upload RT logo and update page."""

    print("\n🎨 Uploading Resilient Tomorrow logo...")

    # Upload RT logo
    logo_path = Path("/Users/michaeljones/Dev/MJ_Online/assets/substacks/Logo - Email Header.png")

    token = generate_ghost_token()
    headers = {'Authorization': f'Ghost {token}'}

    async with httpx.AsyncClient(timeout=60.0) as client:
        # Upload logo
        with open(logo_path, 'rb') as f:
            files = {'file': (logo_path.name, f, 'image/png')}

            response = await client.post(
                f"{GHOST_API_URL}/ghost/api/admin/images/upload/",
                headers=headers,
                files=files
            )

            if response.status_code not in [200, 201]:
                raise Exception(f"Upload failed: {response.status_code}")

            result = response.json()
            rt_logo_url = result['images'][0]['url']

            print(f"✅ RT Logo uploaded!")
            print(f"   URL: {rt_logo_url}")

        # Get current page
        print("\n📖 Fetching /writing page...")
        response = await client.get(
            f"{GHOST_API_URL}/ghost/api/admin/pages/slug/writing/?formats=html",
            headers=headers
        )

        if response.status_code != 200:
            raise Exception(f"Failed to fetch page: {response.status_code}")

        result = response.json()
        page = result['pages'][0]

        print(f"✅ Page found: {page['title']}")

        # Read current HTML and add RT logo
        current_html = page.get('html', '')

        # Add RT logo before the h3 heading in the RT column
        # Look for <h3>Resilient Tomorrow</h3> and add logo before it
        updated_html = current_html.replace(
            '<h3>Resilient Tomorrow</h3>',
            f'<div class="logo"><img src="{rt_logo_url}" alt="Resilient Tomorrow Logo"></div>\n                <h3>Resilient Tomorrow</h3>'
        )

        if updated_html == current_html:
            print("⚠️  Couldn't find insertion point - HTML structure may have changed")
            print("   Page is still live, just needs manual logo addition")
            return

        print(f"\n📝 Updating page with RT logo...")

        # Update page
        update_payload = {
            "pages": [{
                "html": updated_html,
                "updated_at": page['updated_at']
            }]
        }

        response = await client.put(
            f"{GHOST_API_URL}/ghost/api/admin/pages/{page['id']}/",
            headers=headers,
            json=update_payload
        )

        if response.status_code != 200:
            raise Exception(f"Update failed: {response.status_code}")

        print(f"✅ Page updated with RT logo!")
        print(f"\n🌐 Live page: https://www.mikejones.online/writing/")
        print(f"📊 Both publications now have logos!")


if __name__ == "__main__":
    asyncio.run(upload_and_update())
