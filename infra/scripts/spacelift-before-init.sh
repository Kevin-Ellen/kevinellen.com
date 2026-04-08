#!/usr/bin/env bash
set -euo pipefail

echo "Starting before_init hook"

ARTIFACT_ROOT="/mnt/workspace/.artifact"
PY_BIN="${PY_BIN:-python3}"

test -n "${R2_ACCOUNT_ID:-}" || { echo "R2_ACCOUNT_ID is not set"; exit 1; }
test -n "${R2_ARTIFACT_BUCKET:-}" || { echo "R2_ARTIFACT_BUCKET is not set"; exit 1; }
test -n "${R2_ACCESS_KEY_ID:-}" || { echo "R2_ACCESS_KEY_ID is not set"; exit 1; }
test -n "${R2_SECRET_ACCESS_KEY:-}" || { echo "R2_SECRET_ACCESS_KEY is not set"; exit 1; }
test -n "${TF_VAR_release_sha:-}" || { echo "TF_VAR_release_sha is not set"; exit 1; }
test -n "${TF_VAR_release_key:-}" || { echo "TF_VAR_release_key is not set"; exit 1; }
test -n "${TF_VAR_worker_script_path:-}" || { echo "TF_VAR_worker_script_path is not set"; exit 1; }
test -n "${TF_VAR_static_dir:-}" || { echo "TF_VAR_static_dir is not set"; exit 1; }

RELEASE_SHA="${TF_VAR_release_sha}"
ARTIFACT_KEY="${TF_VAR_release_key}"
RELEASE_DIR="${ARTIFACT_ROOT}/releases/${RELEASE_SHA}"
BUNDLE_TAR="${RELEASE_DIR}/worker-bundle.tar.gz"
CHECKSUM_FILE="${RELEASE_DIR}/checksums.txt"
MANIFEST_FILE="${RELEASE_DIR}/manifest.json"
EXTRACT_DIR="${RELEASE_DIR}"

ARTIFACT_ENDPOINT="https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com"
ARTIFACT_BUCKET="${R2_ARTIFACT_BUCKET}"

export AWS_ACCESS_KEY_ID="${R2_ACCESS_KEY_ID}"
export AWS_SECRET_ACCESS_KEY="${R2_SECRET_ACCESS_KEY}"

rm -rf "${RELEASE_DIR}"
mkdir -p "${RELEASE_DIR}"

echo "Checking Python"
"${PY_BIN}" --version

echo "Installing awscli via pip"
rm -rf "${ARTIFACT_ROOT}/pylib"
"${PY_BIN}" -m pip install --no-cache-dir --target "${ARTIFACT_ROOT}/pylib" awscli

export PYTHONPATH="${ARTIFACT_ROOT}/pylib"
AWS_CMD="${PY_BIN} -m awscli"

echo "Checking awscli"
${AWS_CMD} --version

echo "Using endpoint: ${ARTIFACT_ENDPOINT}"
echo "Using bucket: ${ARTIFACT_BUCKET}"
echo "Using release SHA: ${RELEASE_SHA}"
echo "Using artifact key: ${ARTIFACT_KEY}"

echo "Downloading worker bundle from R2"
${AWS_CMD} s3 cp \
  "s3://${ARTIFACT_BUCKET}/${ARTIFACT_KEY}" \
  "${BUNDLE_TAR}" \
  --endpoint-url "${ARTIFACT_ENDPOINT}"

echo "Downloading checksums from R2"
${AWS_CMD} s3 cp \
  "s3://${ARTIFACT_BUCKET}/workers/${RELEASE_SHA}/checksums.txt" \
  "${CHECKSUM_FILE}" \
  --endpoint-url "${ARTIFACT_ENDPOINT}"

echo "Downloading manifest from R2"
${AWS_CMD} s3 cp \
  "s3://${ARTIFACT_BUCKET}/workers/${RELEASE_SHA}/manifest.json" \
  "${MANIFEST_FILE}" \
  --endpoint-url "${ARTIFACT_ENDPOINT}"

echo "Verifying artifact checksum"
(
  cd "${RELEASE_DIR}"
  sha256sum -c checksums.txt
)

echo "Validating manifest exists"
test -f "${MANIFEST_FILE}"

echo "Extracting worker bundle"
tar -xzf "${BUNDLE_TAR}" -C "${EXTRACT_DIR}"

echo "Listing extracted files"
find "${EXTRACT_DIR}" -maxdepth 4 -type f | sort

if [ -f "${TF_VAR_worker_script_path}" ]; then
  echo "Worker entry found: ${TF_VAR_worker_script_path}"
else
  echo "Worker entry not found at expected path: ${TF_VAR_worker_script_path}"
  exit 1
fi

if [ -d "${TF_VAR_static_dir}" ]; then
  echo "Static directory found: ${TF_VAR_static_dir}"
  find "${TF_VAR_static_dir}" -maxdepth 4 -type f | sort
else
  echo "Static directory not found at expected path: ${TF_VAR_static_dir}"
  exit 1
fi

echo "Resolved worker script path: ${TF_VAR_worker_script_path}"

echo "before_init hook completed successfully"
