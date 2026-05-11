// src/app-state/resolve/page-content/block/note-listing.resolve.app-state.test.ts

import type { AuthoredNoteListingBlock } from "@shared-types/page-content/block/note-listing/authored.note-listing.block.types";

import { appStateResolveNoteListingBlock } from "@app-state/resolve/page-content/block/note-listing.resolve.app-state";

describe("appStateResolveNoteListingBlock", () => {
  it("defaults flow to content", () => {
    const module: AuthoredNoteListingBlock = {
      kind: "noteListing",
      pagination: {
        pageSize: 10,
      },
    };

    expect(appStateResolveNoteListingBlock(module)).toEqual({
      ...module,
      flow: "content",
    });
  });

  it("preserves authored flow", () => {
    const module: AuthoredNoteListingBlock = {
      kind: "noteListing",
      flow: "breakout",
      pagination: {
        pageSize: 10,
      },
    };

    expect(appStateResolveNoteListingBlock(module)).toEqual({
      ...module,
      flow: "breakout",
    });
  });
});
