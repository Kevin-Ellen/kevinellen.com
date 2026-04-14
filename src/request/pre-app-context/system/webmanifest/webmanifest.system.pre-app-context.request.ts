// src/request/pre-app-context/system/webmanifest/webmanifest.system.pre-app-context.request.ts

import type { AppState } from "@app-state/class.app-state";
import type { PreAppContextResult } from "@request/pre-app-context/types/pre-app-context.request.types";

import { resolveWebmanifestSystem } from "@request/pre-app-context/system/webmanifest/webmanifest.resolver.system.pre-app-context.request";
import { renderWebmanifestSystem } from "@request/pre-app-context/system/webmanifest/webmanifest.render.system.pre-app-context.request";

export const webmanifestSystemOrchestrator = (
  req: Request,
  _env: Env,
  appState: AppState,
): PreAppContextResult | null => {
  const resolved = resolveWebmanifestSystem(req, appState);

  if (!resolved) {
    return null;
  }

  return renderWebmanifestSystem(resolved);
};
