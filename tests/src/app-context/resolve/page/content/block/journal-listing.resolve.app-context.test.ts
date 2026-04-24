// tests/src/app-context/resolve/page/content/block/journal-listing.resolve.app-context.test.ts

import { appContextResolveJournalListingBlockContentModule } from "@app-context/resolve/page/content/block/journal-listing.resolve.app-context";

describe("appContextResolveJournalListingBlockContentModule", () => {
  it("returns the journal listing module unchanged", () => {
    const module = {
      kind: "journalListing",
      pagination: {
        pageSize: 10,
      },
      flow: "content",
    } as const;

    const result = appContextResolveJournalListingBlockContentModule(
      module,
      {} as never,
    );

    expect(result).toBe(module);
  });
});
