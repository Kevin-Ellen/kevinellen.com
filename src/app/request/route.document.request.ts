// src/app/request/route.document.request.ts

import type { AppState } from "@app/appState/class.appState";
import type { DocumentRenderTarget } from "@app/request/request.document.types";

const getRequestPathname = (req: Request): string => {
  const url = new URL(req.url);

  return url.pathname;
};

const resolveNotFoundTarget = (appState: AppState): DocumentRenderTarget => {
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

export const routeDocumentRequest = (
  req: Request,
  appState: AppState,
): DocumentRenderTarget => {
  const pathname = getRequestPathname(req);
  const publicPage = appState.getPublicPageBySlug(pathname);

  if (!publicPage) {
    return resolveNotFoundTarget(appState);
  }

  return {
    kind: "public-page",
    page: publicPage,
    status: 200,
  };
};
