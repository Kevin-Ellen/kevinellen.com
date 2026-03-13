#!/usr/bin/env bash
set -euo pipefail

echo "Starting before_init hook"

ARTIFACT_DIR="/mnt/workspace/.artifact"
BUNDLE_TAR="$ARTIFACT_DIR/worker-bundle.tar.gz"
EXTRACT_DIR="$ARTIFACT_DIR"
PY_BIN="${PY_BIN:-python3}"

ARTIFACT_ENDPOINT="https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com"
ARTIFACT_BUCKET="${R2_ARTIFACT_BUCKET}"
ARTIFACT_KEY="${R2_ARTIFACT_KEY:-}"

mkdir -p "$ARTIFACT_DIR"
rm -f "$BUNDLE_TAR"

test -n "$R2_ACCOUNT_ID" || { echo "R2_ACCOUNT_ID is not set"; exit 1; }
test -n "$R2_ARTIFACT_BUCKET" || { echo "R2_ARTIFACT_BUCKET is not set"; exit 1; }
test -n "$ARTIFACT_KEY" || { echo "ARTIFACT_KEY is not set"; exit 1; }

echo "Checking Python"
"$PY_BIN" --version

echo "Installing awscli via pip"
"$PY_BIN" -m pip install --no-cache-dir --target "$ARTIFACT_DIR/pylib" awscli

export PYTHONPATH="$ARTIFACT_DIR/pylib"
AWS_CMD="$PY_BIN -m awscli"

echo "Checking awscli"
$AWS_CMD --version

echo "Using endpoint: $ARTIFACT_ENDPOINT"
echo "Using bucket: $ARTIFACT_BUCKET"
echo "Using key: $ARTIFACT_KEY"

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
