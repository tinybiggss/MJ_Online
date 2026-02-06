#!/usr/bin/env python3
"""Helper script for Ghost Admin API operations."""

import jwt
import requests
from datetime import datetime, timedelta

# Ghost Admin API credentials
ADMIN_API_KEY = "69865fb99b9e4300013490031c4b36dd45c9bfeb2821f777a7dbf396cd9f3e85"
API_URL = "https://mikejones-online.ghost.io"

# Parse the Admin API key (format: first 26 chars are ID, rest is SECRET)
# The key format from Ghost is: ID (26 chars) + SECRET (rest)
key_id = ADMIN_API_KEY[:26]  # "69865fb99b9e430001349000" + "1c"
key_secret = ADMIN_API_KEY[26:]  # remaining hex string

def generate_jwt_token():
    """Generate JWT token for Ghost Admin API."""
    iat = int(datetime.now().timestamp())

    header = {"alg": "HS256", "typ": "JWT", "kid": key_id}
    payload = {
        "iat": iat,
        "exp": iat + 300,  # Token expires in 5 minutes
        "aud": "/admin/"
    }

    token = jwt.encode(payload, bytes.fromhex(key_secret), algorithm="HS256", headers=header)
    return token

def get_post_by_slug(slug):
    """Get post details by slug."""
    token = generate_jwt_token()
    headers = {"Authorization": f"Ghost {token}"}

    url = f"{API_URL}/ghost/api/admin/posts/slug/{slug}/"
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code}")
        print(response.text)
        return None

if __name__ == "__main__":
    # Get NeighborhoodShare post
    result = get_post_by_slug("neighborhoodshare-ai-powered-community-tool-sharing-platform")
    if result:
        import json
        print(json.dumps(result, indent=2))
