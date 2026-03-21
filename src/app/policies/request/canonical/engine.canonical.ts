// src/app/policies/request/canonical/engine.canonical.ts

import type { PreRoutingOutcome } from "@app/request/request.types";
import type {
  CanonicalRedirectCode,
  CanonicalUrlParts,
} from "@app/policies/request/canonical/canonical.types";

const CANONICAL_REDIRECT_STATUS: CanonicalRedirectCode = 308;

const isProd = (env: Env): boolean => {
  return env.APP_ENV === "prod";
};

const getUrlParts = (req: Request): CanonicalUrlParts => {
  const url = new URL(req.url);

  return {
    protocol: url.protocol,
    hostname: url.hostname,
    port: url.port,
    pathname: url.pathname,
    search: url.search,
  };
};

const buildHost = (hostname: string, port: string): string => {
  return port ? `${hostname}:${port}` : hostname;
};

const resolveCanonicalHostname = (hostname: string, env: Env): string => {
  if (!isProd(env)) {
    return hostname;
  }

  if (!hostname.startsWith("www.")) {
    return hostname;
  }

  return hostname.replace(/^www\./, "");
};

const resolveCanonicalPathname = (pathname: string): string => {
  if (pathname === "/") {
    return "/";
  }

  const withoutTrailingSlash = pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;

  return withoutTrailingSlash.toLowerCase();
};

const buildCanonicalUrl = (parts: CanonicalUrlParts, env: Env): string => {
  const hostname = resolveCanonicalHostname(parts.hostname, env);
  const pathname = resolveCanonicalPathname(parts.pathname);
  const host = buildHost(hostname, parts.port);

  return `${parts.protocol}//${host}${pathname}${parts.search}`;
};

const hasCanonicalDifference = (
  req: Request,
  canonicalUrl: string,
): boolean => {
  return req.url !== canonicalUrl;
};

export const evaluateCanonicalPolicy = (
  req: Request,
  env: Env,
): PreRoutingOutcome => {
  const parts = getUrlParts(req);
  const canonicalUrl = buildCanonicalUrl(parts, env);

  if (!hasCanonicalDifference(req, canonicalUrl)) {
    return { type: "continue" };
  }

  return {
    type: "direct-response",
    response: new Response(null, {
      status: CANONICAL_REDIRECT_STATUS,
      headers: {
        location: canonicalUrl,
        "x-runtime-policy": "canonical",
      },
    }),
  };
};
