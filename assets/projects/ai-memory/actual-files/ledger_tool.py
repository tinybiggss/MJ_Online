#!/usr/bin/env python3
import sys, json, argparse, pathlib, shutil

LEDGER = pathlib.Path("/Volumes/MacMini_Extended/rt-assistant/knowledge/memory/memory.jsonl")
REQUIRED = {"id","timestamp","projects","author","type","summary","details","tags","related_files","links","source_convo","source"}

def validate(obj):
    if not isinstance(obj, dict):
        raise ValueError("entry is not a JSON object")
    missing = REQUIRED - set(obj.keys())
    if missing:
        raise ValueError(f"missing fields: {sorted(missing)}")
    if not isinstance(obj["projects"], list): raise ValueError("projects must be a list")
    if not isinstance(obj["tags"], list): raise ValueError("tags must be a list")
    if not isinstance(obj["related_files"], list): raise ValueError("related_files must be a list")
    if not isinstance(obj["links"], list): raise ValueError("links must be a list")

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
    ap = argparse.ArgumentParser(description="Append validated entries to memory.jsonl")
    ap.add_argument("path", help="JSONL (preferred) or JSON array file")
    ap.add_argument("--backup", action="store_true", help="Create .bak of ledger before append")
    ap.add_argument("--dedupe", action="store_true", help="Run dedupe script after append (if present)")
    args = ap.parse_args()

    src = pathlib.Path(args.path)
    if not src.exists(): sys.exit(f"not found: {src}")

    if args.backup:
        shutil.copy2(LEDGER, LEDGER.with_suffix(".jsonl.bak"))

    to_append = []
    for obj in iter_entries(src):
        validate(obj)
        to_append.append(json.dumps(obj, ensure_ascii=False))

    with LEDGER.open("a", encoding="utf-8") as f:
        for line in to_append:
            f.write(line + "\n")

    print(f"Appended {len(to_append)} entries to {LEDGER}")

    if args.dedupe:
        dedupe = LEDGER.with_name("dedupe_memory.py")
        if dedupe.exists():
            import subprocess
            subprocess.check_call([
                "python3", str(dedupe),
                "--in", str(LEDGER),
                "--in-place"
            ])
            print("Ran dedupe_memory.py --in-place")
        else:
            print("dedupe_memory.py not found; skipped")

if __name__ == "__main__":
    main()
