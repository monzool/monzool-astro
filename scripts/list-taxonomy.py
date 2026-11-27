#!/usr/bin/env python3
"""List tags defined in the frontmatter of markdown posts.

Usage:
    scripts/list-taxonomy.py [DIR ...]

DIR defaults to src/content/blog (relative to the repo root).
"""

import sys
from collections import Counter
from pathlib import Path

import yaml

DEFAULT_DIR = Path(__file__).resolve().parent.parent / "src" / "content" / "blog"


def read_frontmatter(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---"):
        return {}
    parts = text.split("\n---", 2)
    if len(parts) < 2:
        return {}
    data = yaml.safe_load(parts[0].lstrip("-")) or {}
    return data if isinstance(data, dict) else {}


def as_list(value) -> list[str]:
    if value is None:
        return []
    if isinstance(value, str):
        return [value]
    return [str(v) for v in value]


def main() -> int:
    dirs = [Path(d) for d in sys.argv[1:]] or [DEFAULT_DIR]
    files = sorted(f for d in dirs for f in d.rglob("*.md*"))

    untagged: list[str] = []
    tag_count: Counter[str] = Counter()

    print("== Posts with tags ==\n")
    for f in files:
        try:
            fm = read_frontmatter(f)
        except yaml.YAMLError as e:
            print(f"{f.name}\n  !! frontmatter parse error: {e}\n", file=sys.stderr)
            continue
        tags = as_list(fm.get("tags"))
        if not tags:
            untagged.append(f.name)
            continue
        tag_count.update(tags)
        print(f.name)
        print(f"  tags: {', '.join(tags)}")
        print()

    print(f"== Posts with no tags ({len(untagged)}) ==\n")
    for name in untagged:
        print(f"  {name}")
    print()

    print_counts("Tags", tag_count)
    return 0


def print_counts(title: str, counts: Counter) -> None:
    print(f"== {title} ({len(counts)} distinct) ==\n")
    if not counts:
        print("  -\n")
        return
    width = max(len(k) for k in counts)
    # Most used first, alphabetical within equal counts
    for name, n in sorted(counts.items(), key=lambda kv: (-kv[1], kv[0])):
        print(f"  {name:<{width}}  {n:>3}")
    print()


if __name__ == "__main__":
    sys.exit(main())
