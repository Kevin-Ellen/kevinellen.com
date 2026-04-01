// src/app/policies/request/system/evaluate.webmanifest.request.system.ts

import type { AppState } from "@app/appState/class.appState";
import type { RequestSystemStageOutcome } from "@app/policies/request/request.policies.types";

import { buildWebManifestSystem } from "@app/policies/request/system/build.webmanifest.request.system";

export const evaluateWebManifestRequestSystem = (
  req: Request,
  _env: Env,
  appState: AppState,
): RequestSystemStageOutcome => {
  const { pathname } = new URL(req.url);

  if (pathname !== "/manifest.webmanifest") {
    return { kind: "continue" };
  }

  const body = buildWebManifestSystem(appState);

  return {
    kind: "direct-response",
    response: new Response(body, {
      status: 200,
      headers: {
        "content-type": "application/manifest+json; charset=utf-8",
      },
    }),
  };
};
