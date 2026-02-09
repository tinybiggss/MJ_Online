#!/usr/bin/env python3
"""Upload professional headshot to Ghost Pro via Admin API."""

import os
from dotenv import load_dotenv
import jwt
from datetime import datetime as date
import requests

# Load environment variables
load_dotenv('/Users/michaeljones/Dev/MJ_Online/.env')
GHOST_ADMIN_API_KEY = os.getenv('GHOST_ADMIN_API_KEY')
GHOST_API_URL = os.getenv('GHOST_API_URL')

# Parse the Admin API key (format: id:secret)
api_id, api_secret = GHOST_ADMIN_API_KEY.split(':')

# Generate JWT token for Ghost Admin API
iat = int(date.now().timestamp())
header = {'alg': 'HS256', 'typ': 'JWT', 'kid': api_id}
payload = {
    'iat': iat,
    'exp': iat + 5 * 60,  # Token expires in 5 minutes
    'aud': '/admin/'
}

token = jwt.encode(payload, bytes.fromhex(api_secret), algorithm='HS256', headers=header)

# Upload image
upload_url = f"{GHOST_API_URL}/ghost/api/admin/images/upload/"
headers = {'Authorization': f'Ghost {token}'}

# Read the image file
image_path = '/Users/michaeljones/Dev/MJ_Online/assets/photos/headshot-professional.png'
with open(image_path, 'rb') as f:
    files = {'file': ('headshot-professional.png', f, 'image/png')}
    response = requests.post(upload_url, headers=headers, files=files)

# Print response
print(f"Status Code: {response.status_code}")
print(f"Response: {response.text}")

if response.status_code in [200, 201]:
    result = response.json()
    if 'images' in result and len(result['images']) > 0:
        ghost_url = result['images'][0]['url']
        print(f"\n✅ SUCCESS! Ghost-hosted URL:\n{ghost_url}")
    else:
        print(f"\n⚠️ Unexpected response format: {result}")
else:
    print(f"\n❌ Upload failed with status {response.status_code}")
