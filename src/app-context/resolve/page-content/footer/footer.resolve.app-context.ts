// src/app-context/resolve/page-content/footer/footer.resolve.app-context.ts

import type { AppStatePageContentFooter } from "@shared-types/page-content/footer/app-state.page-footer.types";
import type { AppContextPageContentFooter } from "@shared-types/page-content/footer/app-context.page-footer.types";

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";

import { appContextResolveJournalEntryFooter } from "@app-context/resolve/page-content/footer/journal-entry-footer/journal-entry-footer.resolve.app-context";
import { appContextResolveNoteEntryFooter } from "@app-context/resolve/page-content/footer/note-entry-footer/note-entry-footer.resolve.app-context";

type FooterModuleKind = AppStatePageContentFooter["kind"];

type FooterModuleByKind<TKind extends FooterModuleKind> = Extract<
  AppStatePageContentFooter,
  { kind: TKind }
>;

type FooterResolverRegistry = {
  [TKind in FooterModuleKind]: (
    module: FooterModuleByKind<TKind>,
    context: AppContextPageContentResolverContext,
  ) => AppContextPageContentFooter;
};

const APP_CONTEXT_FOOTER_RESOLVER_REGISTRY = {
  journalEntryFooter: appContextResolveJournalEntryFooter,
  noteEntryFooter: appContextResolveNoteEntryFooter,
} satisfies FooterResolverRegistry;

export const appContextResolveFooter = <TKind extends FooterModuleKind>(
  module: FooterModuleByKind<TKind>,
  context: AppContextPageContentResolverContext,
): AppContextPageContentFooter => {
  const resolver = APP_CONTEXT_FOOTER_RESOLVER_REGISTRY[module.kind];

  return resolver(module as never, context);
};
