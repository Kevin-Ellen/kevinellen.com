// src/app-context/resolve/page/content/footer/journal-entry-footer.page-content.resolve.app-context.ts

import type { AppStateJournalEntryFooterModule } from "@shared-types/page-content/footer/journal-entry-footer/app-state.journal-entry-footer.page-content.types";
import type { AppContextJournalEntryFooterModule } from "@shared-types/page-content/footer/journal-entry-footer/app-context.journal-entry-footer.page-content.types";

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";

const uniqueDefinedStrings = (
  values: readonly (string | null)[],
): readonly string[] => [
  ...new Set(
    values.filter(
      (value): value is string =>
        typeof value === "string" && value.trim().length > 0,
    ),
  ),
];

const resolveCameraLabel = (
  cameraMake: string | null,
  cameraModel: string | null,
): string | null => {
  if (!cameraMake && !cameraModel) {
    return null;
  }

  if (cameraMake && cameraModel?.startsWith(cameraMake)) {
    return cameraModel;
  }

  return [cameraMake, cameraModel].filter(Boolean).join(" ").trim();
};

export const appContextResolveJournalEntryFooterModule = (
  module: AppStateJournalEntryFooterModule,
  context: AppContextPageContentResolverContext,
): AppContextJournalEntryFooterModule => {
  const cameras = uniqueDefinedStrings(
    context.photos.map((photo) =>
      resolveCameraLabel(photo.cameraMake, photo.cameraModel),
    ),
  );

  const lenses = uniqueDefinedStrings(
    context.photos.map((photo) => photo.lensModel),
  );

  return {
    ...module,
    equipment: {
      cameras,
      lenses,
    },
  };
};
