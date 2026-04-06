// src/app/content/pages/registry.pages.ts

import type { ErrorPage } from "@shared-types/content/pages/error/error.page.union";
import type { PublicPage } from "@shared-types/content/pages/public/public.page.union";

import { homePage } from "@app/content/pages/public/home.public.page";
import { journalListingPage } from "@app/content/pages/public/journal-listing.public.page";

import { aboutPage } from "@app/content/pages/public/about/about.public.page";

import { notFoundErrorPage } from "@app/content/pages/error/404.error.page";
import { goneErrorPage } from "@app/content/pages/error/410.error.page";
import { internalErrorPage } from "@app/content/pages/error/500.error.page";

const PUBLIC_PAGES = [homePage, journalListingPage, aboutPage];

const ERROR_PAGES: readonly ErrorPage[] = [
  notFoundErrorPage,
  goneErrorPage,
  internalErrorPage,
];

export type PageRegistry = {
  public: readonly PublicPage[];
  error: readonly ErrorPage[];
};

export const PAGE_REGISTRY: PageRegistry = {
  public: PUBLIC_PAGES,
  error: ERROR_PAGES,
};
