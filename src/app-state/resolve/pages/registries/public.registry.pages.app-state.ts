// src/app-state/resolve/pages/registries/public.registry.pages.app-state.ts

import type { AuthoredPublicPageDefinition } from "@shared-types/page-definitions/authored.public.page-definition.types";

import { loadKvPublicPageRegistry } from "@app-state/resolve/pages/registries/public.kv.registry.pages.app-state";
import { APP_STATE_PAGE_REGISTRY_STATIC_PUBLIC } from "@app-state/resolve/pages/registries/public.static.registry.pages.app-state";

type LoadMergedPublicPageRegistryArgs = Readonly<{
  journalKv: KVNamespace;
  notesKv: KVNamespace;
}>;

export const loadMergedPublicPageRegistry = async ({
  journalKv,
  notesKv,
}: LoadMergedPublicPageRegistryArgs): Promise<
  readonly AuthoredPublicPageDefinition[]
> => {
  const [journalPages, notePages] = await Promise.all([
    loadKvPublicPageRegistry({ kv: journalKv, prefix: "page:journal:" }),
    loadKvPublicPageRegistry({ kv: notesKv, prefix: "page:note:" }),
  ]);

  return [
    ...APP_STATE_PAGE_REGISTRY_STATIC_PUBLIC,
    ...journalPages,
    ...notePages,
  ];
};
