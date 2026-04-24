// src/app-render-context/resolve/body-content/inline/inline.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextInlineContent } from "@shared-types/page-content/inline/app-context.inline-content.page-content.types";
import type { AppRenderContextInlineContent } from "@shared-types/page-content/inline/app-render-context.inline-content.page-content.types";

import { resolveCodeInlineContentAppRenderContext } from "./code.resolve.app-render-context";
import { resolveEmphasisInlineContentAppRenderContext } from "./emphasis.resolve.app-render-context";
import { resolveExternalLinkInlineContentAppRenderContext } from "./external-link.resolve.app-render-context";
import { resolveInternalLinkInlineContentAppRenderContext } from "./internal-link.resolve.app-render-context";
import { resolveLineBreakInlineContentAppRenderContext } from "./line-break.resolve.app-render-context";
import { resolveStrongInlineContentAppRenderContext } from "./strong.resolve.app-render-context";
import { resolveTextInlineContentAppRenderContext } from "./text.resolve.app-render-context";

type AppRenderContextInlineResolverMap = Readonly<{
  [K in AppContextInlineContent["kind"]]: (
    appContext: AppContext,
    module: Extract<AppContextInlineContent, { kind: K }>,
  ) => AppRenderContextInlineContent;
}>;

const inlineContentResolvers = {
  code: resolveCodeInlineContentAppRenderContext,
  emphasis: resolveEmphasisInlineContentAppRenderContext,
  externalLink: resolveExternalLinkInlineContentAppRenderContext,
  internalLink: resolveInternalLinkInlineContentAppRenderContext,
  lineBreak: resolveLineBreakInlineContentAppRenderContext,
  strong: resolveStrongInlineContentAppRenderContext,
  text: resolveTextInlineContentAppRenderContext,
} satisfies AppRenderContextInlineResolverMap;

export const resolveInlineContentModuleAppRenderContext = (
  appContext: AppContext,
  module: AppContextInlineContent,
): AppRenderContextInlineContent => {
  const resolver = inlineContentResolvers[module.kind] as (
    appContext: AppContext,
    module: AppContextInlineContent,
  ) => AppRenderContextInlineContent;

  return resolver(appContext, module);
};
