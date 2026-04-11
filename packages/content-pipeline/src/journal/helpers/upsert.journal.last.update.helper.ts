// packages/content-pipeline/src/journal/helpers/upsert.journal.last.update.helper.ts

import type { JournalKvRecord } from "@content-pipeline/journal/types/journal.kv.record.types";

export const upsertJournalLastUpdate = (
  journal: JournalKvRecord,
  timestamp: string,
): JournalKvRecord => {
  const publication = journal.content.footer.publication.filter(
    (item) => item.label !== "Last update",
  );

  return {
    ...journal,
    content: {
      ...journal.content,
      footer: {
        ...journal.content.footer,
        publication: [
          ...publication,
          {
            label: "Last update",
            value: timestamp,
          },
        ],
      },
    },
  };
};
