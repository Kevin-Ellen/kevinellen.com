// src/app/rendering/renderer/utils/script.util.renderer.ts

import type { ScriptAsset } from "@app/assets/scripts/scripts.assets.types";
import type { DocumentRenderContext } from "@app/rendering/document/document.render.types";

import { escapeAttribute } from "@app/rendering/renderer/utils/escapeAttribute.util.renderer";

export const renderScriptAsset = (
  script: ScriptAsset,
  ctx: DocumentRenderContext,
): string => {
  const typeAttribute = script.type
    ? ` type="${escapeAttribute(script.type)}"`
    : "";

  if (script.kind === "inline") {
    return `<script${typeAttribute} nonce="${escapeAttribute(ctx.security.nonce)}">${script.content}</script>`;
  }

  const deferAttribute = script.defer ? " defer" : "";
  const asyncAttribute = script.async ? " async" : "";

  return `<script src="${escapeAttribute(script.src)}"${typeAttribute}${deferAttribute}${asyncAttribute}></script>`;
};
