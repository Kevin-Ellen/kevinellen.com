// src/app-state/resolve/page-content/footer/footer.resolve.app-state.ts

import type { AuthoredPageContentFooter } from "@shared-types/page-content/footer/authored.page-footer.types";
import type { AppStatePageContentFooter } from "@shared-types/page-content/footer/app-state.page-footer.types";

import { appStateResolveJournalEntryFooter } from "@app-state/resolve/page-content/footer/journal-entry-footer/journal-entry-footer.resolve.app-state";
import { appStateResolveNoteEntryFooter } from "@app-state/resolve/page-content/footer/note-entry-footer/note-entry-footer.resolve.app-state";

type ModuleKind = AuthoredPageContentFooter["kind"];

type ModuleByKind<TKey extends ModuleKind> = Extract<
  AuthoredPageContentFooter,
  { kind: TKey }
>;

type Registry = {
  [TKey in ModuleKind]: (
    module: ModuleByKind<TKey>,
  ) => AppStatePageContentFooter;
};

const footerResolver = <TKind extends ModuleKind>(
  kind: TKind,
): Registry[TKind] => {
  const registry = {
    journalEntryFooter: appStateResolveJournalEntryFooter,
    noteEntryFooter: appStateResolveNoteEntryFooter,
  } satisfies Registry;

  return registry[kind];
};

export const appStateResolveFooter = <TKind extends ModuleKind>(
  module: ModuleByKind<TKind>,
): AppStatePageContentFooter => {
  const resolver = footerResolver(module.kind);

  if (!resolver) {
    throw new Error(
      `No AppState footer content resolver registered for kind: ${module.kind}`,
    );
  }

  return resolver(module);
};
