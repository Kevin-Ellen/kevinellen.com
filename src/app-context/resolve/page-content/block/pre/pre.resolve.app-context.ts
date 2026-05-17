// src/app-context/resolve/page-content/block/pre/pre.resolve.app-context.ts

import type { AppStatePreBlock } from "@shared-types/page-content/block/pre/app-state.pre.block.types";
import type { AppContextPreBlock } from "@shared-types/page-content/block/pre/app-context.pre.block.types";

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";

export const appContextResolvePreBlock = (
  module: AppStatePreBlock,
  _context: AppContextPageContentResolverContext,
): AppContextPreBlock => {
  return module;
};
