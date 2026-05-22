#!/usr/bin/env python3
"""Rebuild manifest.json for the FCIR asset library.

Scans asset-library/uploads/ and writes a manifest the gallery page reads.
Run from the repo root: `python3 asset-library/update-manifest.py`
"""
import json
import os
import datetime
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
UPLOADS = SCRIPT_DIR / "uploads"
MANIFEST = SCRIPT_DIR / "manifest.json"

IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".avif"}


def main() -> None:
    if not UPLOADS.exists():
        UPLOADS.mkdir(parents=True)

    files = []
    for entry in sorted(UPLOADS.iterdir()):
        if entry.name.startswith(".") or not entry.is_file():
            continue
        stat = entry.stat()
        files.append({
            "name": entry.name,
            "size": stat.st_size,
            "modified": datetime.datetime.fromtimestamp(stat.st_mtime).strftime("%Y-%m-%d"),
            "ext": entry.suffix.lower().lstrip("."),
            "is_image": entry.suffix.lower() in IMAGE_EXTS,
        })

    manifest = {
        "generated": datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
        "count": len(files),
        "files": files,
    }
    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n")
    print(f"Wrote manifest with {len(files)} file(s) -> {MANIFEST}")


if __name__ == "__main__":
    main()
