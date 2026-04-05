// src/app/appContext/resolvers/canonical.resolve.appContext.ts

import type { AppContextPage } from "@app/appContext/appContext.types";

import { getRuntimeBehaviour } from "@app/runtime/get.runtime.behaviour";

export const resolveCanonicalUrl = (
  env: Env,
  page: AppContextPage,
): string | null => {
  const runtime = getRuntimeBehaviour(env);

  if (!runtime.canonicalHost) {
    throw new Error(
      "Runtime canonical host is required when canonical is enabled",
    );
  }

  if (!("slug" in page.core)) {
    return null;
  }

  const url = new URL(`https://${runtime.canonicalHost}${page.core.slug}`);

  url.hash = "";
  url.search = "";

  return url.toString();
};
