// src/app/policies/request/request.policies.types.ts

import type { ErrorPageStatus } from "@shared-types/content/pages/error/error.page.definition";

export type ErrorRenderIntent = {
  status: ErrorPageStatus;
};

export type RequestPolicyContinueOutcome = {
  kind: "continue";
};

export type RequestPolicyDirectResponseOutcome = {
  kind: "direct-response";
  response: Response;
};

export type RequestPolicyRenderErrorOutcome = {
  kind: "render-error";
  intent: ErrorRenderIntent;
};

export type RequestPolicyOutcome =
  | RequestPolicyContinueOutcome
  | RequestPolicyDirectResponseOutcome
  | RequestPolicyRenderErrorOutcome;
