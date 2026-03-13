#!/usr/bin/env bash
set -euo pipefail

echo "Starting before_init hook"

ARTIFACT_DIR="/mnt/workspace/.artifact"
BUNDLE_TAR="$ARTIFACT_DIR/worker-bundle.tar.gz"
EXTRACT_DIR="$ARTIFACT_DIR"
AWS_ZIP="$ARTIFACT_DIR/awscliv2.zip"
AWS_UNZIP_DIR="$ARTIFACT_DIR/aws-cli-download"
AWS_BIN="$AWS_UNZIP_DIR/aws/dist/aws"

mkdir -p "$ARTIFACT_DIR"
rm -rf "$AWS_UNZIP_DIR" "$BUNDLE_TAR"

echo "Downloading AWS CLI bundle"
curl -sSL "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "$AWS_ZIP"

echo "Unzipping AWS CLI bundle"
unzip -q -o "$AWS_ZIP" -d "$AWS_UNZIP_DIR"

echo "Checking AWS binary"
test -f "$AWS_BIN"
"$AWS_BIN" --version

echo "Downloading worker bundle from R2"
"$AWS_BIN" s3 cp \
  "s3://${ARTIFACT_BUCKET}/${ARTIFACT_KEY}" \
  "$BUNDLE_TAR" \
  --endpoint-url "$ARTIFACT_ENDPOINT"

echo "Extracting worker bundle"
tar -xzf "$BUNDLE_TAR" -C "$EXTRACT_DIR"

echo "Listing extracted files"
find "$EXTRACT_DIR" -maxdepth 3 -type f | sort

echo "Validating entry.js exists"
test -f "$EXTRACT_DIR/entry.js"

echo "before_init hook completed successfully"
