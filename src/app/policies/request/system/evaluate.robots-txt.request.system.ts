// src/app/policies/request/system/evaluate.robots-txt.request.system.ts

import type { AppState } from "@app/appState/class.appState";
import type { RequestSystemStageOutcome } from "@app/policies/request/request.policies.types";

import { buildRobotsTxtRequestSystem } from "@app/policies/request/system/build.robots-txt.request.system";

export const evaluateRobotsTxtRequestSystem = (
  req: Request,
  _env: Env,
  appState: AppState,
): RequestSystemStageOutcome => {
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
