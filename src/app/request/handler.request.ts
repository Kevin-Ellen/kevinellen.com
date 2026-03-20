// src/app/request/requestHandler.ts

import type { AppState } from "@app/appState/appState";
import type {
  PreRoutingOutcome,
  ErrorRenderIntent,
} from "@app/request/request.types";
import { routeRequest } from "@app/request/router.request";

import { evaluateRedirectPolicy } from "@app/policies/redirects/engine.redirects";
import { evaluateGonePolicy } from "@app/policies/gone/engine.gone";
import { evaluateCanonicalPolicy } from "@app/policies/canonical/engine.canonical";
import { evaluateMethodPolicy } from "../policies/method/engine.method";

const runPreRoutingStage = (
  req: Request,
  env: Env,
  _ctx: ExecutionContext,
  _appState: AppState,
): PreRoutingOutcome => {
  const methodOutcome = evaluateMethodPolicy(req);

  if (methodOutcome.type !== "continue") {
    return methodOutcome;
  }

  const canonicalOutcome = evaluateCanonicalPolicy(req, env);

  if (canonicalOutcome.type !== "continue") {
    return canonicalOutcome;
  }

  const redirectOutcome = evaluateRedirectPolicy(req);
  if (redirectOutcome.type !== "continue") {
    return redirectOutcome;
  }

  const goneOutcome = evaluateGonePolicy(req);
  if (goneOutcome.type !== "continue") {
    return goneOutcome;
  }

  return { type: "continue" };
};

const runRoutingStage = (req: Request, appState: AppState) => {
  const url = new URL(req.url);
  const slug = url.pathname;

  return routeRequest(slug, appState);
};

const resolveRenderStatus = (intent: ErrorRenderIntent): 404 | 410 | 500 => {
  switch (intent.kind) {
    case "gone":
      return 410;
    case "not-found":
      return 404;
    case "failure":
      return 500;
  }
};

const renderPageResponse = (page: unknown): Response => {
  return new Response(JSON.stringify(page, null, 2), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
};

const renderErrorIntent = (
  intent: ErrorRenderIntent,
  appState: AppState,
): Response => {
  const status = resolveRenderStatus(intent);
  const errorPage = appState.getErrorPageByStatus(status);

  const headers = new Headers({
    "content-type": "application/json; charset=utf-8",
  });

  if (intent.kind === "gone") {
    headers.set("x-runtime-policy", "gone");
  }

  return new Response(JSON.stringify(errorPage, null, 2), {
    status,
    headers,
  });
};

const applyResponsePolicies = (
  _req: Request,
  _env: Env,
  _appState: AppState,
  response: Response,
): Response => {
  return response;
};

export const handleRequest = async (
  req: Request,
  env: Env,
  ctx: ExecutionContext,
  appState: AppState,
): Promise<Response> => {
  try {
    const preRoutingOutcome = runPreRoutingStage(req, env, ctx, appState);

    if (preRoutingOutcome.type === "direct-response") {
      return applyResponsePolicies(
        req,
        env,
        appState,
        preRoutingOutcome.response,
      );
    }

    if (preRoutingOutcome.type === "render-error") {
      return applyResponsePolicies(
        req,
        env,
        appState,
        renderErrorIntent(preRoutingOutcome.intent, appState),
      );
    }

    const routingOutcome = runRoutingStage(req, appState);

    if (routingOutcome.kind === "not-found") {
      return applyResponsePolicies(
        req,
        env,
        appState,
        renderErrorIntent({ kind: "not-found" }, appState),
      );
    }

    return applyResponsePolicies(
      req,
      env,
      appState,
      renderPageResponse(routingOutcome.page),
    );
  } catch (_error) {
    return applyResponsePolicies(
      req,
      env,
      appState,
      renderErrorIntent({ kind: "failure" }, appState),
    );
  }
};
