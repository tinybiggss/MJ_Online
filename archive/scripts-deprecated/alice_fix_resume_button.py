#!/usr/bin/env python3
"""
Alice - Fix Resume Download Button (Lexical Format)
Properly adds button to Lexical content format
"""

import asyncio
import sys
import os
import jwt
import json
from datetime import datetime as dt
from dotenv import load_dotenv
import httpx

sys.path.insert(0, '/Users/michaeljones/Dev/MJ_Online/agent_coordination')
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


async def add_button_to_resume():
    """Add download button using Lexical format."""

    print("\n" + "="*80)
    print("📄 FIXING RESUME DOWNLOAD BUTTON (Lexical Format)")
    print("="*80 + "\n")

    pdf_url = "https://www.mikejones.online/content/files/2026/02/Mike_Jones_PTPM.pdf"

    async with WorkerClient("Alice") as worker:
        await worker.heartbeat(
            status="busy",
            current_task="qa-critical-1-fix",
            current_task_title="Fixing resume download button in Lexical format"
        )

        token = generate_ghost_token()
        headers = {'Authorization': f'Ghost {token}'}

        async with httpx.AsyncClient() as client:
            # Get current page with Lexical format
            print("📖 Fetching resume page...")
            response = await client.get(
                f"{GHOST_API_URL}/ghost/api/admin/pages/slug/resume/?formats=lexical",
                headers=headers
            )

            if response.status_code != 200:
                raise Exception(f"Failed to fetch page: {response.status_code}")

            result = response.json()
            page = result['pages'][0]

            print(f"✅ Page found: {page['title']}")
            print(f"   Lexical length: {len(page['lexical'])} chars")

            # Parse Lexical content
            lexical = json.loads(page['lexical'])

            # Create download button card as Lexical node
            button_card = {
                "type": "html",
                "version": 1,
                "html": f'''<div style="text-align: center; margin: 40px 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px;">
    <a href="{pdf_url}"
       download="Mike-Jones-Resume.pdf"
       onclick="if(window.gtag){{gtag('event','resume_download',{{'event_category':'engagement','event_label':'Resume PDF'}});}}if(window.plausible){{plausible('Resume Download');}}"
       style="display: inline-block; padding: 18px 40px; background-color: white; color: #667eea; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 20px; transition: all 0.3s; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
        📄 Download Full Resume (PDF)
    </a>
    <p style="margin-top: 16px; color: white; font-size: 14px; opacity: 0.9;">Complete career history and project details</p>
</div>'''
            }

            # Insert button card after the first paragraph (after title and contact info)
            # Typically the structure is: [title, blank, contact, contact, contact, blank, hr, blank, blank, "Professional Summary", ...]
            # Let's insert after the HR (horizontal rule) which appears early in the resume

            children = lexical['root']['children']

            # Find the HR element (usually appears after contact info)
            insert_index = None
            for i, child in enumerate(children):
                if child.get('type') == 'horizontalrule':
                    insert_index = i + 1
                    break

            if insert_index is None:
                # If no HR found, insert after 5th element (after contact section)
                insert_index = min(5, len(children))

            print(f"   Inserting button at position {insert_index}")

            # Insert button card
            children.insert(insert_index, button_card)

            # Update Lexical content
            lexical['root']['children'] = children
            new_lexical = json.dumps(lexical)

            print(f"   New Lexical length: {len(new_lexical)} chars")

            # Update page
            print("\n📤 Updating page...")
            update_payload = {
                "pages": [{
                    "lexical": new_lexical,
                    "updated_at": page['updated_at']
                }]
            }

            response = await client.put(
                f"{GHOST_API_URL}/ghost/api/admin/pages/{page['id']}/",
                headers=headers,
                json=update_payload
            )

            if response.status_code != 200:
                print(f"❌ Update failed: {response.status_code}")
                print(f"   Response: {response.text}")
                raise Exception(f"Update failed: {response.status_code}")

            result = response.json()
            updated_page = result['pages'][0]

            print(f"✅ Resume page updated!")
            print(f"   URL: https://www.mikejones.online/resume/")

            await worker.send_coordination_message(
                f"✅ Resume download button added successfully! "
                f"PDF: {pdf_url} | Page updated with Lexical format"
            )
            await worker.heartbeat(status="active", current_task=None)

            print("\n" + "="*80)
            print("✅ DOWNLOAD BUTTON ADDED SUCCESSFULLY")
            print("="*80)
            print(f"\n📄 PDF URL: {pdf_url}")
            print(f"🌐 Page URL: https://www.mikejones.online/resume/")
            print(f"\n✨ Button is now live with analytics tracking!")
            print(f"   - Beautiful gradient background")
            print(f"   - Click tracking (gtag + plausible)")
            print(f"   - Proper download filename")


if __name__ == "__main__":
    asyncio.run(add_button_to_resume())
