// src/app/policies/request/system/evaluate.sitemap-xml.request.system.ts

import type { AppState } from "@app/appState/class.appState";
import type { RequestSystemStageOutcome } from "@app/policies/request/request.policies.types";

import { buildSitemapXmlSystem } from "@app/policies/request/system/build.sitemap-xml.request.system";

export const evaluateSitemapXmlRequestSystem = (
  req: Request,
  _env: Env,
  appState: AppState,
): RequestSystemStageOutcome => {
  const { pathname } = new URL(req.url);

  if (pathname !== "/sitemap.xml") {
    return { kind: "continue" };
  }

  const body = buildSitemapXmlSystem(appState);

  return {
    kind: "direct-response",
    response: new Response(body, {
      status: 200,
      headers: {
        "content-type": "application/xml; charset=utf-8",
      },
    }),
  };
};
