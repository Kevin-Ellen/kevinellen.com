// src/app-state/resolve/page-content/footer/note-entry-footer.resolve.app-state.test.ts

import type { AuthoredNoteEntryFooter } from "@shared-types/page-content/footer/note-entry-footer/authored.note-entry-footer.types";

import { appStateResolveNoteEntryFooter } from "@app-state/resolve/page-content/footer/note-entry-footer/note-entry-footer.resolve.app-state";

describe("appStateResolveNoteEntryFooter", () => {
  it("passes authored note footer content through unchanged", () => {
    const footer: AuthoredNoteEntryFooter = {
      kind: "noteEntryFooter",
      publication: {
        author: "Kevin Ellen",
        publishedAt: "2026-05-10T22:14:49+01:00",
        updatedAt: ["2026-05-10T22:14:49+01:00", "2026-05-11T09:00:00+01:00"],
      },
      topic: "Architecture",
      tags: ["typescript", "cloudflare-workers"],
    };

    expect(appStateResolveNoteEntryFooter(footer)).toEqual(footer);
  });
});
