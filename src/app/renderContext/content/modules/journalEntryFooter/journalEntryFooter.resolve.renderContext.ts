// src/app/renderContext/content/modules/journalEntryFooter/journalEntryFooter.resolve.renderContext.ts

import type { AppContextJournalEntryFooterModule } from "@app/appContext/content/modules/journalEntryFooter/journalEntryFooter.module.appContext.types";
import type {
  RenderContextJournalEntryFooterModule,
  RenderContextJournalEntryFooterPublicationItem,
} from "@app/renderContext/content/modules/journalEntryFooter/journalEntryFooter.module.renderContext.types";

const collapseRedundantPublicationItems = (
  items: readonly { label: string; value: string }[],
): readonly { label: string; value: string }[] => {
  const published = items.find((item) => item.label === "Published");
  const lastUpdate = items.find((item) => item.label === "Last update");

  if (published && lastUpdate && published.value === lastUpdate.value) {
    return items.filter((item) => item.label !== "Last update");
  }

  return items;
};

const mapPublicationItem = (item: {
  label: string;
  value: string;
}): RenderContextJournalEntryFooterPublicationItem => {
  if (item.label === "Published" || item.label === "Last update") {
    return {
      kind: "date",
      label: item.label,
      value: item.value,
    };
  }

  return {
    kind: "text",
    label: item.label,
    value: item.value,
  };
};

export const resolveJournalEntryFooterRenderContext = (
  footer: AppContextJournalEntryFooterModule,
): RenderContextJournalEntryFooterModule => {
  return {
    kind: "journalEntryFooter",
    publication: collapseRedundantPublicationItems(
      footer.publication.map((item) => ({
        label: item.label,
        value: item.value,
      })),
    ).map(mapPublicationItem),
    fieldNotes: footer.fieldNotes.map((item) => ({
      label: item.label,
      values: item.values,
    })),
  };
};
