// src/request/pre-app-context/types/pre-app-context.request.types.ts

import type { RedirectMatch } from "@request/pre-app-context/redirects/redirects.pre-app-context.request.types";
import type { ErrorPageStatus } from "@shared-types/pages/error/status.error.page.types";

export type RequestResult =
  | { kind: "continue" }
  | { kind: "direct-response"; response: Response }
  | { kind: "redirect"; redirectMatch: RedirectMatch }
  | { kind: "error"; status: ErrorPageStatus };
