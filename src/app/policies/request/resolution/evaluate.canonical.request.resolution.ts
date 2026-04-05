// src/app/policies/request/resolution/evaluate.canonical.request.resolution.ts

import type { CanonicalResult } from "@app/policies/request/resolution/request.resolution.types";
import type { RuntimeBehaviour } from "@app/runtime/runtime.types";

export const evaluateCanonicalRequestResolution = (
  inputUrl: URL,
  runtime: RuntimeBehaviour,
): CanonicalResult => {
  let changed = false;

  const url = new URL(inputUrl.toString());

  /* -------------------------------------------------------------------------- */
  /* Host canonicalisation                                                      */
  /* -------------------------------------------------------------------------- */

  if (
    runtime.canonical &&
    runtime.canonicalHost &&
    url.hostname !== runtime.canonicalHost
  ) {
    url.hostname = runtime.canonicalHost;
    changed = true;
  }

  /* -------------------------------------------------------------------------- */
  /* Path canonicalisation                                                      */
  /* -------------------------------------------------------------------------- */

  const lowerPath = url.pathname.toLowerCase();
  if (url.pathname !== lowerPath) {
    url.pathname = lowerPath;
    changed = true;
  }

  if (url.pathname !== "/" && url.pathname.endsWith("/")) {
    url.pathname = url.pathname.slice(0, -1);
    changed = true;
  }

  return {
    url,
    changed,
  };
};
