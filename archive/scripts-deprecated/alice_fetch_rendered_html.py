#!/usr/bin/env python3
"""
Alice - Fetch rendered HTML from /writing page
"""

import httpx
import asyncio


async def fetch_rendered_html():
    """Fetch the live rendered HTML from the published page."""

    page_url = "https://www.mikejones.online/writing/"

    async with httpx.AsyncClient(timeout=60.0) as client:
        print(f"📥 Fetching rendered HTML from {page_url}")

        response = await client.get(page_url)

        if response.status_code == 200:
            html = response.text

            print(f"✅ Fetched rendered HTML")
            print(f"   Length: {len(html)} chars")
            print(f"   Lines: {len(html.split(chr(10)))}")

            # Save to file
            with open('/tmp/writing_page_rendered.html', 'w') as f:
                f.write(html)

            print(f"\n✅ Saved rendered HTML to /tmp/writing_page_rendered.html")

            # Check for line 987
            html_lines = html.split('\n')
            if len(html_lines) >= 987:
                print(f"\n🔍 Line 987 context (lines 980-995):")
                for i in range(max(0, 980), min(len(html_lines), 995)):
                    line_num = i + 1
                    marker = ">>> " if line_num == 987 else "    "
                    line_text = html_lines[i]
                    # Truncate long lines
                    if len(line_text) > 150:
                        line_text = line_text[:147] + "..."
                    print(f"{marker}{line_num:4d}: {line_text}")
            else:
                print(f"\n⚠️ HTML only has {len(html_lines)} lines (line 987 not found)")

            # Search for script tags and JavaScript
            import re
            scripts = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
            print(f"\n📊 Found {len(scripts)} script blocks")

            for i, script in enumerate(scripts):
                script_lines = script.split('\n')
                print(f"\n   Script {i+1}: {len(script_lines)} lines, {len(script)} chars")
                if len(script_lines) > 50:
                    print(f"      (Large script - might contain the error)")

            return html
        else:
            print(f"❌ Failed to fetch page: {response.status_code}")
            return None


if __name__ == "__main__":
    asyncio.run(fetch_rendered_html())
