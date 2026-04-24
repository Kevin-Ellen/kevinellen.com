// src/rendering/renderer.ts

import type { AppRenderContext } from "@app-render-context/class.app-render-context";

import { renderDocOpen } from "@rendering/doc-open/doc-open.renderer";
import { renderBodyHeader } from "@rendering/body-header/body-header.renderer";
import { renderBodyContent } from "@rendering/body-content/body-content.renderer";
import { renderBodyFooter } from "@rendering/body-footer/body-footer.renderer";
import { renderDocClose } from "@rendering/doc-close/doc-close.renderer";

export const render = (appRenderContext: AppRenderContext): string => {
  return [
    renderDocOpen(appRenderContext.docOpen),
    renderBodyHeader(appRenderContext.bodyHeader),
    renderBodyContent(appRenderContext.bodyContent),
    renderBodyFooter(appRenderContext.bodyFooter),
    renderDocClose(appRenderContext.docClose),
  ].join("");
};
