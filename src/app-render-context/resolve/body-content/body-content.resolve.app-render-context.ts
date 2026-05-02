// src/app-render-context/resolve/body-content/body-content.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppRenderContextBodyContent } from "@app-render-context/types/body-content.app-render-context.types";

import { resolveBlockContentModuleAppRenderContext } from "@app-render-context/resolve/body-content/block/block.resolve.app-render-context";
import { resolveFooterContentModuleAppRenderContext } from "@app-render-context/resolve/body-content/footer/footer.resolve.app-render-context";

export const resolveBodyContentAppRenderContext = (
  appContext: AppContext,
): AppRenderContextBodyContent => {
  return {
    header: appContext.page.content.header,
    content: appContext.page.content.content.map((module) =>
      resolveBlockContentModuleAppRenderContext(appContext, module),
    ),
    footer: appContext.page.content.footer.map((module) =>
      resolveFooterContentModuleAppRenderContext(appContext, module),
    ),
  };
};
