// src/request/pre-app-context/redirects/redirects.resolve.pre-app-context.request.ts

import type { AppState } from "@app-state/class.app-state";
import type { PreAppContextResult } from "@request/types/request.types";

import { resolveSystemRedirect } from "@request/pre-app-context/redirects/system/system.redirects.resolve.pre-app-context.request";
import { resolveCanonicalUrl } from "@request/pre-app-context/redirects/canonical/canonical.redirects.resolve.pre-app-context.request";

export const preAppContextResolveRedirects = (
  req: Request,
  env: Env,
  appState: AppState,
): PreAppContextResult | null => {
  const originalUrl = new URL(req.url);
  let effectiveUrl = new URL(req.url);
  let redirectStatus = 308;

  const systemRedirect = resolveSystemRedirect(effectiveUrl, appState);

  if (systemRedirect?.kind === "redirect") {
    if (!systemRedirect.redirectMatch.isInternal) {
      return {
        kind: "direct-response",
        response: new Response(null, {
          status: systemRedirect.redirectMatch.redirectStatusCode,
          headers: {
            location: systemRedirect.redirectMatch.to,
            "x-runtime-redirect": "true",
          },
        }),
      };
    }

    effectiveUrl = new URL(
      systemRedirect.redirectMatch.to,
      effectiveUrl.origin,
    );
    redirectStatus = systemRedirect.redirectMatch.redirectStatusCode;
  }

  const canonicalUrl = resolveCanonicalUrl(effectiveUrl, appState, env);

  if (canonicalUrl.href === originalUrl.href) {
    return null;
  }

  return {
    kind: "direct-response",
    response: new Response(null, {
      status: redirectStatus,
      headers: {
        location: canonicalUrl.href,
        "x-runtime-redirect": "true",
      },
    }),
  };
};
