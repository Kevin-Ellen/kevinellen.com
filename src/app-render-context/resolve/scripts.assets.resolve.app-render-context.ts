// src/app-render-context/resolve/shared/scripts.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type {
  AppRenderContextInlineScript,
  AppRenderContextLinkScript,
} from "@shared-types/assets/scripts/app-render-context.scripts.assets.types";

type ResolveScriptsAppRenderContextContext = Readonly<{
  location: "header" | "footer";
  nonce: string;
}>;

export type ResolvedScriptsAppRenderContext = Readonly<{
  inlineScripts: readonly AppRenderContextInlineScript[];
  linkScripts: readonly AppRenderContextLinkScript[];
}>;

export const resolveScriptsAppRenderContext = (
  appContext: AppContext,
  context: ResolveScriptsAppRenderContextContext,
): ResolvedScriptsAppRenderContext => {
  const scriptsForLocation = appContext.assets.scripts.filter(
    (script) => script.location === context.location,
  );

  const inlineScripts: AppRenderContextInlineScript[] = [];
  const linkScripts: AppRenderContextLinkScript[] = [];

  for (const script of scriptsForLocation) {
    if (script.kind === "inline") {
      inlineScripts.push({
        content: script.content,
        nonce: context.nonce,
      });

      continue;
    }

    linkScripts.push({
      src: script.src,
      nonce: context.nonce,
      loading: script.loading ?? "blocking",
    });
  }

  return {
    inlineScripts,
    linkScripts,
  };
};
