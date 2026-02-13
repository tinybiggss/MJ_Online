#!/usr/bin/env python3
"""
Publish About Page to Ghost Pro (Phase 3.0.3 Final Step)

This script publishes the About page HTML to Ghost Pro using the Admin API
with the source=html parameter. Ghost automatically converts HTML to Lexical format.
"""

import os
import jwt
import requests
from datetime import datetime as date
from dotenv import load_dotenv

# Load Ghost API credentials
load_dotenv('/Users/michaeljones/Dev/MJ_Online/.env')
GHOST_ADMIN_API_KEY = os.getenv('GHOST_ADMIN_API_KEY')
GHOST_API_URL = os.getenv('GHOST_API_URL')

print("="*80)
print("ABOUT PAGE PUBLISHING TO GHOST PRO")
print("="*80)
print(f"\nGhost API URL: {GHOST_API_URL}")

# Step 1: Read HTML file
print("\n[Step 1/5] Reading HTML content...")
with open('/Users/michaeljones/Dev/MJ_Online/content-drafts/about-page.html', 'r') as f:
    html_content = f.read()

print(f"✅ HTML loaded successfully ({len(html_content)} bytes)")

# Step 2: Generate JWT token
print("\n[Step 2/5] Generating JWT token...")
api_id, api_secret = GHOST_ADMIN_API_KEY.split(':')
iat = int(date.now().timestamp())
header = {'alg': 'HS256', 'typ': 'JWT', 'kid': api_id}
payload = {'iat': iat, 'exp': iat + 5 * 60, 'aud': '/admin/'}
token = jwt.encode(payload, bytes.fromhex(api_secret), algorithm='HS256', headers=header)

print("✅ JWT token generated")

# Step 3: Check if About page already exists
print("\n[Step 3/5] Checking if About page exists...")
headers = {'Authorization': f'Ghost {token}', 'Content-Type': 'application/json'}

check_response = requests.get(
    f'{GHOST_API_URL}/ghost/api/admin/pages/slug/about/',
    headers=headers
)

page_exists = check_response.status_code == 200

if page_exists:
    page_id = check_response.json()['pages'][0]['id']
    updated_at = check_response.json()['pages'][0]['updated_at']
    print(f"✅ About page exists (ID: {page_id})")
    print(f"   Will UPDATE existing page")
else:
    print("✅ About page does not exist")
    print("   Will CREATE new page")

# Step 4: Publish (CREATE or UPDATE)
print("\n[Step 4/5] Publishing to Ghost Pro...")

if page_exists:
    # UPDATE existing page
    page_data = {
        "pages": [{
            "html": html_content,
            "updated_at": updated_at  # Required for updates
        }]
    }
    response = requests.put(
        f'{GHOST_API_URL}/ghost/api/admin/pages/{page_id}/?source=html',
        headers=headers,
        json=page_data
    )
else:
    # CREATE new page
    page_data = {
        "pages": [{
            "title": "About",
            "slug": "about",
            "html": html_content,
            "status": "published"
        }]
    }
    response = requests.post(
        f'{GHOST_API_URL}/ghost/api/admin/pages/?source=html',
        headers=headers,
        json=page_data
    )

# Step 5: Verify success
print("\n[Step 5/5] Verifying publication...")

if response.status_code in [200, 201]:
    page_data = response.json()['pages'][0]
    page_url = page_data['url']
    page_id = page_data['id']

    print(f"\n{'='*80}")
    print("✅ PAGE PUBLISHED SUCCESSFULLY")
    print(f"{'='*80}")
    print(f"Page ID: {page_id}")
    print(f"Page URL: {page_url}")
    print(f"HTTP Status: {response.status_code}")

    # Verify page is accessible
    print(f"\nVerifying page is live...")
    verify = requests.get(page_url)

    if verify.status_code == 200:
        print("✅ Page is live and accessible")
        print(f"\n🎉 About page successfully published!")
        print(f"   Visit: {page_url}")
    else:
        print(f"⚠️  Page published but not accessible yet (HTTP {verify.status_code})")
        print(f"   This is normal - Ghost may need a moment to process")
        print(f"   Visit: {page_url}")

    # Print summary
    print(f"\n{'='*80}")
    print("SUMMARY")
    print(f"{'='*80}")
    print(f"Operation: {'UPDATE' if page_exists else 'CREATE'}")
    print(f"Format: HTML → Ghost Lexical (automatic conversion)")
    print(f"Content Size: {len(html_content)} bytes")
    print(f"Status: Published")
    print(f"Live URL: {page_url}")
    print(f"\n✅ Phase 3.0.3 pilot test COMPLETE!")

else:
    print(f"\n{'='*80}")
    print("❌ PUBLISHING FAILED")
    print(f"{'='*80}")
    print(f"HTTP Status: {response.status_code}")
    print(f"Response: {response.text}")
    print(f"\nTroubleshooting:")
    print(f"1. Check if JWT token is valid")
    print(f"2. Verify source=html parameter is in URL")
    print(f"3. Check Ghost API credentials in .env file")
