// src/request/pre-app-context/redirects/redirects.pre-app-context.request.types.ts

import type { SystemRedirectRule } from "@shared-types/config/system/redirect-rules.system.types";

type RedirectMatchAdditionaFields = Readonly<{
  isInternal: boolean;
}>;

export type RedirectMatch = Readonly<
  SystemRedirectRule & RedirectMatchAdditionaFields
>;

export type SystemRedirectResolution = {
  kind: "redirect";
  redirectMatch: RedirectMatch;
} | null;
