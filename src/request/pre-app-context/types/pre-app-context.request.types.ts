// src/request/pre-app-context/types/pre-app-context.request.types.ts

import type { RedirectMatch } from "@request/pre-app-context/redirects/redirects.pre-app-context.request.types";

export type PreAppContextResult =
  | { kind: "continue" }
  | { kind: "direct-response"; response: Response }
  | { kind: "redirect"; redirectMatch: RedirectMatch }
  | { kind: "system"; system: "robots" | "manifest" | "sitemap" }
  | { kind: "gone" };
