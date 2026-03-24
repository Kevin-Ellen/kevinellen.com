// src/app/request/resolution/redirects/apply.request.resolution.ts

import type { AppState } from "@app/appState/appState";
import type { RequestResolutionOutcome } from "@app/request/resolution/apply.resolution.types";

import { redirectRules } from "@app/request/resolution/redirects/rules.redirects";
import { applyRedirectResolution } from "@app/request/resolution/redirects/apply.redirects";
import { applyGoneResolution } from "@app/request/resolution/gone/apply.gone";

import { resolveRobotsRequest } from "@app/system/robots/resolve.robots";
import { resolveXmlSitemapRequest } from "@app/system/xml-sitemap/resolve.xml-sitemap";
import { resolveWebManifestRequest } from "@app/system/webmanifest/resolve.webmanifest";

export const applyRequestResolution = async (
  req: Request,
  env: Env,
  _ctx: ExecutionContext,
  appState: AppState,
): Promise<RequestResolutionOutcome> => {
  // 1. Redirects
  const redirectOutcome = applyRedirectResolution(req, redirectRules);
  if (redirectOutcome.type !== "continue") {
    return redirectOutcome;
  }

  // 2. Gone
  const goneOutcome = applyGoneResolution(req);
  if (goneOutcome.type !== "continue") {
    return goneOutcome;
  }

  // 3. System routes
  const robotsOutcome = resolveRobotsRequest(req, appState);
  if (robotsOutcome.type !== "continue") {
    return robotsOutcome;
  }

  const sitemapOutcome = resolveXmlSitemapRequest(req, appState);
  if (sitemapOutcome.type !== "continue") return sitemapOutcome;

  const webManifestOutcome = resolveWebManifestRequest(req, appState);
  if (webManifestOutcome.type !== "continue") {
    return webManifestOutcome;
  }

  return { type: "continue" };
};
