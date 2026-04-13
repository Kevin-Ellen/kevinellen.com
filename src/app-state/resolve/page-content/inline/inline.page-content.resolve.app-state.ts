// src/app-state/resolve/page-content/inline/inline.page-content.resolve.app-state.ts

import type { AuthoredInlineContent } from "@shared-types/page-content/inline/authored.inline-content.page-content.types";
import type { AppStateInlineContent } from "@shared-types/page-content/inline/app-state.inline-content.page-content.types";

import { appStateResolveTextInlineContent } from "@app-state/resolve/page-content/inline/text.resolve.app-state";
import { appStateResolveCodeInlineContent } from "@app-state/resolve/page-content/inline/code.resolve.app-state";
import { appStateResolveLineBreakInlineContent } from "@app-state/resolve/page-content/inline/line-break.resolve.app-state";
import { appStateResolveEmphasisInlineContent } from "@app-state/resolve/page-content/inline/emphasis.resolve.app-state";
import { appStateResolveStrongInlineContent } from "@app-state/resolve/page-content/inline/strong.resolve.app-state";
import { appStateResolveInternalLinkInlineContent } from "@app-state/resolve/page-content/inline/internal-link.resolve.app-state";
import { appStateResolveExternalLinkInlineContent } from "@app-state/resolve/page-content/inline/external-link.resolve.app-state";

type AuthoredInlineContentKind = AuthoredInlineContent["kind"];

type AuthoredInlineContentByKind<TKey extends AuthoredInlineContentKind> =
  Extract<AuthoredInlineContent, { kind: TKey }>;

type AppStateInlineContentResolverRegistry = {
  [TKey in AuthoredInlineContentKind]: (
    content: AuthoredInlineContentByKind<TKey>,
  ) => AppStateInlineContent;
};

const getAppStateInlineContentResolver = <
  TKind extends AuthoredInlineContentKind,
>(
  kind: TKind,
): AppStateInlineContentResolverRegistry[TKind] => {
  const registry = {
    text: appStateResolveTextInlineContent,
    code: appStateResolveCodeInlineContent,
    lineBreak: appStateResolveLineBreakInlineContent,
    emphasis: appStateResolveEmphasisInlineContent,
    strong: appStateResolveStrongInlineContent,
    internalLink: appStateResolveInternalLinkInlineContent,
    externalLink: appStateResolveExternalLinkInlineContent,
  } satisfies AppStateInlineContentResolverRegistry;

  return registry[kind];
};

export const appStateResolveInlineContent = <
  TKind extends AuthoredInlineContentKind,
>(
  content: AuthoredInlineContentByKind<TKind>,
): AppStateInlineContent => {
  const resolver = getAppStateInlineContentResolver(content.kind);

  if (!resolver) {
    throw new Error(
      `No AppState inline content resolver registered for kind: ${content.kind}`,
    );
  }

  return resolver(content);
};
