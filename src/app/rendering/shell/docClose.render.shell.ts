// src/app/rendering/shell/docClose.render.shell.ts

import type { RenderContext } from "@app/renderContext/class.renderContext";

import { renderScriptAsset } from "@app/rendering/utils/script.render.util";
import { renderStructuredDataNode } from "@app/rendering/utils/structuredData.render.util";
import { renderSvgSprite } from "@app/rendering/utils/svg.render.sprite.util";

export const docCloseRenderShell = (ctx: RenderContext): string => {
  const structuredDataScripts = ctx.structuredData.items
    .map((item) => renderStructuredDataNode(item, ctx.security.nonce))
    .join("");

  const footerScripts = ctx.footer.scripts
    .map((script) => renderScriptAsset(script, ctx.security.nonce))
    .join("");

  const svgSprite = renderSvgSprite(ctx.footer.svgs);

  const closeFragments = [
    structuredDataScripts,
    footerScripts,
    svgSprite,
  ].filter((fragment) => fragment.length > 0);

  if (closeFragments.length === 0) {
    return "</body>\n</html>";
  }

  return `${closeFragments.join("\n")}\n</body>\n</html>`;
};
