// src/app/request/render.document.request.ts

import type { AppState } from "@app/appState/class.appState";
import type { DocumentRenderTarget } from "@app/request/request.document.types";

import { createAppContext } from "@app/appContext/create.appContext";
import { shouldRenderDocumentInspection } from "@app/rendering/document/debug/should.render.document.inspection";
import { renderDocumentInspectionResponse } from "@app/rendering/document/debug/render.document.inspection.response";

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

  const debugPayload = {
    type: "document-inspection",

    request: {
      url: req.url,
      method: req.method,
    },

    target: {
      kind: target.kind,
      status: target.status,
      page: {
        id: target.page.core.id,
        slug: target.kind === "page" ? target.page.core.slug : undefined,
        label: target.page.core.label,
        kind: target.page.core.kind,
      },
    },

    appContext: {
      site: {
        siteName: appContext.getSiteConfig().siteName,
        siteUrl: appContext.getSiteConfig().siteUrl,
      },
      canonicalUrl: appContext.getCanonicalUrl(),
      navigation: appContext.getNavigation(),
      breadcrumbs: appContext.getBreadcrumbs(),
      // assets: appContext.getAssets(),
      structuredData: appContext.getStructuredData(),
      content: appContext.getContent(),
    },
  };

  return new Response(JSON.stringify(debugPayload, null, 2), {
    status: target.status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "x-render-mode": "document-inspection",
    },
  });
};
