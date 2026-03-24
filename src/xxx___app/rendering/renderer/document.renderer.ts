// src/app/rendering/renderer/document.renderer.ts

import type { DocumentRenderContext } from "@app/rendering/document/document.render.types";

import { renderDocHead } from "@app/rendering/renderer/parts/docHead/render.docHead";
import { renderPageHead } from "@app/rendering/renderer/parts/pageHead/render.pageHead";
import { renderBody } from "@app/rendering/renderer/parts/body/render.body";
import { renderPageFooter } from "@app/rendering/renderer/parts/pageFooter/render.pageFooter";
import { renderDocFooter } from "@app/rendering/renderer/parts/docFooter/render.docFooter";

export const renderDocument = (
  documentRender: DocumentRenderContext,
): string => {
  return [
    renderDocHead(documentRender),
    renderPageHead(documentRender),
    renderBody(documentRender),
    renderPageFooter(documentRender),
    renderDocFooter(documentRender),
  ].join("");
};
