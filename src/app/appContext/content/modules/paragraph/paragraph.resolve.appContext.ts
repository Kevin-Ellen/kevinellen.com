// src/app/appContext/content/modules/paragraph/paragraph.resolve.appContext.ts

import type { AppContextParagraphModule } from "@app/appContext/content/modules/paragraph/paragraph.module.appContext.types";
import type { AppState } from "@app/appState/class.appState";
import type { ParagraphModuleAuthored } from "@shared-types/content/modules/paragraph/paragraph.module.types";

import { resolveInlineContentAppContext } from "@app/appContext/resolvers/inline-content.resolve.appContext";

export const resolveParagraphAppContext = (
  module: ParagraphModuleAuthored,
  appState: AppState,
): AppContextParagraphModule => {
  return {
    kind: "paragraph",
    content: resolveInlineContentAppContext(module.content, appState),
  };
};
