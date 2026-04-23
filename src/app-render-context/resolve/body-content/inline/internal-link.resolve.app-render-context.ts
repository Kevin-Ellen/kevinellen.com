// src/app-render-context/resolve/body-content/inline/internal-link.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextInternalLinkInlineContent } from "@shared-types/page-content/inline/internal-link/app-context.internal-link.inline-content.page-content.types";
import type { AppRenderContextLinkInlineContent } from "@shared-types/page-content/inline/link/app-render-context.link.inline-content.page-content.types";

import { resolveLinkAppRenderContext } from "@app-render-context/shared/link.resolve.app-render-context";

export const resolveInternalLinkInlineContentAppRenderContext = (
  appContext: AppContext,
  module: AppContextInternalLinkInlineContent,
): AppRenderContextLinkInlineContent => {
  return {
    kind: "link",
    link: resolveLinkAppRenderContext(appContext, module.link),
  };
};
