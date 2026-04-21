// src/app-render-context/resolve/shared/scripts.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppRenderContextScriptAsset } from "@shared-types/assets/scripts/app-render-context.scripts.assets.types";

type ResolveScriptsAppRenderContextContext = Readonly<{
  location: "header" | "footer";
  nonce: string;
}>;

export const resolveScriptsAppRenderContext = (
  appContext: AppContext,
  context: ResolveScriptsAppRenderContextContext,
): readonly AppRenderContextScriptAsset[] => {
  return appContext.assets.scripts
    .filter((script) => script.location === context.location)
    .map(({ location: _location, ...script }) => ({
      ...script,
      nonce: context.nonce,
    }));
};
