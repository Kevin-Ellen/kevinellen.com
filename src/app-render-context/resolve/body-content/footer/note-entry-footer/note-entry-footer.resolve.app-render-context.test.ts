// src/app-render-context/resolve/body-content/footer/note-entry-footer/note-entry-footer.resolve.app-render-context.test.ts

import type { AppContextNoteEntryFooter } from "@shared-types/page-content/footer/note-entry-footer/app-context.note-entry-footer.types";

import { appRenderContextResolveNoteEntryFooter } from "@app-render-context/resolve/body-content/footer/note-entry-footer/note-entry-footer.resolve.app-render-context";
import { formatDate } from "@utils/date.format.util";

jest.mock("@utils/date.format.util", () => ({
  formatDate: jest.fn(),
}));

describe("appRenderContextResolveNoteEntryFooter", () => {
  const mockedFormatDate = jest.mocked(formatDate);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("formats publication dates and preserves topic metadata", () => {
    mockedFormatDate
      .mockReturnValueOnce("10 May 2026")
      .mockReturnValueOnce("11 May 2026");

    const footer: AppContextNoteEntryFooter = {
      kind: "noteEntryFooter",
      publication: {
        author: "Kevin",
        publishedAt: "2026-05-10T22:14:49+01:00",
        updatedAt: ["2026-05-10T22:14:49+01:00", "2026-05-11T09:00:00+01:00"],
      },
      topic: "Architecture",
      tags: ["typescript", "cloudflare-workers"],
    };

    expect(appRenderContextResolveNoteEntryFooter(footer)).toEqual({
      ...footer,
      publication: {
        author: "Kevin",
        publishedAt: "10 May 2026",
        updatedAt: "11 May 2026",
      },
    });

    expect(mockedFormatDate).toHaveBeenNthCalledWith(
      1,
      "2026-05-10T22:14:49+01:00",
    );
    expect(mockedFormatDate).toHaveBeenNthCalledWith(
      2,
      "2026-05-11T09:00:00+01:00",
    );
  });

  it("falls back to publishedAt when there are no updatedAt values", () => {
    mockedFormatDate
      .mockReturnValueOnce("10 May 2026")
      .mockReturnValueOnce("10 May 2026");

    const footer: AppContextNoteEntryFooter = {
      kind: "noteEntryFooter",
      publication: {
        author: "Kevin",
        publishedAt: "2026-05-10T22:14:49+01:00",
        updatedAt: [],
      },
      topic: "Architecture",
      tags: [],
    };

    expect(appRenderContextResolveNoteEntryFooter(footer)).toEqual({
      ...footer,
      publication: {
        author: "Kevin",
        publishedAt: "10 May 2026",
        updatedAt: "10 May 2026",
      },
    });

    expect(mockedFormatDate).toHaveBeenCalledTimes(2);
  });
});
