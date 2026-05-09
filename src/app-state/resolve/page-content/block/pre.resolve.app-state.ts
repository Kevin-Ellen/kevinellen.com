// src/app-state/resolve/page-content/block/pre.resolve.app-state.ts

import type { AuthoredPreBlock } from "@shared-types/page-content/block/pre/authored.pre.block.types";
import type { AppStatePreBlock } from "@shared-types/page-content/block/pre/app-state.pre.block.types";

export const appStateResolvePreBlock = (
  module: AuthoredPreBlock,
): AppStatePreBlock => {
  return {
    ...module,
    flow: module.flow ?? "content",
  };
};
