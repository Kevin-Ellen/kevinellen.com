// src/app/policies/request/run.request.system.stage.ts

import type { AppState } from "@app/appState/class.appState";
import type { SystemOutcome } from "@app/policies/request/system/request.system.types";

import { evaluateRobotsTxtRequestSystem } from "@app/policies/request/system/evaluate.robots-txt.request.system";
import { evaluateSitemapXmlRequestSystem } from "@app/policies/request/system/evaluate.sitemap-xml.request.system";
import { evaluateWebManifestRequestSystem } from "@app/policies/request/system/evaluate.webmanifest.request.system";

export const runRequestSystemStage = (
  req: Request,
  env: Env,
  appState: AppState,
): SystemOutcome => {
  const robotsOutcome = evaluateRobotsTxtRequestSystem(req, env, appState);

  if (robotsOutcome.kind === "direct-response") {
    return robotsOutcome;
  }

  const sitemapOutcome = evaluateSitemapXmlRequestSystem(req, env, appState);

  if (sitemapOutcome.kind === "direct-response") {
    return sitemapOutcome;
  }

  const manifestOutcome = evaluateWebManifestRequestSystem(req, env, appState);

  if (manifestOutcome.kind === "direct-response") {
    return manifestOutcome;
  }

  return { kind: "continue" };
};
