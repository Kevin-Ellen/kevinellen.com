#!/usr/bin/env bash
set -euo pipefail

NODE_VERSION="$(tr -d '[:space:]' < .nvmrc)"
NODE_DIR="/tmp/spacelift-node"

# Required by Node 26 on Alpine Linux
apk add --no-cache libatomic libstdc++

mkdir -p "$NODE_DIR"

curl -fsSL \
  "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64-musl.tar.xz" \
  | tar -xJ --strip-components=1 -C "$NODE_DIR"

export PATH="${NODE_DIR}/bin:${PATH}"

node --version
npm --version
