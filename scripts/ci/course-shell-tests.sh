#!/usr/bin/env bash
# Runs every content/courses/*/src/sh/test_*.sh; fails if any of them fails.
set -euo pipefail
fail=0
for t in content/courses/*/src/sh/test_*.sh; do
  [ -f "$t" ] || continue
  bash "$t" || { echo "::error::$t failed"; fail=1; }
done
exit "$fail"
