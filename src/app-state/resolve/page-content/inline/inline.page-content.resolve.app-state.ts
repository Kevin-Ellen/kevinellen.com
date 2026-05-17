// src/app-state/resolve/page-content/inline/inline.page-content.resolve.app-state.ts

import type { AuthoredInline } from "@shared-types/page-content/inline/authored.inline-content.types";
import type { AppStateInline } from "@shared-types/page-content/inline/app-state.inline-content.types";

import { appStateResolveTextInline } from "@app-state/resolve/page-content/inline/text.resolve.app-state";
import { appStateResolveCodeInline } from "@app-state/resolve/page-content/inline/code.resolve.app-state";
import { appStateResolveLineBreakInline } from "@app-state/resolve/page-content/inline/line-break.resolve.app-state";
import { appStateResolveEmphasisInline } from "@app-state/resolve/page-content/inline/emphasis.resolve.app-state";
import { appStateResolveStrongInline } from "@app-state/resolve/page-content/inline/strong.resolve.app-state";
import { appStateResolveInternalLinkInline } from "@app-state/resolve/page-content/inline/internal-link.resolve.app-state";
import { appStateResolveExternalLinkInline } from "@app-state/resolve/page-content/inline/external-link.resolve.app-state";

type InlineKind = AuthoredInline["kind"];

type InlineByKind<TKey extends InlineKind> = Extract<
  AuthoredInline,
  { kind: TKey }
>;

type Registry = {
  [TKey in InlineKind]: (content: InlineByKind<TKey>) => AppStateInline;
};

const InlineResolver = <TKind extends InlineKind>(
  kind: TKind,
): Registry[TKind] => {
  const registry = {
    text: appStateResolveTextInline,
    code: appStateResolveCodeInline,
    lineBreak: appStateResolveLineBreakInline,
    emphasis: appStateResolveEmphasisInline,
    strong: appStateResolveStrongInline,
    internalLink: appStateResolveInternalLinkInline,
    externalLink: appStateResolveExternalLinkInline,
  } satisfies Registry;

  return registry[kind];
};

export const appStateResolveInline = <TKind extends InlineKind>(
  content: InlineByKind<TKind>,
): AppStateInline => {
  const resolver = InlineResolver(content.kind);

  if (!resolver) {
    throw new Error(
      `No AppState inline content resolver registered for kind: ${content.kind}`,
    );
  }

  return resolver(content);
};
