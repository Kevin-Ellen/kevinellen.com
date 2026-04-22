// src/app-render-context/resolve/body-content/body-content.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppRenderContextBodyContent } from "@app-render-context/types/body-content.app-render-context.types";

export const resolveBodyContentAppRenderContext = (
  appContext: AppContext,
): AppRenderContextBodyContent => {
  return {
    body: appContext.pageContent,
  };
};
