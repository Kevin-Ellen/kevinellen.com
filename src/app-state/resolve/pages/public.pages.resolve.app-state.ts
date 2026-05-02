// src/app-state/resolve/pages/public.pages.resolve.app-state.ts

import type { AppStatePageDefinition } from "@shared-types/page-definitions/app-state.page-definition.types";

import { loadMergedPublicPageRegistry } from "@app-state/resolve/pages/registries/public.registry.pages.app-state";
import { appStateResolvePublicPage } from "@app-state/resolve/pages/public/public.page.resolve.app-state";

type AppStateResolvePublicPagesArgs = Readonly<{
  kv: KVNamespace;
}>;

export const appStateResolvePublicPages = async ({
  kv,
}: AppStateResolvePublicPagesArgs): Promise<
  readonly AppStatePageDefinition[]
> => {
  const publicPageRegistry = await loadMergedPublicPageRegistry({ kv });

  return publicPageRegistry.map(appStateResolvePublicPage);
};
