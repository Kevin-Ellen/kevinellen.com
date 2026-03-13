#!/usr/bin/env bash
set -euo pipefail

echo "Starting before_init hook"

ARTIFACT_DIR="/mnt/workspace/.artifact"
BUNDLE_TAR="$ARTIFACT_DIR/worker-bundle.tar.gz"
EXTRACT_DIR="$ARTIFACT_DIR"
PY_BIN="${PY_BIN:-python3}"

mkdir -p "$ARTIFACT_DIR"
rm -f "$BUNDLE_TAR"

echo "Checking Python"
"$PY_BIN" --version

echo "Installing awscli via pip"
"$PY_BIN" -m pip install --no-cache-dir --target "$ARTIFACT_DIR/pylib" awscli

export PYTHONPATH="$ARTIFACT_DIR/pylib"
AWS_CMD="$PY_BIN -m awscli"

echo "Checking awscli"
$AWS_CMD --version

echo "Downloading worker bundle from R2"
$AWS_CMD s3 cp \
  "s3://${ARTIFACT_BUCKET}/${ARTIFACT_KEY}" \
  "$BUNDLE_TAR" \
  --endpoint-url "$ARTIFACT_ENDPOINT"

echo "Extracting worker bundle"
tar -xzf "$BUNDLE_TAR" -C "$EXTRACT_DIR"

echo "Listing extracted files"
find "$EXTRACT_DIR" -maxdepth 4 -type f | sort

echo "Validating entry.js exists"
test -f "$EXTRACT_DIR/entry.js"

echo "before_init hook completed successfully"
