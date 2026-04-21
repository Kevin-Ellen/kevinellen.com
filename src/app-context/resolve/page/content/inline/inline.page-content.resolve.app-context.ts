// src/app-context/resolve/page/content/inline/inline.page-content.resolve.app-context.ts

import type { AppStateInlineContent } from "@shared-types/page-content/inline/app-state.inline-content.page-content.types";
import type { AppContextInlineContent } from "@shared-types/page-content/inline/app-context.inline-content.page-content.types";

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";

import { appContextResolveTextInlineContent } from "@app-context/resolve/page/content/inline/text.resolve.app-context";
import { appContextResolveCodeInlineContent } from "@app-context/resolve/page/content/inline/code.resolve.app-context";
import { appContextResolveLineBreakInlineContent } from "@app-context/resolve/page/content/inline/line-break.resolve.app-context";
import { appContextResolveEmphasisInlineContent } from "@app-context/resolve/page/content/inline/emphasis.resolve.app-context";
import { appContextResolveStrongInlineContent } from "@app-context/resolve/page/content/inline/strong.resolve.app-context";
import { appContextResolveInternalLinkInlineContent } from "@app-context/resolve/page/content/inline/internal-link.resolve.app-context";
import { appContextResolveExternalLinkInlineContent } from "@app-context/resolve/page/content/inline/external-link.resolve.app-context";

type AppStateInlineContentKind = AppStateInlineContent["kind"];

type AppStateInlineContentByKind<TKey extends AppStateInlineContentKind> =
  Extract<AppStateInlineContent, { kind: TKey }>;

type AppContextInlineContentResolverRegistry = {
  [TKey in AppStateInlineContentKind]: (
    content: AppStateInlineContentByKind<TKey>,
    context: AppContextPageContentResolverContext,
  ) => AppContextInlineContent;
};

const getAppContextInlineContentResolver = <
  TKind extends AppStateInlineContentKind,
>(
  kind: TKind,
): AppContextInlineContentResolverRegistry[TKind] => {
  const registry = {
    text: (content) => appContextResolveTextInlineContent(content),
    code: (content) => appContextResolveCodeInlineContent(content),
    lineBreak: (content) => appContextResolveLineBreakInlineContent(content),
    emphasis: appContextResolveEmphasisInlineContent,
    strong: appContextResolveStrongInlineContent,
    internalLink: appContextResolveInternalLinkInlineContent,
    externalLink: (content) =>
      appContextResolveExternalLinkInlineContent(content),
  } satisfies AppContextInlineContentResolverRegistry;

  return registry[kind];
};

export const appContextResolveInlineContent = <
  TKind extends AppStateInlineContentKind,
>(
  content: AppStateInlineContentByKind<TKind>,
  context: AppContextPageContentResolverContext,
): AppContextInlineContent => {
  const resolver = getAppContextInlineContentResolver(content.kind);

  if (!resolver) {
    throw new Error(
      `No AppContext inline content resolver registered for kind: ${content.kind}`,
    );
  }

  return resolver(content, context);
};
