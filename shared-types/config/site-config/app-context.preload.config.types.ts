// shared-types/config/site-config/app-context.preload.config.types.ts

import type { AppStatePreload } from "@shared-types/config/site-config/app-state.site-config.types";

export type AppContextPreloadAsset = AppStatePreload[number];
export type AppContextPreload = readonly AppContextPreloadAsset[];
