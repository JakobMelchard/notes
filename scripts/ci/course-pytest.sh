#!/usr/bin/env bash
# Runs pytest in every content/courses/*/src that has tests; fails if any course fails.
set -euo pipefail
fail=0
for d in content/courses/*/src; do
  [ -n "$(find "$d" -name 'test_*.py' -print -quit)" ] || continue
  echo "::group::$d"
  uv run pytest "$d" -q -p no:cacheprovider || fail=1
  echo "::endgroup::"
done
exit "$fail"
