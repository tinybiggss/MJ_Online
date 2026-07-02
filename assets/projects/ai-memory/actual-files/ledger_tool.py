#!/usr/bin/env python3
"""Append validated entries to the cross-project memory ledger.

Writes to the LIVE ledger at /Volumes/MacMini_Extended/llm-memory/memory.jsonl
(the store that session-start-reader.py reads and session-capture-hook.py writes).
The old /Volumes/MacMini_Extended/rt-assistant/... path is retired — do not use it.

Entries must match the canonical live schema (same shape the Stop hook produces):
required id, date (YYYY-MM-DD), type, summary; optional list fields validated if
present. The SessionStart reader windows on `date`, so an entry without a proper
`date` will never surface — that is why the old `timestamp`-based schema is gone.
"""
import sys, json, argparse, pathlib, shutil

LEDGER = pathlib.Path("/Volumes/MacMini_Extended/llm-memory/memory.jsonl")
REQUIRED = {"id", "date", "type", "summary"}
LIST_FIELDS = ("projects", "tags", "decisions", "open_threads",
               "topics", "insights", "linked_memories")


def validate(obj):
    if not isinstance(obj, dict):
        raise ValueError("entry is not a JSON object")
    missing = REQUIRED - set(obj.keys())
    if missing:
        raise ValueError(
            f"missing required fields: {sorted(missing)} "
            "(canonical schema: id, date [YYYY-MM-DD], type, summary)")
    if not isinstance(obj["date"], str):
        raise ValueError("date must be a 'YYYY-MM-DD' string (the reader windows on it)")
    for field in LIST_FIELDS:
        if field in obj and not isinstance(obj[field], list):
            raise ValueError(f"{field} must be a list")


def iter_entries(path):
    p = pathlib.Path(path)
    if p.suffix.lower() == ".jsonl":
        for line in p.read_text(encoding="utf-8").splitlines():
            if line.strip():
                yield json.loads(line)
    else:  # assume JSON array
        data = json.loads(p.read_text(encoding="utf-8"))
        if isinstance(data, list):
            for obj in data: yield obj
        else:
            raise ValueError("JSON file must be an array")


def main():
    ap = argparse.ArgumentParser(description="Append validated entries to the live memory ledger")
    ap.add_argument("path", help="JSONL (preferred) or JSON array file")
    ap.add_argument("--ledger", default=str(LEDGER),
                    help=f"Override ledger path (default: {LEDGER})")
    ap.add_argument("--backup", action="store_true", help="Create .bak of ledger before append")
    ap.add_argument("--dedupe", action="store_true", help="Run dedupe script after append (if present)")
    args = ap.parse_args()

    src = pathlib.Path(args.path)
    if not src.exists(): sys.exit(f"not found: {src}")

    ledger = pathlib.Path(args.ledger)
    if not ledger.parent.exists():
        sys.exit(f"ledger volume not reachable (unmounted?): {ledger.parent}")

    to_append = []
    for obj in iter_entries(src):
        validate(obj)
        to_append.append(json.dumps(obj, ensure_ascii=False))

    if args.backup and ledger.exists():
        shutil.copy2(ledger, ledger.with_suffix(".jsonl.bak"))

    with ledger.open("a", encoding="utf-8") as f:
        for line in to_append:
            f.write(line + "\n")

    print(f"Appended {len(to_append)} entries to {ledger}")

    if args.dedupe:
        dedupe = ledger.with_name("dedupe_memory.py")
        if dedupe.exists():
            import subprocess
            subprocess.check_call([
                "python3", str(dedupe),
                "--in", str(ledger),
                "--in-place"
            ])
            print("Ran dedupe_memory.py --in-place")
        else:
            print("dedupe_memory.py not found; skipped")


if __name__ == "__main__":
    main()
