// src/app/policies/request/resolution/evaluate.redirect.request.resolution.ts

import type { AppState } from "@app/appState/class.appState";
import type { ResolutionOutcome } from "@app/policies/request/resolution/request.resolution.types";

const isInternalRedirectTarget = (
  target: string,
  siteOrigin: string,
): boolean => {
  if (target.startsWith("/")) {
    return true;
  }

  try {
    const targetUrl = new URL(target);
    return targetUrl.origin === siteOrigin;
  } catch {
    return false;
  }
};

export const evaluateRedirectRequestResolution = (
  request: Request,
  appState: AppState,
): ResolutionOutcome => {
  const redirects = appState.redirects;
  const siteOrigin = new URL(appState.site.siteUrl).origin;

  const url = new URL(request.url);
  const pathname = url.pathname;

  const rule = redirects.find((r) => r.fromPath === pathname);

  if (!rule) {
    return { kind: "continue" };
  }

  if (!isInternalRedirectTarget(rule.to, siteOrigin)) {
    return {
      kind: "direct-response",
      response: new Response(null, {
        status: rule.redirectStatusCode,
        headers: {
          location: rule.to,
          "x-runtime-policy": "redirect",
        },
      }),
    };
  }

  return {
    kind: "redirect",
    location: rule.to,
    status: rule.redirectStatusCode,
  };
};
