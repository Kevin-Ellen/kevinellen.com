// src/request/pre-app-context/gone/gone.resolve.pre-app-context.request.ts

import type { AppState } from "@app-state/class.app-state";
import type { PreAppContextResult } from "@request/types/request.types";

export const preAppContextResolveGone = (
  req: Request,
  appState: AppState,
): PreAppContextResult | null => {
  const url = new URL(req.url);
  const pathname = url.pathname;

  const hasMatch = appState.getGoneRuleByPath(pathname);

  if (hasMatch) {
    return { kind: "error", status: 410 };
  }

  return null;
};
