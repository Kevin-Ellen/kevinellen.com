// tests/src/app-state/resolve/page-content/block/journal-listing.resolve.app-state.test.ts

import { appStateResolveJournalListingBlockContentModule } from "@app-state/resolve/page-content/block/journal-listing.resolve.app-state";

import type { AuthoredJournalListingBlockContentModule } from "@shared-types/page-content/block/journal-listing/authored.journal-listing.block.page-content.types";
import type { AppStateJournalListingBlockContentModule } from "@shared-types/page-content/block/journal-listing/app-state.journal-listing.block.page-content.types";

describe("appStateResolveJournalListingBlockContentModule", () => {
  it("returns journal listing block content unchanged", () => {
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
    };

    expect(result).toEqual(expected);
  });

  it("returns the same object reference", () => {
    const module: AuthoredJournalListingBlockContentModule = {
      kind: "journalListing",
      pagination: {
        pageSize: 6,
      },
    };

    const result = appStateResolveJournalListingBlockContentModule(module);

    expect(result).toBe(module);
  });
});
