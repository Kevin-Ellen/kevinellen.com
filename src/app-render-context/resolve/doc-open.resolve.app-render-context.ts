// src/app-render-context/resolve/doc-open.resolve.app-render-context.ts

import type { AppRenderContextDocOpen } from "@app-render-context/app-render-context.types";
import type { AppContext } from "@app-context/class.app-context";

import { resolveScriptsAppRenderContext } from "@app-render-context/resolve/scripts.assets.resolve.app-render-context";

type ResolveDocOpenAppRenderContextContext = Readonly<{
  nonce: string;
}>;

export const resolveDocOpenAppRenderContext = (
  appContext: AppContext,
  context: ResolveDocOpenAppRenderContextContext,
): AppRenderContextDocOpen => {
  return {
    metadata: appContext.metadata,
    language: appContext.language,
    canonicalUrl: appContext.canonicalUrl,
    assets: {
      scripts: resolveScriptsAppRenderContext(appContext, {
        location: "header",
        nonce: context.nonce,
      }),
    },
    nonce: context.nonce,
  };
};
