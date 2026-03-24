// src/app/request/resolution/apply.resolution.types

import type { ErrorRenderIntent } from "@app/request/request.types";

export type DirectResponseFormat = "text" | "json" | "xml" | "binary";

export type ContinueResolutionOutcome = {
  type: "continue";
};

export type DirectResponseOutcome = {
  type: "direct-response";
  response: Response;
  responseFormat: DirectResponseFormat;
};

export type RenderErrorOutcome = {
  type: "render-error";
  intent: ErrorRenderIntent;
};

export type RequestResolutionOutcome =
  | ContinueResolutionOutcome
  | DirectResponseOutcome
  | RenderErrorOutcome;
