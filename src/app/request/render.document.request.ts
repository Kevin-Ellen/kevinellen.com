// src/app/request/render.document.request.ts

import type { AppState } from "@app/appState/class.appState";
import type { DocumentRenderTarget } from "@app/request/request.document.types";

import { createAppContext } from "@app/appContext/create.appContext";

export const renderDocumentRequest = async (
  req: Request,
  _env: Env,
  _ctx: ExecutionContext,
  appState: AppState,
  target: DocumentRenderTarget,
): Promise<Response> => {
  const appContext = createAppContext(req, appState, target);

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
      navigation: appContext.getNavigation(),
      breadcrumbs: appContext.getBreadcrumbs(),
      // assets: appContext.getAssets(),
      structuredData: appContext.getStructuredData(),
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
