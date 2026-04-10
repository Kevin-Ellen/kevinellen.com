// src/app/appContext/content/modules/paragraph/paragraph.resolve.appContext.ts

import type { AppContextParagraphModule } from "@app/appContext/content/modules/paragraph/paragraph.module.appContext.types";
import type { ParagraphModuleAuthored } from "@shared-types/content/modules/paragraph/paragraph.module.types";
import type { AppContextModuleResolverDependencies } from "@app/appContext/content/modules/module.registry.appContext";

import { resolveInlineContentAppContext } from "@app/appContext/resolvers/inline-content.resolve.appContext";

export const resolveParagraphAppContext = (
  module: ParagraphModuleAuthored,
  dependencies: AppContextModuleResolverDependencies,
): AppContextParagraphModule => {
  return {
    kind: "paragraph",
    content: resolveInlineContentAppContext(
      module.content,
      dependencies.appState,
    ),
  };
};
