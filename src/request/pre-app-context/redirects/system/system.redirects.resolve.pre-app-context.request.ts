// src/request/pre-app-context/redirects/system/system.redirects.resolve.pre-app-context.request.ts

import type { AppState } from "@app-state/class.app-state";
import type { PreAppContextResult } from "@request/types/request.types";

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
): PreAppContextResult | null => {
  const pathname = url.pathname;

  const redirects = appState.redirectRules;
  const siteOrigin = new URL(appState.siteConfig.origin).origin;

  const rule = redirects.find((r) => r.fromPath === pathname);

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
