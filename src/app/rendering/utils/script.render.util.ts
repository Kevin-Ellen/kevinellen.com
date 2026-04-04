// src/app/rendering/utils/script.render.util.ts

import type { ScriptAssetConfig } from "@config/assets.config.types";

import { escapeAttribute } from "@utils/escapeContent.util";

const escapeScriptContent = (value: string): string =>
  value.replaceAll("</script>", "<\\/script>");

export const renderScriptAsset = (
  script: ScriptAssetConfig,
  nonce: string,
): string => {
  if (script.kind === "external") {
    const asyncAttribute = script.loading === "async" ? " async" : "";
    const deferAttribute = script.loading === "defer" ? " defer" : "";

    return `<script src="${escapeAttribute(script.src)}"${asyncAttribute}${deferAttribute}></script>`;
  }

  return `<script nonce="${escapeAttribute(nonce)}">${escapeScriptContent(script.content)}</script>`;
};
