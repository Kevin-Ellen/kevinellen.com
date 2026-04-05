// src/app/policies/request/resolution/request.resolution.types.ts

import type { ErrorRenderIntent } from "@app/policies/request/request.policies.types";

export type CanonicalResult = {
  url: URL;
  changed: boolean;
};

export type RequestResolutionStageContinueOutcome = {
  kind: "continue";
};

export type RequestResolutionStageDirectResponseOutcome = {
  kind: "direct-response";
  response: Response;
};

export type RequestResolutionStageRenderErrorOutcome = {
  kind: "render-error";
  intent: ErrorRenderIntent;
};

export type RequestResolutionStageRedirectOutcome = {
  kind: "redirect";
  location: string;
  status: 301 | 302 | 307 | 308;
};

export type ResolutionOutcome =
  | RequestResolutionStageContinueOutcome
  | RequestResolutionStageDirectResponseOutcome
  | RequestResolutionStageRenderErrorOutcome
  | RequestResolutionStageRedirectOutcome;
