// src/request/pre-app-context/system/webmanifest/webmanifest.render.system.pre-app-context.request.ts

import type { PreAppContextResult } from "@request/types/request.types";
import type { AppStateWebManifest } from "@shared-types/config/webmanifest/app-state.webmanifest.types";

export const renderWebmanifestSystem = (
  manifest: AppStateWebManifest,
): PreAppContextResult => {
  return {
    kind: "direct-response",
    response: new Response(JSON.stringify(manifest, null, 2), {
      status: 200,
      headers: {
        "content-type": "application/manifest+json; charset=utf-8",
      },
    }),
  };
};
