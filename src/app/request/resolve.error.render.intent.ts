// src/app/request/resolve.error.render.intent.ts

import type { AppState } from "@app/appState/class.appState";
import type { DocumentRenderTarget } from "@app/request/request.document.types";
import type { ErrorRenderIntent } from "@app/policies/request/request.policies.types";

export const resolveErrorRenderIntent = (
  intent: ErrorRenderIntent,
  appState: AppState,
): DocumentRenderTarget => {
  if (intent === "gone") {
    const gonePage = appState.getErrorPageByStatus(410);

    if (!gonePage) {
      throw new Error("Missing 410 error page definition");
    }

    return {
      kind: "error-page",
      page: gonePage,
      status: 410,
    };
  }

  throw new Error(`Unhandled error render intent: ${intent}`);
};
