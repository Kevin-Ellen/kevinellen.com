// src/app/rendering/document/shell/docClose.render.shell.ts

import type { DocumentRenderContext } from "@app/rendering/document/document.render.types";

import { renderScriptAsset } from "@app/rendering/utils/script.render.util";
import { renderStructuredData } from "@app/rendering/utils/structuredData.render.util";
import { renderSvgSprite } from "@app/rendering/utils/svg.render.sprite.util";

export const renderDocClose = (
  documentRenderContext: DocumentRenderContext,
): string => {
  const { security, assets, structuredData } = documentRenderContext;

  const footerScripts = assets.footer.scripts
    .map((script) => renderScriptAsset(script, security.nonce))
    .join("");

  const structuredDataScripts = renderStructuredData(structuredData);
  const svgSprite = renderSvgSprite(assets.footer.svgs);

  const closeFragments = [
    footerScripts,
    structuredDataScripts,
    svgSprite,
  ].filter((fragment) => fragment.length > 0);

  if (closeFragments.length === 0) {
    return "</body>\n</html>";
  }

  return `${closeFragments.join("\n")}\n</body>\n</html>`;
};
