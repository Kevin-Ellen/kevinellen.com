// src/app/policies/request/request.policies.types.ts

import type { RedirectStatusCode } from "@config/redirects.config.types";

export type ErrorRenderIntent = "gone" | "internal-error";

export type RequestPolicyContinueOutcome = {
  kind: "continue";
};

export type RequestPolicyDirectResponseOutcome = {
  kind: "direct-response";
  response: Response;
};

export type RequestPolicyRedirectOutcome = {
  kind: "redirect";
  location: string;
  status: RedirectStatusCode;
};

export type RequestPolicyRenderErrorOutcome = {
  kind: "render-error";
  intent: ErrorRenderIntent;
};

export type RequestPolicyOutcome =
  | RequestPolicyContinueOutcome
  | RequestPolicyDirectResponseOutcome
  | RequestPolicyRedirectOutcome
  | RequestPolicyRenderErrorOutcome;

export type CanonicalResult = {
  url: URL;
  changed: boolean;
};

export type RequestSystemStageOutcome =
  | RequestPolicyContinueOutcome
  | RequestPolicyDirectResponseOutcome;
