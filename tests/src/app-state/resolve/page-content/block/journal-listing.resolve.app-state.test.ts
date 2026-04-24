// tests/src/app-state/resolve/page-content/block/journal-listing.resolve.app-state.test.ts

import { appStateResolveJournalListingBlockContentModule } from "@app-state/resolve/page-content/block/journal-listing.resolve.app-state";

import type { AuthoredJournalListingBlockContentModule } from "@shared-types/page-content/block/journal-listing/authored.journal-listing.block.page-content.types";
import type { AppStateJournalListingBlockContentModule } from "@shared-types/page-content/block/journal-listing/app-state.journal-listing.block.page-content.types";

describe("appStateResolveJournalListingBlockContentModule", () => {
  it("returns journal listing block content with deterministic flow", () => {
    const module: AuthoredJournalListingBlockContentModule = {
      kind: "journalListing",
      pagination: {
        pageSize: 12,
      },
    };

    const result = appStateResolveJournalListingBlockContentModule(module);

    const expected: AppStateJournalListingBlockContentModule = {
      kind: "journalListing",
      pagination: {
        pageSize: 12,
      },
      flow: "content",
    };

    expect(result).toEqual(expected);
  });

  it("preserves authored flow when provided", () => {
    const module: AuthoredJournalListingBlockContentModule = {
      kind: "journalListing",
      pagination: {
        pageSize: 6,
      },
      flow: "breakout",
    };

    const result = appStateResolveJournalListingBlockContentModule(module);

    expect(result).toEqual({
      kind: "journalListing",
      pagination: {
        pageSize: 6,
      },
      flow: "breakout",
    });
  });
});
