// src/request/pre-app-context/system/sitemap-xml/xml-sitemap.system.pre-app-context.request.ts

import type { AppState } from "@app-state/class.app-state";
import type { PreAppContextResult } from "@request/types/request.types";

import { resolveXmlSitemapSystem } from "@request/pre-app-context/system/sitemap-xml/xml-sitemap.resolver.system.pre-app-context.request";
import { renderXmlSitemapSystem } from "@request/pre-app-context/system/sitemap-xml/xml-sitemap.render.system.pre-app-context.request";

export const xmlSitemapSystemOrchestrator = (
  req: Request,
  _env: Env,
  appState: AppState,
): PreAppContextResult | null => {
  const resolved = resolveXmlSitemapSystem(req, appState);

  if (!resolved) {
    return null;
  }

  return renderXmlSitemapSystem(resolved);
};
