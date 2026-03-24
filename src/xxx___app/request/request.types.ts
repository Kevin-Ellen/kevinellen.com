// src/app/request/request.types.ts

import type { PageDefinition } from "@app/pages/page.definition";

export type RouteResult =
  | { kind: "found"; page: PageDefinition }
  | { kind: "not-found" };

export type ErrorRenderIntent =
  | { kind: "not-found" } // routing stage
  | { kind: "gone" } // pre-routing stage
  | { kind: "failure" }; // failure stage

export type PreRoutingOutcome =
  | { type: "continue" }
  | { type: "direct-response"; response: Response }
  | { type: "render-error"; intent: { kind: "gone" } };
