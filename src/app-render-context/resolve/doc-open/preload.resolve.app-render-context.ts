// src/app-render-context/resolve/doc-open/preload.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type {
  AppRenderContextPreload,
  AppRenderContextPreloadAsset,
} from "@shared-types/config/site-config/app-render-context.preload.config.types";

export const resolvePreloadAppRenderContext = (
  appContext: AppContext,
): AppRenderContextPreload => {
  return appContext.preload.map<AppRenderContextPreloadAsset>((asset) => ({
    ...asset,
    rel: "preload",
  }));
};
