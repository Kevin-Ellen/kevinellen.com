// src/app-state/resolve/page-content/block/pre.resolve.app-state.ts

import type { AuthoredPreBlockContentModule } from "@shared-types/page-content/block/pre/authored.pre.block.page-content.types";
import type { AppStatePreBlockContentModule } from "@shared-types/page-content/block/pre/app-state.pre.block.page-content.types";

export const appStateResolvePreBlockContentModule = (
  module: AuthoredPreBlockContentModule,
): AppStatePreBlockContentModule => {
  return module;
};
