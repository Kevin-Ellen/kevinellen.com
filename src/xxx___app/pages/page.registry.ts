// src/app/pages/page.registry.ts

import type { PageDefinition } from "@app/pages/page.definition";
import type { ErrorPages } from "@app/appState/appState.types";

import { homePage } from "@app/pages/public/home.page";

import { error404page } from "@app/pages/error/error.404.page";
import { error500page } from "@app/pages/error/error.500.page";
import { error410page } from "@app/pages/error/error.410.page";

export const STATIC_PAGE_REGISTRY: readonly PageDefinition[] = [
  homePage,
] as const;

export const ERROR_PAGE_REGISTRY: ErrorPages = {
  404: error404page,
  410: error410page,
  500: error500page,
} as const;
