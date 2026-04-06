// src/app/request/render.document.request.ts

import type { RenderContext } from "@app/renderContext/class.renderContext";

import { documentRender } from "@app/rendering/document.render";

export type RenderDocumentResult = {
  response: Response;
};

export const renderDocumentRequest = async (
  renderContext: RenderContext,
): Promise<RenderDocumentResult> => {
  const html = documentRender(renderContext);

  return {
    response: new Response(html, {
      status: renderContext.document.status,
      headers: {
        "content-type": "text/html; charset=utf-8",
      },
    }),
  };
};
