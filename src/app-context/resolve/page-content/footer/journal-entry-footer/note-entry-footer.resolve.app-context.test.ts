// src/app-context/resolve/page-content/footer/note-entry-footer/note-entry-footer.resolve.app-context.test.ts

import type { AppStateNoteEntryFooter } from "@shared-types/page-content/footer/note-entry-footer/app-state.note-entry-footer.types";

import { appContextResolveNoteEntryFooter } from "@app-context/resolve/page-content/footer/note-entry-footer/note-entry-footer.resolve.app-context";

describe("appContextResolveNoteEntryFooter", () => {
  it("passes note footer metadata through unchanged", () => {
    const module: AppStateNoteEntryFooter = {
      kind: "noteEntryFooter",
      publication: {
        author: "Kevin",
        publishedAt: "2026-05-10T22:14:49+01:00",
        updatedAt: ["2026-05-10T22:14:49+01:00"],
      },
      topic: "Architecture",
      tags: ["typescript"],
    };

    expect(appContextResolveNoteEntryFooter(module)).toEqual(module);
  });
});
