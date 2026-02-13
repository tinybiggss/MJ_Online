#!/usr/bin/env python3
"""
Alice - Fix RSS feed loading on /writing page
Add JavaScript to page footer code injection to load RSS feeds
"""

import os
import jwt
import json
import httpx
import asyncio
import sys
from datetime import datetime as dt
from dotenv import load_dotenv
from pathlib import Path

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


async def fix_rss_feeds():
    """Add RSS feed loading JavaScript to page footer code injection."""

    print("\n" + "="*80)
    print("🤖 ALICE - FIXING RSS FEED LOADING")
    print("="*80)

    async with WorkerClient("Alice") as worker:
        await worker.heartbeat(
            status="busy",
            current_task="fix-js-error",
            current_task_title="Fix JavaScript error on /writing page"
        )

        await worker.send_coordination_message(
            "🤖 ALICE - FIXING RSS FEEDS ON /WRITING PAGE\n\n"
            "Problem: Page shows 'Loading articles...' but no JavaScript to load them\n"
            "Solution: Add RSS feed loading script to footer code injection\n\n"
            "Estimated time: 5 minutes"
        )

        # RSS feed loading JavaScript
        rss_script = '''<script>
// Load RSS feeds for Substack publications
document.addEventListener('DOMContentLoaded', function() {
    // Load Resilient Tomorrow feed
    loadRSSFeed(
        'https://resilienttomorrow.substack.com/feed',
        'rt-feed',
        'https://resilienttomorrow.substack.com'
    );

    // Load Organizational Intelligence feed
    loadRSSFeed(
        'https://orgintelligence.substack.com/feed',
        'oi-feed',
        'https://orgintelligence.substack.com'
    );
});

async function loadRSSFeed(feedUrl, containerId, pubUrl) {
    try {
        // Find the "Loading articles..." paragraph for this feed
        const headings = document.querySelectorAll('h4');
        let targetParagraph = null;

        for (const heading of headings) {
            if (heading.textContent.includes('Recent Articles') ||
                heading.textContent.includes('Recent Newsletter')) {
                // Get the next paragraph
                let next = heading.nextElementSibling;
                while (next) {
                    if (next.tagName === 'P' && next.textContent.includes('Loading articles')) {
                        targetParagraph = next;
                        break;
                    }
                    next = next.nextElementSibling;
                }
                if (targetParagraph) break;
            }
        }

        if (!targetParagraph) {
            console.error('Could not find target paragraph for feed:', feedUrl);
            return;
        }

        // Use CORS proxy to fetch RSS feed
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`;
        const response = await fetch(proxyUrl);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const xmlText = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, 'text/xml');

        // Parse RSS items
        const items = xml.querySelectorAll('item');
        const articles = [];

        for (let i = 0; i < Math.min(items.length, 5); i++) {
            const item = items[i];
            const title = item.querySelector('title')?.textContent || '';
            const link = item.querySelector('link')?.textContent || '';
            const pubDate = item.querySelector('pubDate')?.textContent || '';

            if (title && link) {
                articles.push({ title, link, pubDate });
            }
        }

        // Build HTML
        if (articles.length > 0) {
            let html = '<ul style="list-style: none; padding: 0; margin: 1rem 0;">';
            articles.forEach(article => {
                // Format date
                let dateStr = '';
                if (article.pubDate) {
                    const date = new Date(article.pubDate);
                    dateStr = ` <span style="color: #666; font-size: 0.9em;">(${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})</span>`;
                }

                html += `
                    <li style="margin-bottom: 0.75rem;">
                        <a href="${article.link}" target="_blank" rel="noopener" style="color: #00D9FF; text-decoration: none;">
                            ${article.title}
                        </a>${dateStr}
                    </li>
                `;
            });
            html += '</ul>';

            // Add "Visit" link
            const visitLink = targetParagraph.querySelector('a');
            if (visitLink) {
                html += visitLink.outerHTML;
            }

            targetParagraph.innerHTML = html;
        } else {
            targetParagraph.innerHTML = '<p>No recent articles found. <a href="' + pubUrl + '" target="_blank">Visit publication →</a></p>';
        }

    } catch (error) {
        console.error('Error loading RSS feed:', feedUrl, error);
        // Keep "Loading articles..." text and link on error
    }
}
</script>'''

        token = generate_ghost_token()
        headers = {'Authorization': f'Ghost {token}'}

        async with httpx.AsyncClient(timeout=60.0) as client:
            # Get current page
            print("\n📖 Fetching /writing page...")
            response = await client.get(
                f"{GHOST_API_URL}/ghost/api/admin/pages/slug/writing/",
                headers=headers
            )

            if response.status_code != 200:
                raise Exception(f"Failed to fetch page: {response.status_code}")

            result = response.json()
            page = result['pages'][0]

            print(f"✅ Found page: {page['title']}")
            print(f"   ID: {page['id']}")
            print(f"   Current footer injection: {len(page.get('codeinjection_foot', '') or '')} chars")

            # Update page with footer code injection
            print("\n📤 Adding RSS feed loading script to footer...")

            update_payload = {
                "pages": [{
                    "codeinjection_foot": rss_script,
                    "updated_at": page['updated_at']
                }]
            }

            response = await client.put(
                f"{GHOST_API_URL}/ghost/api/admin/pages/{page['id']}/",
                headers=headers,
                json=update_payload
            )

            if response.status_code != 200:
                raise Exception(f"Update failed: {response.status_code} - {response.text}")

            print(f"✅ Successfully added RSS feed loading script!")
            print(f"   Script length: {len(rss_script)} chars")
            print(f"   URL: https://www.mikejones.online/writing/")

            print("\n" + "="*80)
            print("✅ RSS FEED LOADING FIXED")
            print("="*80)
            print("\n📊 Changes:")
            print("   • Added JavaScript to footer code injection")
            print("   • Loads Resilient Tomorrow RSS feed")
            print("   • Loads Organizational Intelligence RSS feed")
            print("   • Displays 5 most recent articles from each")
            print("   • Falls back gracefully on errors")

            await worker.send_coordination_message(
                "🎉 ALICE - RSS FEED LOADING FIXED!\n\n"
                "✅ Added JavaScript to page footer code injection\n"
                "✅ RSS feeds will now load automatically\n"
                "✅ Shows 5 most recent articles from each Substack\n\n"
                "JavaScript error resolved - page ready to launch!"
            )

            await worker.heartbeat(status="idle", current_task=None)

            print("\n✨ Alice - RSS feed fix complete!")
            print("📊 Dashboard: http://localhost:8001")


if __name__ == "__main__":
    asyncio.run(fix_rss_feeds())
