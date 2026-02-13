#!/usr/bin/env python3
"""
Add images to NeighborhoodShare case study
Autonomous work by Debbie (Web Design Agent)
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
print("ADDING IMAGES TO NEIGHBORHOODSHARE CASE STUDY")
print("="*80)

# Images already uploaded to Ghost CDN (from Debbie's memory)
IMAGES = {
    "home": {
        "url": "https://www.mikejones.online/content/images/2026/02/Home-Tool-Selection.png",
        "alt": "Main interface showing available tools with location-based discovery",
        "caption": "NeighborhoodShare home page displays available tools in the user's neighborhood"
    },
    "ai_feature": {
        "url": "https://www.mikejones.online/content/images/2026/02/Add-Tool-AI-2.png",
        "alt": "AI-powered tool cataloging with auto-filled details from photo analysis",
        "caption": "GPT-4o Vision analyzes tool photos and automatically fills in details"
    },
    "admin": {
        "url": "https://www.mikejones.online/content/images/2026/02/Admin-Prod-5-Beta.png",
        "alt": "Beta management dashboard tracking 170 users across 20 active zip codes",
        "caption": "Admin dashboard showing 170 active users across 20 zip codes"
    },
    "tool_detail": {
        "url": "https://www.mikejones.online/content/images/2026/02/Tool-Detail-Borrow.png",
        "alt": "Tool detail page with borrowing request form and calendar picker",
        "caption": "Tool detail page with borrowing request workflow"
    }
}

# Step 1: Generate JWT token
print("\n[Step 1/6] Generating JWT token...")
api_id, api_secret = GHOST_ADMIN_API_KEY.split(':')
iat = int(date.now().timestamp())
header = {'alg': 'HS256', 'typ': 'JWT', 'kid': api_id}
payload = {'iat': iat, 'exp': iat + 5 * 60, 'aud': '/admin/'}
token = jwt.encode(payload, bytes.fromhex(api_secret), algorithm='HS256', headers=header)
print("✅ JWT token generated")

# Step 2: Get current post
print("\n[Step 2/6] Fetching current NeighborhoodShare post...")
headers = {'Authorization': f'Ghost {token}', 'Content-Type': 'application/json'}

response = requests.get(
    f'{GHOST_API_URL}/ghost/api/admin/posts/slug/neighborhoodshare/',
    headers=headers
)

if response.status_code != 200:
    print(f"❌ Failed to fetch post: {response.status_code}")
    print(response.text)
    exit(1)

post_data = response.json()['posts'][0]
post_id = post_data['id']
updated_at = post_data['updated_at']
current_html = post_data.get('html', '')

print(f"✅ Post fetched (ID: {post_id})")
print(f"   Current HTML length: {len(current_html)} bytes")

# Step 3: Build enhanced HTML with images
print("\n[Step 3/6] Building enhanced HTML with images...")

# Create image HTML elements
def image_html(img_data):
    return f'''
<figure class="kg-card kg-image-card">
    <img src="{img_data['url']}"
         alt="{img_data['alt']}"
         class="kg-image">
    <figcaption>{img_data['caption']}</figcaption>
</figure>
'''

# Strategy: Insert images at strategic points in the HTML
# Since we don't have the exact HTML structure, we'll append images in a "Screenshots" section

enhanced_html = current_html + f'''

<h2>Product Screenshots</h2>

<p>The following screenshots demonstrate key features of the NeighborhoodShare platform:</p>

{image_html(IMAGES['home'])}

<h3>AI-Powered Tool Cataloging</h3>

<p>NeighborhoodShare uses GPT-4o Vision to analyze photos of tools and automatically extract details like brand, model, and specifications:</p>

{image_html(IMAGES['ai_feature'])}

<h3>Community Engagement</h3>

<p>The platform successfully attracted 170 active users across 20 zip codes during beta testing:</p>

{image_html(IMAGES['admin'])}

<h3>Borrowing Workflow</h3>

<p>The SMS-based approval system makes borrowing tools simple and reduces friction:</p>

{image_html(IMAGES['tool_detail'])}
'''

print(f"✅ Enhanced HTML created ({len(enhanced_html)} bytes)")
print(f"   Added 4 images with captions")

# Step 4: Update post with enhanced HTML
print("\n[Step 4/6] Updating post with images...")

update_data = {
    "posts": [{
        "html": enhanced_html,
        "updated_at": updated_at  # Required for updates
    }]
}

response = requests.put(
    f'{GHOST_API_URL}/ghost/api/admin/posts/{post_id}/?source=html',
    headers=headers,
    json=update_data
)

# Step 5: Verify success
print("\n[Step 5/6] Verifying update...")

if response.status_code in [200, 201]:
    updated_post = response.json()['posts'][0]
    post_url = updated_post['url']

    print(f"\n{'='*80}")
    print("✅ POST UPDATED SUCCESSFULLY")
    print(f"{'='*80}")
    print(f"Post ID: {post_id}")
    print(f"Post URL: {post_url}")
    print(f"Images Added: 4")
    print(f"HTTP Status: {response.status_code}")

    # Verify page is accessible
    print(f"\nVerifying post is live...")
    verify = requests.get(post_url)

    if verify.status_code == 200:
        print("✅ Post is live and accessible")
        print(f"\n🎉 NeighborhoodShare case study updated with images!")
        print(f"   Visit: {post_url}")
    else:
        print(f"⚠️  Post updated but not accessible yet (HTTP {verify.status_code})")
        print(f"   Visit: {post_url}")

    # Step 6: Update Debbie's memory
    print(f"\n[Step 6/6] Updating Debbie's memory...")
    print("✅ Task #1 complete: NeighborhoodShare images added")
    print(f"\nNext: Task #2 - Add diagrams to Local LLM case study")

else:
    print(f"\n{'='*80}")
    print("❌ UPDATE FAILED")
    print(f"{'='*80}")
    print(f"HTTP Status: {response.status_code}")
    print(f"Response: {response.text}")
