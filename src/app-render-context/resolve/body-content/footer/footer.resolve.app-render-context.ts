// src/app-render-context/resolve/body-content/footer/footer.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextPageContentFooter } from "@shared-types/page-content/footer/app-context.page-footer.types";
import type { AppRenderContextPageContentFooter } from "@shared-types/page-content/footer/app-render-context.page-footer.types";

import { appRenderContextResolveJournalEntryFooter } from "@app-render-context/resolve/body-content/footer/journal-entry-footer/journal-entry-footer.resolve.app-render-context";
import { appRenderContextResolveNoteEntryFooter } from "@app-render-context/resolve/body-content/footer/note-entry-footer/note-entry-footer.resolve.app-render-context";

type FooterKind = AppContextPageContentFooter["kind"];

type FooterByKind<TKind extends FooterKind> = Extract<
  AppContextPageContentFooter,
  { kind: TKind }
>;

type FooterResolverRegistry = {
  [TKind in FooterKind]: (
    appContext: AppContext,
    footer: FooterByKind<TKind>,
  ) => AppRenderContextPageContentFooter;
};

const FOOTER_RESOLVERS: FooterResolverRegistry = {
  journalEntryFooter: (_appContext, footer) =>
    appRenderContextResolveJournalEntryFooter(footer),
  noteEntryFooter: (_appContext, footer) =>
    appRenderContextResolveNoteEntryFooter(footer),
};
export const appRenderContextResolveFooter = <TKind extends FooterKind>(
  appContext: AppContext,
  footer: FooterByKind<TKind>,
): AppRenderContextPageContentFooter => {
  const resolver = FOOTER_RESOLVERS[footer.kind];

  if (!resolver) {
    throw new Error(
      `No AppRenderContext footer resolver registered for kind: ${footer.kind}`,
    );
  }

  return resolver(appContext, footer as never);
};
