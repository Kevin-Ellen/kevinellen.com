// src/app-render-context/resolve/doc-open/doc-open.resolve.app-render-context.ts

import type { AppRenderContextDocOpen } from "@app-render-context/types/doc-open.app-render-context.types";
import type { AppContext } from "@app-context/class.app-context";

import { resolveScriptsAppRenderContext } from "@app-render-context/resolve/scripts.assets.resolve.app-render-context";
import { resolveHeadLinksAppRenderContext } from "@app-render-context/resolve/doc-open/head-links.resolve.app-render-context";
import { resolvePreloadAppRenderContext } from "@app-render-context/resolve/doc-open/preload.resolve.app-render-context";

type ResolveDocOpenAppRenderContextContext = Readonly<{
  nonce: string;
}>;

export const resolveDocOpenAppRenderContext = (
  appContext: AppContext,
  context: ResolveDocOpenAppRenderContextContext,
): AppRenderContextDocOpen => {
  const scripts = resolveScriptsAppRenderContext(appContext, {
    location: "header",
    nonce: context.nonce,
  });

  return {
    metadata: appContext.metadata,
    language: appContext.language,
    canonicalUrl: appContext.canonicalUrl,
    inlineScripts: scripts.inlineScripts,
    linkScripts: scripts.linkScripts,
    links: resolveHeadLinksAppRenderContext(appContext),
    preload: resolvePreloadAppRenderContext(appContext),
    nonce: context.nonce,
    themeColour: appContext.themeColour,
  };
};
