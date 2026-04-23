// text.resolve.app-render-context.ts
import type { AppContext } from "@app-context/class.app-context";
import type { AppContextTextInlineContent } from "@shared-types/page-content/inline/text/app-context.text.inline-content.page-content.types";
import type { AppRenderContextTextInlineContent } from "@shared-types/page-content/inline/text/app-render-context.text.inline-content.page-content.types";

export const resolveTextInlineContentAppRenderContext = (
  _appContext: AppContext,
  module: AppContextTextInlineContent,
): AppRenderContextTextInlineContent => {
  return module;
};
