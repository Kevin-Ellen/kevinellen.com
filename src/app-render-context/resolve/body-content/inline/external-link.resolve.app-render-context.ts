// src/app-render-context/resolve/body-content/inline/external-link.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextExternalLinkInline } from "@shared-types/page-content/inline/external-link/app-context.external-link.inline-content.types";
import type { AppRenderContextLinkInline } from "@shared-types/page-content/inline/link/app-render-context.link.inline-content.types";

import { appRenderContextResolveLink } from "@app-render-context/shared/link.resolve.app-render-context";

export const appRenderContextResolveExternalLinkInline = (
  appContext: AppContext,
  inline: AppContextExternalLinkInline,
): AppRenderContextLinkInline => ({
  kind: "link",
  link: appRenderContextResolveLink(appContext, inline.link),
});
