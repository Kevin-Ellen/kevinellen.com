// src/app/request/requestHandler.ts

import type { AppState } from "@app/appState/appState";
import type { PageDefinition } from "@app/pages/page.definition";
import type {
  PreRoutingOutcome,
  ErrorRenderIntent,
} from "@app/request/request.types";

import { routeRequest } from "@app/request/router.request";

import { evaluateRedirectPolicy } from "@app/policies/redirects/engine.redirects";
import { evaluateGonePolicy } from "@app/policies/gone/engine.gone";
import { evaluateCanonicalPolicy } from "@app/policies/canonical/engine.canonical";
import { evaluateMethodPolicy } from "../policies/method/engine.method";

import { buildDocumentRender } from "@app/rendering/document/build.document";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const createNonce = (): string => {
  return crypto.randomUUID().replace(/-/g, "");
};

/* -------------------------------------------------------------------------- */
/* Pre-routing policy ordering contract                                       */
/* -------------------------------------------------------------------------- */
/*
  Policies in this stage must run in this order:

  1. Method policy
     - validates request method before any URL-based policy work
     - may terminate with direct response

  2. Canonical policy
     - normalises request URL before redirect/gone lookups
     - may terminate with direct response

  3. Redirect policy
     - resolves explicit redirect mappings after canonical normalisation
     - may terminate with direct response

  4. Gone policy
     - resolves explicit gone mappings after redirect checks
     - may terminate with render-error

  New pre-routing policies must define:
  - why they belong in pre-routing
  - whether they must run before or after canonical / redirect / gone
  - whether they return continue, direct-response, or render-error

  Ordering changes require corresponding test updates.
*/
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

/* -------------------------------------------------------------------------- */
/* Render inspection responses                                                */
/* -------------------------------------------------------------------------- */

const renderDocumentInspectionResponse = (
  req: Request,
  appState: AppState,
  page: PageDefinition,
  status: number = 200,
): Response => {
  const nonce = createNonce();
  const documentRender = buildDocumentRender(appState, page, nonce);

  return new Response(JSON.stringify(documentRender, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "x-render-mode": "document-inspection",
    },
  });
};

const renderErrorIntent = (
  req: Request,
  intent: ErrorRenderIntent,
  appState: AppState,
): Response => {
  const status = resolveRenderStatus(intent);
  const errorPage = appState.getErrorPageByStatus(status);

  const response = renderDocumentInspectionResponse(
    req,
    appState,
    errorPage,
    status,
  );

  if (intent.kind !== "gone") {
    return response;
  }

  const headers = new Headers(response.headers);
  headers.set("x-runtime-policy", "gone");

  return new Response(response.body, {
    status: response.status,
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

/* -------------------------------------------------------------------------- */
/* Main handler                                                               */
/* -------------------------------------------------------------------------- */

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
        renderErrorIntent(req, preRoutingOutcome.intent, appState),
      );
    }

    const routingOutcome = runRoutingStage(req, appState);

    if (routingOutcome.kind === "not-found") {
      return applyResponsePolicies(
        req,
        env,
        appState,
        renderErrorIntent(req, { kind: "not-found" }, appState),
      );
    }

    return applyResponsePolicies(
      req,
      env,
      appState,
      renderDocumentInspectionResponse(req, appState, routingOutcome.page),
    );
  } catch (_error) {
    return applyResponsePolicies(
      req,
      env,
      appState,
      renderErrorIntent(req, { kind: "failure" }, appState),
    );
  }
};
