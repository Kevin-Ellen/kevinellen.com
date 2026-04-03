// src/app/rendering/document/debug/render.document.inspection.response.ts

import type { AppContext } from "@app/appContext/class.appContext";
import type { DocumentRenderTarget } from "@app/request/request.document.types";

import { buildDocumentInspection } from "@app/rendering/document/debug/build.document.inspection";

export const renderDocumentInspectionResponse = (
  req: Request,
  target: DocumentRenderTarget,
  appContext: AppContext,
): Response => {
  const payload = buildDocumentInspection(req, target, appContext);

  return new Response(JSON.stringify(payload, null, 2), {
    status: target.status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "x-render-mode": "document-inspection",
    },
  });
};
