// src/app/request/requestHandler.ts

import type { AppState } from "@app/appState/appState";
import type { ErrorRenderIntent } from "@app/request/request.types";
import type { ResponsePolicyContext } from "@app/policies/response/response.policies.types";

import { orchestrateRequestPolicies } from "@app/policies/request/orchestrator.request.policies";
import { orchestrateResponsePolicies } from "@app/policies/response/orchestrator.response.policies";

import { buildDocumentRender } from "@app/rendering/document/build.document";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const createNonce = (): string => {
  return crypto.randomUUID().replace(/-/g, "");
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
/* Response builders                                                          */
/* -------------------------------------------------------------------------- */

const buildDocumentInspectionResponse = (
  documentRender: ReturnType<typeof buildDocumentRender>,
  status: number,
): Response => {
  return new Response(JSON.stringify(documentRender, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "x-render-mode": "document-inspection",
    },
  });
};

const buildErrorDocument = (intent: ErrorRenderIntent, appState: AppState) => {
  const status = resolveRenderStatus(intent);
  const errorPage = appState.getErrorPageByStatus(status);

  const nonce = createNonce();
  const documentRender = buildDocumentRender(appState, errorPage, nonce);

  const response = buildDocumentInspectionResponse(documentRender, status);

  if (intent.kind !== "gone") {
    return { response, documentRender };
  }

  const headers = new Headers(response.headers);
  headers.set("x-runtime-policy", "gone");

  return {
    response: new Response(response.body, {
      status: response.status,
      headers,
    }),
    documentRender,
  };
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
    const outcome = orchestrateRequestPolicies(req, env, ctx, appState);

    /* ---------------- direct responses (redirect, canonical, method) -------- */

    if (outcome.type === "direct-response") {
      const context: ResponsePolicyContext = {
        response: outcome.response,
        responseKind: "direct",
        status: outcome.response.status,
        env,
      };

      return orchestrateResponsePolicies(context, appState);
    }

    /* ---------------- rendered error responses ------------------------------ */

    if (outcome.type === "render-error") {
      const { response, documentRender } = buildErrorDocument(
        outcome.intent,
        appState,
      );

      const context: ResponsePolicyContext = {
        response,
        responseKind: "document",
        status: response.status,
        documentRender,
        env,
      };

      return orchestrateResponsePolicies(context, appState);
    }

    /* ---------------- rendered page response -------------------------------- */

    const nonce = createNonce();
    const documentRender = buildDocumentRender(appState, outcome.page, nonce);

    const response = buildDocumentInspectionResponse(
      documentRender,
      outcome.status,
    );

    const context: ResponsePolicyContext = {
      response,
      responseKind: "document",
      status: response.status,
      documentRender,
      env,
    };

    return orchestrateResponsePolicies(context, appState);
  } catch {
    const { response, documentRender } = buildErrorDocument(
      { kind: "failure" },
      appState,
    );

    const context: ResponsePolicyContext = {
      response,
      responseKind: "document",
      status: response.status,
      documentRender,
      env,
    };

    return orchestrateResponsePolicies(context, appState);
  }
};
