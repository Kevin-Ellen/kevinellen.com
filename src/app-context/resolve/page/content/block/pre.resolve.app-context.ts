// src/app-context/resolve/page/content/block/pre.resolve.app-context.ts

import type { AppStatePreBlockContentModule } from "@shared-types/page-content/block/pre/app-state.pre.block.page-content.types";
import type { AppContextPreBlockContentModule } from "@shared-types/page-content/block/pre/app-context.pre.block.page-content.types";

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";

export const appContextResolvePreBlockContentModule = (
  module: AppStatePreBlockContentModule,
  _context: AppContextPageContentResolverContext,
): AppContextPreBlockContentModule => {
  return module;
};
