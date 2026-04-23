// src/app-render-context/resolve/body-content/inline/external-link.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextExternalLinkInlineContent } from "@shared-types/page-content/inline/external-link/app-context.external-link.inline-content.page-content.types";
import type { AppRenderContextLinkInlineContent } from "@shared-types/page-content/inline/link/app-render-context.link.inline-content.page-content.types";

import { resolveLinkAppRenderContext } from "@app-render-context/shared/link.resolve.app-render-context";

export const resolveExternalLinkInlineContentAppRenderContext = (
  appContext: AppContext,
  module: AppContextExternalLinkInlineContent,
): AppRenderContextLinkInlineContent => {
  return {
    kind: "link",
    link: resolveLinkAppRenderContext(appContext, module.link),
  };
};
