#!/usr/bin/env python3
"""
Alice - QA Image Uploads (Autonomous)
Upload missing images for Local LLM and NeighborhoodShare articles
"""

import asyncio
import sys
import os
import jwt
from pathlib import Path
from datetime import datetime as dt
from dotenv import load_dotenv
import httpx

sys.path.insert(0, str(Path(__file__).parent / "agent_coordination"))
from agent_coordination.client import WorkerClient

load_dotenv()
GHOST_ADMIN_API_KEY = os.getenv('GHOST_ADMIN_API_KEY')
GHOST_API_URL = os.getenv('GHOST_API_URL')


def generate_ghost_token():
    """Generate JWT token for Ghost Admin API."""
    key_id, secret = GHOST_ADMIN_API_KEY.split(':')
    iat = int(dt.now().timestamp())
    header = {'alg': 'HS256', 'typ': 'JWT', 'kid': key_id}
    payload = {'iat': iat, 'exp': iat + 5 * 60, 'aud': '/admin/'}
    token = jwt.encode(payload, bytes.fromhex(secret), algorithm='HS256', headers=header)
    return token


async def upload_image(file_path, description):
    """Upload single image to Ghost CDN."""

    path = Path(file_path)
    if not path.exists():
        raise FileNotFoundError(f"Image not found: {file_path}")

    size_kb = path.stat().st_size / 1024
    print(f"\n📤 Uploading {description}...")
    print(f"   File: {path.name} ({size_kb:.0f}KB)")

    token = generate_ghost_token()
    headers = {'Authorization': f'Ghost {token}'}

    async with httpx.AsyncClient(timeout=60.0) as client:
        with open(path, 'rb') as f:
            files = {'file': (path.name, f, 'image/png')}

            response = await client.post(
                f"{GHOST_API_URL}/ghost/api/admin/images/upload/",
                headers=headers,
                files=files
            )

            if response.status_code not in [200, 201]:
                raise Exception(f"Upload failed: {response.status_code} - {response.text}")

            result = response.json()
            cdn_url = result['images'][0]['url']

            print(f"✅ Uploaded successfully!")
            print(f"   CDN URL: {cdn_url}")

            return {
                "filename": path.name,
                "description": description,
                "cdn_url": cdn_url,
                "size_kb": size_kb
            }


async def qa_images_workflow():
    """Execute QA image uploads autonomously."""

    print("\n" + "="*80)
    print("🤖 ALICE - QA IMAGE UPLOADS (AUTONOMOUS)")
    print("="*80)

    async with WorkerClient("Alice") as worker:
        await worker.register(
            description="Web Content Builder - QA image uploads"
        )

        await worker.heartbeat(
            status="busy",
            current_task="qa-images",
            current_task_title="Uploading QA images for Local LLM and NeighborhoodShare"
        )

        await worker.send_coordination_message(
            "🤖 ALICE - STARTING QA IMAGE UPLOADS\n\n"
            "Tasks:\n"
            "  1. qa-img-1: Upload OfflineAI-Session-Workflow.png\n"
            "  2. qa-img-3: Upload NeighborhoodShare screenshots (5 images)\n\n"
            "These uploads will unblock insertion tasks:\n"
            "  - qa-img-2: Insert Local LLM diagrams\n"
            "  - qa-img-4: Insert NeighborhoodShare screenshots\n\n"
            "Estimated time: 20-30 minutes\n"
            "Status: IN PROGRESS"
        )

        all_uploads = []

        try:
            # Task 1: Upload Local LLM Workflow Diagram
            print("\n" + "="*80)
            print("TASK 1: LOCAL LLM WORKFLOW DIAGRAM")
            print("="*80)

            llm_diagram_path = "/Users/michaeljones/Dev/MJ_Online/assets/projects/local-llm/OfflineAI-Session-Workflow.png"

            llm_result = await upload_image(
                llm_diagram_path,
                "Local LLM Session Workflow Diagram"
            )
            all_uploads.append(llm_result)

            await worker.send_coordination_message(
                f"✅ Task 1 Complete: Local LLM diagram uploaded\n"
                f"   CDN URL: {llm_result['cdn_url']}\n"
                f"   Ready for qa-img-2 (diagram insertion)"
            )

            # Task 2: Upload NeighborhoodShare Screenshots
            print("\n" + "="*80)
            print("TASK 2: NEIGHBORHOODSHARE SCREENSHOTS")
            print("="*80)

            ns_base_path = Path("/Users/michaeljones/Dev/MJ_Online/assets/projects/neighborhoodshare")

            # Find screenshot files
            screenshot_files = [
                "Home-Tool-Selection.png",
                "Add-Tool-AI-2.png",
                "Admin-Prod-4-AIMonitoring.png",
                "Tool-Detail-Owner.png",
                "LandingPage.png"
            ]

            print(f"\n📋 Looking for {len(screenshot_files)} screenshots...")

            found_files = []
            for screenshot in screenshot_files:
                full_path = ns_base_path / screenshot
                if full_path.exists():
                    found_files.append((str(full_path), screenshot))
                    print(f"   ✅ Found: {screenshot}")
                else:
                    # Try alternate naming
                    alt_path = ns_base_path / screenshot.replace("Add-Tool-AI-2", "Add-Tool-AI-2-1")
                    if alt_path.exists():
                        found_files.append((str(alt_path), screenshot))
                        print(f"   ✅ Found (alternate): {alt_path.name}")
                    else:
                        print(f"   ⚠️  Missing: {screenshot}")

            print(f"\n📊 Found {len(found_files)}/{len(screenshot_files)} screenshots")

            if len(found_files) == 0:
                raise FileNotFoundError("No NeighborhoodShare screenshots found!")

            # Upload all found screenshots
            for file_path, description in found_files:
                result = await upload_image(file_path, f"NeighborhoodShare: {description}")
                all_uploads.append(result)
                await asyncio.sleep(1)  # Brief pause between uploads

            await worker.send_coordination_message(
                f"✅ Task 2 Complete: NeighborhoodShare screenshots uploaded\n"
                f"   Uploaded: {len(found_files)} images\n"
                f"   Ready for qa-img-4 (screenshot insertion)"
            )

            # Generate summary
            print("\n" + "="*80)
            print("✅ ALL QA IMAGE UPLOADS COMPLETE")
            print("="*80)

            print(f"\n📊 Summary:")
            print(f"   Total images uploaded: {len(all_uploads)}")
            print(f"   Local LLM diagrams: 1")
            print(f"   NeighborhoodShare screenshots: {len(found_files)}")

            print(f"\n📋 CDN URLs:")
            for upload in all_uploads:
                print(f"   • {upload['filename']}")
                print(f"     {upload['cdn_url']}")

            # Create summary for next tasks
            result = {
                "summary": f"Uploaded {len(all_uploads)} QA images to Ghost CDN",
                "status": "completed",
                "uploads": all_uploads,
                "unblocked_tasks": [
                    "qa-img-2 (Insert Local LLM diagrams)",
                    "qa-img-4 (Insert NeighborhoodShare screenshots)"
                ]
            }

            await worker.send_coordination_message(
                f"🎉 ALICE - QA IMAGE UPLOADS COMPLETE!\n\n"
                f"✅ Uploaded {len(all_uploads)} images:\n"
                f"   - Local LLM workflow diagram\n"
                f"   - {len(found_files)} NeighborhoodShare screenshots\n\n"
                f"📋 UNBLOCKED TASKS (ready to execute):\n"
                f"   - qa-img-2: Insert Local LLM diagrams into article\n"
                f"   - qa-img-4: Insert NeighborhoodShare screenshots into article\n\n"
                f"Alice ready for next task: Would you like me to continue with image insertion?"
            )

            await worker.heartbeat(status="idle", current_task=None)

            print("\n✨ Alice autonomous image uploads complete!")
            print("📊 Dashboard: http://localhost:8001")

            return result

        except Exception as e:
            error_msg = f"QA image upload failed: {str(e)}"
            print(f"\n❌ ERROR: {error_msg}")
            await worker.report_error(error_msg)
            await worker.heartbeat(status="idle", current_task=None)
            raise


if __name__ == "__main__":
    asyncio.run(qa_images_workflow())
