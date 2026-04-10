// src/app/request/resolve.error.render.intent.ts

import type { AppState } from "@app/appState/class.appState";
import type { DocumentRenderTarget } from "@app/request/request.document.types";
import type { ErrorRenderIntent } from "@app/policies/request/request.policies.types";

export const resolveErrorRenderIntent = (
  intent: ErrorRenderIntent,
  appState: AppState,
): DocumentRenderTarget => {
  const errorPage = appState.getErrorPageByStatus(intent.status);

  if (!errorPage) {
    throw new Error(`Missing ${intent.status} error page definition`);
  }

  return {
    kind: "error-page",
    page: errorPage,
    status: intent.status,
  };
};
