// src/app/rendering/document.render.ts

import type { RenderContext } from "@app/renderContext/class.renderContext";

import { docOpenRenderShell } from "@app/rendering/shell/docOpen.render.shell";
import { pageHeadRenderShell } from "@app/rendering/shell/pageHead.render.shell";
import { pageFooterRenderShell } from "@app/rendering/shell/pageFooter.render.shell";
import { docCloseRenderShell } from "@app/rendering/shell/docClose.render.shell";
import { renderPageBody } from "@app/rendering/content/pageBody.render";

export const documentRender = (ctx: RenderContext): string => {
  return [
    docOpenRenderShell(ctx),
    pageHeadRenderShell(ctx),
    renderPageBody(ctx),
    `<pre>${JSON.stringify(ctx.inspect(), null, 2)}</pre>`,
    pageFooterRenderShell(ctx),
    docCloseRenderShell(ctx),
  ].join("");
};
