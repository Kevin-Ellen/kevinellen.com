#!/usr/bin/env bash
set -euo pipefail

NODE_VERSION="$(tr -d '[:space:]' < .nvmrc)"
NODE_DIR="/tmp/spacelift-node"

mkdir -p "$NODE_DIR"

curl -fsSL \
  "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz" \
  | tar -xJ --strip-components=1 -C "$NODE_DIR"

export PATH="${NODE_DIR}/bin:${PATH}"

node --version
npm --version
