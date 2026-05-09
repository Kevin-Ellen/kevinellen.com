// src/app-state/resolve/page-content/block/journal-listing.resolve.app-state.test.ts

import { appStateResolveJournalListingBlock } from "@app-state/resolve/page-content/block/journal-listing.resolve.app-state";

describe("appStateResolveJournalListingBlock", () => {
  it("applies deterministic defaults", () => {
    expect(
      appStateResolveJournalListingBlock({
        kind: "journalListing",
        pagination: {
          pageSize: 10,
        },
      } as never),
    ).toEqual({
      kind: "journalListing",
      pagination: {
        pageSize: 10,
      },
      flow: "content",
    });
  });

  it("preserves authored flow", () => {
    expect(
      appStateResolveJournalListingBlock({
        kind: "journalListing",
        pagination: {
          pageSize: 20,
        },
        flow: "breakout",
      } as never),
    ).toEqual({
      kind: "journalListing",
      pagination: {
        pageSize: 20,
      },
      flow: "breakout",
    });
  });
});
