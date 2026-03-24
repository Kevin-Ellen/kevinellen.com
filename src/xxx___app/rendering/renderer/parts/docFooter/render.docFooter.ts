// src/app/rendering/renderer/parts/docFooter/render.docFooter.ts

import type { DocumentRenderContext } from "@app/rendering/document/document.render.types";

import { escapeAttribute } from "@app/rendering/renderer/utils/escapeAttribute.util.renderer";
import { renderScriptAsset } from "@app/rendering/renderer/utils/script.util.renderer";

const renderFooterScripts = (ctx: DocumentRenderContext): string => {
  return ctx.assets.scripts
    .filter((script) => script.location === "footer")
    .map((script) => renderScriptAsset(script, ctx))
    .join("\n");
};

export const renderDocFooter = (ctx: DocumentRenderContext): string => {
  const svgSymbols = ctx.assets.svgs
    .map((svg) => {
      return `<symbol id="${escapeAttribute(svg.id)}" viewBox="${escapeAttribute(svg.viewBox)}" fill="currentColor">${svg.content}</symbol>`;
    })
    .join("\n");

  const html = `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="display: none;">
        ${svgSymbols}
      </svg>
      ${renderFooterScripts(ctx)}
    </body>
  </html>`;

  return html;
};
