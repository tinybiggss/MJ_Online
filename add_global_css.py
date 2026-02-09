#!/usr/bin/env python3
"""
Add Design System Global CSS to Ghost Pro via Admin API
Author: Debbie (Web Design Agent)
Date: 2026-02-06
"""

import os
import jwt
import datetime
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

GHOST_ADMIN_API_KEY = os.getenv('GHOST_ADMIN_API_KEY')
GHOST_API_URL = os.getenv('GHOST_API_URL')

if not GHOST_ADMIN_API_KEY or not GHOST_API_URL:
    print("❌ Missing Ghost API credentials in .env file")
    exit(1)

# Parse the Admin API key (format: id:secret)
id, secret = GHOST_ADMIN_API_KEY.split(':')

# Create JWT token for authentication
iat = int(datetime.datetime.now().timestamp())
header = {'alg': 'HS256', 'typ': 'JWT', 'kid': id}
payload = {
    'iat': iat,
    'exp': iat + 5 * 60,  # Token expires in 5 minutes
    'aud': '/admin/'
}
token = jwt.encode(payload, bytes.fromhex(secret), algorithm='HS256', headers=header)

headers = {'Authorization': f'Ghost {token}'}

# Design System CSS from /design/DESIGN-SYSTEM.md
DESIGN_SYSTEM_CSS = """
/* ========================================
   DESIGN SYSTEM - GLOBAL STYLES
   Created: 2026-02-06
   Author: Debbie (Web Design Agent)
   Version: 1.0
   ========================================*/

/* === GOOGLE FONTS === */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=JetBrains+Mono:wght@400;700&display=swap');

/* === CSS VARIABLES === */
:root {
  /* Fonts */
  --font-primary: 'Inter', system-ui, -apple-system, sans-serif;
  --font-code: 'JetBrains Mono', 'Courier New', monospace;

  /* Colors - Dark Mode Foundation */
  --color-bg-dark: #0A0B0D;
  --color-surface-dark: #1A1B1E;
  --color-border-dark: #2A2B2E;

  /* Colors - Text */
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #B4B5B9;
  --color-text-tertiary: #6B6C70;

  /* Colors - Brand */
  --color-indigo: #4F46E5;
  --color-neon-cyan: #00D9FF;
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;

  /* Spacing - 8px base unit */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  --space-4xl: 96px;
  --space-5xl: 128px;

  /* Typography Scale */
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-2xl: 24px;
  --font-size-3xl: 32px;
  --font-size-4xl: 48px;
  --font-size-5xl: 64px;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;

  /* Transitions */
  --transition-fast: 0.15s ease;
  --transition-base: 0.2s ease;
  --transition-slow: 0.3s ease;
}

/* === TYPOGRAPHY === */
body {
  font-family: var(--font-primary);
  font-size: var(--font-size-base);
  line-height: 1.75;
  color: var(--color-text-secondary);
  background-color: var(--color-bg-dark);
  font-weight: 400;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-primary);
  color: var(--color-text-primary);
  font-weight: 700;
  line-height: 1.2;
  margin-top: 0;
}

h1 {
  font-size: var(--font-size-5xl);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin-bottom: var(--space-lg);
}

h2 {
  font-size: var(--font-size-4xl);
  margin-top: var(--space-4xl);
  margin-bottom: var(--space-xl);
}

h3 {
  font-size: var(--font-size-3xl);
  font-weight: 600;
  margin-top: var(--space-2xl);
  margin-bottom: var(--space-md);
}

h4 {
  font-size: var(--font-size-2xl);
  font-weight: 600;
  margin-top: var(--space-xl);
  margin-bottom: var(--space-sm);
}

h5 {
  font-size: var(--font-size-xl);
  font-weight: 600;
}

h6 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

p {
  margin-bottom: var(--space-lg);
  line-height: 1.75;
}

/* Strong/Bold text */
strong, b {
  font-weight: 700;
  color: var(--color-text-primary);
}

/* Emphasis/Italic */
em, i {
  font-style: italic;
}

/* Code and Pre */
code, pre {
  font-family: var(--font-code);
  font-size: var(--font-size-sm);
}

code {
  background: rgba(0, 217, 255, 0.1);
  border: 1px solid rgba(0, 217, 255, 0.2);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  color: var(--color-neon-cyan);
}

pre {
  background: var(--color-surface-dark);
  border: 1px solid var(--color-border-dark);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  overflow-x: auto;
  margin-bottom: var(--space-lg);
}

pre code {
  background: none;
  border: none;
  padding: 0;
  color: var(--color-text-secondary);
}

/* === LINKS === */
a {
  color: var(--color-indigo);
  text-decoration: none;
  transition: color var(--transition-base);
}

a:hover {
  color: var(--color-neon-cyan);
  text-decoration: underline;
}

a:focus {
  outline: 2px solid var(--color-indigo);
  outline-offset: 2px;
}

/* === BUTTONS === */
.button-primary,
.gh-button-primary,
button[type="submit"],
.kg-button-card a {
  display: inline-block;
  background: var(--color-indigo);
  color: var(--color-text-primary);
  font-family: var(--font-primary);
  font-size: var(--font-size-sm);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 14px 32px;
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  transition: all var(--transition-base);
  text-decoration: none;
}

.button-primary:hover,
.gh-button-primary:hover,
button[type="submit"]:hover,
.kg-button-card a:hover {
  background: var(--color-neon-cyan);
  color: var(--color-bg-dark);
  transform: scale(1.02);
  text-decoration: none;
}

.button-secondary {
  background: transparent;
  color: var(--color-text-primary);
  border: 2px solid var(--color-border-dark);
}

.button-secondary:hover {
  border-color: var(--color-neon-cyan);
  color: var(--color-neon-cyan);
  background: rgba(0, 217, 255, 0.1);
}

/* === CARDS === */
.card,
.gh-card,
.kg-card {
  background: var(--color-surface-dark);
  border: 1px solid var(--color-border-dark);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  transition: all var(--transition-slow);
}

.card:hover,
.gh-card:hover {
  border-color: var(--color-neon-cyan);
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 217, 255, 0.15);
}

/* === BADGES === */
.badge {
  display: inline-block;
  font-size: var(--font-size-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 4px 12px;
  border-radius: var(--radius-sm);
}

.badge-category {
  background: rgba(79, 70, 229, 0.2);
  color: var(--color-indigo);
  border: 1px solid var(--color-indigo);
}

.badge-tech {
  background: var(--color-surface-dark);
  color: var(--color-text-secondary);
  font-family: var(--font-code);
  border: 1px solid var(--color-border-dark);
  padding: 6px 10px;
  border-radius: var(--radius-md);
  margin: var(--space-xs);
}

.badge-metric {
  color: var(--color-neon-cyan);
  font-family: var(--font-code);
  font-size: var(--font-size-sm);
  font-weight: 700;
  border: 2px solid var(--color-neon-cyan);
  padding: 8px 16px;
  border-radius: var(--radius-md);
}

/* === IMAGES === */
img {
  max-width: 100%;
  height: auto;
  border-radius: var(--radius-md);
}

figure {
  margin: var(--space-xl) 0;
}

figcaption {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
  text-align: center;
  margin-top: var(--space-sm);
  font-style: italic;
}

/* === LISTS === */
ul, ol {
  margin-bottom: var(--space-lg);
  padding-left: var(--space-xl);
}

li {
  margin-bottom: var(--space-sm);
  line-height: 1.75;
}

/* === BLOCKQUOTES === */
blockquote {
  border-left: 4px solid var(--color-indigo);
  padding-left: var(--space-lg);
  margin: var(--space-xl) 0;
  font-style: italic;
  color: var(--color-text-secondary);
}

blockquote p:last-child {
  margin-bottom: 0;
}

/* === HORIZONTAL RULES === */
hr {
  border: none;
  border-top: 1px solid var(--color-border-dark);
  margin: var(--space-4xl) 0;
}

/* === TABLES === */
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: var(--space-lg);
}

th {
  background: var(--color-surface-dark);
  color: var(--color-text-primary);
  font-weight: 600;
  text-align: left;
  padding: var(--space-md);
  border: 1px solid var(--color-border-dark);
}

td {
  padding: var(--space-md);
  border: 1px solid var(--color-border-dark);
}

tr:nth-child(even) {
  background: rgba(255, 255, 255, 0.02);
}

/* === FORMS === */
input[type="text"],
input[type="email"],
input[type="url"],
input[type="password"],
input[type="search"],
textarea,
select {
  width: 100%;
  font-family: var(--font-primary);
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  background: var(--color-surface-dark);
  border: 1px solid var(--color-border-dark);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  transition: border-color var(--transition-base);
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: var(--color-indigo);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

label {
  display: block;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--space-sm);
}

/* === UTILITY CLASSES === */
.section-spacing {
  margin-top: var(--space-4xl);
}

.content-spacing {
  margin-bottom: var(--space-xl);
}

.text-center {
  text-align: center;
}

.text-primary {
  color: var(--color-text-primary);
}

.text-secondary {
  color: var(--color-text-secondary);
}

.text-indigo {
  color: var(--color-indigo);
}

.text-cyan {
  color: var(--color-neon-cyan);
}

/* === RESPONSIVE === */
@media (max-width: 768px) {
  :root {
    --font-size-5xl: 48px;
    --font-size-4xl: 36px;
    --font-size-3xl: 24px;
    --space-4xl: 64px;
  }

  h1 {
    font-size: var(--font-size-5xl);
  }

  h2 {
    font-size: var(--font-size-4xl);
    margin-top: var(--space-3xl);
  }

  h3 {
    font-size: var(--font-size-3xl);
    margin-top: var(--space-xl);
  }

  .section-spacing {
    margin-top: var(--space-3xl);
  }
}

@media (max-width: 480px) {
  body {
    font-size: var(--font-size-base);
  }

  .button-primary,
  .button-secondary {
    width: 100%;
    text-align: center;
  }
}

/* === ACCESSIBILITY === */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Focus visible for keyboard navigation */
*:focus-visible {
  outline: 2px solid var(--color-indigo);
  outline-offset: 2px;
}
"""

print("🎨 Adding Design System Global CSS to Ghost Pro...")
print(f"📍 Ghost URL: {GHOST_API_URL}")

# Get current settings
try:
    response = requests.get(f"{GHOST_API_URL}/ghost/api/admin/settings/", headers=headers)
    response.raise_for_status()
    settings = response.json()

    # Find current code injection settings
    code_injection_head = None
    code_injection_foot = None

    for setting in settings['settings']:
        if setting['key'] == 'codeinjection_head':
            code_injection_head = setting['value'] or ''
        elif setting['key'] == 'codeinjection_foot':
            code_injection_foot = setting['value']

    print(f"\n📋 Current header code injection: {len(code_injection_head)} characters")

    # Check if design system is already present
    if 'DESIGN SYSTEM - GLOBAL STYLES' in code_injection_head:
        print("\n⚠️  Design System CSS already present in code injection")
        print("❓ Would you like to:")
        print("   1. Skip (keep existing)")
        print("   2. Replace (update to latest)")
        response = input("\nEnter choice (1 or 2): ")

        if response == '1':
            print("\n✅ Keeping existing Design System CSS")
            exit(0)
        elif response == '2':
            # Remove old design system CSS
            start_marker = '/* ========================================'
            end_marker = '*:focus-visible'

            start_idx = code_injection_head.find(start_marker)
            if start_idx != -1:
                # Find the end of the design system CSS
                end_idx = code_injection_head.find(end_marker, start_idx)
                if end_idx != -1:
                    # Find the end of that rule (next closing brace)
                    brace_idx = code_injection_head.find('}', end_idx)
                    if brace_idx != -1:
                        # Remove the design system section
                        code_injection_head = (code_injection_head[:start_idx] +
                                              code_injection_head[brace_idx+1:])
                        print("🗑️  Removed old Design System CSS")

    # Prepare new code injection (prepend design system CSS)
    new_code_injection = f"<style>{DESIGN_SYSTEM_CSS}</style>\n\n{code_injection_head}"

    print(f"\n📝 New header code injection: {len(new_code_injection)} characters")
    print(f"   Design System CSS: {len(DESIGN_SYSTEM_CSS)} characters")

    # Update settings
    update_data = {
        "settings": [
            {
                "key": "codeinjection_head",
                "value": new_code_injection
            }
        ]
    }

    response = requests.put(
        f"{GHOST_API_URL}/ghost/api/admin/settings/",
        headers={**headers, 'Content-Type': 'application/json'},
        json=update_data
    )
    response.raise_for_status()

    print("\n✅ Design System Global CSS added successfully!")
    print("\n🎨 Applied styling includes:")
    print("   • Inter font family (primary typography)")
    print("   • JetBrains Mono (code/technical elements)")
    print("   • Typography scale (H1-H6)")
    print("   • Color system (Indigo + Neon Cyan accents)")
    print("   • Button styles (primary, secondary, hover states)")
    print("   • Card components with hover effects")
    print("   • Badge styles (category, tech, metric)")
    print("   • Form styling")
    print("   • Responsive breakpoints")
    print("   • Accessibility features")
    print("\n🌐 Visit your site to see the changes!")
    print(f"   {GHOST_API_URL.replace('/ghost/api/admin', '')}")

except requests.exceptions.RequestException as e:
    print(f"\n❌ Error: {e}")
    if hasattr(e, 'response') and e.response is not None:
        print(f"   Response: {e.response.text}")
    exit(1)
