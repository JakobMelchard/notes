#!/bin/sh
# Copies the published notes (JakobMelchard/notes-src, written from the vault on mimi) over content/.
# Usage: scripts/notes.sh [ref]
set -eu
dir=.notes
url=https://github.com/JakobMelchard/notes-src.git
if [ -d "$dir/.git" ]; then
  # an older clone points at JakobMelchard/notes, which is now this repo
  git -C "$dir" remote set-url origin "$url"
  git -C "$dir" fetch -q --depth 1 origin "${1:-main}" && git -C "$dir" checkout -q FETCH_HEAD
else
  git clone -q --depth 1 --branch "${1:-main}" "$url" "$dir"
fi
rsync -a --exclude .git "$dir"/ content/
