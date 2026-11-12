#!/bin/sh
# Import the generated public content branch; keep reference code and sources local.
# Usage: scripts/notes.sh [ref]
set -eu
dir=.notes
url=${NOTES_URL:-https://codeberg.org/lilfeelz/notes.git}
if [ -d "$dir/.git" ]; then
  # The source is always the public export, never the private vault.
  git -C "$dir" remote set-url origin "$url"
  git -C "$dir" fetch -q --depth 1 origin "${1:-content}" && git -C "$dir" checkout -q FETCH_HEAD
else
  git clone -q --depth 1 --branch "${1:-content}" "$url" "$dir"
fi
# Only exported prose paths (see .gitignore); --delete drops removed notes, while the
# excluded tracked refs/ and src/ are left alone
rsync -a --delete \
  --include /index.md --include /courses/ --include '/courses/*/' --include '/courses/*/index.md' --include '/courses/*/verified-cards.md' \
  --include '/courses/*/notes/***' --include '/courses/*/docs/***' --exclude '*' \
  "$dir"/ content/
