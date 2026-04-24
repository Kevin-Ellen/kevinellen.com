// shared-types/config/site-config/app-render-context.preload.config.types.ts

import type { AppContextPreload } from "@shared-types/config/site-config/app-context.preload.config.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

export type AppRenderContextPreloadAsset = Replace<
  AppContextPreload[number],
  Readonly<{
    rel: "preload";
  }>
>;

export type AppRenderContextPreload = readonly AppRenderContextPreloadAsset[];
