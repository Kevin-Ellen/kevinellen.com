// src/app/appContext/resolvers/canonical.resolve.appContext.ts

import type { PublicPage } from "@shared-types/content/pages/public/public.page.union";

import { getRuntimeBehaviour } from "@app/runtime/get.runtime.behaviour";

export const resolveCanonicalUrl = (env: Env, page: PublicPage): string => {
  const runtime = getRuntimeBehaviour(env);

  if (!runtime.canonicalHost) {
    throw new Error(
      "Runtime canonical host is required when canonical is enabled",
    );
  }

  const url = new URL(`https://${runtime.canonicalHost}${page.core.slug}`);

  url.hash = "";
  url.search = "";

  return url.toString();
};
