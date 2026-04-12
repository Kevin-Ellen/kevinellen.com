// src/app-state/resolve/pages/error.pages.resolve.app-state.ts

import type { AuthoredErrorPageDefinition } from "@shared-types/pages/definitions/error/authored.base.error.definition.page.types";
import type { AppStateErrorPageDefinition } from "@shared-types/pages/definitions/error/app-state.base.error.definition.page.types";

import { APP_STATE_PAGE_REGISTRY_STATIC_ERROR } from "@app-state/resolve/pages/registries/error.static.registry.pages.app-state";

import { appStateResolveErrorPage } from "@app-state/resolve/pages/error/error.page.resolve.app-state";

export const appStateResolveErrorPages =
  (): readonly AppStateErrorPageDefinition[] => {
    const mergedPublicRegistries: readonly AuthoredErrorPageDefinition[] = [
      ...APP_STATE_PAGE_REGISTRY_STATIC_ERROR,
    ];

    return mergedPublicRegistries.map(appStateResolveErrorPage);
  };
