#!/usr/bin/env bash

set -uo pipefail

mkdir -p checks

SUMMARY="checks/H01-summary.txt"
: > "$SUMMARY"

run() {
  local name="$1"
  shift

  local output="checks/H01-${name}.txt"

  echo "Running: $name"

  "$@" > "$output" 2>&1
  local status=$?

  if [ "$status" -eq 0 ]; then
    printf "PASS  %-24s %s\n" "$name" "$output" | tee -a "$SUMMARY"
  else
    printf "FAIL  %-24s %s (exit %s)\n" \
      "$name" "$output" "$status" | tee -a "$SUMMARY"
  fi
}

run dependency-audit node checks/run-h01-audit.cjs
run typescript npx tsc --noEmit
run eslint npm run lint
run jest-coverage npm test -- --coverage --runInBand
run build npm run build

echo "Running: stale-references"

{
  echo "=== Old App-Init asset resolver references ==="

  rg -n \
    --glob '*.{ts,tsx}' \
    'app/life-cycle/app-init/resolvers/assets/(svg|scripts)' \
    src || true

  echo
  echo "=== Old asset configuration references ==="

  rg -n \
    --glob '*.{ts,tsx}' \
    'app/config/(svg|scripts).assets.config' \
    src || true

  echo
  echo "=== Asset resolver imports across source ==="

  rg -n \
    --glob '*.{ts,tsx}' \
    'resolve(SvgAssetsConfig|ScriptsAssetConfig)AppInit' \
    src || true

} > checks/H01-stale-references.txt

echo
echo "=== H01 RESULTS ==="
cat "$SUMMARY"
echo
echo "Additional inspection: checks/H01-stale-references.txt"
