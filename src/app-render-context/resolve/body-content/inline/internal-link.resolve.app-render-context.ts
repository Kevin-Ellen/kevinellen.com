// src/app-render-context/resolve/body-content/inline/internal-link.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextInternalLinkInline } from "@shared-types/page-content/inline/internal-link/app-context.internal-link.inline-content.types";
import type { AppRenderContextLinkInline } from "@shared-types/page-content/inline/link/app-render-context.link.inline-content.types";

import { appRenderContextResolveLink } from "@app-render-context/shared/link.resolve.app-render-context";

export const appRenderContextResolveInternalLinkInline = (
  appContext: AppContext,
  inline: AppContextInternalLinkInline,
): AppRenderContextLinkInline => ({
  kind: "link",
  link: appRenderContextResolveLink(appContext, inline.link),
});
