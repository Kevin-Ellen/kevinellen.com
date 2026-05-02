// src/app-render-context/resolve/body-content/footer/footer.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextPageContentFooterModule } from "@shared-types/page-content/footer/app-context.page-footer.page-content.types";
import type { AppRenderContextPageContentFooterModule } from "@shared-types/page-content/footer/app-render-context.page-footer.page-content.types";

import { resolveJournalEntryFooterAppRenderContext } from "@app-render-context/resolve/body-content/footer/journal-entry-footer.resolve.app-render-context";

type FooterModuleKind = AppContextPageContentFooterModule["kind"];

type FooterModuleByKind<TKind extends FooterModuleKind> = Extract<
  AppContextPageContentFooterModule,
  { kind: TKind }
>;

type FooterResolverRegistry = {
  [TKind in FooterModuleKind]: (
    appContext: AppContext,
    module: FooterModuleByKind<TKind>,
  ) => AppRenderContextPageContentFooterModule;
};

const FOOTER_RESOLVERS: FooterResolverRegistry = {
  journalEntryFooter: resolveJournalEntryFooterAppRenderContext,
};

export const resolveFooterContentModuleAppRenderContext = <
  TKind extends FooterModuleKind,
>(
  appContext: AppContext,
  module: FooterModuleByKind<TKind>,
): AppRenderContextPageContentFooterModule => {
  const resolver = FOOTER_RESOLVERS[module.kind];

  if (!resolver) {
    throw new Error(
      `No AppRenderContext footer content resolver registered for kind: ${module.kind}`,
    );
  }

  return resolver(appContext, module as never);
};
