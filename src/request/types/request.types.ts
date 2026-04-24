// src/request/types/request.types.ts

import type { RedirectMatch } from "@request/pre-app-context/redirects/redirects.pre-app-context.request.types";
import type { ErrorPageStatus } from "@shared-types/page-definitions/shared/shared.error.page-definition.types";
import type { PageIdPublic } from "@shared-types/page-definitions/shared/shared.page-id.page-definition.types";

export type RequestResult =
  | { kind: "continue" }
  | { kind: "direct-response"; response: Response }
  | { kind: "redirect"; redirectMatch: RedirectMatch }
  | { kind: "error"; status: ErrorPageStatus }
  | { kind: "found"; publicPageId: PageIdPublic };

export type PreRequestResult = Response | null;

export type PreAppContextResult = Extract<
  RequestResult,
  { kind: "continue" } | { kind: "direct-response" } | { kind: "error" }
>;

export type RoutingResult = Extract<
  RequestResult,
  { kind: "found" } | { kind: "error" }
>;
