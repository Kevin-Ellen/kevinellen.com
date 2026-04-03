// src/app/appContext/resolvers/canonical.resolve.appContext.ts

import type { AppState } from "@app/appState/class.appState";
import type { DocumentRenderTarget } from "@app/request/request.document.types";

import { getRuntimeBehaviour } from "@app/runtime/get.runtime.behaviour";

const buildCanonicalOrigin = (env: Env, appState: AppState): string => {
  const runtimeBehaviour = getRuntimeBehaviour(env);

  if (runtimeBehaviour.canonicalHost) {
    return `https://${runtimeBehaviour.canonicalHost}`;
  }

  return appState.getSiteConfig().siteUrl;
};

export const resolveCanonicalUrlAppContext = (
  env: Env,
  appState: AppState,
  target: DocumentRenderTarget,
): string | null => {
  if (target.kind !== "page") {
    return null;
  }

  const origin = buildCanonicalOrigin(env, appState);

  return new URL(target.page.core.slug, origin).toString();
};
