#!/usr/bin/env python3
"""
Alice - Add Resume Download Button
Uploads PDF and adds download button to resume page
"""

import asyncio
import sys
import os
import jwt
from pathlib import Path
from datetime import datetime as dt
from dotenv import load_dotenv
import httpx

# Add agent_coordination to path
sys.path.insert(0, str(Path(__file__).parent / "agent_coordination"))
from agent_coordination.client import WorkerClient

# Load Ghost API credentials
load_dotenv()
GHOST_ADMIN_API_KEY = os.getenv('GHOST_ADMIN_API_KEY')
GHOST_API_URL = os.getenv('GHOST_API_URL')

if not GHOST_ADMIN_API_KEY or not GHOST_API_URL:
    print("❌ Ghost API credentials not found in .env")
    sys.exit(1)


def generate_ghost_token():
    """Generate JWT token for Ghost Admin API."""
    key_id, secret = GHOST_ADMIN_API_KEY.split(':')

    iat = int(dt.now().timestamp())

    header = {'alg': 'HS256', 'typ': 'JWT', 'kid': key_id}
    payload = {
        'iat': iat,
        'exp': iat + 5 * 60,
        'aud': '/admin/'
    }

    token = jwt.encode(payload, bytes.fromhex(secret), algorithm='HS256', headers=header)
    return token


async def upload_resume_pdf():
    """Upload resume PDF to Ghost media library."""

    print("📤 Uploading resume PDF to Ghost...")

    pdf_path = Path("/Users/michaeljones/Dev/MJ_Online/assets/Career/Mike_Jones_PTPM.pdf")

    if not pdf_path.exists():
        raise FileNotFoundError(f"PDF not found: {pdf_path}")

    size_kb = pdf_path.stat().st_size / 1024
    print(f"   File: {pdf_path.name} ({size_kb:.0f}KB)")

    token = generate_ghost_token()
    headers = {'Authorization': f'Ghost {token}'}

    async with httpx.AsyncClient(timeout=60.0) as client:
        # Upload file
        with open(pdf_path, 'rb') as f:
            files = {
                'file': (pdf_path.name, f, 'application/pdf')
            }

            # Try file upload endpoint for PDFs
            response = await client.post(
                f"{GHOST_API_URL}/ghost/api/admin/files/upload/",
                headers=headers,
                files=files
            )

            if response.status_code not in [200, 201]:
                print(f"❌ Upload failed: {response.status_code}")
                print(f"   Response: {response.text}")
                raise Exception(f"Upload failed: {response.status_code}")

            result = response.json()
            # File upload returns different structure than image upload
            file_url = result['files'][0]['url'] if 'files' in result else result['images'][0]['url']

            print(f"✅ PDF uploaded successfully!")
            print(f"   URL: {file_url}")

            return file_url


async def get_resume_page():
    """Get current resume page content."""

    print("\n📖 Fetching current resume page...")

    token = generate_ghost_token()
    headers = {'Authorization': f'Ghost {token}'}

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{GHOST_API_URL}/ghost/api/admin/pages/slug/resume/",
            headers=headers
        )

        if response.status_code != 200:
            raise Exception(f"Failed to fetch resume page: {response.status_code}")

        result = response.json()
        page = result['pages'][0]

        print(f"✅ Resume page found")
        print(f"   ID: {page['id']}")
        print(f"   Title: {page['title']}")
        print(f"   Updated: {page['updated_at']}")

        return page


async def update_resume_page_with_button(page, pdf_url):
    """Add download button to resume page."""

    print("\n✏️  Adding download button to resume page...")

    # Get current HTML
    current_html = page.get('html', '')

    # Create download button HTML with analytics tracking
    button_html = f'''
<!-- Resume Download Button -->
<div style="text-align: center; margin: 40px 0;">
    <a href="{pdf_url}"
       download="Mike-Jones-Resume.pdf"
       class="resume-download-button"
       onclick="if(window.gtag){{gtag('event','resume_download',{{'event_category':'engagement','event_label':'Resume PDF'}});}}if(window.plausible){{plausible('Resume Download');}}"
       style="display: inline-block; padding: 16px 32px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 18px; transition: all 0.2s;">
        📄 Download Resume (PDF)
    </a>
</div>
<style>
.resume-download-button:hover {{
    background-color: #1d4ed8;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}}
</style>
'''

    # Add button at the top of the page (after any hero section)
    # Look for the first </section> or </div> tag and insert after it
    if '</section>' in current_html:
        parts = current_html.split('</section>', 1)
        new_html = parts[0] + '</section>' + button_html + parts[1]
    elif '<div' in current_html:
        # Insert after first major div
        parts = current_html.split('>', 1)
        new_html = parts[0] + '>' + button_html + parts[1]
    else:
        # Just prepend if structure is unclear
        new_html = button_html + current_html

    print(f"   Button HTML added ({len(button_html)} chars)")
    print(f"   Total HTML size: {len(new_html)} chars")

    # Update page via API
    token = generate_ghost_token()
    headers = {'Authorization': f'Ghost {token}'}

    update_payload = {
        "pages": [{
            "id": page['id'],
            "html": new_html,
            "updated_at": page['updated_at']
        }]
    }

    async with httpx.AsyncClient() as client:
        response = await client.put(
            f"{GHOST_API_URL}/ghost/api/admin/pages/{page['id']}/",
            headers=headers,
            json=update_payload
        )

        if response.status_code != 200:
            print(f"❌ Update failed: {response.status_code}")
            print(f"   Response: {response.text}")
            raise Exception(f"Update failed: {response.status_code}")

        result = response.json()
        updated_page = result['pages'][0]

        print(f"✅ Resume page updated successfully!")
        print(f"   URL: {updated_page['url']}")

        return updated_page


async def add_resume_download_button():
    """Main function to add resume download button."""

    print("\n" + "="*80)
    print("📄 ADDING RESUME DOWNLOAD BUTTON")
    print("="*80 + "\n")

    async with WorkerClient("Alice") as worker:
        await worker.register(description="Web Content Builder - Adding resume download button")
        await worker.heartbeat(
            status="busy",
            current_task="qa-critical-1",
            current_task_title="Adding resume download button"
        )
        await worker.send_coordination_message(
            "🎯 Alice implementing resume download button: Upload PDF → Update page"
        )

        try:
            # Step 1: Upload PDF
            pdf_url = await upload_resume_pdf()

            # Step 2: Get current resume page
            page = await get_resume_page()

            # Step 3: Add download button
            updated_page = await update_resume_page_with_button(page, pdf_url)

            # Success!
            result = {
                "summary": "Resume download button added successfully",
                "pdf_url": pdf_url,
                "page_url": updated_page['url'],
                "status": "completed",
                "features": [
                    "PDF uploaded to Ghost CDN",
                    "Download button added with styling",
                    "Analytics tracking configured (gtag + plausible)",
                    "Hover effects and visual feedback",
                    "Proper download attribute for filename"
                ]
            }

            await worker.complete_task("qa-critical-1", result=result)
            await worker.send_coordination_message(
                f"✅ Resume download button complete! PDF: {pdf_url}"
            )
            await worker.heartbeat(status="active", current_task=None)

            print("\n" + "="*80)
            print("✅ RESUME DOWNLOAD BUTTON COMPLETE")
            print("="*80)
            print(f"\n📄 PDF URL: {pdf_url}")
            print(f"🌐 Page URL: {updated_page['url']}")
            print(f"\n✨ Download button is now live with analytics tracking!")

        except Exception as e:
            error_msg = f"Failed to add resume button: {str(e)}"
            print(f"\n❌ ERROR: {error_msg}")
            await worker.complete_task("qa-critical-1", error=error_msg)
            await worker.report_error(error_msg)
            await worker.heartbeat(status="active", current_task=None)
            raise


if __name__ == "__main__":
    asyncio.run(add_resume_download_button())
