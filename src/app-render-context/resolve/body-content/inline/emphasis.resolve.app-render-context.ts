import type { AppContext } from "@app-context/class.app-context";
import type { AppContextEmphasisInlineContent } from "@shared-types/page-content/inline/emphasis/app-context.emphasis.inline-content.page-content.types";
import type { AppRenderContextEmphasisInlineContent } from "@shared-types/page-content/inline/emphasis/app-render-context.emphasis.inline-content.page-content.types";

import { resolveInlineContentModuleAppRenderContext } from "@app-render-context/resolve/body-content/inline/inline.resolve.app-render-context";

export const resolveEmphasisInlineContentAppRenderContext = (
  appContext: AppContext,
  module: AppContextEmphasisInlineContent,
): AppRenderContextEmphasisInlineContent => {
  return {
    ...module,
    content: module.content.map((item) =>
      resolveInlineContentModuleAppRenderContext(appContext, item),
    ),
  };
};
