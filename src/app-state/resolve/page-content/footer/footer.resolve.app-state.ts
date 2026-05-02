// src/app-state/resolve/page-content/footer/footer.resolve.app-state.ts

import type { AuthoredPageContentFooterModule } from "@shared-types/page-content/footer/authored.page-footer.page-content.types";
import type { AppStatePageContentFooterModule } from "@shared-types/page-content/footer/app-state.page-footer.page-content.types";

import { appStateResolveJournalEntryFooterModule } from "@app-state/resolve/page-content/footer/journal-entry-footer.resolve.app-state";

type AuthoredPageContentFooterModuleKind =
  AuthoredPageContentFooterModule["kind"];

type AuthoredPageContentFooterModuleByKind<
  TKey extends AuthoredPageContentFooterModuleKind,
> = Extract<AuthoredPageContentFooterModule, { kind: TKey }>;

type AppStatePageContentFooterModuleResolverRegistry = {
  [TKey in AuthoredPageContentFooterModuleKind]: (
    module: AuthoredPageContentFooterModuleByKind<TKey>,
  ) => AppStatePageContentFooterModule;
};

const getAppStatePageContentFooterModuleResolver = <
  TKind extends AuthoredPageContentFooterModuleKind,
>(
  kind: TKind,
): AppStatePageContentFooterModuleResolverRegistry[TKind] => {
  const registry = {
    journalEntryFooter: appStateResolveJournalEntryFooterModule,
  } satisfies AppStatePageContentFooterModuleResolverRegistry;

  return registry[kind];
};

export const appStateResolveFooterContentModule = <
  TKind extends AuthoredPageContentFooterModuleKind,
>(
  module: AuthoredPageContentFooterModuleByKind<TKind>,
): AppStatePageContentFooterModule => {
  const resolver = getAppStatePageContentFooterModuleResolver(module.kind);

  if (!resolver) {
    throw new Error(
      `No AppState footer content resolver registered for kind: ${module.kind}`,
    );
  }

  return resolver(module);
};
