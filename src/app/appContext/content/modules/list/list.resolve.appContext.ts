// src/app/appContext/content/modules/list/list.resolve.appContext.ts

import type { AppContextListModule } from "@app/appContext/content/modules/list/list.module.appContext.types";
import type { ListModuleAuthored } from "@shared-types/content/modules/list/list.module.types";
import type { AppContextModuleResolverDependencies } from "@app/appContext/content/modules/module.registry.appContext";

import { resolveInlineContentAppContext } from "@app/appContext/resolvers/inline-content.resolve.appContext";

export const resolveListAppContext = (
  module: ListModuleAuthored,
  dependencies: AppContextModuleResolverDependencies,
): AppContextListModule => {
  return {
    kind: "list",
    style: module.style ?? "unordered",
    items: module.items.map((item) => ({
      content: resolveInlineContentAppContext(
        item.content,
        dependencies.appState,
      ),
    })),
  };
};
