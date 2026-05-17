// src/request/pre-app-context/redirects/system/system.redirects.resolve.pre-app-context.request.ts

import type { AppState } from "@app-state/class.app-state";
import type { SystemRedirectResolution } from "@request/pre-app-context/redirects/redirects.pre-app-context.request.types";

const isInternalRedirectTarget = (
  target: string,
  siteOrigin: string,
): boolean => {
  if (target.startsWith("/")) return true;

  try {
    return new URL(target).origin === siteOrigin;
  } catch {
    return false;
  }
};

export const resolveSystemRedirect = (
  url: URL,
  appState: AppState,
): SystemRedirectResolution => {
  const pathname = url.pathname;

  const siteOrigin = new URL(appState.siteConfig.origin).origin;

  const rule = appState.getRedirectRuleByPath(pathname);

  if (!rule) return null;

  return {
    kind: "redirect",
    redirectMatch: {
      fromPath: rule.fromPath,
      to: rule.to,
      redirectStatusCode: rule.redirectStatusCode,
      isInternal: isInternalRedirectTarget(rule.to, siteOrigin),
    },
  };
};
