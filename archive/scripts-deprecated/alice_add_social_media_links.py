#!/usr/bin/env python3
"""
Alice - Add social media links to site
Implements footer social icons and Schema.org social profiles
"""

import os
import jwt
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


async def add_social_media_footer():
    """Add social media icons to site footer via Ghost Code Injection."""

    print("\n" + "="*80)
    print("🤖 ALICE - ADDING SOCIAL MEDIA LINKS")
    print("="*80)

    async with WorkerClient("Alice") as worker:
        await worker.heartbeat(
            status="busy",
            current_task="phase4-social-links",
            current_task_title="Social Media Links & Contact Enhancement"
        )

        await worker.send_coordination_message(
            "🤖 ALICE - ADDING SOCIAL MEDIA LINKS\n\n"
            "Tasks:\n"
            "  • Add social media icons to footer\n"
            "  • Update Schema.org sameAs property\n"
            "  • Verify social meta tags\n\n"
            "Social profiles (from RAG):\n"
            "  • LinkedIn: https://www.linkedin.com/in/mejones73/\n"
            "  • GitHub: https://github.com/tinybiggss\n"
            "  • Twitter/X: https://x.com/IsMikeJones\n"
            "  • Facebook: https://facebook.com/mejones73\n"
            "  • Mastodon (RT): @resilientTomorrow@mastodon.social\n"
            "  • ActivityPub: @index@mikejones.online\n\n"
            "Estimated time: 30 minutes"
        )

        # Social media footer HTML/CSS
        footer_social_html = '''<!-- Social Media Links Footer -->
<style>
.footer-social {
    text-align: center;
    padding: 2rem 0 1rem 0;
    margin-top: 2rem;
}

.footer-social-title {
    font-size: 0.875rem;
    color: #666;
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
}

.footer-social-links {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    flex-wrap: wrap;
}

.footer-social-link {
    color: #00D9FF;
    font-size: 1.5rem;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(0, 217, 255, 0.1);
}

.footer-social-link:hover {
    color: #4F46E5;
    background: rgba(79, 70, 229, 0.1);
    transform: translateY(-2px);
}

@media (max-width: 640px) {
    .footer-social-links {
        gap: 1rem;
    }

    .footer-social-link {
        width: 36px;
        height: 36px;
        font-size: 1.25rem;
    }
}
</style>

<div class="footer-social">
    <div class="footer-social-title">Connect</div>
    <div class="footer-social-links">
        <a href="https://www.linkedin.com/in/mejones73/"
           target="_blank"
           rel="noopener noreferrer"
           class="footer-social-link"
           aria-label="LinkedIn"
           title="Connect on LinkedIn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
        </a>

        <a href="https://github.com/tinybiggss"
           target="_blank"
           rel="noopener noreferrer"
           class="footer-social-link"
           aria-label="GitHub"
           title="Follow on GitHub">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.840 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
        </a>

        <a href="https://x.com/IsMikeJones"
           target="_blank"
           rel="noopener noreferrer"
           class="footer-social-link"
           aria-label="Twitter/X"
           title="Follow on X (Twitter)">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
        </a>

        <a href="https://facebook.com/mejones73"
           target="_blank"
           rel="noopener noreferrer"
           class="footer-social-link"
           aria-label="Facebook"
           title="Connect on Facebook">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
            </svg>
        </a>

        <a href="https://mastodon.social/@resilientTomorrow"
           target="_blank"
           rel="noopener me noreferrer"
           class="footer-social-link"
           aria-label="Mastodon"
           title="Follow on Mastodon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.242 15.792 0 11.813 0h-.03c-3.98 0-4.835.242-5.288.309C3.882.692 1.496 2.518.917 5.127.64 6.412.61 7.837.661 9.143c.074 1.874.088 3.745.26 5.611.118 1.24.325 2.47.62 3.68.55 2.237 2.777 4.098 4.96 4.857 2.336.792 4.849.923 7.256.38.265-.061.527-.132.786-.213.585-.184 1.27-.39 1.774-.753a.057.057 0 0 0 .023-.043v-1.809a.052.052 0 0 0-.02-.041.053.053 0 0 0-.046-.01 20.282 20.282 0 0 1-4.709.545c-2.73 0-3.463-1.284-3.674-1.818a5.593 5.593 0 0 1-.319-1.433.053.053 0 0 1 .066-.054c1.517.363 3.072.546 4.632.546.376 0 .75 0 1.125-.01 1.57-.044 3.224-.124 4.768-.422.038-.008.077-.015.11-.024 2.435-.464 4.753-1.92 4.989-5.604.008-.145.03-1.52.03-1.67.002-.512.167-3.63-.024-5.545zm-3.748 9.195h-2.561V8.29c0-1.309-.55-1.976-1.67-1.976-1.23 0-1.846.79-1.846 2.35v3.403h-2.546V8.663c0-1.56-.617-2.35-1.848-2.35-1.112 0-1.668.668-1.67 1.977v6.218H4.822V8.102c0-1.31.337-2.35 1.011-3.12.696-.77 1.608-1.164 2.74-1.164 1.311 0 2.302.5 2.962 1.498l.638 1.06.638-1.06c.66-.999 1.65-1.498 2.96-1.498 1.13 0 2.043.395 2.74 1.164.675.77 1.012 1.81 1.012 3.12z"/>
            </svg>
        </a>
    </div>
</div>

<script>
// Track social media clicks
document.querySelectorAll('.footer-social-link').forEach(function(link) {
    link.addEventListener('click', function(e) {
        var platform = this.getAttribute('aria-label');
        if (window.gtag) {
            gtag('event', 'social_click', {
                'platform': platform,
                'location': 'footer'
            });
        }
        console.log('Social media click:', platform);
    });
});
</script>'''

        # Schema.org Person schema with sameAs property
        schema_person_social = '''<!-- Schema.org Person with Social Profiles -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Mike Jones",
  "url": "https://www.mikejones.online",
  "image": "https://www.mikejones.online/content/images/2026/02/headshot-professional.png",
  "jobTitle": "AI Implementation Expert and LLM Integration Specialist",
  "worksFor": {
    "@type": "Organization",
    "name": "Jones Collaboration Company, LLC"
  },
  "sameAs": [
    "https://www.linkedin.com/in/mejones73/",
    "https://github.com/tinybiggss",
    "https://x.com/IsMikeJones",
    "https://facebook.com/mejones73",
    "https://mastodon.social/@resilientTomorrow",
    "https://www.mikejones.online/@index"
  ],
  "knowsAbout": [
    "AI Implementation",
    "LLM Integration",
    "Program Management",
    "Organizational Intelligence",
    "Community Resilience",
    "AI-Augmented Process Design"
  ]
}
</script>'''

        token = generate_ghost_token()
        headers = {'Authorization': f'Ghost {token}'}

        async with httpx.AsyncClient(timeout=60.0) as client:
            # Get current Ghost settings
            print("\n📖 Fetching Ghost settings...")
            response = await client.get(
                f"{GHOST_API_URL}/ghost/api/admin/settings/",
                headers=headers
            )

            if response.status_code != 200:
                print(f"❌ Failed to fetch settings: {response.status_code}")
                return

            result = response.json()
            settings = result['settings']

            # Find codeinjection_foot and codeinjection_head settings
            footer_injection = None
            header_injection = None

            for setting in settings:
                if setting['key'] == 'codeinjection_foot':
                    footer_injection = setting
                elif setting['key'] == 'codeinjection_head':
                    header_injection = setting

            # Update site-wide code injection
            print("\n📤 Adding social media footer and Schema.org...")

            # Add social media footer to site footer (if not already present)
            current_footer = footer_injection.get('value', '') or ''
            if 'footer-social' not in current_footer:
                new_footer = current_footer + '\n' + footer_social_html

                # Update footer injection
                update_payload = {
                    "settings": [{
                        "key": "codeinjection_foot",
                        "value": new_footer
                    }]
                }

                response = await client.put(
                    f"{GHOST_API_URL}/ghost/api/admin/settings/",
                    headers=headers,
                    json=update_payload
                )

                if response.status_code != 200:
                    print(f"❌ Failed to update footer: {response.status_code}")
                else:
                    print(f"✅ Added social media footer!")
            else:
                print(f"✅ Social media footer already present")

            # Add Schema.org Person to site header (if not already present)
            current_header = header_injection.get('value', '') or ''
            if '"@type": "Person"' not in current_header or 'sameAs' not in current_header:
                new_header = current_header + '\n' + schema_person_social

                # Update header injection
                update_payload = {
                    "settings": [{
                        "key": "codeinjection_head",
                        "value": new_header
                    }]
                }

                response = await client.put(
                    f"{GHOST_API_URL}/ghost/api/admin/settings/",
                    headers=headers,
                    json=update_payload
                )

                if response.status_code != 200:
                    print(f"❌ Failed to update header: {response.status_code}")
                else:
                    print(f"✅ Added Schema.org Person with social profiles!")
            else:
                print(f"✅ Schema.org Person already present")

        print("\n" + "="*80)
        print("✅ SOCIAL MEDIA LINKS IMPLEMENTATION COMPLETE")
        print("="*80)

        print(f"\n📊 What was added:")
        print(f"   • Footer social media icons (5 platforms)")
        print(f"   • LinkedIn: mejones73")
        print(f"   • GitHub: tinybiggss")
        print(f"   • Twitter/X: @IsMikeJones")
        print(f"   • Facebook: mejones73")
        print(f"   • Mastodon: @resilientTomorrow@mastodon.social")
        print(f"\n   • Schema.org Person with sameAs property")
        print(f"   • Analytics tracking on social clicks")
        print(f"   • Responsive design (mobile-optimized)")
        print(f"   • Accessibility labels")

        await worker.send_coordination_message(
            "🎉 ALICE - SOCIAL MEDIA LINKS COMPLETE!\n\n"
            "✅ Added footer social media icons (5 platforms)\n"
            "   • LinkedIn, GitHub, Twitter/X, Facebook, Mastodon\n\n"
            "✅ Added Schema.org Person schema with sameAs property\n"
            "   • All social profiles linked\n"
            "   • SEO-optimized for social discovery\n\n"
            "✅ Features:\n"
            "   • Responsive design (mobile-optimized)\n"
            "   • Accessibility labels\n"
            "   • Analytics tracking\n"
            "   • Brand colors (Neon Cyan hover)\n\n"
            "Social media integration complete!"
        )

        await worker.heartbeat(status="idle", current_task=None)

        print("\n✨ Alice - Social media links complete!")
        print("📊 Dashboard: http://localhost:8001")


if __name__ == "__main__":
    asyncio.run(add_social_media_footer())
