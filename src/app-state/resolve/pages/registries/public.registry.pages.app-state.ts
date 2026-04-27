// src/app-state/resolve/pages/registries/public.registry.pages.app-state.ts

import type { AuthoredPublicPageDefinition } from "@shared-types/page-definitions/authored.public.page-definition.types";

import { APP_STATE_PAGE_REGISTRY_KV_PUBLIC } from "@app-state/resolve/pages/registries/public.kv.registry.pages.app-state";
import { APP_STATE_PAGE_REGISTRY_STATIC_PUBLIC } from "@app-state/resolve/pages/registries/public.static.registry.pages.app-state";

export const APP_STATE_PAGE_REGISTRY_PUBLIC_MERGED: readonly AuthoredPublicPageDefinition[] =
  [
    ...APP_STATE_PAGE_REGISTRY_STATIC_PUBLIC,
    ...APP_STATE_PAGE_REGISTRY_KV_PUBLIC,
  ] as const;
