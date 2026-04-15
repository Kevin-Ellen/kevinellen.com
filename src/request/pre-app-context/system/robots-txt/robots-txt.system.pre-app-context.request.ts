// src/request/pre-app-context/system/robots-txt/robots-txt.system.pre-app-context.request.ts

import type { AppState } from "@app-state/class.app-state";
import type { PreAppContextResult } from "@request/types/request.types";

import { resolveRobotsTxtSystem } from "@request/pre-app-context/system/robots-txt/robots-txt.resolver.system.pre-app-context.request";
import { renderRobotsTxtSystem } from "@request/pre-app-context/system/robots-txt/robots-txt.render.system.pre-app-context.request";

export const robotsTxtSystemOrchestrator = (
  req: Request,
  _env: Env,
  appState: AppState,
): PreAppContextResult | null => {
  const resolved = resolveRobotsTxtSystem(req, appState);

  if (!resolved) {
    return null;
  }

  return renderRobotsTxtSystem(resolved);
};
