#!/usr/bin/env python3
"""Publish resume download button task for Alice."""

import asyncio
import sys
import httpx
from datetime import datetime
sys.path.insert(0, "/Users/michaeljones/Dev/MJ_Online")


async def publish_resume_button_task():
    """Create and publish resume button task since Mike provided PDF."""

    print("📋 Publishing resume download button task for Alice...\n")

    task = {
        "task_id": "resume-button-final",
        "title": "Add Resume Download Button with PDF Link",
        "description": (
            "Add download button to Resume page now that Mike has provided PDF.\n\n"
            "**PREREQUISITE MET:** Mike has provided resume PDF\n\n"
            "**Steps:**\n"
            "1. Check if PDF already uploaded to Ghost media library\n"
            "2. If not uploaded: Upload mike-jones-resume.pdf via Ghost Admin API\n"
            "3. Get Ghost CDN URL for PDF\n"
            "4. Fetch current Resume page HTML via Ghost Admin API\n"
            "5. Add download button (prominent placement - hero or after contact CTA)\n"
            "6. Use design system button styling (indigo primary or cyan accent)\n"
            "7. Add analytics event tracking for 'Track Resume Downloads'\n"
            "8. Update page via Ghost Admin API with source=html parameter\n"
            "9. Verify button works and analytics fire\n\n"
            "**Button HTML example:**\n"
            "<a href='{pdf_url}' class='button button-primary' download='mike-jones-resume.pdf' onclick=\"plausible('Resume Download')\">\n"
            "  Download Resume (PDF)\n"
            "</a>\n\n"
            "**Page URL:** https://www.mikejones.online/resume/\n"
            "**Ghost credentials:** /.env file\n\n"
            "**Quality checks:**\n"
            "- Button visible on page\n"
            "- PDF downloads when clicked\n"
            "- Analytics event fires\n"
            "- Mobile responsive\n"
            "- Matches design system styling"
        ),
        "status": "available",
        "priority": "critical",
        "created_at": datetime.now().isoformat(),
        "owner": None,
        "blocked_by": []
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                "http://localhost:8001/api/tasks",
                json=task,
                timeout=10.0
            )
            response.raise_for_status()
            print(f"✅ Published: {task['task_id']}")
            print(f"   Title: {task['title']}")
            print(f"   Priority: {task['priority']}")
            print(f"   Status: Available for Alice to claim")
            print()
            print("📊 Dashboard: http://localhost:8001")
            print()
            print("✅ Alice can now claim this task autonomously!")
            return True
        except Exception as e:
            print(f"❌ Error publishing task: {e}")
            return False


if __name__ == "__main__":
    success = asyncio.run(publish_resume_button_task())
    if success:
        print("\n🎯 Task published successfully!")
        print("📱 Alice should see it in her queue now")
    else:
        print("\n⚠️ Task publication failed")
