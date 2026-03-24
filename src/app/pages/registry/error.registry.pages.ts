// src/app/pages/registry/error.registry.pages.ts

import type { ErrorPageDefinition } from "@app/pages/page.definition";

import { error404Page } from "@app/pages/error/404.error.page";

export const REGISTRY_ERROR_PAGES: readonly ErrorPageDefinition[] = [
  error404Page,
];
