// src/app/content/pages/registry.pages.ts

import type { ErrorPage } from "@shared-types/content/pages/error/error.page.union";
import type { PublicPage } from "@shared-types/content/pages/public/public.page.union";
import type { JournalEntryPageDefinition } from "@shared-types/content/pages/public/journal-entry/journal-entry.public.page.definition";

import { homePage } from "@app/content/pages/public/home.public.page";
import { journalListingPage } from "@app/content/pages/public/journal/journal-listing.public.page";

// About
import { aboutPage } from "@app/content/pages/public/about/about.public.page";
import { equipmentAboutPage } from "@app/content/pages/public/about/equipment.about.page";
import { technologyAboutPage } from "@app/content/pages/public/about/technology.about.page";

// Legal
import { termsLegalPage } from "@app/content/pages/public/legal/terms.legal.page";
import { licensingLegalPage } from "@app/content/pages/public/legal/licensing.legal.page";
import { privacyLegalPage } from "@app/content/pages/public/legal/privacy.legal.page";

// Errors
import { notFoundErrorPage } from "@app/content/pages/error/404.error.page";
import { goneErrorPage } from "@app/content/pages/error/410.error.page";
import { internalErrorPage } from "@app/content/pages/error/500.error.page";

// TEMP
import { exampleJournalEntryPage } from "./public/journal/example.journal.page";

const PUBLIC_PAGES: readonly PublicPage[] = [
  homePage,
  journalListingPage,
  aboutPage,
  equipmentAboutPage,
  technologyAboutPage,
  termsLegalPage,
  licensingLegalPage,
  privacyLegalPage,
];

const ERROR_PAGES: readonly ErrorPage[] = [
  notFoundErrorPage,
  goneErrorPage,
  internalErrorPage,
];

const getJournalPagesKV = (): readonly JournalEntryPageDefinition[] => {
  return [exampleJournalEntryPage];
};

const mergedPublicPages: readonly PublicPage[] = [
  ...PUBLIC_PAGES,
  ...getJournalPagesKV(),
];

export type PageRegistry = {
  public: readonly PublicPage[];
  error: readonly ErrorPage[];
};

export const PAGE_REGISTRY: PageRegistry = {
  public: mergedPublicPages,
  error: ERROR_PAGES,
};
