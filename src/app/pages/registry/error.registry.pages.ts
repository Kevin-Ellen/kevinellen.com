// src/app/pages/registry/error.registry.pages.ts

import type { ErrorPageDefinition } from "@shared-types/pages/page.definition";

import { error404Page } from "@app/pages/error/404.error.page";
import { error410Page } from "@app/pages/error/410.error.page";
import { error500Page } from "@app/pages/error/500.error.page";

export const REGISTRY_ERROR_PAGES: readonly ErrorPageDefinition[] = [
  error404Page,
  error410Page,
  error500Page,
];
