// src/app-context/resolve/page/content/footer/footer.page-content.resolve.app-context.ts

import type { AppStatePageContentFooterModule } from "@shared-types/page-content/footer/app-state.page-footer.page-content.types";
import type { AppContextPageContentFooterModule } from "@shared-types/page-content/footer/app-context.page-footer.page-content.types";

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";

import { appContextResolveJournalEntryFooterModule } from "@app-context/resolve/page/content/footer/journal-entry-footer.page-content.resolve.app-context";

type FooterModuleKind = AppStatePageContentFooterModule["kind"];

type FooterModuleByKind<TKind extends FooterModuleKind> = Extract<
  AppStatePageContentFooterModule,
  { kind: TKind }
>;

type FooterResolverRegistry = {
  [TKind in FooterModuleKind]: (
    module: FooterModuleByKind<TKind>,
    context: AppContextPageContentResolverContext,
  ) => AppContextPageContentFooterModule;
};

const FOOTER_RESOLVERS: FooterResolverRegistry = {
  journalEntryFooter: appContextResolveJournalEntryFooterModule,
};

export const appContextResolveFooterContentModule = <
  TKind extends FooterModuleKind,
>(
  module: FooterModuleByKind<TKind>,
  context: AppContextPageContentResolverContext,
): AppContextPageContentFooterModule => {
  const resolver = FOOTER_RESOLVERS[module.kind];

  if (!resolver) {
    throw new Error(
      `No AppContext footer content resolver registered for kind: ${module.kind}`,
    );
  }

  return resolver(module as never, context);
};
