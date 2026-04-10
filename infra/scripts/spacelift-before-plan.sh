#!/usr/bin/env bash
echo "hello world :)"

#!/usr/bin/env bash
set -euo pipefail

echo "PWD=$(pwd)"

python3 - <<'PY'
import os, hashlib
token = os.environ.get("CLOUDFLARE_API_TOKEN", "")
print("CLOUDFLARE_API_TOKEN present:", bool(token))
print("CLOUDFLARE_API_TOKEN sha256:", hashlib.sha256(token.encode()).hexdigest() if token else "missing")
PY

echo "Verifying token"
curl -sS "https://api.cloudflare.com/client/v4/user/tokens/verify" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" | sed 's/"id":"[^"]*"/"id":"redacted"/'

echo
echo "Listing KV namespaces for target account"
curl -sS "https://api.cloudflare.com/client/v4/accounts/${TF_VAR_account_id}/storage/kv/namespaces" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}"
echo
