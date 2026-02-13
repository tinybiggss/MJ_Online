# Ghost API Setup Guide

**Status:** ✅ Configured (2026-02-06)

---

## Environment Variables

All Ghost API credentials are stored in `.env` file in the project root.

### Location
- **File:** `/.env` (project root)
- **Template:** `/.env.example` (committed to repo)
- **Security:** `.env` is in `.gitignore` (never committed)

### Variables

```bash
GHOST_CONTENT_API_KEY=<key>      # For reading published content
GHOST_ADMIN_API_KEY=<id:secret>  # For creating/updating content
GHOST_API_URL=https://mikejones-online.ghost.io
```

---

## Ghost APIs

### Content API (Read-Only)
**Use when:** Reading published posts, pages, authors, tags
**Key:** `GHOST_CONTENT_API_KEY`
**Docs:** https://ghost.org/docs/content-api/
**Rate limit:** None specified (reasonable use)

**Example (Python):**
```python
import os
from dotenv import load_dotenv
import requests

load_dotenv()
content_key = os.getenv('GHOST_CONTENT_API_KEY')
api_url = os.getenv('GHOST_API_URL')

response = requests.get(
    f"{api_url}/ghost/api/content/posts/",
    params={'key': content_key}
)
posts = response.json()
```

### Admin API (Read-Write)
**Use when:** Creating, updating, or deleting content programmatically
**Key:** `GHOST_ADMIN_API_KEY` (format: `id:secret`)
**Docs:** https://ghost.org/docs/admin-api/
**Authentication:** JWT tokens (requires signing requests)

**Example (Python with ghost-client):**
```python
import os
from dotenv import load_dotenv
from ghost_client import Ghost

load_dotenv()
admin_key = os.getenv('GHOST_ADMIN_API_KEY')
api_url = os.getenv('GHOST_API_URL')

# Parse admin key
key_id, key_secret = admin_key.split(':')

ghost = Ghost(
    admin_api_url=f"{api_url}/ghost/api/admin",
    admin_api_key=key_id,
    admin_api_secret=key_secret
)

# Create a post
ghost.posts.create(
    title="New Post",
    html="<p>Content here</p>",
    status="draft"
)
```

---

## Getting New API Keys

If keys are compromised or you need to regenerate:

1. Go to Ghost Admin: https://mikejones-online.ghost.io/ghost/
2. Settings → Integrations
3. Click "Add custom integration"
4. Name it (e.g., "MJ_Online Automation")
5. Copy the Content API Key and Admin API Key
6. Update `.env` file with new keys

---

## Security Checklist

- ✅ `.env` exists in project root
- ✅ `.env` is in `.gitignore`
- ✅ `.env.example` committed (without secrets)
- ✅ Only project collaborators have access to `.env`
- ✅ Keys regenerated if ever committed to repo accidentally

---

## Agent Usage

Agents working with Ghost content should:

1. **Load environment variables:**
   ```python
   from dotenv import load_dotenv
   load_dotenv()
   ```

2. **Use appropriate API:**
   - Content API for reading published content
   - Admin API for creating/updating content

3. **Handle errors gracefully:**
   - Check response status codes
   - Log API errors for debugging
   - Don't expose API keys in error messages

4. **Document API usage:**
   - Update agent memory with API calls made
   - Note any rate limiting encountered
   - Track content created/updated

---

## Useful Ghost API Endpoints

### Content API (Read)
- `GET /ghost/api/content/posts/` - List posts
- `GET /ghost/api/content/posts/slug/:slug/` - Get post by slug
- `GET /ghost/api/content/pages/` - List pages
- `GET /ghost/api/content/tags/` - List tags

### Admin API (Write)
- `POST /ghost/api/admin/posts/` - Create post
- `PUT /ghost/api/admin/posts/:id/` - Update post
- `DELETE /ghost/api/admin/posts/:id/` - Delete post
- `POST /ghost/api/admin/pages/` - Create page
- `PUT /ghost/api/admin/pages/:id/` - Update page

---

## Python Libraries

**Recommended:**
- `python-dotenv` - Load `.env` files
- `ghost-client` - Official Python client for Ghost Admin API
- `requests` - HTTP library (for Content API)

**Install:**
```bash
pip install python-dotenv ghost-client requests
```

---

**Last Updated:** 2026-02-06
**Maintained By:** Project Manager
**Status:** Production - API keys configured and secured

