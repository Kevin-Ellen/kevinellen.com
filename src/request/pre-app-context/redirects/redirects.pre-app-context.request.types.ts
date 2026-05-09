// src/request/pre-app-context/redirects/redirects.pre-app-context.request.types.ts

import type { SystemRedirectRule } from "@shared-types/config/system/redirect-rules.system.types";

type RedirectMatchAdditionalFields = Readonly<{
  isInternal: boolean;
}>;

export type RedirectMatch = Readonly<
  SystemRedirectRule & RedirectMatchAdditionalFields
>;

export type SystemRedirectResolution = {
  kind: "redirect";
  redirectMatch: RedirectMatch;
} | null;
