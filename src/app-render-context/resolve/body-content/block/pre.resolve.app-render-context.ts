// src/app-render-context/resolve/body-content/block/pre.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextPreBlockContentModule } from "@shared-types/page-content/block/pre/app-context.pre.block.page-content.types";
import type { AppRenderContextPreBlockContentModule } from "@shared-types/page-content/block/pre/app-render-context.pre.block.page-content.types";

export const resolvePreBlockContentModuleAppRenderContext = (
  _appContext: AppContext,
  module: AppContextPreBlockContentModule,
): AppRenderContextPreBlockContentModule => {
  return module;
};
