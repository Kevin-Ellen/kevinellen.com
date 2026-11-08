// src/app/life-cycle/request/config.request.ts

import type { RedirectStatus } from "../../types/system/redirects.system.type";

import { redirectsConfig } from "../../config/redirects.config";

type TrailingSlash = "preserve" | "remove" | "add";

export type RedirectEntry = Readonly<{
  from: string;
  to: string;
  status?: RedirectStatus;
}>;

export type RequestConfig = Readonly<{
  allowedMethods: readonly string[];
  trailingSlash: TrailingSlash;
  redirects: readonly RedirectEntry[];
  defaultRedirectStatus: RedirectStatus;
}>;

export const requestConfig = {
  allowedMethods: ["GET", "HEAD"],
  trailingSlash: "remove",
  redirects: redirectsConfig,
  defaultRedirectStatus: 308,
} as const satisfies RequestConfig;
