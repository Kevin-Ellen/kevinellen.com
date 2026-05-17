// src/app-render-context/resolve/doc-open/doc-open.resolve.app-render-context.ts

import type { AppRenderContextDocOpen } from "@app-render-context/types/doc-open.app-render-context.types";
import type { AppContext } from "@app-context/class.app-context";

import { appRenderContextResolveScripts } from "@app-render-context/resolve/shared/scripts.resolve.app-render-context";
import { appRenderContextResolveDocOpenHeadLinks } from "@app-render-context/resolve/doc-open/head-links.doc-open.resolve.app-render-context";
import { appRenderContextResolveDocOpenPreload } from "@app-render-context/resolve/doc-open/preload.doc-open.resolve.app-render-context";
import { appRenderContextResolveSocialPreview } from "@app-render-context/resolve/doc-open/social-preview.resolve.app-render-context";

type ResolveDocOpenAppRenderContextContext = Readonly<{
  nonce: string;
}>;

export const appRenderContextResolveDocOpen = (
  appContext: AppContext,
  context: ResolveDocOpenAppRenderContextContext,
): AppRenderContextDocOpen => {
  const scripts = appRenderContextResolveScripts(appContext, {
    location: "header",
    nonce: context.nonce,
  });

  return {
    metadata: appContext.metadata,
    language: appContext.language,
    canonicalUrl: appContext.canonicalUrl,
    socialPreview: appRenderContextResolveSocialPreview(
      appContext.socialPreview,
    ),
    inlineScripts: scripts.inlineScripts,
    linkScripts: scripts.linkScripts,
    links: appRenderContextResolveDocOpenHeadLinks(appContext),
    preload: appRenderContextResolveDocOpenPreload(appContext),
    nonce: context.nonce,
    themeColour: appContext.themeColour,
  };
};
