// src/request/pre-app-context/gone/gone.resolve.pre-app-context.request.ts

import type { AppState } from "@app-state/class.app-state";
import type { PreAppContextResult } from "@request/pre-app-context/types/pre-app-context.request.types";

export const preAppContextResolveGone = (
  req: Request,
  appState: AppState,
): PreAppContextResult | null => {
  const url = new URL(req.url);
  const pathname = url.pathname;

  const rules = appState.goneRules;

  const hasMatch = rules.some((rule) => rule.path === pathname);

  if (hasMatch) {
    return { kind: "gone" };
  }

  return null;
};
