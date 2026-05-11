// src/app-state/resolve/page-content/footer/journal-entry-footer/journal-entry-footer.resolve.app-state.test.ts

import type { AuthoredJournalEntryFooter } from "@shared-types/page-content/footer/journal-entry-footer/authored.journal-entry-footer.types";
import { appStateResolveJournalEntryFooter } from "@app-state/resolve/page-content/footer/journal-entry-footer/journal-entry-footer.resolve.app-state";

describe("appStateResolveJournalEntryFooter", () => {
  it("returns the authored journal entry footer unchanged", () => {
    const footer = {
      kind: "journalEntryFooter",
      publication: {
        author: "Kevin Ellen",
        publishedAt: "2026-05-06",
        updatedAt: [],
      },
      tags: ["wildlife", "field-notes"],
    } satisfies AuthoredJournalEntryFooter;

    expect(appStateResolveJournalEntryFooter(footer)).toBe(footer);
  });
});
