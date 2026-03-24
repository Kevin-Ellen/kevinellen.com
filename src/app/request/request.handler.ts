// src/app/request/request.handler.ts

import type { AppState } from "@app/appState/appState";

import { AppContext } from "@app/appContext/appContext";
import { applyRequestResolution } from "@app/request/resolution/apply.request.resolution";
import { applyRequestPolicies } from "@app/policies/request/apply.request.policies";
import { applyResponsePolicies } from "@app/policies/response/apply.response.policies";

const applyResponse = (
  response: Response,
  appContext: AppContext,
): Response => {
  return applyResponsePolicies({
    response,
    appContext,
  });
};

/**
 * Request orchestration entry.
 *
 * Current stages:
 * 1. Request resolution (redirects, gone, system routes)
 * 2. Request policies (method, canonical)
 * 3. Routing → NOT IMPLEMENTED
 * 4. Rendering → NOT IMPLEMENTED
 * 5. Response policies
 */
export const handleRequest = async (
  req: Request,
  env: Env,
  ctx: ExecutionContext,
  appState: AppState,
): Promise<Response> => {
  // Stage 1. Request resolution (redirects, gone, system routes)
  const resolutionOutcome = await applyRequestResolution(
    req,
    env,
    ctx,
    appState,
  );

  if (resolutionOutcome.type === "direct-response") {
    const appContext = new AppContext({
      responseKind: "direct",
      responseFormat: resolutionOutcome.responseFormat,
      env,
    });

    return applyResponse(resolutionOutcome.response, appContext);
  }

  if (resolutionOutcome.type === "render-error") {
    const response = new Response(
      JSON.stringify({
        type: "render-error",
        intent: resolutionOutcome.intent,
      }),
      {
        status: resolutionOutcome.intent.kind === "gone" ? 410 : 500,
      },
    );

    const appContext = new AppContext({
      responseKind: "document",
      responseFormat: "json",
      env,
      document: {
        robots: "noindex, nofollow, noarchive, nosnippet, noimageindex",
      },
    });

    return applyResponse(response, appContext);
  }

  // Stage 2. Request policies (method, canonical)
  const requestPolicyOutcome = applyRequestPolicies(req, env, ctx, appState);

  if (requestPolicyOutcome.type === "direct-response") {
    const appContext = new AppContext({
      responseKind: "direct",
      responseFormat: "text",
      env,
    });

    return applyResponse(requestPolicyOutcome.response, appContext);
  }

  /**
   * ---------------------------------------------------------------------------
   * Stage 3 — Routing
   * ---------------------------------------------------------------------------
   *
   * Future:
   *
   * const routeOutcome = resolveRoute(req, appState);
   */

  /**
   * ---------------------------------------------------------------------------
   * Stage 4 — Rendering
   * ---------------------------------------------------------------------------
   *
   * Future:
   *
   * const context = buildAppContext(routeOutcome, appState);
   * const html = renderDocument(context);
   */

  const response = new Response(JSON.stringify(appState.toJSON()), {
    status: 200,
  });

  const appContext = new AppContext({
    responseKind: "document",
    responseFormat: "json",
    env,
    document: {
      robots: "noindex, nofollow, noarchive, nosnippet, noimageindex",
    },
  });

  return applyResponse(response, appContext);
};
