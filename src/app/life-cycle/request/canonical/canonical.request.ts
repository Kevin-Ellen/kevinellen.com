// src/app/life-cycle/request/canonical/canonical.request.ts

import type { RequestConfig } from "../config.request";

type Input = Readonly<{
  url: URL;
  domain: string;
  config: RequestConfig;
}>;

const normaliseDefaultPagination = (pathname: string): string => {
  if (!/^\/(topics|journal)(?:\/|$)/.test(pathname)) {
    return pathname;
  }

  return pathname.replace(/\/page-1$/, "");
};

export const resolveCanonical = ({ url, domain, config }: Input): URL => {
  const canonical = new URL(url);
  const origin = new URL(domain);

  // Canonical domain and protocol
  canonical.protocol = origin.protocol;
  canonical.host = origin.host;

  // Normalise trailing slashes before pagination
  if (canonical.pathname !== "/") {
    canonical.pathname = canonical.pathname.replace(/\/+$/, "");
  }

  // Remove default pagination
  canonical.pathname = normaliseDefaultPagination(canonical.pathname);

  // Apply final trailing slash policy
  if (config.trailingSlash === "add" && canonical.pathname !== "/") {
    canonical.pathname += "/";
  }

  return canonical;
};
