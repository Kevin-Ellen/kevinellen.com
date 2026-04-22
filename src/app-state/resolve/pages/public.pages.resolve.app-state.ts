// src/app-state/resolve/pages/public.pages.resolve.app-state.ts

import type { AppStatePageDefinition } from "@shared-types/page-definitions/app-state.page-definition.types";

import { APP_STATE_PAGE_REGISTRY_PUBLIC_MERGED } from "@app-state/resolve/pages/registries/public.registry.pages.app-state";

import { appStateResolvePublicPage } from "@app-state/resolve/pages/public/public.page.resolve.app-state";

export const appStateResolvePublicPages =
  (): readonly AppStatePageDefinition[] => {
    return APP_STATE_PAGE_REGISTRY_PUBLIC_MERGED.map(appStateResolvePublicPage);
  };
