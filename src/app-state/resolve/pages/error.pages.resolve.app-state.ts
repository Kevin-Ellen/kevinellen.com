// src/app-state/resolve/pages/error.pages.resolve.app-state.ts

import type { AuthoredErrorPageDefinition } from "@shared-types/page-definitions/authored.error.page-definition.types";
import type { AppStatePageDefinition } from "@shared-types/page-definitions/app-state.page-definition.types";
import { APP_STATE_PAGE_REGISTRY_STATIC_ERROR } from "@app-state/resolve/pages/registries/error.static.registry.pages.app-state";

import { appStateResolveErrorPage } from "@app-state/resolve/pages/error/error.page.resolve.app-state";

export const appStateResolveErrorPages =
  (): readonly AppStatePageDefinition[] => {
    const mergedPublicRegistries: readonly AuthoredErrorPageDefinition[] = [
      ...APP_STATE_PAGE_REGISTRY_STATIC_ERROR,
    ];

    return mergedPublicRegistries.map(appStateResolveErrorPage);
  };
