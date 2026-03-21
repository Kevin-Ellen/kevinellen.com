// src/app/policies/request/redirects/rules.redirects.ts

import type { RedirectRules } from "@app/policies/request/redirects/redirects.types";

export const redirectRules: RedirectRules = [
  { fromPath: "/old", toPath: "/new", status: 308 },
] as const;
