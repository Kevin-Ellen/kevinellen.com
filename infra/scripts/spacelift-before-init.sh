#!/usr/bin/env bash
set -euo pipefail

echo "Starting before_init hook"

ARTIFACT_DIR="/mnt/workspace/.artifact"
BUNDLE_TAR="$ARTIFACT_DIR/worker-bundle.tar.gz"
EXTRACT_DIR="$ARTIFACT_DIR"
PY_BIN="${PY_BIN:-python3}"

test -n "${R2_ACCOUNT_ID:-}" || { echo "R2_ACCOUNT_ID is not set"; exit 1; }
test -n "${R2_ARTIFACT_BUCKET:-}" || { echo "R2_ARTIFACT_BUCKET is not set"; exit 1; }
test -n "${R2_ACCESS_KEY_ID:-}" || { echo "R2_ACCESS_KEY_ID is not set"; exit 1; }
test -n "${R2_SECRET_ACCESS_KEY:-}" || { echo "R2_SECRET_ACCESS_KEY is not set"; exit 1; }

ARTIFACT_ENDPOINT="https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com"
ARTIFACT_BUCKET="${R2_ARTIFACT_BUCKET}"

export AWS_ACCESS_KEY_ID="${R2_ACCESS_KEY_ID}"
export AWS_SECRET_ACCESS_KEY="${R2_SECRET_ACCESS_KEY}"

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

echo "Using endpoint: $ARTIFACT_ENDPOINT"
echo "Using bucket: $ARTIFACT_BUCKET"

echo "Available commit-related env vars:"
env | sort | grep -E 'SPACELIFT|GIT_COMMIT|COMMIT_SHA' || true

COMMIT_SHA="$(git -C /mnt/workspace/source rev-parse HEAD)"
test -n "$COMMIT_SHA" || { echo "Could not determine commit SHA from git"; exit 1; }

echo "Resolved commit SHA: $COMMIT_SHA"

ARTIFACT_KEY="workers/${COMMIT_SHA}/worker-bundle.tar.gz"
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
