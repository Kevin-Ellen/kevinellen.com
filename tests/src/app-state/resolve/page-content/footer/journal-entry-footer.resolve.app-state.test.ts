// tests/src/app-state/resolve/page-content/footer/journal-entry-footer.resolve.app-state.test.ts

import { appStateResolveJournalEntryFooterModule } from "@app-state/resolve/page-content/footer/journal-entry-footer.resolve.app-state";

describe("appStateResolveJournalEntryFooterModule", () => {
  it("returns the authored journal entry footer module unchanged", () => {
    const module = {
      kind: "journalEntryFooter",
      publication: {
        author: "Kevin Ellen",
        publishedAt: "2025-05-27T10:30:00.000Z",
        updatedAt: ["2025-05-28T10:30:00.000Z"],
      },
      tags: ["Mallorca", "Birds"],
    } as const;

    expect(appStateResolveJournalEntryFooterModule(module)).toBe(module);
  });
});
