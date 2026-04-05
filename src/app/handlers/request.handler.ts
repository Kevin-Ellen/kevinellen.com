// src/app/handlers/request.handler.ts

import type { AppState } from "@app/appState/class.appState";
import type { DocumentRenderTarget } from "@app/request/request.document.types";

import { runRequestPolicies } from "@app/policies/request/run.request.policies";
import { runResponsePolicies } from "@app/policies/response/run.response.policies";
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

const renderTargetResponse = async (
  req: Request,
  env: Env,
  ctx: ExecutionContext,
  appState: AppState,
  target: DocumentRenderTarget,
): Promise<Response> => {
  const rendered = await renderDocumentRequest(req, env, ctx, appState, target);

  return runResponsePolicies(
    req,
    env,
    appState,
    target,
    rendered.security,
    rendered.response,
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

    if (requestPolicyOutcome.kind === "render-error") {
      const target = resolveErrorRenderIntent(
        requestPolicyOutcome.intent,
        appState,
      );

      return renderTargetResponse(req, env, ctx, appState, target);
    }

    const target = routeDocumentRequest(req, appState);

    return renderTargetResponse(req, env, ctx, appState, target);
  } catch (_error) {
    const target = resolveInternalErrorTarget(appState);

    return renderTargetResponse(req, env, ctx, appState, target);
  }
};
