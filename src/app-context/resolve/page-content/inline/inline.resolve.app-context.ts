// src/app-context/resolve/page-content/inline/inline.resolve.app-context.ts

import type { AppStateInline } from "@shared-types/page-content/inline/app-state.inline-content.types";
import type { AppContextInline } from "@shared-types/page-content/inline/app-context.inline-content.types";

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";

import { appContextResolveTextInline } from "@app-context/resolve/page-content/inline/text.resolve.app-context";
import { appContextResolveCodeInline } from "@app-context/resolve/page-content/inline/code.resolve.app-context";
import { appContextResolveLineBreakInline } from "@app-context/resolve/page-content/inline/line-break.resolve.app-context";
import { appContextResolveEmphasisInline } from "@app-context/resolve/page-content/inline/emphasis.resolve.app-context";
import { appContextResolveStrongInline } from "@app-context/resolve/page-content/inline/strong.resolve.app-context";
import { appContextResolveInternalLinkInline } from "@app-context/resolve/page-content/inline/internal-link.resolve.app-context";
import { appContextResolveExternalLinkInline } from "@app-context/resolve/page-content/inline/external-link.resolve.app-context";

type AppStateInlineKind = AppStateInline["kind"];

type AppStateInlineByKind<TKind extends AppStateInlineKind> = Extract<
  AppStateInline,
  { kind: TKind }
>;

type AppContextInlineResolverRegistry = {
  [TKind in AppStateInlineKind]: (
    content: AppStateInlineByKind<TKind>,
    context: AppContextPageContentResolverContext,
  ) => AppContextInline;
};

const APP_CONTEXT_INLINE_RESOLVER_REGISTRY = {
  text: appContextResolveTextInline,
  code: appContextResolveCodeInline,
  lineBreak: appContextResolveLineBreakInline,
  emphasis: appContextResolveEmphasisInline,
  strong: appContextResolveStrongInline,
  internalLink: appContextResolveInternalLinkInline,
  externalLink: appContextResolveExternalLinkInline,
} satisfies AppContextInlineResolverRegistry;

export const appContextResolveInline = <TKind extends AppStateInlineKind>(
  content: AppStateInlineByKind<TKind>,
  context: AppContextPageContentResolverContext,
): AppContextInline => {
  const resolver = APP_CONTEXT_INLINE_RESOLVER_REGISTRY[content.kind];

  return resolver(content as never, context);
};
