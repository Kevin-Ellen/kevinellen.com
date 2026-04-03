// src/app/request/handler.request.ts

import type { AppState } from "@app/appState/class.appState";
import type { DocumentRenderTarget } from "@app/request/request.document.types";

import { runRequestPolicies } from "@app/policies/request/run.request.policies";
import { resolveErrorRenderIntent } from "@app/request/resolve.error.render.intent";
import { routeDocumentRequest } from "@app/request/route.document.request";
import { renderDocumentRequest } from "@app/request/render.document.request";

const resolveInternalErrorTarget = (
  appState: AppState,
): DocumentRenderTarget => {
  const internalErrorPage = appState.getErrorPageByStatus(500);

  if (!internalErrorPage) {
    throw new Error("Missing 500 error page definition");
  }

  return {
    kind: "error-page",
    page: internalErrorPage,
    status: 500,
  };
};

export const handleRequest = async (
  req: Request,
  env: Env,
  ctx: ExecutionContext,
  appState: AppState,
): Promise<Response> => {
  try {
    const requestPolicyOutcome = runRequestPolicies(req, env, appState);

    if (requestPolicyOutcome.kind === "direct-response") {
      return requestPolicyOutcome.response;
    }

    if (requestPolicyOutcome.kind === "render-error") {
      const target = resolveErrorRenderIntent(
        requestPolicyOutcome.intent,
        appState,
      );

      return renderDocumentRequest(req, env, ctx, appState, target);
    }

    const target = routeDocumentRequest(req, appState);

    return renderDocumentRequest(req, env, ctx, appState, target);
  } catch (_error) {
    const target = resolveInternalErrorTarget(appState);

    return renderDocumentRequest(req, env, ctx, appState, target);
  }
};
