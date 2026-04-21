// src/app-render-context/resolve/doc-close.resolve.app-render-context.ts

import type { AppRenderContextDocClose } from "@app-render-context/app-render-context.types";
import type { AppContext } from "@app-context/class.app-context";

import { resolveScriptsAppRenderContext } from "@app-render-context/resolve/scripts.assets.resolve.app-render-context";
import { resolveSvgAppRenderContext } from "@app-render-context/resolve/svg.assets.resolve.app-render-context";

type ResolveDocCloseAppRenderContextContext = Readonly<{
  nonce: string;
}>;

export const resolveDocCloseAppRenderContext = (
  appContext: AppContext,
  context: ResolveDocCloseAppRenderContextContext,
): AppRenderContextDocClose => {
  return {
    assets: {
      scripts: resolveScriptsAppRenderContext(appContext, {
        location: "footer",
        nonce: context.nonce,
      }),
      svg: resolveSvgAppRenderContext(appContext),
    },
  };
};
