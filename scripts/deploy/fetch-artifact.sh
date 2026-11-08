
#!/usr/bin/env bash
set -euo pipefail

REPO="Kevin-Ellen/kevinellen.com"
ROOT="$(git rev-parse --show-toplevel)"
SHA="$(git -C "$ROOT" rev-parse HEAD)"
ARTIFACT="website-${SHA}"
API="https://api.github.com/repos/${REPO}"

: "${GITHUB_ARTIFACT_TOKEN:?Missing GITHUB_ARTIFACT_TOKEN}"

api_get() {
  curl --fail --silent --show-error --location \
    --retry 3 \
    -H "Authorization: Bearer ${GITHUB_ARTIFACT_TOKEN}" \
    -H "Accept: application/vnd.github+json" \
    "$1"
}

echo "Finding artifact: ${ARTIFACT}"

ARTIFACT_JSON="$(
  api_get "${API}/actions/artifacts?name=${ARTIFACT}&per_page=100" |
    jq -ec --arg name "$ARTIFACT" --arg sha "$SHA" '
      [
        .artifacts[]
        | select(
            .name == $name
            and .expired == false
            and .workflow_run.head_sha == $sha
          )
      ]
      | sort_by(.created_at)
      | last // empty
    '
)"

ARTIFACT_ID="$(jq -r '.id' <<< "$ARTIFACT_JSON")"
RUN_ID="$(jq -r '.workflow_run.id' <<< "$ARTIFACT_JSON")"
DIGEST="$(jq -r '.digest' <<< "$ARTIFACT_JSON")"

echo "Verifying GitHub Actions run: ${RUN_ID}"

api_get "${API}/actions/runs/${RUN_ID}" |
  jq -e \
    --arg sha "$SHA" \
    'select(
      .head_sha == $sha
      and .name == "CI"
      and .event == "push"
      and .conclusion == "success"
    )' >/dev/null

echo "CI run verified."

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

echo "Downloading artifact: ${ARTIFACT_ID}"

curl --fail --silent --show-error --location \
  --retry 3 \
  -H "Authorization: Bearer ${GITHUB_ARTIFACT_TOKEN}" \
  -H "Accept: application/vnd.github+json" \
  "${API}/actions/artifacts/${ARTIFACT_ID}/zip" \
  -o "${TMP_DIR}/artifact.zip"

# Verify the exact ZIP supplied by GitHub
[[ "$DIGEST" == sha256:* ]] || {
  echo "Missing SHA-256 artifact digest" >&2
  exit 1
}

echo "${DIGEST#sha256:}  ${TMP_DIR}/artifact.zip" |
  sha256sum --check --status

# GitHub's upload-artifact stores dist/ contents at ZIP root
mkdir -p "${TMP_DIR}/dist"
unzip -q "${TMP_DIR}/artifact.zip" -d "${TMP_DIR}/dist"

test -s "${TMP_DIR}/dist/worker/entry.js"
test -d "${TMP_DIR}/dist/static"

rm -rf "${ROOT}/dist"
mv "${TMP_DIR}/dist" "${ROOT}/dist"

echo "Artifact verified and extracted for ${SHA}"
