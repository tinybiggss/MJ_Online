#!/usr/bin/env python3
"""
Publish Resume page to Ghost Pro via Admin API
Using HTML source (Ghost converts to Lexical automatically)
"""

import os
import jwt
import datetime
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

GHOST_ADMIN_API_KEY = os.getenv('GHOST_ADMIN_API_KEY')
GHOST_API_URL = os.getenv('GHOST_API_URL')

# Split the key into ID and SECRET
key_id, key_secret = GHOST_ADMIN_API_KEY.split(':')

# Read the HTML content
with open('/Users/michaeljones/Dev/MJ_Online/content-drafts/resume-page.html', 'r') as f:
    html_content = f.read()

# Create JWT token
iat = int(datetime.datetime.now().timestamp())
exp = iat + 5 * 60  # Token expires in 5 minutes

payload = {
    'iat': iat,
    'exp': exp,
    'aud': '/admin/'
}

token = jwt.encode(payload, bytes.fromhex(key_secret), algorithm='HS256', headers={'kid': key_id})

# Prepare the API request
url = f"{GHOST_API_URL}/ghost/api/admin/pages/?source=html"
headers = {
    'Authorization': f'Ghost {token}',
    'Content-Type': 'application/json',
    'Accept-Version': 'v5.0'
}

# Page data
page_data = {
    "pages": [{
        "title": "Resume",
        "slug": "resume",
        "html": html_content,
        "status": "published",
        "meta_title": "Resume - Mike Jones | AI Implementation Expert",
        "meta_description": "29 years building systems that help people thrive. AI Implementation Expert, LLM Integration Specialist, Xbox SDK patent holder. Director roles at Kabam, Livescribe, Kinoo.",
        "og_title": "Resume - Mike Jones",
        "og_description": "AI Implementation Expert and LLM Integration Specialist with 29 years experience in gaming, AR, and enterprise technology.",
        "twitter_title": "Resume - Mike Jones",
        "twitter_description": "AI Implementation Expert | Xbox SDK Patent Holder | 29 Years Building Systems That Help People Thrive"
    }]
}

print("🚀 Publishing Resume page to Ghost Pro...")
print(f"📍 URL: {url}")
print(f"📄 HTML size: {len(html_content)} bytes")
print()

# Make the request
response = requests.post(url, json=page_data, headers=headers)

if response.status_code in [200, 201]:
    result = response.json()
    page = result['pages'][0]
    print("✅ SUCCESS! Resume page published!")
    print(f"📄 Page ID: {page['id']}")
    print(f"🔗 URL: https://www.mikejones.online/{page['slug']}/")
    print(f"📅 Updated: {page['updated_at']}")
    print()
    print("🎉 Resume page is now live at https://www.mikejones.online/resume/")
else:
    print(f"❌ ERROR: {response.status_code}")
    print(f"Response: {response.text}")
