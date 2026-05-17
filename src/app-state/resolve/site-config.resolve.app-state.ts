// src/app-state/resolve/site-config.resolve.app-state.ts

import type { AppStateSiteConfig } from "@shared-types/config/site-config/app-state.site-config.types";

import { appStateSiteConfigAuthored } from "@app-state/config/site-config/authored.site-config.app-state";
import { deepFreeze } from "@utils/deepFreeze.util";

const resolveSiteHost = (env: Env): string => {
  if (!env.APP_HOST) {
    throw new Error("AppState site config: APP_HOST is not set.");
  }

  return env.APP_HOST;
};

export const appStateResolveSiteConfig = (env: Env): AppStateSiteConfig => {
  const host = resolveSiteHost(env);

  return deepFreeze({
    ...appStateSiteConfigAuthored,
    preload: appStateSiteConfigAuthored.preload ?? [],
    host,
    origin: `https://${host}`,
  });
};
