// src/app-render-context/resolve/body-content/inline/strong.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextStrongInlineContent } from "@shared-types/page-content/inline/strong/app-context.strong.inline-content.page-content.types";
import type { AppRenderContextStrongInlineContent } from "@shared-types/page-content/inline/strong/app-render-context.strong.inline-content.page-content.types";

import { resolveInlineContentModuleAppRenderContext } from "@app-render-context/resolve/body-content/inline/inline.resolve.app-render-context";

export const resolveStrongInlineContentAppRenderContext = (
  appContext: AppContext,
  module: AppContextStrongInlineContent,
): AppRenderContextStrongInlineContent => {
  return {
    ...module,
    content: module.content.map((item) =>
      resolveInlineContentModuleAppRenderContext(appContext, item),
    ),
  };
};
