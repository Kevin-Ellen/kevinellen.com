// src/app/policies/request/system/evaluate.robots-txt.request.system.ts

import type { AppState } from "@app/appState/class.appState";
import type { SystemOutcome } from "@app/policies/request/system/request.system.types";

import { buildRobotsTxtRequestSystem } from "@app/policies/request/system/build.robots-txt.request.system";

export const evaluateRobotsTxtRequestSystem = (
  req: Request,
  _env: Env,
  appState: AppState,
): SystemOutcome => {
  const { pathname } = new URL(req.url);

  if (pathname !== "/robots.txt") {
    return { kind: "continue" };
  }

  const body = buildRobotsTxtRequestSystem(appState);

  return {
    kind: "direct-response",
    response: new Response(body, {
      status: 200,
      headers: {
        "content-type": "text/plain; charset=utf-8",
      },
    }),
  };
};
