// src/app/pages/registry/public.registry.pages.ts

import type { HomePageDefinition } from "@shared-types/pages/definitions/home.definition.page";

import { homePage } from "@app/pages/public/home.page";
// import { journalPage } from "@app/pages/public/journal.page";

type PageDefinition = HomePageDefinition;

export const REGISTRY_PUBLIC_PAGES: readonly PageDefinition[] = [
  homePage,
  // journalPage,
];
