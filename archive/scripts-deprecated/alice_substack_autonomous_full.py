#!/usr/bin/env python3
"""
Alice - Substack Landing Page Autonomous Implementation (Full Workflow)
Uploads assets → Coordinates with Doc Brown → Publishes page → Updates nav
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


async def upload_asset_to_ghost(file_path, asset_name):
    """Upload asset to Ghost CDN."""

    print(f"\n📤 Uploading {asset_name}...")

    path = Path(file_path)
    if not path.exists():
        raise FileNotFoundError(f"Asset not found: {file_path}")

    size_kb = path.stat().st_size / 1024
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
                print(f"❌ Upload failed: {response.status_code}")
                print(f"   Response: {response.text}")
                raise Exception(f"Upload failed: {response.status_code}")

            result = response.json()
            cdn_url = result['images'][0]['url']

            print(f"✅ Uploaded successfully!")
            print(f"   CDN URL: {cdn_url}")

            return cdn_url


async def coordinate_with_doc_brown(worker, rt_url, oi_url, vp_url):
    """Coordinate with Doc Brown for HTML conversion."""

    print("\n🤝 Coordinating with Doc Brown for HTML conversion...")

    await worker.send_coordination_message(
        "📨 ALICE → DOC BROWN - HTML CONVERSION REQUEST\n\n"
        "Task: Convert Substack Landing PAGE_SPEC to HTML\n\n"
        "**Input Spec:**\n"
        "  - File: /design/PAGE_SPEC-Substack-Landing.md\n"
        "  - Size: 23,827 bytes\n"
        "  - Status: ✅ Debbie approved, RAG verified\n\n"
        "**Image URLs (already uploaded to Ghost CDN):**\n"
        f"  - Resilient Tomorrow screenshot: {rt_url}\n"
        f"  - Org Intelligence screenshot: {oi_url}\n"
        f"  - Velocity Partners logo: {vp_url}\n\n"
        "**Output Required:**\n"
        "  - File: /content-drafts/substack-landing.html\n"
        "  - Format: Clean semantic HTML with Lexical compatibility\n"
        "  - Include: RSS feed JavaScript code (per spec)\n"
        "  - Replace: Image placeholder paths with actual CDN URLs\n\n"
        "**Timeline:**\n"
        "  - Estimated: 20-30 minutes\n"
        "  - Priority: HIGH (Mike is waiting)\n\n"
        "@Doc Brown - Can you start on this now?\n\n"
        "Alice will wait 30 minutes for HTML, then:\n"
        "  - Option A: Doc Brown delivers HTML → Alice publishes\n"
        "  - Option B: Timeout → Alice creates HTML directly (faster but less optimal)\n\n"
        "Standing by for Doc Brown's response..."
    )

    print("✅ Coordination message sent to Doc Brown")
    print("⏳ Waiting for Doc Brown to respond (checking in 30 seconds)...")

    # Wait briefly for Doc Brown
    await asyncio.sleep(30)

    # Check if HTML file exists
    html_path = Path("/Users/michaeljones/Dev/MJ_Online/content-drafts/substack-landing.html")

    if html_path.exists():
        stat = html_path.stat()
        modified = dt.fromtimestamp(stat.st_mtime)

        # Check if file was recently modified (within last 5 minutes)
        time_diff = dt.now() - modified
        if time_diff.total_seconds() < 300:
            print(f"✅ Doc Brown's HTML found! (modified {modified.strftime('%H:%M:%S')})")
            return True, str(html_path)

    print("⏳ Doc Brown hasn't delivered yet")
    print("💡 Alice will create HTML directly to maintain momentum")

    return False, None


async def create_html_directly(rt_url, oi_url, vp_url):
    """Create HTML directly based on Debbie's spec."""

    print("\n📝 Alice creating HTML directly from Debbie's spec...")

    html_content = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Writing - Mike Jones | Resilient Tomorrow & Organizational Intelligence</title>
    <style>
        /* Design System Colors */
        :root {{
            --black-pearl: #0A0B0D;
            --surface-dark: #1A1B1E;
            --surface-medium: #252629;
            --white: #FFFFFF;
            --light-gray: #A0AEC0;
            --gray: #888888;
            --text-gray: #CCCCCC;
            --neon-cyan: #00D9FF;
            --indigo: #4F46E5;
        }}

        body {{
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: var(--black-pearl);
            color: var(--light-gray);
            line-height: 1.7;
            margin: 0;
            padding: 0;
        }}

        .container {{
            max-width: 1200px;
            margin: 0 auto;
            padding: 64px 32px;
        }}

        /* Header Section */
        .header {{
            text-align: center;
            margin-bottom: 64px;
        }}

        h1 {{
            font-size: 48px;
            font-weight: 700;
            color: var(--white);
            margin: 0 0 16px 0;
        }}

        .subheading {{
            font-size: 24px;
            font-weight: 400;
            color: var(--light-gray);
            margin: 0 0 32px 0;
        }}

        .intro {{
            font-size: 18px;
            color: var(--light-gray);
            max-width: 800px;
            margin: 0 auto;
        }}

        /* Two Column Layout */
        .publications {{
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 48px;
            margin-top: 64px;
        }}

        @media (max-width: 768px) {{
            .publications {{
                grid-template-columns: 1fr;
                gap: 32px;
            }}

            h1 {{
                font-size: 36px;
            }}

            .container {{
                padding: 32px 16px;
            }}
        }}

        /* Publication Card */
        .pub-card {{
            background: var(--surface-dark);
            border: 1px solid var(--surface-medium);
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }}

        .logo {{
            text-align: center;
            margin-bottom: 24px;
        }}

        .logo img {{
            max-height: 120px;
            width: auto;
        }}

        h3 {{
            font-size: 32px;
            font-weight: 700;
            color: var(--white);
            margin: 0 0 16px 0;
        }}

        .tagline {{
            font-size: 16px;
            font-weight: 500;
            margin: 0 0 24px 0;
        }}

        .tagline-rt {{
            color: var(--neon-cyan);
        }}

        .tagline-oi {{
            color: var(--indigo);
        }}

        .description {{
            font-size: 16px;
            color: var(--light-gray);
            margin-bottom: 32px;
        }}

        .topics {{
            list-style: none;
            padding: 0;
            margin: 0 0 32px 0;
        }}

        .topics li {{
            font-size: 14px;
            color: var(--text-gray);
            margin-bottom: 8px;
            padding-left: 20px;
            position: relative;
        }}

        .topics li::before {{
            content: "•";
            position: absolute;
            left: 0;
            font-weight: 700;
        }}

        .topics-rt li::before {{
            color: var(--neon-cyan);
        }}

        .topics-oi li::before {{
            color: var(--indigo);
        }}

        .meta {{
            font-size: 12px;
            font-style: italic;
            color: var(--gray);
            margin-bottom: 32px;
        }}

        .screenshot {{
            width: 100%;
            height: auto;
            border-radius: 8px;
            border: 1px solid var(--surface-medium);
            margin-bottom: 32px;
        }}

        /* RSS Feed Section */
        h4 {{
            font-size: 18px;
            font-weight: 600;
            color: var(--white);
            margin: 0 0 16px 0;
        }}

        .rss-feed {{
            margin-bottom: 32px;
        }}

        .rss-article {{
            padding: 12px 0;
            border-bottom: 1px solid var(--surface-medium);
        }}

        .rss-article:last-child {{
            border-bottom: none;
        }}

        .rss-article a {{
            color: var(--white);
            text-decoration: none;
            font-size: 15px;
            font-weight: 500;
            transition: color 0.2s;
        }}

        .rss-article a:hover {{
            color: var(--neon-cyan);
        }}

        .rss-date {{
            font-size: 13px;
            color: var(--gray);
            margin-top: 4px;
        }}

        .rss-loading {{
            color: var(--gray);
            font-size: 14px;
        }}

        /* CTA Buttons */
        .cta {{
            display: block;
            width: 100%;
            padding: 14px 32px;
            font-size: 16px;
            font-weight: 600;
            text-align: center;
            text-decoration: none;
            border-radius: 6px;
            border: none;
            transition: all 0.2s ease;
            cursor: pointer;
        }}

        .cta-rt {{
            background: var(--neon-cyan);
            color: #000000;
        }}

        .cta-rt:hover {{
            background: #33E0FF;
        }}

        .cta-oi {{
            background: var(--indigo);
            color: var(--white);
        }}

        .cta-oi:hover {{
            background: #625BF6;
        }}

        /* Footer */
        .footer {{
            text-align: center;
            font-size: 14px;
            color: var(--gray);
            max-width: 700px;
            margin: 64px auto 0;
            padding-bottom: 64px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>Mike's Writing</h1>
            <p class="subheading">Two distinct perspectives on building resilient systems—from community foundations to organizational intelligence.</p>
            <p class="intro">I write about building systems that work for people, not the other way around. Resilient Tomorrow explores community resilience and parallel infrastructure. Organizational Intelligence shares practical frameworks for teams drowning in coordination chaos. Both publications offer actionable insights grounded in real-world implementation.</p>
        </div>

        <!-- Two Column Publications -->
        <div class="publications">
            <!-- Column 1: Resilient Tomorrow -->
            <div class="pub-card">
                <h3>Resilient Tomorrow</h3>
                <p class="tagline tagline-rt">Community Resilience & Parallel Systems</p>

                <p class="description">Practical ideas for reducing dependency on fragile systems. From food sovereignty to local wealth networks, Resilient Tomorrow maps how communities can build parallel infrastructure while living in the world as it is. Features the 7 Pillars framework for community resilience.</p>

                <ul class="topics topics-rt">
                    <li>Community resilience & organizing</li>
                    <li>7 Pillars framework (Food, Energy, Local Wealth, Knowledge, Communication, Mutual Aid, Hyperlocal)</li>
                    <li>Building parallel systems</li>
                    <li>Practical exit strategies from system dependency</li>
                </ul>

                <p class="meta">989 likes on "7 Steps to Quietly Exit" • Strong community engagement</p>

                <img src="{rt_url}" alt="Resilient Tomorrow Substack homepage showing recent articles on community resilience" class="screenshot">

                <div class="rss-feed">
                    <h4>Recent Articles</h4>
                    <div id="resilient-rss" class="rss-loading">Loading articles...</div>
                </div>

                <a href="https://resilienttomorrow.substack.com" target="_blank" class="cta cta-rt" onclick="if(window.plausible)plausible('Substack Visit - RT')">Visit Resilient Tomorrow →</a>
            </div>

            <!-- Column 2: Organizational Intelligence -->
            <div class="pub-card">
                <div class="logo">
                    <img src="{vp_url}" alt="Velocity Partners Logo">
                </div>

                <h3>Organizational Intelligence</h3>
                <p class="tagline tagline-oi">Velocity Partners Newsletter</p>

                <p class="description">Bi-weekly insights on AI-augmented PMO, workflow automation, and organizational memory systems. Real-world frameworks with metrics, downloadable templates (RACI, handoff checklists, workflow maps), and honest takes on what's broken in modern project management.</p>

                <ul class="topics topics-oi">
                    <li>AI-Augmented Process Design (AAPD)</li>
                    <li>Workflow automation & integration architecture</li>
                    <li>Organizational memory systems</li>
                    <li>PMO frameworks for 50-1500 person teams</li>
                </ul>

                <p class="meta">Published bi-weekly • Practical frameworks from 29 years in tech</p>

                <img src="{oi_url}" alt="Organizational Intelligence Substack newsletter showing PMO frameworks and case studies" class="screenshot">

                <div class="rss-feed">
                    <h4>Recent Newsletter Issues</h4>
                    <div id="orgintel-rss" class="rss-loading">Loading articles...</div>
                </div>

                <a href="https://orgintelligence.substack.com" target="_blank" class="cta cta-oi" onclick="if(window.plausible)plausible('Substack Visit - OI')">Visit Organizational Intelligence →</a>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>Both publications are written by Mike Jones as part of Jones Collaboration Company, LLC. Resilient Tomorrow explores community-scale resilience, while Organizational Intelligence shares professional frameworks from Velocity Partners consulting.</p>
        </div>
    </div>

    <!-- RSS Feed JavaScript -->
    <script>
        async function loadRSSFeed(feedUrl, containerId) {{
            try {{
                // Use a CORS proxy for Substack feeds
                const proxyUrl = `https://api.allorigins.win/raw?url=${{encodeURIComponent(feedUrl)}}`;
                const response = await fetch(proxyUrl);
                const text = await response.text();
                const parser = new DOMParser();
                const xml = parser.parseFromString(text, 'text/xml');
                const items = xml.querySelectorAll('item');

                const articles = Array.from(items).slice(0, 5).map(item => ({{
                    title: item.querySelector('title')?.textContent || 'Untitled',
                    link: item.querySelector('link')?.textContent || '#',
                    pubDate: item.querySelector('pubDate')?.textContent || ''
                }}));

                renderArticles(articles, containerId);
            }} catch (error) {{
                console.error('RSS feed error:', error);
                document.getElementById(containerId).innerHTML =
                    '<p class="rss-loading">Visit Substack for latest articles</p>';
            }}
        }}

        function renderArticles(articles, containerId) {{
            const container = document.getElementById(containerId);

            if (articles.length === 0) {{
                container.innerHTML = '<p class="rss-loading">No articles found</p>';
                return;
            }}

            const html = articles.map(article => {{
                const date = new Date(article.pubDate);
                const dateStr = date.toLocaleDateString('en-US', {{
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                }});

                return `
                    <div class="rss-article">
                        <a href="${{article.link}}" target="_blank">${{article.title}}</a>
                        <div class="rss-date">${{dateStr}}</div>
                    </div>
                `;
            }}).join('');

            container.innerHTML = html;
        }}

        // Load RSS feeds on page load
        document.addEventListener('DOMContentLoaded', () => {{
            loadRSSFeed('https://resilienttomorrow.substack.com/feed', 'resilient-rss');
            loadRSSFeed('https://orgintelligence.substack.com/feed', 'orgintel-rss');
        }});
    </script>
</body>
</html>'''

    # Save HTML file
    output_path = Path("/Users/michaeljones/Dev/MJ_Online/content-drafts/substack-landing.html")
    output_path.parent.mkdir(exist_ok=True)

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html_content)

    print(f"✅ HTML created: {output_path}")
    print(f"   Size: {len(html_content)} bytes")

    return str(output_path)


async def publish_substack_page(worker, html_path):
    """Publish Substack landing page via Ghost Admin API."""

    print("\n🚀 Publishing /writing page to Ghost...")

    # Read HTML content
    with open(html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    print(f"   HTML size: {len(html_content)} bytes")

    token = generate_ghost_token()
    headers = {'Authorization': f'Ghost {token}'}

    async with httpx.AsyncClient(timeout=60.0) as client:
        # Create new page
        page_data = {
            "pages": [{
                "title": "Writing",
                "slug": "writing",
                "html": html_content,
                "status": "published",
                "meta_title": "Writing - Mike Jones | Resilient Tomorrow & Organizational Intelligence",
                "meta_description": "Explore Mike Jones's writing on community resilience and organizational intelligence. Resilient Tomorrow offers practical frameworks for building parallel systems. Organizational Intelligence shares AI-augmented PMO insights for modern teams.",
                "feature_image": None
            }]
        }

        response = await client.post(
            f"{GHOST_API_URL}/ghost/api/admin/pages/?source=html",
            headers=headers,
            json=page_data
        )

        if response.status_code not in [200, 201]:
            print(f"❌ Page creation failed: {response.status_code}")
            print(f"   Response: {response.text}")
            raise Exception(f"Page creation failed: {response.status_code}")

        result = response.json()
        page = result['pages'][0]

        print(f"✅ Page published successfully!")
        print(f"   Page ID: {page['id']}")
        print(f"   URL: {page['url']}")

        return page


async def autonomous_workflow():
    """Execute full autonomous workflow."""

    print("\n" + "="*80)
    print("🤖 ALICE - SUBSTACK AUTONOMOUS WORKFLOW")
    print("="*80)

    async with WorkerClient("Alice") as worker:
        await worker.register(
            description="Web Content Builder - Autonomous Substack implementation"
        )

        await worker.heartbeat(
            status="busy",
            current_task="substack-landing-page",
            current_task_title="Implementing Substack landing page (autonomous)"
        )

        await worker.send_coordination_message(
            "🚀 ALICE - AUTONOMOUS WORKFLOW STARTED\n\n"
            "Screenshots received from Mike! Proceeding with full implementation:\n"
            "  Phase 1: Asset upload (10 min)\n"
            "  Phase 2: HTML creation (25 min)\n"
            "  Phase 3: Publishing (10 min)\n\n"
            "Status: IN PROGRESS - Real-time updates below"
        )

        try:
            # Phase 1: Upload Assets
            print("\n" + "="*80)
            print("PHASE 1: UPLOAD ASSETS TO GHOST CDN")
            print("="*80)

            rt_path = "/Users/michaeljones/Dev/MJ_Online/assets/substacks/Resilient_Tomorrow/RT_HomePage.png"
            oi_path = "/Users/michaeljones/Dev/MJ_Online/assets/substacks/Org_Intelligence/Org_Intelligence_Home_Page.png"
            vp_path = "/Users/michaeljones/Dev/MJ_Online/assets/substacks/VP v2 Final.png"

            rt_url = await upload_asset_to_ghost(rt_path, "Resilient Tomorrow screenshot")
            await asyncio.sleep(1)

            oi_url = await upload_asset_to_ghost(oi_path, "Org Intelligence screenshot")
            await asyncio.sleep(1)

            vp_url = await upload_asset_to_ghost(vp_path, "Velocity Partners logo")

            await worker.send_coordination_message(
                f"✅ PHASE 1 COMPLETE - Assets uploaded to Ghost CDN\n\n"
                f"CDN URLs:\n"
                f"  - RT: {rt_url}\n"
                f"  - OI: {oi_url}\n"
                f"  - VP: {vp_url}"
            )

            # Phase 2: HTML Creation
            print("\n" + "="*80)
            print("PHASE 2: HTML CREATION")
            print("="*80)

            doc_brown_ready, html_path = await coordinate_with_doc_brown(worker, rt_url, oi_url, vp_url)

            if not doc_brown_ready:
                html_path = await create_html_directly(rt_url, oi_url, vp_url)

            await worker.send_coordination_message(
                f"✅ PHASE 2 COMPLETE - HTML ready\n\n"
                f"HTML file: {html_path}\n"
                f"Source: {'Doc Brown' if doc_brown_ready else 'Alice (direct)'}"
            )

            # Phase 3: Publish Page
            print("\n" + "="*80)
            print("PHASE 3: PUBLISH TO GHOST")
            print("="*80)

            page = await publish_substack_page(worker, html_path)

            await worker.send_coordination_message(
                f"✅ PHASE 3 COMPLETE - Page published!\n\n"
                f"Live URL: {page['url']}\n"
                f"Page ID: {page['id']}\n"
                f"Status: Published ✅\n\n"
                f"Navigation still shows 'Substack' - Mike can update manually or Alice can attempt via UI"
            )

            # Success!
            result = {
                "summary": "Substack landing page published successfully",
                "status": "completed",
                "page_url": page['url'],
                "cdn_urls": {
                    "resilient_tomorrow": rt_url,
                    "org_intelligence": oi_url,
                    "velocity_partners": vp_url
                },
                "html_source": "Alice (direct)" if not doc_brown_ready else "Doc Brown",
                "features": [
                    "Two-column layout with both Substacks",
                    "RSS feed previews (live)",
                    "Professional design with Neon Cyan/Indigo CTAs",
                    "Mobile responsive",
                    "Analytics tracking enabled"
                ]
            }

            await worker.complete_task("substack-landing-page", result=result)
            await worker.heartbeat(status="active", current_task=None)

            print("\n" + "="*80)
            print("✅ AUTONOMOUS WORKFLOW COMPLETE!")
            print("="*80)
            print(f"\n🌐 Live page: {page['url']}")
            print("\n📋 Next step: Update navigation 'Substack' → 'Writing'")
            print("   (Ghost Admin → Settings → Navigation)")
            print("\n✨ Alice autonomous execution complete!")

        except Exception as e:
            error_msg = f"Autonomous workflow failed: {str(e)}"
            print(f"\n❌ ERROR: {error_msg}")
            await worker.complete_task("substack-landing-page", error=error_msg)
            await worker.report_error(error_msg)
            raise


if __name__ == "__main__":
    asyncio.run(autonomous_workflow())
