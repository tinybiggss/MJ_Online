#!/usr/bin/env python3
"""
List all Ghost pages to find correct slugs.
"""

import os
import jwt
import requests
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

GHOST_API_URL = os.getenv('GHOST_API_URL')
GHOST_ADMIN_API_KEY = os.getenv('GHOST_ADMIN_API_KEY')

# Parse admin API key (format: id:secret)
admin_key_id, admin_key_secret = GHOST_ADMIN_API_KEY.split(':')

def generate_jwt_token():
    """Generate JWT token for Ghost Admin API authentication."""
    iat = int(datetime.now().timestamp())
    exp = iat + (5 * 60)  # Token expires in 5 minutes

    payload = {
        'iat': iat,
        'exp': exp,
        'aud': '/admin/'
    }

    token = jwt.encode(payload, bytes.fromhex(admin_key_secret), algorithm='HS256', headers={'kid': admin_key_id})
    return token

def list_pages():
    """List all Ghost pages."""
    token = generate_jwt_token()

    headers = {
        'Authorization': f'Ghost {token}'
    }

    url = f"{GHOST_API_URL}/ghost/api/admin/pages/?limit=all"
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        pages = response.json()['pages']
        print(f"Found {len(pages)} pages:\n")
        for page in pages:
            print(f"Title: {page['title']}")
            print(f"Slug: {page['slug']}")
            print(f"URL: {page['url']}")
            print()
    else:
        print(f"Error fetching pages: {response.status_code}")
        print(f"Response: {response.text}")

if __name__ == '__main__':
    list_pages()
