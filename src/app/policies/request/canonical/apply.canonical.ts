// src/app/policies/request/canonical/apply.canonical.ts

import type { RequestPolicyOutcome } from "@app/policies/request/request.policies.types";
import type {
  CanonicalRedirectCode,
  CanonicalUrlParts,
} from "@app/policies/request/canonical/canonical.types";

import { getRuntimeBehaviour } from "@utils/runtimeEnv.util";

const CANONICAL_REDIRECT_STATUS: CanonicalRedirectCode = 308;

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
  const runtime = getRuntimeBehaviour(env);

  if (!runtime.canonical || !hostname.startsWith("www.")) {
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

export const applyCanonicalPolicy = (
  req: Request,
  env: Env,
): RequestPolicyOutcome => {
  const parts = getUrlParts(req);
  const canonicalUrl = buildCanonicalUrl(parts, env);

  if (req.url === canonicalUrl) {
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
