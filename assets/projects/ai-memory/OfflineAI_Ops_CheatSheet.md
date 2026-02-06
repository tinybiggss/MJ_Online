# Offline AI Ops Cheat Sheet (Mac Mini)

_Last updated: 2025-09-15 23:20:40_

This is the quick-reference for operating your local **Offline AI + RAG** setup on macOS (absolute paths; zsh-safe). It covers nightly memory compaction, session context rendering, the Open WebUI system prompt, and continuous sync of `RT_Articles` to your Knowledge base.

---

## Changelog (recent)
- **Switched watcher to repo template** that reads token from `~/.offlineai/token`.
- **Added token file**: `~/.offlineai/token` (keeps secrets out of scripts/repo).
- **Created `.ragignore`** at `/Volumes/MacMini_Extended/rt-assistant/knowledge/.ragignore` (drafts/private patterns). _Note: see “Ignore patterns” below to enable enforcement in the watcher._
- **GitHub repo** created under org **Jones-Co**: `offlineai-macmini`. Tag suggested: `v0.2.2`.

---

## Repo + Layout

**Local repo (canonical):**
```
/Volumes/MacMini_Extended/rt-assistant/offlineai-macmini
```

**Key folders in repo**
- `scripts/`
  - `compact_memory.py`
  - `render_memory.py`
  - `rt_watch_poll.template.sh`  ← **source** watcher (reads `~/.offlineai/token`)
- `launchagents/`
  - `com.offlineai.memorycompact.v2.plist`
- `docs/`
  - `OFFLINE_AI_OPS_CHEATSHEET.md` (this file)

**Deployed copies (live paths)**
- Watcher used at runtime:  
  `~/Library/Application Support/offlineai/rt_watch_poll.sh` (copied from repo template)
- Compact + render scripts (live):  
  `~/Library/Application Support/offlineai/compact_memory.py`  
  `~/Library/Application Support/offlineai/render_memory.py`

**Knowledge base (Open WebUI)**
- Base URL: `http://localhost:3000`
- Collection: **RT_Articles** — **id:** `2d5ac00f-faa0-4a20-8297-36e657f78c2d`
- Upload endpoint: `POST /api/v1/files/`
- Add-to-collection endpoint: `POST /api/v1/knowledge/<id>/file/add`

**Secrets**
- Open WebUI API token (no quotes/newlines):  
  `~/.offlineai/token`

---

## Nightly Memory Compaction (LaunchAgent)

**What it does:** Reads `memory.jsonl`, keeps last N per topic + recent items, writes `memory_compact.json` nightly at 02:05 and at load.

**Common actions**
```bash
# clear logs
: > /tmp/memory_compact_v2.log; : > /tmp/memory_compact_v2.err

# reload and run (modern launchctl flow)
launchctl bootout gui/$(id -u)/com.offlineai.memorycompact.v2 2>/dev/null || true
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.offlineai.memorycompact.v2.plist
launchctl enable   gui/$(id -u)/com.offlineai.memorycompact.v2
launchctl kickstart -k gui/$(id -u)/com.offlineai.memorycompact.v2

# inspect logs
tail -n +1 /tmp/memory_compact_v2.log /tmp/memory_compact_v2.err
```

**If you see “Operation not permitted”**  
Make sure the Python script path is in your **Home** (`~/Library/...`), not the external volume. The plist should invoke `/usr/bin/python3` with your Home script path.

---

## Render & Paste Compact Memory (per session)

**What:** Converts `memory_compact.json` → human-readable block for Open WebUI’s **System Prompt**.

```bash
/usr/bin/python3 "$HOME/Library/Application Support/offlineai/render_memory.py"
pbcopy < "$HOME/Library/Application Support/offlineai/memory/session_context.txt"
```

Paste into **Open WebUI → Settings → General → System Prompt** (or per-chat).

Suggested header:
```
You are my local Offline-AI collaborator. Load and respect the compact project memory below…
<<<PROJECT_MEMORY>>>
[paste here]
<<<END_PROJECT_MEMORY>>>
```

---

## Continuous Sync to `RT_Articles` (Watcher)

**What:** Watches your articles folder and, on new/changed files, uploads to `/api/v1/files/` then adds to collection `2d5ac00f-faa0-4a20-8297-36e657f78c2d`.

**Watched folder**
```
/Volumes/MacMini_Extended/rt-assistant/knowledge/articles
```

**Token source (now preferred)**  
The watcher reads `OWUI_TOKEN` from `~/.offlineai/token`. Create/update it with:
```bash
/bin/mkdir -p "$HOME/.offlineai"
/usr/bin/printf "%s\n" "<paste-openwebui-token>" > "$HOME/.offlineai/token"
/bin/chmod 600 "$HOME/.offlineai/token"
```

**Start (foreground)**
```bash
/bin/bash "$HOME/Library/Application Support/offlineai/rt_watch_poll.sh"
```

**Stop**: press `Ctrl+C` in that terminal.

**Logs**
```bash
/usr/bin/tail -f /tmp/rt_watch_poll.log
```

**Background mode**
```bash
/usr/bin/nohup /bin/bash "$HOME/Library/Application Support/offlineai/rt_watch_poll.sh" >/tmp/rt_watch_poll.log 2>&1 &
echo $! > /tmp/rt_watch_poll.pid
# stop later:
/bin/kill "$(cat /tmp/rt_watch_poll.pid)" 2>/dev/null || /usr/bin/pkill -f rt_watch_poll.sh
```

**Manual one-off upload (uses token file if present)**
```bash
FILE="$HOME/Desktop/owui_upload_test.md"; /usr/bin/printf "# test\n" > "$FILE"
BASE="http://localhost:3000"; KB_ID="2d5ac00f-faa0-4a20-8297-36e657f78c2d"
OWUI_TOKEN="$(/bin/cat "$HOME/.offlineai/token" 2>/dev/null || echo "<paste-openwebui-token>")"

TMP=$(/usr/bin/mktemp)
/usr/bin/curl -sS -X POST -H "Authorization: Bearer $OWUI_TOKEN" -H "Accept: application/json" -b "token=$OWUI_TOKEN"   -F "file=@${FILE};type=text/markdown" -o "$TMP" "$BASE/api/v1/files/"
FILE_ID=$(/usr/bin/python3 - "$TMP" <<'PY'
import sys,json,pathlib
p=pathlib.Path(sys.argv[1]).read_text()
d=json.loads(p)
def find(x):
  if isinstance(x,dict):
    for k in("file_id","id","uuid"):
      v=x.get(k)
      if isinstance(v,str): print(v); return
    for v in x.values(): 
      find(v); return
  if isinstance(x,list):
    for it in x: 
      find(it); return
find(d)
PY
)
/usr/bin/curl -sS -X POST -H "Authorization: Bearer $OWUI_TOKEN" -H "Content-Type: application/json" -b "token=$OWUI_TOKEN"   -d "{\"file_id\":\"$FILE_ID\"}" "$BASE/api/v1/knowledge/$KB_ID/file/add"
```

---

## Ignore patterns (`.ragignore`)

**File:**  
`/Volumes/MacMini_Extended/rt-assistant/knowledge/.ragignore`

**Example contents:**
```
*.private.md
draft_*
*.tmp
.DS_Store
```

> _Note:_ If your current watcher doesn’t yet consult `.ragignore`, it will still upload everything. When ready, update the watcher to skip files that match lines in `.ragignore`. (Ping the assistant for the tiny patch if you want this behavior turned on.)

---

## GitHub (Jones-Co/offlineai-macmini)

**Publish from this Mac (once logged in via `gh auth login`):**
```bash
cd "/Volumes/MacMini_Extended/rt-assistant/offlineai-macmini"
/usr/bin/git add .
/usr/bin/git commit -m "update: watcher uses token file; add ragignore, docs"
/usr/bin/git push
```

**Open the repo page:**
```bash
/opt/homebrew/bin/gh repo view Jones-Co/offlineai-macmini --web || /usr/local/bin/gh repo view Jones-Co/offlineai-macmini --web
```

**Tag a working state:**
```bash
cd "/Volumes/MacMini_Extended/rt-assistant/offlineai-macmini"
/usr/bin/git tag v0.2.2 -m "Stable: nightly memory + continuous KB sync"
/usr/bin/git push origin v0.2.2
```

---

## Troubleshooting quick hits

- **Uploads succeed but nothing prints in terminal:** tail the log — `/usr/bin/tail -f /tmp/rt_watch_poll.log`
- **HTTP 400 on add:** usually means “already in collection” — safe to ignore.
- **Command not found:** prefer absolute paths as used above (e.g., `/usr/bin/curl`, `/bin/sleep`).
- **Change watch folder:** edit `SRC=` line inside the watcher script, then restart it.
- **LaunchAgent confusion:** ensure only `com.offlineai.memorycompact.v2` is active (bootout any old labels).

---

## Reference IDs
- `RT_Articles` collection id: **2d5ac00f-faa0-4a20-8297-36e657f78c2d**
- Open WebUI base: **http://localhost:3000**

_Store this file where you’ll look first: canonical at `.../rt-assistant/OFFLINE_AI_OPS_CHEATSHEET.md`, symlink in `.../openwebui_data/`, optional link at `~/Library/Application Support/offlineai/`._
