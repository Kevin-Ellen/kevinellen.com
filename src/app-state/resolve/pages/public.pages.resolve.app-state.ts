// src/app-state/resolve/pages/public.pages.resolve.app-state.ts

import type { AppStatePageDefinition } from "@shared-types/page-definitions/app-state.page-definition.types";

import { loadMergedPublicPageRegistry } from "@app-state/resolve/pages/registries/public.registry.pages.app-state";
import { appStateResolvePublicPage } from "@app-state/resolve/pages/public/public.page.resolve.app-state";

type AppStateResolvePublicPagesArgs = Readonly<{
  journalKv: KVNamespace;
  notesKv: KVNamespace;
}>;

export const appStateResolvePublicPages = async ({
  journalKv,
  notesKv,
}: AppStateResolvePublicPagesArgs): Promise<
  readonly AppStatePageDefinition[]
> => {
  const publicPageRegistry = await loadMergedPublicPageRegistry({
    journalKv,
    notesKv,
  });

  return publicPageRegistry.map(appStateResolvePublicPage);
};
