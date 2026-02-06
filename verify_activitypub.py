#!/usr/bin/env python3
"""
ActivityPub Configuration Verification Script

Tests WebFinger endpoint and basic ActivityPub connectivity
for mikejones.online Ghost Pro site.

Usage:
    python verify_activitypub.py
"""

import json
import sys
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError


def test_webfinger(domain: str, username: str) -> dict:
    """
    Test WebFinger endpoint for ActivityPub discovery.

    Args:
        domain: Domain name (e.g., mikejones.online)
        username: Username/handle (e.g., mike)

    Returns:
        dict with test results
    """
    resource = f"acct:{username}@{domain}"
    url = f"https://{domain}/.well-known/webfinger?resource={resource}"

    print(f"\n{'='*60}")
    print("Testing WebFinger Endpoint")
    print(f"{'='*60}")
    print(f"URL: {url}")
    print(f"Looking for: @{username}@{domain}")

    try:
        req = Request(url)
        req.add_header('Accept', 'application/jrd+json')

        with urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode())

            print(f"\n✅ WebFinger endpoint accessible")
            print(f"Status: {response.status}")
            print(f"\nResponse:")
            print(json.dumps(data, indent=2))

            # Verify response structure
            if 'subject' in data and data['subject'] == resource:
                print(f"\n✅ Subject matches: {data['subject']}")
            else:
                print(f"\n⚠️  Subject mismatch or missing")

            if 'links' in data:
                activitypub_links = [
                    link for link in data['links']
                    if link.get('type') == 'application/activity+json'
                ]
                if activitypub_links:
                    print(f"✅ ActivityPub link found:")
                    for link in activitypub_links:
                        print(f"   {link.get('href')}")
                else:
                    print(f"⚠️  No ActivityPub links found")

            return {
                'success': True,
                'endpoint': url,
                'data': data
            }

    except HTTPError as e:
        print(f"\n❌ HTTP Error: {e.code} - {e.reason}")
        if e.code == 404:
            print("\nPossible causes:")
            print("1. ActivityPub not enabled in Ghost admin")
            print("2. Username is different than expected")
            print("3. Ghost Pro uses different WebFinger path")
        return {
            'success': False,
            'error': f"HTTP {e.code}: {e.reason}"
        }

    except URLError as e:
        print(f"\n❌ URL Error: {e.reason}")
        return {
            'success': False,
            'error': str(e.reason)
        }

    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        return {
            'success': False,
            'error': str(e)
        }


def test_activitypub_profile(profile_url: str) -> dict:
    """
    Test ActivityPub profile endpoint.

    Args:
        profile_url: URL to ActivityPub profile

    Returns:
        dict with test results
    """
    print(f"\n{'='*60}")
    print("Testing ActivityPub Profile")
    print(f"{'='*60}")
    print(f"URL: {profile_url}")

    try:
        req = Request(profile_url)
        req.add_header('Accept', 'application/activity+json')

        with urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode())

            print(f"\n✅ ActivityPub profile accessible")
            print(f"Status: {response.status}")
            print(f"\nProfile data:")
            print(f"  Type: {data.get('type')}")
            print(f"  Name: {data.get('name')}")
            print(f"  PreferredUsername: {data.get('preferredUsername')}")
            print(f"  Summary: {data.get('summary', 'N/A')[:100]}")

            return {
                'success': True,
                'profile_url': profile_url,
                'data': data
            }

    except HTTPError as e:
        print(f"\n⚠️  Cannot access profile: HTTP {e.code}")
        print("This is expected if the profile URL structure is unknown")
        return {
            'success': False,
            'error': f"HTTP {e.code}"
        }

    except Exception as e:
        print(f"\n⚠️  Error accessing profile: {e}")
        return {
            'success': False,
            'error': str(e)
        }


def main():
    """Run all verification tests."""
    domain = "mikejones.online"
    username = "mike"

    print("\n" + "="*60)
    print("ActivityPub Configuration Verification")
    print(f"Site: {domain}")
    print(f"Expected Handle: @{username}@{domain}")
    print("="*60)

    # Test 1: WebFinger
    webfinger_result = test_webfinger(domain, username)

    # Test 2: ActivityPub Profile (if WebFinger provides link)
    if webfinger_result['success'] and 'data' in webfinger_result:
        links = webfinger_result['data'].get('links', [])
        activitypub_links = [
            link['href'] for link in links
            if link.get('type') == 'application/activity+json' and 'href' in link
        ]

        if activitypub_links:
            profile_url = activitypub_links[0]
            test_activitypub_profile(profile_url)

    # Summary
    print(f"\n{'='*60}")
    print("Summary")
    print(f"{'='*60}")

    if webfinger_result['success']:
        print(f"✅ ActivityPub appears to be configured correctly")
        print(f"\nYour Fediverse handle: @{username}@{domain}")
        print(f"\nNext steps:")
        print(f"1. Search for @{username}@{domain} from a Mastodon account")
        print(f"2. Follow the Ghost site")
        print(f"3. Publish a test post to verify federation")
    else:
        print(f"❌ ActivityPub does not appear to be configured")
        print(f"\nNext steps:")
        print(f"1. Log into Ghost admin: https://{domain}/ghost")
        print(f"2. Navigate to Settings → Membership → Fediverse")
        print(f"3. Enable ActivityPub toggle")
        print(f"4. Configure profile settings")
        print(f"5. Save and wait 1-2 minutes")
        print(f"6. Run this script again")

    print(f"\n{'='*60}\n")

    # Exit code
    sys.exit(0 if webfinger_result['success'] else 1)


if __name__ == "__main__":
    main()
