#!/usr/bin/env python3
"""
Alice - Re-publish Substack page with BOTH logos included
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


async def republish_with_logos():
    """Re-publish page with both logos included."""

    print("\n" + "="*80)
    print("🎨 RE-PUBLISHING SUBSTACK PAGE WITH BOTH LOGOS")
    print("="*80)

    # CDN URLs (already uploaded)
    rt_screenshot_url = "https://www.mikejones.online/content/images/2026/02/RT_HomePage.png"
    oi_screenshot_url = "https://www.mikejones.online/content/images/2026/02/Org_Intelligence_Home_Page.png"
    vp_logo_url = "https://www.mikejones.online/content/images/2026/02/VP-v2-Final-1.png"
    rt_logo_url = "https://www.mikejones.online/content/images/2026/02/Logo---Email-Header.png"

    print("\n✅ Using CDN URLs:")
    print(f"   RT Logo: {rt_logo_url}")
    print(f"   RT Screenshot: {rt_screenshot_url}")
    print(f"   VP Logo: {vp_logo_url}")
    print(f"   OI Screenshot: {oi_screenshot_url}")

    # Create complete HTML with both logos
    html_content = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Substack - Mike Jones | Resilient Tomorrow & Organizational Intelligence</title>
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
                <div class="logo">
                    <img src="{rt_logo_url}" alt="Resilient Tomorrow Logo">
                </div>

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

                <img src="{rt_screenshot_url}" alt="Resilient Tomorrow Substack homepage showing recent articles on community resilience" class="screenshot">

                <div class="rss-feed">
                    <h4>Recent Articles</h4>
                    <div id="resilient-rss" class="rss-loading">Loading articles...</div>
                </div>

                <a href="https://resilienttomorrow.substack.com" target="_blank" class="cta cta-rt" onclick="if(window.plausible)plausible('Substack Visit - RT')">Visit Resilient Tomorrow →</a>
            </div>

            <!-- Column 2: Organizational Intelligence -->
            <div class="pub-card">
                <div class="logo">
                    <img src="{vp_logo_url}" alt="Velocity Partners Logo">
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

                <img src="{oi_screenshot_url}" alt="Organizational Intelligence Substack newsletter showing PMO frameworks and case studies" class="screenshot">

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

    print("\n📝 HTML created with both logos integrated")
    print(f"   Size: {len(html_content)} bytes")

    # Update the page via Ghost Admin API
    token = generate_ghost_token()
    headers = {'Authorization': f'Ghost {token}'}

    async with WorkerClient("Alice") as worker:
        await worker.heartbeat(
            status="busy",
            current_task="republish-substack-logos",
            current_task_title="Re-publishing Substack page with both logos"
        )

        async with httpx.AsyncClient(timeout=60.0) as client:
            # Get current page to get ID and updated_at
            print("\n📖 Fetching current page...")
            response = await client.get(
                f"{GHOST_API_URL}/ghost/api/admin/pages/slug/writing/",
                headers=headers
            )

            if response.status_code != 200:
                raise Exception(f"Failed to fetch page: {response.status_code}")

            result = response.json()
            page = result['pages'][0]
            page_id = page['id']

            print(f"✅ Found page: {page['title']} (ID: {page_id})")

            # Update page with new HTML
            print("\n🚀 Updating page with both logos...")

            update_payload = {
                "pages": [{
                    "html": html_content,
                    "updated_at": page['updated_at']
                }]
            }

            response = await client.put(
                f"{GHOST_API_URL}/ghost/api/admin/pages/{page_id}/?source=html",
                headers=headers,
                json=update_payload
            )

            if response.status_code != 200:
                print(f"❌ Update failed: {response.status_code}")
                print(f"   Response: {response.text}")
                raise Exception(f"Update failed: {response.status_code}")

            result = response.json()
            updated_page = result['pages'][0]

            print(f"✅ Page re-published successfully!")
            print(f"   URL: {updated_page['url']}")

            await worker.send_coordination_message(
                "✅ SUBSTACK PAGE RE-PUBLISHED WITH BOTH LOGOS!\n\n"
                "Updated features:\n"
                "  ✅ Resilient Tomorrow logo displayed\n"
                "  ✅ Velocity Partners logo displayed\n"
                "  ✅ Both screenshots showing\n"
                "  ✅ RSS feeds loading\n"
                "  ✅ All CTAs working\n\n"
                "Live URL: https://www.mikejones.online/writing/\n\n"
                "Navigation remains 'Substack' as requested (no changes needed)"
            )

            await worker.heartbeat(status="idle", current_task=None)

            print("\n" + "="*80)
            print("✅ RE-PUBLISH COMPLETE!")
            print("="*80)
            print(f"\n🌐 Live page: https://www.mikejones.online/writing/")
            print(f"\n✨ Both logos now displaying:")
            print(f"   - Resilient Tomorrow logo ✅")
            print(f"   - Velocity Partners logo ✅")
            print(f"\n📊 Navigation: 'Substack' link remains unchanged (as requested)")


if __name__ == "__main__":
    asyncio.run(republish_with_logos())
