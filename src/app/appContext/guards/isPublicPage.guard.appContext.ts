// src/app/appContext/guards/isPublicPage.guard.appContext.ts

import type { PublicPage } from "@shared-types/content/pages/public/public.page.union";
import type { ErrorPage } from "@shared-types/content/pages/error/error.page.union";

export const isPublicPage = (
  page: PublicPage | ErrorPage,
): page is PublicPage => {
  return page.core.kind !== "error";
};
