// src/request/types/request.types.ts

import type { RedirectMatch } from "@request/pre-app-context/redirects/redirects.pre-app-context.request.types";
import type { ErrorPageStatus } from "@shared-types/pages/error/status.error.page.types";
import type { PageIdPublic } from "@shared-types/pages/shared/id.shared.page.types";

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
