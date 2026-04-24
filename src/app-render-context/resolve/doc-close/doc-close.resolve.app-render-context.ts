// src/app-render-context/resolve/doc-close/doc-close.resolve.app-render-context.ts

import type { AppRenderContextDocClose } from "@app-render-context/types/doc-close.app-render-context.types";
import type { AppContext } from "@app-context/class.app-context";

import { resolveScriptsAppRenderContext } from "@app-render-context/resolve/shared/scripts.assets.resolve.app-render-context";
import { resolveSvgSpritesAppRenderContext } from "@app-render-context/shared/svg.resolve.app-render-context";
import { resolveStructuredDataAppRenderContext } from "@app-render-context/resolve/doc-close/structured-data.resolve.app-render-context";

type ResolveDocCloseAppRenderContextContext = Readonly<{
  nonce: string;
  origin: string;
}>;

export const resolveDocCloseAppRenderContext = (
  appContext: AppContext,
  context: ResolveDocCloseAppRenderContextContext,
): AppRenderContextDocClose => {
  const scripts = resolveScriptsAppRenderContext(appContext, {
    location: "footer",
    nonce: context.nonce,
  });

  return {
    inlineScripts: scripts.inlineScripts,
    linkScripts: scripts.linkScripts,
    svg: resolveSvgSpritesAppRenderContext(appContext),
    structuredData: resolveStructuredDataAppRenderContext(appContext, {
      origin: context.origin,
    }),
  };
};
