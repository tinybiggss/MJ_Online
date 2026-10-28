#!/bin/bash
# rag-eval-nightly.sh — the refresh-loop shell (T-2026-10-20-8BF / kanban t_874fa8ef).
#
# Run by launchd nightly at 03:30 (label LOCAL.mike.rag-eval). The plist was created
# DISABLED and launchctl-loaded disabled — ARMED BUT DISABLED PENDING MIKE's read of the
# design (T-2026-10-20-XEP §6 owns the go-live decision). `launchctl load -w` on the plist
# is the enabling step and is a deliberate Mike action, never an agent one.
#
# What one nightly run does: re-runs the two-layer corpus assembly (both converters),
# diffs staging vs live knowledge.jsonl; on an EMPTY diff it writes a one-line log and
# exits (N6H gate — no notify, no live files touched, no eval); on a NON-EMPTY diff it
# runs the eval and writes the scorecard. It NEVER applies the corpus to the live files
# (the corpus deploy step stays Mike's manual step — publication-layer rule).
#
# Engine swap note: until kanban t_ba6fdfc1 merges, the engine + staging corpus live in
# its worktree; RAG_ENGINE_ROOT below points there. After the merge, repoint (repo root)
# or export RAG_ENGINE_ROOT in launchd's environment.

set -u

RAG_ENGINE_ROOT="${RAG_ENGINE_ROOT:-/Users/michaeljones/.hermes/cache/scratch/wt-rag-engine-t_ba6fdfc1/mj-chatbot-backend}"
export RAG_ENGINE_ROOT

HARNESS_DIR="/Users/michaeljones/Dev/MJ_Online/mj-chatbot-backend/tests/rag-eval"
LOG_DIR="$HOME/Library/Logs"
TODAY="$(date +%F)"

mkdir -p "$LOG_DIR" 2>/dev/null

echo "[$(date -u +%FT%TZ)] rag-eval nightly: starting (engine root $RAG_ENGINE_ROOT)" >> "$LOG_DIR/rag-eval.log"

node "$HARNESS_DIR/run_eval.mjs" \
  --nightly \
  --out "$HARNESS_DIR/scorecard-eval-$TODAY.json" \
  >> "$LOG_DIR/rag-eval.log" 2>&1

RC=$?
if [ $RC -eq 0 ]; then
  echo "[$(date -u +%FT%TZ)] rag-eval nightly: done (exit 0)" >> "$LOG_DIR/rag-eval.log"
else
  echo "[$(date -u +%FT%TZ)] rag-eval nightly: FAILED (exit $RC) — see stderr log" >> "$LOG_DIR/rag-eval.log"
fi
exit $RC