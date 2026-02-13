#!/usr/bin/env python3
"""
Update OG image meta tags on all pages with real CDN URLs.
"""

import os
import json
import jwt
import requests
from datetime import datetime
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

def get_page_by_slug(slug):
    """Get a page by its slug."""
    token = generate_jwt_token()

    headers = {
        'Authorization': f'Ghost {token}'
    }

    url = f"{GHOST_API_URL}/ghost/api/admin/pages/slug/{slug}/"
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        return response.json()['pages'][0]
    else:
        print(f"Error fetching page {slug}: {response.status_code}")
        print(f"Response: {response.text}")
        return None

def update_page_code_injection(page_id, current_updated_at, code_injection):
    """Update a page's code injection."""
    token = generate_jwt_token()

    headers = {
        'Authorization': f'Ghost {token}',
        'Content-Type': 'application/json'
    }

    url = f"{GHOST_API_URL}/ghost/api/admin/pages/{page_id}/"

    data = {
        'pages': [{
            'id': page_id,
            'updated_at': current_updated_at,
            'codeinjection_head': code_injection
        }]
    }

    response = requests.put(url, headers=headers, json=data)

    if response.status_code == 200:
        return True
    else:
        print(f"Error updating page {page_id}: {response.status_code}")
        print(f"Response: {response.text}")
        return False

def create_og_meta_tags(page_title, page_description, og_image_url):
    """Create OG meta tags HTML."""
    return f"""<!-- SEO Meta Tags -->
<meta name="description" content="{page_description}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:title" content="{page_title}">
<meta property="og:description" content="{page_description}">
<meta property="og:image" content="{og_image_url}">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{page_title}">
<meta name="twitter:description" content="{page_description}">
<meta name="twitter:image" content="{og_image_url}">"""

def main():
    """Update OG image meta tags on all pages."""
    # Load CDN URLs
    with open('/Users/michaeljones/Dev/MJ_Online/og-images-cdn-urls.json') as f:
        cdn_urls = json.load(f)

    # Page configurations (only existing pages for now)
    pages = [
        {
            'slug': 'home',
            'title': 'Mike Jones - AI Implementation Expert & LLM Integration Specialist',
            'description': '29 years in tech leadership, specializing in AI implementation and LLM integration. Delivering measurable results through Context Engineering and AI-Augmented Process Design.',
            'og_image_key': 'homepage'
        },
        {
            'slug': 'about',
            'title': 'About Mike Jones - AI Implementation Expert',
            'description': 'AI Implementation Expert with 29 years in tech. Former Microsoft Xbox, Kabam, Livescribe leader. Specializing in LLM integration and Context Engineering.',
            'og_image_key': 'about'
        },
        {
            'slug': 'resume',
            'title': 'Resume - Mike Jones, AI Implementation Expert',
            'description': '29 years of tech leadership: Microsoft Xbox, Kabam Director, AI implementation expert. 80% delivery improvement, 3x efficiency gains through AI-Augmented Process Design.',
            'og_image_key': 'resume'
        },
        {
            'slug': 'projects',
            'title': 'Projects - Mike Jones Portfolio',
            'description': 'Explore AI implementation projects: AI Memory System, Local LLM Setup, NeighborhoodShare platform. Real-world applications of Context Engineering and AAPD methodology.',
            'og_image_key': 'projects'
        }
    ]

    # Note: Case study pages will be added when they are created:
    # - neighborhoodshare-building-community-resilience
    # - local-llm-setup-privacy-first-ai-development
    # - ai-memory-system-context-aware-personal-knowledge

    print("Updating OG image meta tags on all pages...\n")

    for page_config in pages:
        slug = page_config['slug']
        print(f"Processing {slug}... ", end='', flush=True)

        # Get page
        page = get_page_by_slug(slug)
        if not page:
            print("❌ Page not found")
            continue

        # Get OG image URL
        og_image_url = cdn_urls.get(page_config['og_image_key'])
        if not og_image_url:
            print(f"❌ No OG image URL for {page_config['og_image_key']}")
            continue

        # Create meta tags
        meta_tags = create_og_meta_tags(
            page_config['title'],
            page_config['description'],
            og_image_url
        )

        # Update page
        success = update_page_code_injection(page['id'], page['updated_at'], meta_tags)

        if success:
            print(f"✅ Updated with {og_image_url}")
        else:
            print("❌ Failed to update")

    print("\n✅ All pages updated!")

if __name__ == '__main__':
    main()
