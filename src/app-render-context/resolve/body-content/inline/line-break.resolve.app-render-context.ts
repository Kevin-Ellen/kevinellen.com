// line-break.resolve.app-render-context.ts
import type { AppContext } from "@app-context/class.app-context";
import type { AppContextLineBreakInlineContent } from "@shared-types/page-content/inline/line-break/app-context.line-break.inline-content.page-content.types";
import type { AppRenderContextLineBreakInlineContent } from "@shared-types/page-content/inline/line-break/app-render-context.line-break.inline-content.page-content.types";

export const resolveLineBreakInlineContentAppRenderContext = (
  _appContext: AppContext,
  module: AppContextLineBreakInlineContent,
): AppRenderContextLineBreakInlineContent => {
  return module;
};
