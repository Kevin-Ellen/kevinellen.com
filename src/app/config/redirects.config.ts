// src/app/config/redirects.config.ts

import type { RedirectEntry } from "../life-cycle/request/config.request";

export const redirectsConfig = [
  { from: "/favicon.ico", to: "/assets/icons/favicon.ico", status: 301 },
] as const satisfies readonly RedirectEntry[];
