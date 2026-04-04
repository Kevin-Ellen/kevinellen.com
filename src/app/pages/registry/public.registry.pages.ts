// src/app/pages/registry/public.registry.pages.ts

import type { PageDefinition } from "@shared-types/pages/page.definition";

import { homePage } from "@app/pages/public/home.page";
import { journalPage } from "@app/pages/public/journal.page";

export const REGISTRY_PUBLIC_PAGES: readonly PageDefinition[] = [
  homePage,
  journalPage,
];
