// src/request/pre-app-context/pre-app-context.request.ts

import type { AppState } from "@app-state/class.app-state";
import type { PreAppContextResult } from "@request/types/request.types";

import { preAppContextResolveGone } from "@request/pre-app-context/gone/gone.resolve.pre-app-context.request";
import { preAppContextResolveRedirects } from "@request/pre-app-context/redirects/redirects.resolve.pre-app-context.request";
import { preAppContextSystemOrchestrator } from "@request/pre-app-context/system/system.pre-app-context.request";

export const preAppContextOrchestrator = async (
  req: Request,
  env: Env,
  appState: AppState,
): Promise<PreAppContextResult> => {
  // gone
  const goneResult = preAppContextResolveGone(req, appState);
  if (goneResult) return goneResult;

  // redirect rules
  const redirectResult = preAppContextResolveRedirects(req, env, appState);
  if (redirectResult) return redirectResult;

  // system
  const systemResult = preAppContextSystemOrchestrator(req, env, appState);
  if (systemResult) return systemResult;

  return { kind: "continue" };
};
