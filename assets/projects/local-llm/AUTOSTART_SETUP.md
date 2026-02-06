# RT-OfflineAI Auto-Start Setup

Complete auto-start configuration for Ollama, OpenWebUI, and mcpo MCP bridge.

## Quick Installation

From the repo root:

```bash
chmod +x scripts/install_autostart.sh
./scripts/install_autostart.sh
```

This will:
- Create `~/rt-offlineai/` directory structure
- Install management scripts to `~/rt-offlineai/bin/`
- Install LaunchAgent plist files to `~/Library/LaunchAgents/`
- Set up auto-start on boot

**IMPORTANT**: Enable Docker Desktop auto-start:
1. Open Docker Desktop
2. Settings → General  
3. Check ✅ "Start Docker Desktop when you log in"

## Manual Start (After Installation)

Start all services immediately:

```bash
launchctl load ~/Library/LaunchAgents/local.rt.ollama.plist
launchctl load ~/Library/LaunchAgents/local.rt.openwebui.plist
launchctl load ~/Library/LaunchAgents/local.rt.mcpo.plist
```

Or use the management tool:

```bash
~/rt-offlineai/bin/rtai start
```

## Management Tool

The `rtai` command provides easy service management:

```bash
# Check status of all services
~/rt-offlineai/bin/rtai status

# Start all services
~/rt-offlineai/bin/rtai start

# Stop all services
~/rt-offlineai/bin/rtai stop

# Restart all services
~/rt-offlineai/bin/rtai restart

# View recent logs
~/rt-offlineai/bin/rtai logs
```

**Optional**: Add to your PATH for easier access:

```bash
echo 'export PATH="$HOME/rt-offlineai/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
# Now you can just type: rtai status
```

## Services

### 1. Ollama (Port 11434)
- **Purpose**: Local LLM backend
- **Auto-start**: Yes (via LaunchAgent)
- **Restart on crash**: Yes
- **Logs**: `~/rt-offlineai/logs/ollama.log`

### 2. OpenWebUI (Port 3000)
- **Purpose**: Web interface for AI chat
- **URL**: http://localhost:3000
- **Auto-start**: Yes (via LaunchAgent)
- **Restart on crash**: Yes
- **Logs**: `~/rt-offlineai/logs/openwebui.log`
- **Container**: Auto-created if doesn't exist
- **Volumes**:
  - `/Volumes/MacMini_Extended/openwebui_data` → `/app/backend/data`
  - `/Volumes/MacMini_Extended/rt-assistant` → `/rt` (read-write)
  - `/Volumes/MacMini_Extended/rt-assistant/knowledge/memory` → `/app/backend/data/memory` (read-write)

### 3. mcpo MCP Bridge (Port 11620)
- **Purpose**: Filesystem access for AI
- **Root**: `/Volumes/MacMini_Extended/rt-assistant`
- **Auto-start**: Yes (via LaunchAgent)
- **Restart on crash**: Yes
- **Logs**: `~/rt-offlineai/logs/mcpo.log`
- **Corrected Command**: `uvx mcpo --host 127.0.0.1 --port 11620 -- npx -y @modelcontextprotocol/server-filesystem /Volumes/MacMini_Extended/rt-assistant`
  - Note: `--cors` and `--verbose` options removed (not supported in current mcpo version)

## OpenWebUI Container Auto-Creation

If the OpenWebUI container doesn't exist, the startup script automatically creates it:

```bash
docker run -d \
    --name openwebui \
    -p 3000:8080 \
    -v /Volumes/MacMini_Extended/openwebui_data:/app/backend/data \
    -v /Volumes/MacMini_Extended/rt-assistant:/rt:rw \
    -v /Volumes/MacMini_Extended/rt-assistant/knowledge/memory:/app/backend/data/memory:rw \
    --add-host=host.docker.internal:host-gateway \
    --restart unless-stopped \
    ghcr.io/open-webui/open-webui:main
```

This ensures:
- MCP filesystem access via `host.docker.internal:11620`
- Full rt-assistant tree mounted at `/rt`
- Memory ledger synced to container
- Auto-restart on Docker daemon restart

## What Happens on Boot

1. **You log in**
2. **Docker Desktop starts** (if auto-start enabled in Docker settings)
3. **Ollama starts** (LaunchAgent)
4. **OpenWebUI** waits for Docker, then starts/creates container (LaunchAgent)
5. **mcpo** starts MCP bridge (LaunchAgent)

All services ready in ~30-60 seconds!

## Testing

After starting services:

```bash
# Check status
~/rt-offlineai/bin/rtai status

# Test Ollama
curl http://localhost:11434/api/version

# Test OpenWebUI
open http://localhost:3000

# Test mcpo
curl http://localhost:11620
```

## Stopping Services

Temporary stop:

```bash
~/rt-offlineai/bin/rtai stop
```

Or:

```bash
launchctl unload ~/Library/LaunchAgents/local.rt.ollama.plist
launchctl unload ~/Library/LaunchAgents/local.rt.openwebui.plist
launchctl unload ~/Library/LaunchAgents/local.rt.mcpo.plist
```

## Disabling Auto-Start

Permanently disable:

```bash
launchctl unload ~/Library/LaunchAgents/local.rt.ollama.plist
launchctl unload ~/Library/LaunchAgents/local.rt.openwebui.plist
launchctl unload ~/Library/LaunchAgents/local.rt.mcpo.plist
rm ~/Library/LaunchAgents/local.rt.*.plist
```

## Re-enabling Auto-Start

```bash
launchctl load ~/Library/LaunchAgents/local.rt.ollama.plist
launchctl load ~/Library/LaunchAgents/local.rt.openwebui.plist
launchctl load ~/Library/LaunchAgents/local.rt.mcpo.plist
```

## Troubleshooting

### Check service status:
```bash
~/rt-offlineai/bin/rtai status
```

### View logs:
```bash
~/rt-offlineai/bin/rtai logs

# Or individual logs:
tail -f ~/rt-offlineai/logs/ollama.log
tail -f ~/rt-offlineai/logs/openwebui.log
tail -f ~/rt-offlineai/logs/mcpo.log
```

### Check LaunchAgent status:
```bash
launchctl list | grep local.rt
```

### Restart a specific service:
```bash
launchctl unload ~/Library/LaunchAgents/local.rt.mcpo.plist
launchctl load ~/Library/LaunchAgents/local.rt.mcpo.plist
```

### mcpo not working?
- Verify `uvx` is in PATH: `which uvx`
- If not found, add to PATH in `~/.zshrc`:
  ```bash
  export PATH="$HOME/.local/bin:$PATH"
  ```
- Reload LaunchAgent after PATH change

### Docker Desktop not auto-starting?
1. Open Docker Desktop → Settings → General
2. Enable "Start Docker Desktop when you log in"
3. Verify Docker has sufficient resources

## Directory Structure

```
~/rt-offlineai/
├── bin/
│   ├── rtai                # Management tool
│   ├── start_all.sh        # Start all services
│   ├── start_mcpo.sh       # Start mcpo only
│   └── start_openwebui.sh  # Start OpenWebUI only
└── logs/
    ├── startup.log         # General startup logs
    ├── ollama.log          # Ollama logs
    ├── openwebui.log       # OpenWebUI logs
    └── mcpo.log            # mcpo logs

~/Library/LaunchAgents/
├── local.rt.ollama.plist    # Ollama auto-start
├── local.rt.openwebui.plist # OpenWebUI auto-start
└── local.rt.mcpo.plist      # mcpo auto-start
```

## First-Time Setup Checklist

- [ ] Docker Desktop installed
- [ ] Docker Desktop auto-start enabled
- [ ] Ollama installed
- [ ] Volume paths exist:
  - [ ] `/Volumes/MacMini_Extended/openwebui_data`
  - [ ] `/Volumes/MacMini_Extended/rt-assistant`
- [ ] Installation script run
- [ ] LaunchAgents loaded
- [ ] All services running (`rtai status`)
- [ ] MCP External Tool configured in OpenWebUI: `http://host.docker.internal:11620`

## Next Steps

1. Run installation script
2. Enable Docker Desktop auto-start
3. Start services (or reboot)
4. Check status: `rtai status`
5. Open OpenWebUI: http://localhost:3000
6. Configure "QWEN2.5:14b-instruct-RW" preset
7. Test MCP filesystem access

---

**Maintained by**: Mike + Claude  
**Created**: 2026-01-22  
**Last Updated**: 2026-01-22
