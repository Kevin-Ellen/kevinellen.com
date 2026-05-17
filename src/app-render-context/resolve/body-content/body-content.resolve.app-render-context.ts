// src/app-render-context/resolve/body-content/body-content.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppRenderContextBodyContent } from "@app-render-context/types/body-content.app-render-context.types";

import { appRenderContextResolveBlock } from "@app-render-context/resolve/body-content/block/block.resolve.app-render-context";
import { appRenderContextResolveFooter } from "@app-render-context/resolve/body-content/footer/footer.resolve.app-render-context";

export const appRenderContextResolveBodyContent = (
  appContext: AppContext,
): AppRenderContextBodyContent => {
  const { page } = appContext;

  return {
    header: page.content.head.showInBody === false ? null : page.content.head,
    content: page.content.content.map((block) =>
      appRenderContextResolveBlock(appContext, block),
    ),
    footer: page.content.footer.map((footer) =>
      appRenderContextResolveFooter(appContext, footer),
    ),
  };
};
