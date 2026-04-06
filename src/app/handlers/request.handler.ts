// src/app/handlers/request.handler.ts

import type { AppState } from "@app/appState/class.appState";
import type { DocumentRenderTarget } from "@app/request/request.document.types";

import { createAppContext } from "@app/appContext/create.appContext";
import { runRequestPolicies } from "@app/policies/request/run.request.policies";
import { runResponsePolicies } from "@app/policies/response/run.response.policies";
import { resolveErrorRenderIntent } from "@app/request/resolve.error.render.intent";
import { routeDocumentRequest } from "@app/request/route.document.request";
import { renderDocumentRequest } from "@app/request/render.document.request";
import { createRenderContext } from "@app/renderContext/create.renderContext";

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

const renderTargetResponse = async (
  req: Request,
  env: Env,
  _ctx: ExecutionContext,
  appState: AppState,
  target: DocumentRenderTarget,
): Promise<Response> => {
  const appContext = createAppContext(req, env, appState, target);
  const renderContext = createRenderContext(appContext);
  const renderResult = await renderDocumentRequest(renderContext);

  return runResponsePolicies(
    req,
    env,
    target,
    renderContext,
    renderResult.response,
  );
};

export const requestHandler = async (
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

    const target =
      requestPolicyOutcome.kind === "render-error"
        ? resolveErrorRenderIntent(requestPolicyOutcome.intent, appState)
        : routeDocumentRequest(req, appState);

    return renderTargetResponse(req, env, ctx, appState, target);
  } catch (_error) {
    const target = resolveInternalErrorTarget(appState);

    return renderTargetResponse(req, env, ctx, appState, target);
  }
};
