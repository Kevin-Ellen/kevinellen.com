// src/app/system/robots/resolve.robots.ts

import type { AppState } from "@app/appState/appState";
import type { RequestResolutionOutcome } from "@app/request/resolution/apply.resolution.types";

import { buildRobotsDocument } from "@app/system/robots/build.robots";
import { renderRobotsDocument } from "@app/system/robots/render.robots";

const isRobotsRequest = (req: Request): boolean => {
  const url = new URL(req.url);
  return url.pathname === "/robots.txt";
};

export const resolveRobotsRequest = (
  req: Request,
  appState: AppState,
): RequestResolutionOutcome => {
  if (!isRobotsRequest(req)) {
    return { type: "continue" };
  }

  const robotsDocument = buildRobotsDocument(appState);
  const body = renderRobotsDocument(robotsDocument);

  return {
    type: "direct-response",
    responseFormat: "text",
    response: new Response(body, {
      status: 200,
      headers: {
        "content-type": "text/plain; charset=utf-8",
      },
    }),
  };
};
