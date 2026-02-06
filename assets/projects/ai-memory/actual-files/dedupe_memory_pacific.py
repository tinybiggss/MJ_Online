#!/usr/bin/env python3
import argparse, json, hashlib, pathlib, sys, datetime, shutil
from zoneinfo import ZoneInfo

def to_pacific_iso(ts):
    """Convert any timestamp to Pacific Time ISO format"""
    if not ts:
        return datetime.datetime.now(ZoneInfo("America/Los_Angeles")).isoformat()
    
    try:
        # Parse various formats
        if ts.endswith("Z"):
            dt = datetime.datetime.fromisoformat(ts.replace("Z", "+00:00"))
        else:
            dt = datetime.datetime.fromisoformat(ts)
        
        # Convert to Pacific Time
        if dt.tzinfo is None:
            # Assume UTC if no timezone
            dt = dt.replace(tzinfo=ZoneInfo("UTC"))
        
        pacific_dt = dt.astimezone(ZoneInfo("America/Los_Angeles"))
        return pacific_dt.isoformat()
        
    except Exception:
        return datetime.datetime.now(ZoneInfo("America/Los_Angeles")).isoformat()

def stable_id(entry):
    base = "|".join([
        entry.get("timestamp",""),
        entry.get("type",""),
        entry.get("summary",""),
        ",".join(sorted(entry.get("tags",[])))
    ])
    return "mem-" + hashlib.sha1(base.encode("utf-8")).hexdigest()[:12]

def normalize(raw):
    e = dict(raw) if isinstance(raw, dict) else {}
    
    # Aliases
    if "timestamp" not in e and "ts" in e: 
        e["timestamp"] = e.pop("ts")
    e["timestamp"] = to_pacific_iso(e.get("timestamp"))
    
    # Projects/author defaults
    if "projects" not in e or not isinstance(e["projects"], list) or not e["projects"]:
        e["projects"] = ["OfflineAI"]
    e["author"] = e.get("author") or "Mike"
    
    # Topic -> tag migration
    tags = e.get("tags", [])
    if not isinstance(tags, list): 
        tags = [str(tags)] if tags else []
    if "topic" in e and e["topic"]:
        tags.append(str(e["topic"]))
        e.pop("topic", None)  # Remove topic field after migration
    e["tags"] = sorted(list({t for t in tags if t}))
    
    # Arrays
    for k in ("related_files", "links"):
        v = e.get(k, [])
        if not isinstance(v, list): 
            v = [v] if v else []
        e[k] = v
    
    # Required basics with consistent defaults
    e["type"] = e.get("type", "note")
    e["summary"] = e.get("summary", "").strip()
    e["details"] = e.get("details", "").strip()
    e["source"] = e.get("source", "claude")
    e["source_convo"] = e.get("source_convo", "")
    
    # Generate ID
    e["id"] = e.get("id") or stable_id(e)
    
    return e

def merge(a, b):
    # choose earliest timestamp
    a_ts = a.get("timestamp"); b_ts = b.get("timestamp")
    keep_earliest = a if a_ts <= b_ts else b
    other = b if keep_earliest is a else a
    out = dict(keep_earliest)
    
    # Union fields
    out["projects"] = sorted(list({*a.get("projects",[]), *b.get("projects",[])}))
    out["tags"] = sorted(list({*a.get("tags",[]), *b.get("tags",[])}))
    out["links"] = sorted(list({*a.get("links",[]), *b.get("links",[])}))
    out["related_files"] = sorted(list({*a.get("related_files",[]), *b.get("related_files",[])}))
    
    # Prefer existing non-empty values
    out["author"] = a.get("author") or b.get("author") or "Mike"
    out["source_convo"] = a.get("source_convo") or b.get("source_convo") or ""
    out["source"] = a.get("source") or b.get("source") or "claude"
    
    # Type/summary prefer non-empty from either
    out["type"] = a.get("type") or b.get("type") or "note"
    out["summary"] = a.get("summary") or b.get("summary") or ""
    
    # Details: keep the longer text
    out["details"] = max([a.get("details",""), b.get("details","")], key=len)
    
    # Keep stable ID
    out["id"] = a.get("id") if a.get("id","").startswith("mem-") else (b.get("id") if b.get("id","").startswith("mem-") else stable_id(out))
    
    return out

def read_jsonl(path, rejects):
    entries = []
    with open(path, "r", encoding="utf-8") as f:
        for i, line in enumerate(f, 1):
            line = line.strip()
            if not line: continue
            try:
                obj = json.loads(line)
                entries.append(obj)
            except Exception as err:
                rejects.write(json.dumps({"path": str(path), "line": i, "error": str(err), "raw": line}) + "\n")
    return entries

def write_jsonl(path, entries):
    with open(path, "w", encoding="utf-8") as f:
        for e in entries:
            f.write(json.dumps(e, ensure_ascii=False) + "\n")

def main():
    ap = argparse.ArgumentParser(description="Normalize + dedupe memory.jsonl with Pacific Time")
    ap.add_argument("--in", dest="infile", required=True, help="Primary JSONL")
    ap.add_argument("--merge", dest="mergefile", help="Optional second JSONL to merge")
    ap.add_argument("--out", dest="outfile", help="Output JSONL (omit with --in-place)")
    ap.add_argument("--in-place", action="store_true", help="Rewrite input in place (creates .bak)")
    args = ap.parse_args()

    in_path = pathlib.Path(args.infile)
    out_path = pathlib.Path(args.outfile) if args.outfile else None
    rej_path = in_path.with_suffix(".rejects.jsonl")

    with open(rej_path, "w", encoding="utf-8") as rejects:
        raw = read_jsonl(in_path, rejects)
        if args.mergefile:
            raw += read_jsonl(pathlib.Path(args.mergefile), rejects)
        
        # normalize
        norm = [normalize(x) for x in raw]
        
        # index & merge duplicates
        by_id = {}
        for e in norm:
            k = e.get("id") or stable_id(e)
            if k in by_id:
                by_id[k] = merge(by_id[k], e)
            else:
                by_id[k] = e
        
        # sort by timestamp asc
        cleaned = sorted(by_id.values(), key=lambda x: x.get("timestamp",""))
        
        # output
        if args.in_place:
            backup = in_path.with_suffix(".jsonl.bak")
            shutil.copy2(in_path, backup)
            write_jsonl(in_path, cleaned)
            print(f"[ok] wrote in-place: {in_path} (backup: {backup})")
        else:
            if not out_path:
                print("ERROR: provide --out or use --in-place", file=sys.stderr)
                sys.exit(2)
            write_jsonl(out_path, cleaned)
            print(f"[ok] wrote: {out_path}")
        
        print(f"[stats] input_lines={len(raw)}  unique={len(cleaned)}  rejects={sum(1 for _ in open(rej_path, 'r', encoding='utf-8'))}")
        print(f"[info] rejects file: {rej_path}")

if __name__ == "__main__":
    main()
