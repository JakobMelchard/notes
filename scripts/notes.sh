#!/bin/sh
# Copies the published notes (JakobMelchard/notes-src, written from the private vault) over content/.
# Usage: scripts/notes.sh [ref]
set -eu
dir=.notes
url=https://github.com/JakobMelchard/notes-src.git
if [ -d "$dir/.git" ]; then
  # make sure origin is notes-src
  git -C "$dir" remote set-url origin "$url"
  git -C "$dir" fetch -q --depth 1 origin "${1:-main}" && git -C "$dir" checkout -q FETCH_HEAD
else
  git clone -q --depth 1 --branch "${1:-main}" "$url" "$dir"
fi
# only the paths notes-src owns (see .gitignore); --delete drops notes removed upstream, and the
# excluded tracked refs/ and src/ are left alone
rsync -a --delete \
  --include /index.md --include /courses/ --include '/courses/*/' --include '/courses/*/index.md' --include '/courses/*/verified-cards.md' \
  --include '/courses/*/notes/***' --include '/courses/*/docs/***' --exclude '*' \
  "$dir"/ content/
