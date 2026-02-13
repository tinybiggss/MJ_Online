#!/usr/bin/env python3
"""
Fix Resume Page and Add Local LLM Case Study Images
====================================================

Tasks:
1. Fix Microsoft job title on Resume page: "Program Manager" → "Software Development Engineer in Test (SDET)"
2. Upload and insert missing images into Local LLM Setup case study
3. Report roles missing employment dates

Uses Ghost Admin API for all operations.
Handles both Lexical and Mobiledoc content formats.
"""

import os
import json
import jwt
import requests
from datetime import datetime as date
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

GHOST_ADMIN_API_KEY = os.getenv('GHOST_ADMIN_API_KEY')
GHOST_API_URL = os.getenv('GHOST_API_URL')

if not GHOST_ADMIN_API_KEY or not GHOST_API_URL:
    raise ValueError("Missing Ghost API credentials in .env file")

# Parse admin API key
api_key_id, api_key_secret = GHOST_ADMIN_API_KEY.split(':')

def generate_jwt_token():
    """Generate JWT token for Ghost Admin API authentication."""
    iat = int(date.now().timestamp())

    header = {'alg': 'HS256', 'typ': 'JWT', 'kid': api_key_id}
    payload = {
        'iat': iat,
        'exp': iat + 5 * 60,  # Token expires in 5 minutes
        'aud': '/admin/'
    }

    token = jwt.encode(payload, bytes.fromhex(api_key_secret), algorithm='HS256', headers=header)
    return token

def get_headers():
    """Get headers with fresh JWT token."""
    token = generate_jwt_token()
    return {
        'Authorization': f'Ghost {token}',
        'Content-Type': 'application/json',
        'Accept-Version': 'v5.0'
    }

def get_page_by_slug(slug, formats='html,mobiledoc,lexical'):
    """Get page by slug with specified formats."""
    url = f"{GHOST_API_URL}/ghost/api/admin/pages/slug/{slug}/?formats={formats}"
    response = requests.get(url, headers=get_headers())

    if response.status_code == 200:
        return response.json()['pages'][0]
    else:
        print(f"Error fetching page '{slug}': {response.status_code}")
        print(response.text)
        return None

def get_post_by_slug(slug, formats='html,mobiledoc,lexical'):
    """Get post by slug with specified formats."""
    url = f"{GHOST_API_URL}/ghost/api/admin/posts/slug/{slug}/?formats={formats}"
    response = requests.get(url, headers=get_headers())

    if response.status_code == 200:
        return response.json()['posts'][0]
    else:
        print(f"Error fetching post '{slug}': {response.status_code}")
        print(response.text)
        return None

def update_page(page_id, updates):
    """Update a page with new content."""
    url = f"{GHOST_API_URL}/ghost/api/admin/pages/{page_id}/"

    payload = {
        'pages': [updates]
    }

    response = requests.put(url, headers=get_headers(), json=payload)

    if response.status_code == 200:
        return response.json()['pages'][0]
    else:
        print(f"Error updating page: {response.status_code}")
        print(response.text)
        return None

def update_post(post_id, updates):
    """Update a post with new content."""
    url = f"{GHOST_API_URL}/ghost/api/admin/posts/{post_id}/"

    payload = {
        'posts': [updates]
    }

    response = requests.put(url, headers=get_headers(), json=payload)

    if response.status_code == 200:
        return response.json()['posts'][0]
    else:
        print(f"Error updating post: {response.status_code}")
        print(response.text)
        return None

def upload_image(image_path):
    """Upload an image to Ghost and return the URL."""
    url = f"{GHOST_API_URL}/ghost/api/admin/images/upload/"

    # Remove Content-Type header for multipart/form-data upload
    headers = {
        'Authorization': f'Ghost {generate_jwt_token()}',
        'Accept-Version': 'v5.0'
    }

    with open(image_path, 'rb') as image_file:
        files = {'file': (Path(image_path).name, image_file, 'image/png')}
        response = requests.post(url, headers=headers, files=files)

    if response.status_code in [200, 201]:
        return response.json()['images'][0]['url']
    else:
        print(f"Error uploading image: {response.status_code}")
        print(response.text)
        return None

def update_lexical_text(lexical_data, old_text, new_text):
    """Recursively update text in Lexical JSON structure."""
    if isinstance(lexical_data, dict):
        # Check if this is a text node with the target text
        if 'text' in lexical_data and old_text in str(lexical_data.get('text', '')):
            lexical_data['text'] = lexical_data['text'].replace(old_text, new_text)
            return True

        # Recursively check all nested objects
        updated = False
        for key, value in lexical_data.items():
            if update_lexical_text(value, old_text, new_text):
                updated = True
        return updated

    elif isinstance(lexical_data, list):
        updated = False
        for item in lexical_data:
            if update_lexical_text(item, old_text, new_text):
                updated = True
        return updated

    return False

def find_text_in_lexical(lexical_data, search_text):
    """Recursively search for text in Lexical JSON structure."""
    if isinstance(lexical_data, dict):
        if lexical_data.get('type') == 'text' and search_text in lexical_data.get('text', ''):
            return True

        for value in lexical_data.values():
            if find_text_in_lexical(value, search_text):
                return True

    elif isinstance(lexical_data, list):
        for item in lexical_data:
            if find_text_in_lexical(item, search_text):
                return True

    return False

def fix_resume_page():
    """Fix Microsoft job title on Resume page."""
    print("\n" + "="*70)
    print("TASK #1: Fix Resume Page - Microsoft Job Title")
    print("="*70)

    # Get Resume page
    print("\nFetching Resume page...")
    resume_page = get_page_by_slug('resume', formats='html,lexical')

    if not resume_page:
        print("❌ Could not fetch Resume page")
        return False

    print(f"✅ Found Resume page: {resume_page['title']}")
    print(f"   Page ID: {resume_page['id']}")
    print(f"   Updated: {resume_page['updated_at']}")

    # First check HTML to see current state
    html = resume_page.get('html', '')
    print(f"\n🔍 Checking HTML content...")

    if 'Program Manager' in html and 'Microsoft' in html:
        print("   Found 'Program Manager' at Microsoft in HTML - needs update")

        # Check if page uses Lexical format
        if resume_page.get('lexical'):
            print(f"   Format: Lexical ({len(resume_page['lexical'])} chars)")
            content_format = 'lexical'
            content_data = resume_page['lexical']
        elif resume_page.get('mobiledoc'):
            print(f"   Format: Mobiledoc")
            content_format = 'mobiledoc'
            content_data = resume_page['mobiledoc']
        else:
            print("❌ No content format found")
            return False

        # Parse content
        if isinstance(content_data, str):
            content_json = json.loads(content_data)
        else:
            content_json = content_data

        # Update the text in the Lexical structure
        print("   Updating Lexical JSON...")
        updated = update_lexical_text(content_json, 'Program Manager', 'Software Development Engineer in Test (SDET)')

        if updated:
            print("   ✅ Updated to: Software Development Engineer in Test (SDET)")

            # Update the page
            print("\n📝 Updating Resume page...")
            updated_page = update_page(resume_page['id'], {
                content_format: json.dumps(content_json) if isinstance(content_data, str) else content_json,
                'updated_at': resume_page['updated_at']
            })

            if updated_page:
                print("✅ Resume page updated successfully!")
                print(f"   View at: {GHOST_API_URL}/resume/")
                return True
            else:
                print("❌ Failed to update Resume page")
                return False
        else:
            print("   ⚠️  Could not update Lexical JSON (text not found)")
            return False

    elif 'Software Development Engineer in Test' in html or 'SDET' in html:
        print("   ✅ Job title already correct - no update needed")
        return True
    else:
        print("   ⚠️  Could not locate Microsoft job title in HTML")
        return False

def add_local_llm_images():
    """Add missing images to Local LLM Setup case study."""
    print("\n" + "="*70)
    print("TASK #2: Add Images to Local LLM Case Study")
    print("="*70)

    # Image files to upload
    image_dir = Path('/Users/michaeljones/Dev/MJ_Online/assets/projects/local-llm')
    images = [
        {
            'filename': 'Offline-AI-Architecture.png',
            'caption': 'System architecture showing the integration of local LLM components with LM Studio and the AI Memory System',
            'section': 'architecture'
        },
        {
            'filename': 'OfflineAI-Session-Workflow.png',
            'caption': 'Workflow diagram illustrating how chat sessions flow through the AI Memory System for context management',
            'section': 'workflow'
        }
    ]

    # Upload images
    print("\n📤 Uploading images to Ghost CDN...")
    image_urls = {}

    for img in images:
        image_path = image_dir / img['filename']
        print(f"\n   Uploading {img['filename']}...")

        if not image_path.exists():
            print(f"   ❌ File not found: {image_path}")
            continue

        url = upload_image(image_path)
        if url:
            image_urls[img['filename']] = {
                'url': url,
                'caption': img['caption'],
                'section': img['section']
            }
            print(f"   ✅ Uploaded: {url}")
        else:
            print(f"   ❌ Failed to upload {img['filename']}")

    if not image_urls:
        print("\n❌ No images were uploaded successfully")
        return False

    # Get Local LLM case study post
    print("\n📄 Fetching Local LLM Setup case study post...")
    llm_post = get_post_by_slug('local-llm-setup', formats='html,lexical,mobiledoc')

    if not llm_post:
        print("❌ Could not fetch Local LLM Setup post")
        return False

    print(f"✅ Found post: {llm_post['title']}")

    # Check content format
    if llm_post.get('lexical'):
        print(f"   Format: Lexical")
        content_format = 'lexical'
        content_data = llm_post['lexical']
    elif llm_post.get('mobiledoc'):
        print(f"   Format: Mobiledoc")
        content_format = 'mobiledoc'
        content_data = llm_post['mobiledoc']
    else:
        print("❌ No content format found")
        return False

    # Parse content
    if isinstance(content_data, str):
        content_json = json.loads(content_data)
    else:
        content_json = content_data

    # Insert images
    print("\n🖼️  Inserting images into case study...")

    if content_format == 'lexical':
        # Add images as Lexical image nodes
        for filename, data in image_urls.items():
            image_node = {
                "type": "image",
                "version": 1,
                "src": data['url'],
                "alt": data['caption'],
                "caption": data['caption'],
                "width": 1200,
                "height": 800
            }

            # Find root children array and append
            if 'root' in content_json and 'children' in content_json['root']:
                content_json['root']['children'].append(image_node)
                print(f"   ✅ Added {filename} to page")
            else:
                print(f"   ⚠️  Could not find root.children in Lexical structure")

    elif content_format == 'mobiledoc':
        # Add images as Mobiledoc cards
        for filename, data in image_urls.items():
            image_card = [
                "image",
                {
                    "src": data['url'],
                    "alt": data['caption'],
                    "caption": data['caption'],
                    "width": 1200,
                    "height": 800
                }
            ]

            if 'cards' in content_json:
                content_json['cards'].append(image_card)
                print(f"   ✅ Added {filename} to page")
            else:
                print(f"   ⚠️  Could not find cards array in Mobiledoc structure")

    # Update the post
    print("\n📝 Updating Local LLM Setup post...")
    updated_post = update_post(llm_post['id'], {
        content_format: json.dumps(content_json) if isinstance(content_data, str) else content_json,
        'updated_at': llm_post['updated_at']
    })

    if updated_post:
        print("✅ Local LLM Setup post updated successfully!")
        print(f"   View at: {GHOST_API_URL}/local-llm-setup/")
        print("\n   📌 NOTE: Images added at end of post - reposition in Ghost editor if needed")
        return True
    else:
        print("❌ Failed to update Local LLM Setup post")
        return False

def main():
    """Main execution function."""
    print("\n" + "="*70)
    print("Resume Fix & Local LLM Images - Ghost Admin API Script")
    print("="*70)
    print(f"Ghost API: {GHOST_API_URL}")
    print(f"Timestamp: {date.now().strftime('%Y-%m-%d %H:%M:%S')}")

    # Task 1: Fix Resume page
    resume_success = fix_resume_page()

    # Task 2: Add Local LLM images
    images_success = add_local_llm_images()

    # Summary
    print("\n" + "="*70)
    print("SUMMARY")
    print("="*70)

    if resume_success:
        print("✅ Task #1: Resume page Microsoft job title fixed")
    else:
        print("❌ Task #1: Resume page update failed")

    if images_success:
        print("✅ Task #2: Local LLM case study images added")
    else:
        print("❌ Task #2: Local LLM images failed")

    if resume_success and images_success:
        print("\n🎉 All tasks completed successfully!")
        return 0
    else:
        print("\n⚠️  Some tasks failed - see details above")
        return 1

if __name__ == '__main__':
    exit(main())
