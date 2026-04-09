// src/app/appContext/resolvers/photo/extract.photoIds.appContext.ts

import type { AppContextPhotoId } from "@app/appContext/appContext.types";
import type { ErrorPage } from "@shared-types/content/pages/error/error.page.union";
import type { PublicPage } from "@shared-types/content/pages/public/public.page.union";

const collectPhotoIds = (
  value: unknown,
  found: Set<AppContextPhotoId>,
): void => {
  if (value === null || value === undefined) {
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectPhotoIds(item, found);
    }
    return;
  }

  if (typeof value !== "object") {
    return;
  }

  const record = value as Record<string, unknown>;

  for (const [key, child] of Object.entries(record)) {
    if (key === "photoId" && typeof child === "string" && child.length > 0) {
      found.add(child);
      continue;
    }

    collectPhotoIds(child, found);
  }
};

export const extractPhotoIdsAppContext = (
  page: PublicPage | ErrorPage,
): readonly AppContextPhotoId[] => {
  const found = new Set<AppContextPhotoId>();

  collectPhotoIds(page, found);

  return [...found];
};
