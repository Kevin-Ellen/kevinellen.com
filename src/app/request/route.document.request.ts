// src/app/request/route.document.request.ts

import type { AppState } from "@app/appState/class.appState";
import type { DocumentRenderTarget } from "@app/request/request.document.types";

export const routeDocumentRequest = (
  req: Request,
  appState: AppState,
): DocumentRenderTarget => {
  const { pathname } = new URL(req.url);

  const page = appState.getPageBySlug(pathname);

  if (page) {
    return {
      kind: "page",
      page,
      status: 200,
    };
  }

  const notFoundPage = appState.getErrorPageByStatus(404);

  if (!notFoundPage) {
    throw new Error("Missing 404 error page definition");
  }

  return {
    kind: "error-page",
    page: notFoundPage,
    status: 404,
  };
};
