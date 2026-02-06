# Offline AI — Setup & RAG Checklist

> Canonical checklist for the Mac mini local stack (Ollama + OpenWebUI + mcpo + Filesystem MCP). Keep this file updated with dated change logs.

---

# 2025-09-26 — Update: Filesystem RW, Tooling, and Autostart Plan

## What’s new (implemented today)
- **Filesystem RW via MCP:** `mcpo` is running on the host at `http://localhost:11620`, spawning the **Filesystem MCP** rooted at `/Volumes/MacMini_Extended/rt-assistant`.
- **OpenWebUI Tool Wiring:** External Tool added in OpenWebUI as `http://host.docker.internal:11620` and enabled for the saved preset **QWEN2.5:14b-instruct-RW** (Tool Invocation = Auto).
- **Model Preset Saved:** Clarified UX gotcha — *Workspace → Models* lists only saved presets. We saved a preset so tools can be attached consistently.
- **RAG Content Pathing:** `DOCS_DIR` points to `/rt/knowledge/articles` (inside container), matching host bind to `/Volumes/MacMini_Extended/rt-assistant`.
- **Pathing Rule for MCP:** Tool requests must use **relative paths** (e.g., `_scratch/hello.txt`, `memory/memory.jsonl`). Created `_scratch/` and `knowledge/memory/` (with `memory.jsonl`) and verified read/write.

## Decisions & conventions
- **Transport:** Use **mcpo (OpenAPI bridge over localhost)** to talk to the Filesystem MCP (which communicates over STDIO). No TCP flags for the MCP server; directories are provided as positional args.
- **Container Paths:** Standardize on `/rt` inside the container for the entire RT tree.
- **Volume Binds (recommended):**
  - `/Volumes/MacMini_Extended/openwebui_data → /app/backend/data`
  - `/Volumes/MacMini_Extended/rt-assistant → /rt:rw`
  - `/Volumes/MacMini_Extended/rt-assistant/knowledge/memory → /app/backend/data/memory:rw`
- **Embeddings:** Use Ollama embeddings model **`nomic-embed-text`** for Documents/Knowledge.
- **Security:** Bind mcpo to `127.0.0.1`; reach it from the container via `host.docker.internal`.
- **Project Chat Limitation:** Connectors (e.g., Notion) aren’t exposed inside *Project* chats; use a regular “Notion Bridge” chat when needed.

## Outstanding tasks (next actions)
- [ ] **Autostart & self-heal (launchd)** — create in `~/rt-offlineai/bin/`:
  - [ ] `start_mcpo.sh` (runs `uvx mcpo ... npx @modelcontextprotocol/server-filesystem /Volumes/MacMini_Extended/rt-assistant` with `--cors "*"` and `--verbose`), logs to `~/rt-offlineai/logs/mcpo.log`.
  - [ ] `docs_watch.sh` (POST to `http://localhost:3000/api/documents/scan` every 60s), logs to `watcher.log`.
  - [ ] `healthcheck.sh` (checks OpenWebUI `:3000`, mcpo `:11620`, Ollama `:11434`; restarts services & notifies on failure).
  - [ ] `~/Library/LaunchAgents/` plists: `local.rt.mcpo.plist`, `local.rt.docswatch.plist`, `local.rt.healthcheck.plist` (RunAtLoad + KeepAlive).
- [ ] **Docker compose** for OpenWebUI at `~/rt-offlineai/docker/docker-compose.yml` with the three binds above and `DOCS_DIR=/rt/knowledge/articles`.
- [ ] **Set Docker Desktop to auto-start** at login; verify container restarts persistently (`restart: unless-stopped`).
- [ ] **Preset hardening:** Ensure preset uses Tool Invocation = Auto, sensible temp/top_p, and max context matching model; document defaults here.
- [ ] **Logs & rotation:** Decide retention for `~/rt-offlineai/logs/*.log`; add simple rotation or `maxsize` policy.
- [ ] **Status helper:** Add `~/rt-offlineai/bin/rtai` (`up|down|status`) to bounce or inspect the stack quickly.
- [ ] **Knowledge routine:** Confirm watcher endpoint works on your OpenWebUI build; if not, switch to Knowledge rebuild endpoint.
- [ ] **README.md** in `~/rt-offlineai/` summarizing commands, ports (3000/11434/11620), and recovery steps.

## Quick reference (commands)
- Start mcpo + MCP (interactive, for debugging):
  ```bash
  uvx mcpo --host 127.0.0.1 --port 11620 --cors "*" --verbose -- \
    npx -y @modelcontextprotocol/server-filesystem \
    /Volumes/MacMini_Extended/rt-assistant
  ```
- Test write/read via tool (relative paths): `_scratch/hello.txt`, `memory/memory.jsonl`.
- Verify binds inside container:
  ```bash
  docker exec -it openwebui sh -lc 'ls -la /rt/knowledge/memory && ls -la /app/backend/data/memory'
  ```

---

# Prior baseline (keep for context)
- OpenWebUI runs in Docker with persistent volume at `/app/backend/data` (host: `/Volumes/MacMini_Extended/openwebui_data`).
- Ollama runs on host (Mac) and is reachable from container via `http://host.docker.internal:11434`.
- Knowledge (RAG) uses `/rt/knowledge/articles`; embeddings model via Ollama (`nomic-embed-text`).

> Add new dated updates above this line as we iterate.

