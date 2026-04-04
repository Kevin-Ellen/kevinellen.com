// src/app/request/render.document.request.ts

import type { AppState } from "@app/appState/class.appState";
import type { DocumentRenderTarget } from "@app/request/request.document.types";

import { createAppContext } from "@app/appContext/create.appContext";
import { buildDocumentRenderContext } from "@app/rendering/document/build.context.document.render";
import { renderDocument } from "@app/rendering/document/render.document";
import { renderDocumentInspectionResponse } from "@app/rendering/document/debug/render.document.inspection.response";
import { shouldRenderDocumentInspection } from "@app/rendering/document/debug/should.render.document.inspection";

export const renderDocumentRequest = async (
  req: Request,
  env: Env,
  _ctx: ExecutionContext,
  appState: AppState,
  target: DocumentRenderTarget,
): Promise<Response> => {
  const appContext = createAppContext(req, env, appState, target);

  if (shouldRenderDocumentInspection(req, env)) {
    return renderDocumentInspectionResponse(req, target, appContext);
  }

  const documentRenderContext = buildDocumentRenderContext(appContext);
  const html = renderDocument(documentRenderContext);

  return new Response(html, {
    status: target.status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "x-render-mode": "document",
    },
  });
};
