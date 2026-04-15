// src/request/pre-app-context/system/system.pre-app-context.request.ts

import type { AppState } from "@app-state/class.app-state";
import type { RequestResult } from "@request/types/request.types";

import { robotsTxtSystemOrchestrator } from "@request/pre-app-context/system/robots-txt/robots-txt.system.pre-app-context.request";
import { xmlSitemapSystemOrchestrator } from "@request/pre-app-context/system/sitemap-xml/xml-sitemap.system.pre-app-context.request";
import { webmanifestSystemOrchestrator } from "@request/pre-app-context/system/webmanifest/webmanifest.system.pre-app-context.request";

export const preAppContextSystemOrchestrator = (
  req: Request,
  env: Env,
  appState: AppState,
): RequestResult | null => {
  const robotsTxtResult = robotsTxtSystemOrchestrator(req, env, appState);

  if (robotsTxtResult) {
    return robotsTxtResult;
  }

  const xmlSitemapResult = xmlSitemapSystemOrchestrator(req, env, appState);

  if (xmlSitemapResult) {
    return xmlSitemapResult;
  }

  const webmanifestResult = webmanifestSystemOrchestrator(req, env, appState);

  if (webmanifestResult) {
    return webmanifestResult;
  }

  return null;
};
