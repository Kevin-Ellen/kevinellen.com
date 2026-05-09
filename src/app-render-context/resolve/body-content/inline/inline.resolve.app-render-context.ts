// src/app-render-context/resolve/body-content/inline/inline.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextInline } from "@shared-types/page-content/inline/app-context.inline-content.types";
import type { AppRenderContextInline } from "@shared-types/page-content/inline/app-render-context.inline-content.types";

import { appRenderContextResolveCodeInline } from "@app-render-context/resolve/body-content/inline/code.resolve.app-render-context";
import { appRenderContextResolveEmphasisInline } from "@app-render-context/resolve/body-content/inline/emphasis.resolve.app-render-context";
import { appRenderContextResolveExternalLinkInline } from "@app-render-context/resolve/body-content/inline/external-link.resolve.app-render-context";
import { appRenderContextResolveInternalLinkInline } from "@app-render-context/resolve/body-content/inline/internal-link.resolve.app-render-context";
import { appRenderContextResolveLineBreakInline } from "@app-render-context/resolve/body-content/inline/line-break.resolve.app-render-context";
import { appRenderContextResolveStrongInline } from "@app-render-context/resolve/body-content/inline/strong.resolve.app-render-context";
import { appRenderContextResolveTextInline } from "@app-render-context/resolve/body-content/inline/text.resolve.app-render-context";

type InlineKind = AppContextInline["kind"];

type InlineByKind<TKind extends InlineKind> = Extract<
  AppContextInline,
  { kind: TKind }
>;

type InlineResolverRegistry = {
  [TKind in InlineKind]: (
    appContext: AppContext,
    inline: InlineByKind<TKind>,
  ) => AppRenderContextInline;
};

const INLINE_RESOLVERS: InlineResolverRegistry = {
  code: (_appContext, inline) => appRenderContextResolveCodeInline(inline),
  emphasis: appRenderContextResolveEmphasisInline,
  externalLink: appRenderContextResolveExternalLinkInline,
  internalLink: appRenderContextResolveInternalLinkInline,
  lineBreak: (_appContext, inline) =>
    appRenderContextResolveLineBreakInline(inline),
  strong: appRenderContextResolveStrongInline,
  text: (_appContext, inline) => appRenderContextResolveTextInline(inline),
};

export const appRenderContextResolveInline = <TKind extends InlineKind>(
  appContext: AppContext,
  inline: InlineByKind<TKind>,
): AppRenderContextInline => {
  const resolver = INLINE_RESOLVERS[inline.kind];

  if (!resolver) {
    throw new Error(
      `No AppRenderContext inline resolver registered for kind: ${inline.kind}`,
    );
  }

  return resolver(appContext, inline as never);
};
