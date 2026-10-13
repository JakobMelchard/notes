#!/bin/sh
# Copies the published notes (JakobMelchard/notes, written from the vault on mimi) over content/.
# Usage: scripts/notes.sh [ref]
set -eu
dir=.notes
if [ -d "$dir/.git" ]; then
  git -C "$dir" fetch -q --depth 1 origin "${1:-main}" && git -C "$dir" checkout -q FETCH_HEAD
else
  git clone -q --depth 1 --branch "${1:-main}" https://github.com/JakobMelchard/notes.git "$dir"
fi
rsync -a --exclude .git "$dir"/ content/
