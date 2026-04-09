// src/app/appContext/content/modules/journalEntryFooter/journalEntryFooter.resolve.appContext.ts

import type { AppContextPhoto } from "@app/appContext/appContext.types";
import type { AppContextJournalEntryFooterModule } from "@app/appContext/content/modules/journalEntryFooter/journalEntryFooter.module.appContext.types";
import type { JournalEntryFooterAuthored } from "@shared-types/content/pages/public/journal-entry/journal-entry.public.page.content";

const getUniqueDefinedValues = (
  values: readonly (string | undefined)[],
): readonly string[] => {
  return [
    ...new Set(values.filter((value): value is string => Boolean(value))),
  ];
};

const buildFieldNotes = (
  photos: readonly AppContextPhoto[],
): AppContextJournalEntryFooterModule["fieldNotes"] => {
  const cameras = getUniqueDefinedValues(
    photos.map((photo) => photo.cameraModel),
  );

  const lenses = getUniqueDefinedValues(photos.map((photo) => photo.lensModel));

  return [
    ...(cameras.length > 0
      ? [
          {
            label: "Camera",
            values: cameras,
          },
        ]
      : []),
    ...(lenses.length > 0
      ? [
          {
            label: "Lens",
            values: lenses,
          },
        ]
      : []),
  ];
};

export const resolveJournalEntryFooterAppContext = (
  footer: JournalEntryFooterAuthored,
  photos: readonly AppContextPhoto[],
): AppContextJournalEntryFooterModule => {
  return {
    kind: "journalEntryFooter",
    publication: footer.publication.map((item) => ({
      label: item.label,
      value: item.value,
    })),
    fieldNotes: buildFieldNotes(photos),
  };
};
