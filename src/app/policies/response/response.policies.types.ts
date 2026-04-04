// src/app/policies/response/response.policies.types.ts

import type { AppState } from "@app/appState/class.appState";
import type { DocumentRenderTarget } from "@app/request/request.document.types";

export type ResponsePolicySecurity = {
  nonce: string;
};

export type ResponsePolicyContext = {
  req: Request;
  env: Env;
  appState: AppState;
  target: DocumentRenderTarget;
  security: ResponsePolicySecurity;
};

export type ResponsePolicy = (
  context: ResponsePolicyContext,
  response: Response,
) => Response;
