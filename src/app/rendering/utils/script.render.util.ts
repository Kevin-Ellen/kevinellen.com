// src/app/rendering/utils/script.render.util.ts

import type { ScriptAssetAuthored } from "@shared-types/assets/script.asset.authored.types";

import { escapeAttribute } from "@app/rendering/utils/escapeContent.util";

export const renderScriptAsset = (
  script: ScriptAssetAuthored,
  nonce: string,
): string => {
  if (script.kind === "inline") {
    return `<script nonce="${escapeAttribute(nonce)}">${script.content}</script>`;
  }

  const loadingAttribute =
    script.loading === "defer"
      ? " defer"
      : script.loading === "async"
        ? " async"
        : "";

  return `<script src="${escapeAttribute(
    script.src,
  )}" nonce="${escapeAttribute(nonce)}"${loadingAttribute}></script>`;
};
