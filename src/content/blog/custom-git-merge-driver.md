---
title: "Custom git merge driver"
description: ''
pubDate: '2026-03-24'
heroImage: '../../assets/fallback-blossom-blue.jpg'
categories:
  - "linux"
  - "python"
  - "source-control"
---

**MERGE CONFLICTS IN** git are a normal part of collaboration. But, sometimes you end up in situations of solving the same trivial conflict again and again. That was my situation at $WORK on a busy GitHub Actions pipeline project.

## The problem

GitHub recommends [pinning actions to full commit SHAs](https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions#using-third-party-actions) for security. We also apply this practice to our own workflows and action for reproducebility. In practice that means that workflow files are full of lines like this:

```
uses: Internal-actions/utilities/.github/actions/read-project-file@1028f1aedf5426726c149b3bdfca0b68bf001567 # v1.0.12
```

When a colleague bumps a versions, git simply cannot pick one by itself, thus every merge produces conflicts. Every. Single. Time. The resolution is always the same: **always pick whichever side has the higher version**.

After manually resolving the same type of conflict for the umpteenth time, I went looking for a better way.

## Git merge drivers

It turns out git has a built-in mechanism for exactly this kind of thing: [custom merge drivers](https://git-scm.com/docs/gitattributes#_defining_a_custom_merge_driver). A merge driver is a program that git calls to resolve conflicts on specific files, instead of using its default three-way merge.

The concept is simple. Two pieces of configuration work together:

1. **`.gitattributes`** maps file patterns to a named driver

3. **`.gitconfig`** defines calling of that named driver

For example, telling git to use a driver called `latest-uses-version` for workflow files, first add a file matching rule in _.gitattributes_

```
.github/workflows/*.yml    merge=latest-uses-version
```

Then define the driver by name and how it should be called in _.gitconfig_

```
git config merge.latest-uses-version.name "Pick latest uses version"
git config merge.latest-uses-version.driver "python3 merge-latest-uses-version.py %O %A %B"
```

When git encounters a conflict in a matching file, it will call the driver with three temporary files: `%O` (common ancestor), `%A` (ours), and `%B` (theirs). The driver writes its result into `%A` and exits `0` for success or `1` if conflicts remain.

## The driver

I wrote a Python script to handle the `uses` version conflicts. In our setup, every `uses` line is sha-pinned _and_ always has a semver comment appended (ensured by another automation script), like `@abc123... # v1.0.12`. That comment is what makes it possible for the driver to compare the two sides of a conflict and pick the newer version.

```
#!/usr/bin/env python3

import re
import subprocess
import sys

ANCESTOR = sys.argv[1]
OURS = sys.argv[2]
THEIRS = sys.argv[3]

# Attempt standard merge first
result = subprocess.run(
    ["git", "merge-file", "-p", OURS, ANCESTOR, THEIRS],
    capture_output=True,
    text=True,
)

if result.returncode == 0:
    # Clean merge — no conflicts
    with open(OURS, "w") as f:
        f.write(result.stdout)
    sys.exit(0)

# Conflicts exist — write the conflicted output, then resolve what we can
content = result.stdout

# Pattern: uses: some/path@<exactly 40 hex chars> # vX.Y.Z
SHA_VERSION_RE = re.compile(
    r"uses:\s+\S+@[0-9a-fA-F]{40}\s+#\s*v(\d+\.\d+\.\d+)"
)

CONFLICT_RE = re.compile(
    r"<<<<<<< [^\n]*\n(.*?)\n=======\n(.*?)\n>>>>>>> [^\n]*",
    re.DOTALL,
)

def pick_latest(match):
    head_block = match.group(1)
    incoming_block = match.group(2)

    head_ver = SHA_VERSION_RE.search(head_block)
    incoming_ver = SHA_VERSION_RE.search(incoming_block)

    # Only resolve if BOTH sides are sha-pinned uses: lines with version comments
    if not head_ver or not incoming_ver:
        return match.group(0)  # Leave conflict markers for manual resolution

    h = tuple(int(x) for x in head_ver.group(1).split("."))
    i = tuple(int(x) for x in incoming_ver.group(1).split("."))

    return head_block if h >= i else incoming_block

resolved = CONFLICT_RE.sub(pick_latest, content)

with open(OURS, "w") as f:
    f.write(resolved)

sys.exit(1 if "<<<<<<< " in resolved else 0)
```

It first runs `git merge-file` to get the standard three-way merge. If conflicts remain, it scans each hunk for the sha-pinned version pattern. Only when _both_ sides match does it pick the higher semver. Anything else is left with conflict markers for manual resolution.

## Setting it up

Git merge drivers need two things configured: the driver definition and the file pattern mapping.

The **driver definition** goes in git config - either globally (`~/.gitconfig`) or per-repo (`.git/config`). As our pipeline is spread across multiple repositories I did not want to maintain the same setup in all repositories. By doing the global configuration the setup can be shared between all. Choose a per-repo when the driver is specific to one project.

The **file pattern mapping** goes in `.gitattributes` - either a global file (pointed to by `core.attributesFile`) or a per-repo `.gitattributes`. The global and per-repo attributes are additive; git merges them together, so they won't conflict.

To automate this setup for coworkers, I made a script to do the git setup.

```
./setup-merge-driver.sh
```

_setup-merge-driver.sh_:

```
#!/usr/bin/bash

# Install the "latest-uses-version" custom merge driver globally.

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
driver_path="${script_dir}/tools/⚙/merge-latest-uses-version.py"

if [[ ! -f "${driver_path}" ]]; then
    echo "ERROR: merge driver not found at ${driver_path}" >&2
    exit 1
fi

# Register the merge driver in global git config (idempotent).
git config --global merge.latest-uses-version.name \
    "Auto-resolve sha-pinned action version conflicts by picking the latest"
git config --global merge.latest-uses-version.driver \
    "python3 '${driver_path}' %O %A %B"

echo "✔ Merge driver 'latest-uses-version' registered in global git config."

# Ensure a global attributes file is configured.
attr_file="$(git config --global core.attributesFile 2>/dev/null || true)"

if [[ -z "${attr_file}" ]]; then
    attr_file="${HOME}/.gitattributes"
    git config --global core.attributesFile "${attr_file}"
    echo "✔ Global core.attributesFile set to ${attr_file}"
fi

# Expand ~ in case the user configured it that way.
attr_file="${attr_file/#\~/${HOME}}"

# Add patterns (idempotent).
patterns=(
    ".github/workflows/*.yml merge=latest-uses-version"
    "common/*.yml merge=latest-uses-version"
)

touch "${attr_file}"

for pattern in "${patterns[@]}"; do
    if ! grep -qxF "${pattern}" "${attr_file}"; then
        echo "${pattern}" >> "${attr_file}"
        echo "✔ Added to ${attr_file}: ${pattern}"
    else
        echo "· Already present in ${attr_file}: ${pattern}"
    fi
done

echo ""
echo "Done. The merge driver is ready for all repositories."
```

### What it does

- Registers the `latest-uses-version` driver in global `~/.gitconfig` (this is idempotent and safe to re-run)

- Ensures `core.attributesFile` is set. It respects an existing one and creates `~/.gitattributes` only if none is already configured

- Adds file patterns (`.github/workflows/*.yml` and `common/*.yml`) - skips if already present

- Uses absolute path to the driver script so it works from any repo

## The result

With the driver installed, what used to be a manual chore now just works. Given a conflict like this during merge:

```
<<<<<<< HEAD
      uses: Internal-actions/utilities/.github/actions/read-project-file@1028f1aedf5426726c149b3bdfca0b68bf001567 # v1.0.12
=======
      uses: Internal-actions/utilities/.github/actions/read-project-file@386f499a1f68c20a15df7ad877b77fa139d7e932 # v1.0.15
>>>>>>> feature-branch
```

The driver picks `v1.0.15` and the merge completes cleanly:

```
      uses: Internal-actions/utilities/.github/actions/read-project-file@386f499a1f68c20a15df7ad877b77fa139d7e932 # v1.0.15
```

No manual intervention needed. Git now just does the right thing 🧙  

## Multiple drivers in git config

As a note, then the `uses` version driver is just one driver. Git supports as many custom merge drivers as as desired

```
# Driver 1: sha-pinned action versions
git config merge.latest-uses-version.name "Pick latest sha-pinned action version"
git config merge.latest-uses-version.driver "python3 scripts/merge-latest-uses-version.py %O %A %B"

# Driver 2: hypothetical package-lock resolver
git config merge.package-lock.name "Regenerate package-lock on conflict"
git config merge.package-lock.driver "scripts/merge-package-lock.sh %O %A %B"

# Driver 3: always keep ours for generated files
git config merge.keep-ours.name "Always keep our version"
git config merge.keep-ours.driver "true"
```

### `.gitattributes` routes files to drivers

```
.github/workflows/*.yml     merge=latest-uses-version
package-lock.json           merge=package-lock
generated/**                merge=keep-ours
```

### Rules

- Each file matches **at most one** `merge=` attribute (last match wins, like `.gitignore`).

- If a file matches no `merge=` rule, git uses its built-in merge.

- If you need **two strategies on the same file** (e.g., resolve `uses` versions _and_ something else in the same YAML), that must be handled within a single driver script. Unfortunately drivers can't be chained.

- You can use any `.gitattributes` pattern: exact paths, globs, directory prefixes, etc.

## Conclusion

I am super stoked about the result. The algorithm for this particular case was pretty straight forward, but it works just perfectly - and I got to learn another cool git feature.
