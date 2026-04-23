// code.resolve.app-render-context.ts
import type { AppContext } from "@app-context/class.app-context";
import type { AppContextCodeInlineContent } from "@shared-types/page-content/inline/code/app-context.code.inline-content.page-content.types";
import type { AppRenderContextCodeInlineContent } from "@shared-types/page-content/inline/code/app-render-context.code.inline-content.page-content.types";

export const resolveCodeInlineContentAppRenderContext = (
  _appContext: AppContext,
  module: AppContextCodeInlineContent,
): AppRenderContextCodeInlineContent => {
  return module;
};
