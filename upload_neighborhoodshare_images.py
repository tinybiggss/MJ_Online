#!/usr/bin/env python3
"""Upload NeighborhoodShare screenshots to Ghost and update the post."""

import jwt
import requests
from datetime import datetime
import os
from pathlib import Path

# Load from .env
ADMIN_API_KEY = "6986670c9b9e430001349009:64d8d1d811f548adff94f8aeb3a8e11ca85d3602aa66e29564f4a5e6832fdeef"
API_URL = "https://mikejones-online.ghost.io"

# Split key into ID and SECRET
key_id, key_secret = ADMIN_API_KEY.split(":")

# Screenshots to upload (must-have for case study)
SCREENSHOTS = [
    {
        "filename": "Home-Tool-Selection.png",
        "caption": "Main interface showing available tools with location-based discovery",
        "alt": "NeighborhoodShare home page displaying tools available for borrowing"
    },
    {
        "filename": "Add-Tool-AI-2.png",
        "caption": "AI-powered tool cataloging with auto-filled details from photo analysis",
        "alt": "AI tool categorization interface showing auto-populated fields"
    },
    {
        "filename": "Admin-Prod-5-Beta.png",
        "caption": "Beta management dashboard tracking 170 users across 20 active zip codes",
        "alt": "Beta rollout management system showing geographic expansion metrics"
    },
    {
        "filename": "Tool-Detail-Borrow.png",
        "caption": "Tool detail page with borrowing request form and calendar picker",
        "alt": "Tool borrowing interface with project description and date selection"
    }
]

ASSETS_PATH = Path("/Users/michaeljones/Dev/MJ_Online/assets/projects/neighborhoodshare")


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


def upload_image(filepath, caption, alt_text):
    """Upload an image to Ghost."""
    token = generate_jwt_token()
    headers = {"Authorization": f"Ghost {token}"}

    url = f"{API_URL}/ghost/api/admin/images/upload/"

    with open(filepath, 'rb') as f:
        files = {
            'file': (filepath.name, f, 'image/png'),
            'purpose': (None, 'image'),
            'ref': (None, filepath.stem)
        }

        response = requests.post(url, headers=headers, files=files)

    if response.status_code in [200, 201]:
        result = response.json()
        print(f"✅ Uploaded: {filepath.name}")
        print(f"   URL: {result['images'][0]['url']}")
        return result['images'][0]['url']
    else:
        print(f"❌ Failed to upload {filepath.name}: {response.status_code}")
        print(f"   Response: {response.text}")
        return None


def get_post_by_slug(slug):
    """Get post details by slug."""
    token = generate_jwt_token()
    headers = {"Authorization": f"Ghost {token}"}

    url = f"{API_URL}/ghost/api/admin/posts/slug/{slug}/?formats=mobiledoc,html"
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        return response.json()['posts'][0]
    else:
        print(f"Error getting post: {response.status_code}")
        print(response.text)
        return None


def update_post_with_images(post_id, updated_html, updated_at):
    """Update post with new HTML content including images."""
    token = generate_jwt_token()
    headers = {
        "Authorization": f"Ghost {token}",
        "Content-Type": "application/json"
    }

    url = f"{API_URL}/ghost/api/admin/posts/{post_id}/"

    payload = {
        "posts": [{
            "html": updated_html,
            "updated_at": updated_at  # Required for collision detection
        }]
    }

    response = requests.put(url, headers=headers, json=payload)

    if response.status_code == 200:
        print("✅ Post updated successfully")
        return True
    else:
        print(f"❌ Failed to update post: {response.status_code}")
        print(response.text)
        return False


def main():
    """Main execution."""
    print("=" * 60)
    print("NeighborhoodShare Screenshot Upload")
    print("=" * 60)

    # Step 1: Upload all screenshots
    print("\n📤 Uploading screenshots...")
    uploaded_images = []

    for screenshot in SCREENSHOTS:
        filepath = ASSETS_PATH / screenshot["filename"]
        if filepath.exists():
            url = upload_image(filepath, screenshot["caption"], screenshot["alt"])
            if url:
                uploaded_images.append({
                    "url": url,
                    "caption": screenshot["caption"],
                    "alt": screenshot["alt"],
                    "filename": screenshot["filename"]
                })
        else:
            print(f"⚠️  File not found: {filepath}")

    print(f"\n✅ Uploaded {len(uploaded_images)} of {len(SCREENSHOTS)} images")

    # Step 2: Get the post
    print("\n📖 Fetching NeighborhoodShare post...")
    post = get_post_by_slug("neighborhoodshare-ai-powered-community-tool-sharing-platform")

    if not post:
        print("❌ Could not fetch post")
        return

    print(f"✅ Found post: {post['title']}")
    print(f"   ID: {post['id']}")
    print(f"   Current length: {len(post.get('html', ''))} characters")

    # Step 3: Generate image HTML to insert
    print("\n🖼️  Generating image HTML...")
    image_html_sections = []

    for img in uploaded_images:
        # Create figure with caption
        html = f'''
<figure class="kg-card kg-image-card kg-width-wide">
    <img src="{img['url']}" class="kg-image" alt="{img['alt']}" loading="lazy" />
    <figcaption>{img['caption']}</figcaption>
</figure>
'''
        image_html_sections.append(html)

    # Insert images after the first paragraph (after the intro)
    current_html = post.get('html', '')

    # Find a good insertion point - after the first </p> tag
    insert_point = current_html.find('</p>') + 4

    if insert_point > 4:
        # Add a section heading for the images
        images_section = '\n\n<h2>Visual Overview</h2>\n' + '\n'.join(image_html_sections)
        updated_html = current_html[:insert_point] + images_section + current_html[insert_point:]

        print(f"✅ Generated updated HTML ({len(updated_html)} characters)")

        # Step 4: Update the post
        print("\n💾 Updating post...")
        success = update_post_with_images(post['id'], updated_html, post['updated_at'])

        if success:
            print("\n" + "=" * 60)
            print("✅ SUCCESS! NeighborhoodShare post updated with images")
            print("=" * 60)
            print(f"\nView the updated post at:")
            print(f"https://www.mikejones.online/neighborhoodshare-ai-powered-community-tool-sharing-platform/")
        else:
            print("\n❌ Failed to update post")
    else:
        print("❌ Could not find insertion point in HTML")


if __name__ == "__main__":
    main()
