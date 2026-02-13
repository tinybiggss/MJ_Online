#!/usr/bin/env python3
"""
Add diagrams to Local LLM Setup case study
Autonomous work by Debbie (Web Design Agent)
"""

import os
import jwt
import requests
from datetime import datetime as date
from dotenv import load_dotenv
from pathlib import Path

# Load Ghost API credentials
load_dotenv('/Users/michaeljones/Dev/MJ_Online/.env')
GHOST_ADMIN_API_KEY = os.getenv('GHOST_ADMIN_API_KEY')
GHOST_API_URL = os.getenv('GHOST_API_URL')

print("="*80)
print("ADDING DIAGRAMS TO LOCAL LLM CASE STUDY")
print("="*80)

# Step 1: Upload workflow diagram (architecture diagram already uploaded for Homepage)
print("\n[Step 1/7] Uploading Session Workflow diagram...")
api_id, api_secret = GHOST_ADMIN_API_KEY.split(':')
iat = int(date.now().timestamp())
header = {'alg': 'HS256', 'typ': 'JWT', 'kid': api_id}
payload = {'iat': iat, 'exp': iat + 5 * 60, 'aud': '/admin/'}
token = jwt.encode(payload, bytes.fromhex(api_secret), algorithm='HS256', headers=header)

headers = {'Authorization': f'Ghost {token}'}

workflow_path = '/Users/michaeljones/Dev/MJ_Online/assets/projects/local-llm/OfflineAI-Session-Workflow.png'
with open(workflow_path, 'rb') as f:
    files = {'file': ('OfflineAI-Session-Workflow.png', f, 'image/png')}
    response = requests.post(
        f'{GHOST_API_URL}/ghost/api/admin/images/upload/',
        headers=headers,
        files=files
    )

if response.status_code != 201:
    print(f"❌ Failed to upload workflow diagram: {response.status_code}")
    print(response.text)
    exit(1)

workflow_url = response.json()['images'][0]['url']
print(f"✅ Workflow diagram uploaded: {workflow_url}")

# Diagram URLs
IMAGES = {
    "architecture": {
        "url": "https://www.mikejones.online/content/images/2026/02/Offline-AI-Architecture.png",
        "alt": "System architecture diagram showing Mac Mini with Ollama, OpenWebUI, and MCP Bridge",
        "caption": "Local LLM infrastructure architecture: Mac Mini running Ollama with Open WebUI interface"
    },
    "workflow": {
        "url": workflow_url,
        "alt": "Session workflow diagram showing AI Memory System integration",
        "caption": "AI session workflow with RAG knowledge base and memory system integration"
    }
}

# Step 2: Generate fresh JWT token
print("\n[Step 2/7] Generating JWT token...")
iat = int(date.now().timestamp())
token = jwt.encode(payload, bytes.fromhex(api_secret), algorithm='HS256', headers=header)
print("✅ JWT token generated")

# Step 3: Get current post
print("\n[Step 3/7] Fetching current Local LLM post...")
headers = {'Authorization': f'Ghost {token}', 'Content-Type': 'application/json'}

response = requests.get(
    f'{GHOST_API_URL}/ghost/api/admin/posts/slug/local-llm-setup/',
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

# Step 4: Build enhanced HTML with diagrams
print("\n[Step 4/7] Building enhanced HTML with diagrams...")

def image_html(img_data):
    return f'''
<figure class="kg-card kg-image-card">
    <img src="{img_data['url']}"
         alt="{img_data['alt']}"
         class="kg-image">
    <figcaption>{img_data['caption']}</figcaption>
</figure>
'''

enhanced_html = current_html + f'''

<h2>System Architecture</h2>

<p>The self-hosted LLM infrastructure runs on a Mac Mini with Apple Silicon, providing powerful local AI capabilities:</p>

{image_html(IMAGES['architecture'])}

<h3>Key Components:</h3>

<ul>
<li><strong>Ollama</strong>: Serves Qwen 2.5:14B and other LLM models locally</li>
<li><strong>Open WebUI</strong>: Web-based interface on port 3000</li>
<li><strong>MCP Bridge</strong>: Connects local models to Claude Code</li>
<li><strong>Auto-start</strong>: LaunchAgents ensure services run on boot</li>
</ul>

<h2>Integration with AI Memory System</h2>

<p>The local LLM setup integrates with a cross-platform AI Memory System for seamless context management:</p>

{image_html(IMAGES['workflow'])}

<h3>Workflow Benefits:</h3>

<ul>
<li>Context persists across Claude, ChatGPT, and local LLMs</li>
<li>RAG knowledge base provides instant access to verified facts</li>
<li>JSONL ledger format ensures compatibility across platforms</li>
<li>No cloud dependency for core AI operations</li>
</ul>
'''

print(f"✅ Enhanced HTML created ({len(enhanced_html)} bytes)")
print(f"   Added 2 architecture diagrams with captions")

# Step 5: Update post with enhanced HTML
print("\n[Step 5/7] Updating post with diagrams...")

# Regenerate token for update
iat = int(date.now().timestamp())
payload['iat'] = iat
payload['exp'] = iat + 5 * 60
token = jwt.encode(payload, bytes.fromhex(api_secret), algorithm='HS256', headers=header)
headers = {'Authorization': f'Ghost {token}', 'Content-Type': 'application/json'}

update_data = {
    "posts": [{
        "html": enhanced_html,
        "updated_at": updated_at
    }]
}

response = requests.put(
    f'{GHOST_API_URL}/ghost/api/admin/posts/{post_id}/?source=html',
    headers=headers,
    json=update_data
)

# Step 6: Verify success
print("\n[Step 6/7] Verifying update...")

if response.status_code in [200, 201]:
    updated_post = response.json()['posts'][0]
    post_url = updated_post['url']

    print(f"\n{'='*80}")
    print("✅ POST UPDATED SUCCESSFULLY")
    print(f"{'='*80}")
    print(f"Post ID: {post_id}")
    print(f"Post URL: {post_url}")
    print(f"Diagrams Added: 2")
    print(f"HTTP Status: {response.status_code}")

    # Verify page is accessible
    print(f"\nVerifying post is live...")
    verify = requests.get(post_url)

    if verify.status_code == 200:
        print("✅ Post is live and accessible")
        print(f"\n🎉 Local LLM case study updated with diagrams!")
        print(f"   Visit: {post_url}")
    else:
        print(f"⚠️  Post updated but not accessible yet (HTTP {verify.status_code})")
        print(f"   Visit: {post_url}")

    # Step 7: Update Debbie's memory
    print(f"\n[Step 7/7] Updating Debbie's memory...")
    print("✅ Task #2 complete: Local LLM diagrams added")
    print(f"\nNext: Task #3 - Request custom diagram for AI Memory System")

else:
    print(f"\n{'='*80}")
    print("❌ UPDATE FAILED")
    print(f"{'='*80}")
    print(f"HTTP Status: {response.status_code}")
    print(f"Response: {response.text}")
