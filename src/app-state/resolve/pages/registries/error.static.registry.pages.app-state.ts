// src/app-state/resolve/pages/registries/error.static.registry.pages.app-state.ts

import type { AuthoredErrorPageDefinition } from "@shared-types/pages/definitions/error/authored.base.error.definition.page.types";

import { authoredGoneErrorPage } from "@pages/error/static/authored.410.error.page";
import { authoredNotFoundErrorPage } from "@pages/error/static/authored.404.error.page";
import { authoredInternalErrorPage } from "@pages/error/static/authored.500.error.page";

export const APP_STATE_PAGE_REGISTRY_STATIC_ERROR: readonly AuthoredErrorPageDefinition[] =
  [
    authoredGoneErrorPage,
    authoredNotFoundErrorPage,
    authoredInternalErrorPage,
  ] as const;
