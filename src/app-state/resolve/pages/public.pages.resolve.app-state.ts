// src/app-state/resolve/pages/public.pages.resolve.app-state.ts

import type { AppStatePublicPageDefinition } from "@shared-types/pages/definitions/public/app-state.public.definition.page.types";

import { APP_STATE_PAGE_REGISTRY_PUBLIC_MERGED } from "@app-state/resolve/pages/registries/public.registry.pages.app-state";

import { appStateResolvePublicPage } from "@app-state/resolve/pages/public/public.page.resolve.app-state";

export const appStateResolvePublicPages =
  (): readonly AppStatePublicPageDefinition[] => {
    return APP_STATE_PAGE_REGISTRY_PUBLIC_MERGED.map(appStateResolvePublicPage);
  };
