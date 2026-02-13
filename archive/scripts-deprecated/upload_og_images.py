#!/usr/bin/env python3
"""
Upload OG images to Ghost CDN and collect URLs.
"""

import os
import json
import jwt
import requests
from datetime import datetime, timedelta
from pathlib import Path
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

def upload_image(image_path):
    """Upload an image to Ghost CDN and return the URL."""
    token = generate_jwt_token()

    upload_url = f"{GHOST_API_URL}/ghost/api/admin/images/upload/"

    headers = {
        'Authorization': f'Ghost {token}'
    }

    with open(image_path, 'rb') as image_file:
        files = {
            'file': (os.path.basename(image_path), image_file, 'image/png')
        }

        response = requests.post(upload_url, headers=headers, files=files)

        if response.status_code == 201:
            data = response.json()
            return data['images'][0]['url']
        else:
            print(f"Error uploading {image_path}: {response.status_code}")
            print(f"Response: {response.text}")
            return None

def main():
    """Upload all OG images and save URLs to JSON file."""
    og_images_dir = Path('/Users/michaeljones/Dev/MJ_Online/assets/og_images')

    images = {
        'homepage': og_images_dir / 'og-image-homepage.png',
        'about': og_images_dir / 'og-image-about.png',
        'resume': og_images_dir / 'og-image-resume.png',
        'projects': og_images_dir / 'og-image-projects.png',
        'neighborhoodshare': og_images_dir / 'og-image-neighborhoodshare.png',
        'local-llm': og_images_dir / 'og-image-local-llm.png',
        'ai-memory': og_images_dir / 'og-image-ai-memory.png'
    }

    cdn_urls = {}

    print("Uploading OG images to Ghost CDN...\n")

    for key, image_path in images.items():
        if not image_path.exists():
            print(f"❌ Image not found: {image_path}")
            continue

        print(f"Uploading {key}... ", end='', flush=True)
        url = upload_image(image_path)

        if url:
            cdn_urls[key] = url
            print(f"✅ {url}")
        else:
            print("❌ Failed")

    # Save URLs to JSON file
    output_file = Path('/Users/michaeljones/Dev/MJ_Online/og-images-cdn-urls.json')

    with open(output_file, 'w') as f:
        json.dump(cdn_urls, f, indent=2)

    print(f"\n✅ CDN URLs saved to {output_file}")
    print(f"\nUploaded {len(cdn_urls)}/{len(images)} images successfully.")

    return cdn_urls

if __name__ == '__main__':
    main()
