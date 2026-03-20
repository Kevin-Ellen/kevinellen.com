// src/app/policies/redirects/rules.redirects.ts

import type { RedirectRules } from "@app/policies/redirects/redirects.types";

export const redirectRules: RedirectRules = [
  { fromPath: "/old", toPath: "/new", status: 308 },
] as const;
