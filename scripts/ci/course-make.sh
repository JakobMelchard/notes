#!/usr/bin/env bash
# Runs `make test` for every course C/C++ Makefile that has a test target, 600 s each.
set -euo pipefail
fail=0
for m in content/courses/*/src/c/Makefile content/courses/*/src/cpp/Makefile; do
  [ -f "$m" ] || continue
  grep -q '^test:' "$m" || continue
  echo "::group::$m"
  timeout 600 make -C "$(dirname "$m")" test || { echo "::error::$m failed or timed out"; fail=1; }
  echo "::endgroup::"
done
exit "$fail"
