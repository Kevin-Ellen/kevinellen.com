// src/request/pre-app-context/gone/gone.resolve.pre-app-context.request.ts

import type { AppState } from "@app-state/class.app-state";
import type { RequestResult } from "@request/types/request.types";

export const preAppContextResolveGone = (
  req: Request,
  appState: AppState,
): RequestResult | null => {
  const url = new URL(req.url);
  const pathname = url.pathname;

  const rules = appState.goneRules;

  const hasMatch = rules.some((rule) => rule.path === pathname);

  if (hasMatch) {
    return { kind: "error", status: 410 };
  }

  return null;
};
