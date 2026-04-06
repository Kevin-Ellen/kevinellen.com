// src/app/appContext/resolvers/metadata.resolve.appContext.ts

import type { AppContextMetadata } from "@app/appContext/appContext.types";
import type { PublicPage } from "@shared-types/content/pages/public/public.page.union";
import type { ErrorPage } from "@shared-types/content/pages/error/error.page.union";

import { isPublicPage } from "@app/appContext/guards/isPublicPage.guard.appContext";
import { resolveCanonicalUrl } from "@app/appContext/resolvers/canonical.resolve.appContext";

type MetadataResolvablePage = PublicPage | ErrorPage;

export const resolveMetadataAppContext = (
  env: Env,
  page: MetadataResolvablePage,
): AppContextMetadata => {
  const canonicalUrl = isPublicPage(page)
    ? resolveCanonicalUrl(env, page)
    : null;

  return {
    title: page.meta.pageTitle,
    description: page.meta.metaDescription,
    canonicalUrl,
  };
};
