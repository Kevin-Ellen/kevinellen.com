#!/usr/bin/env bash
set -euo pipefail

echo "Starting before_init hook"

ARTIFACT_DIR="/mnt/workspace/.artifact"
BUNDLE_TAR="$ARTIFACT_DIR/worker-bundle.tar.gz"
EXTRACT_DIR="$ARTIFACT_DIR"

mkdir -p "$ARTIFACT_DIR"

echo "Installing AWS CLI"
curl -sSL "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "$ARTIFACT_DIR/awscliv2.zip"
unzip -q -o "$ARTIFACT_DIR/awscliv2.zip" -d "$ARTIFACT_DIR"
"$ARTIFACT_DIR/aws/install" -i "$ARTIFACT_DIR/aws-cli" -b "$ARTIFACT_DIR/bin"

export PATH="$ARTIFACT_DIR/bin:$PATH"
aws --version

echo "Downloading worker bundle from R2"
aws s3 cp \
  "s3://${ARTIFACT_BUCKET}/${ARTIFACT_KEY}" \
  "$BUNDLE_TAR" \
  --endpoint-url "$ARTIFACT_ENDPOINT"

echo "Extracting worker bundle"
tar -xzf "$BUNDLE_TAR" -C "$EXTRACT_DIR"

echo "Validating extracted files"
ls -la "$EXTRACT_DIR"
test -f "$EXTRACT_DIR/entry.js"

echo "before_init hook completed successfully"
