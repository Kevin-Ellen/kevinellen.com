// src/rendering/shared/script.shared.renderer.ts

import type { AppRenderContextStructuredDataEntry } from "@shared-types/structured-data/app-render-context.structured-data.types";

import {
  escapeAttribute,
  escapeJsonScriptContent,
} from "@rendering/utils/html.escape.util.renderer";

export const renderStructuredDataScript = (
  item: AppRenderContextStructuredDataEntry,
): string =>
  `<script type="application/ld+json">${escapeJsonScriptContent(
    JSON.stringify(item),
  )}</script>`;

export const renderInlineScript = (script: {
  content: string;
  nonce?: string | null;
}): string => {
  const nonceAttribute = script.nonce
    ? ` nonce="${escapeAttribute(script.nonce)}"`
    : "";

  return `<script${nonceAttribute}>${script.content}</script>`;
};

export const renderLinkScript = (script: {
  src: string;
  nonce?: string | null;
  loading?: "blocking" | "defer" | "async";
}): string => {
  const nonceAttribute = script.nonce
    ? ` nonce="${escapeAttribute(script.nonce)}"`
    : "";

  const loadingAttribute =
    script.loading === "defer"
      ? " defer"
      : script.loading === "async"
        ? " async"
        : "";

  return `<script src="${escapeAttribute(
    script.src,
  )}"${nonceAttribute}${loadingAttribute}></script>`;
};
