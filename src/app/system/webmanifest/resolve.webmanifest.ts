// src/app/system/webmanifest/resolve.webmanifest.ts

import type { AppState } from "@app/appState/appState";
import type { RequestResolutionOutcome } from "@app/request/resolution/apply.resolution.types";

import { buildWebManifest } from "@app/system/webmanifest/build.webmanifest";
import { renderWebManifest } from "@app/system/webmanifest/render.webmanifest";

const isWebManifestRequest = (req: Request): boolean => {
  const url = new URL(req.url);
  return url.pathname === "/site.webmanifest";
};

export const resolveWebManifestRequest = (
  req: Request,
  appState: AppState,
): RequestResolutionOutcome => {
  if (!isWebManifestRequest(req)) {
    return { type: "continue" };
  }

  const manifest = buildWebManifest(appState);
  const body = renderWebManifest(manifest);

  return {
    type: "direct-response",
    responseFormat: "json",
    response: new Response(body, {
      status: 200,
      headers: {
        "content-type": "application/manifest+json; charset=utf-8",
      },
    }),
  };
};
