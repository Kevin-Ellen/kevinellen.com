// src/app/request/render.document.request.ts

import type { RenderContext } from "@app/renderContext/class.renderContext";

export type RenderDocumentResult = {
  response: Response;
};

export const renderDocumentRequest = async (
  renderContext: RenderContext,
): Promise<RenderDocumentResult> => {
  return {
    response: new Response(JSON.stringify(renderContext.inspect(), null, 2), {
      status: renderContext.document.status,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    }),
  };
};
