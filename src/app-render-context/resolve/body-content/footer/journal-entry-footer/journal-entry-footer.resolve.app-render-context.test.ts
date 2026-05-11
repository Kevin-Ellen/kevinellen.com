// src/app-render-context/resolve/body-content/footer/journal-entry-footer.resolve.app-render-context.test.ts

import type { AppContextJournalEntryFooter } from "@shared-types/page-content/footer/journal-entry-footer/app-context.journal-entry-footer.types";

import { appRenderContextResolveJournalEntryFooter } from "@app-render-context/resolve/body-content/footer/journal-entry-footer/journal-entry-footer.resolve.app-render-context";
import { formatDate } from "@utils/date.format.util";

jest.mock("@utils/date.format.util", () => ({
  formatDate: jest.fn(),
}));

describe("appRenderContextResolveJournalEntryFooter", () => {
  const mockedFormatDate = jest.mocked(formatDate);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("formats publication dates", () => {
    mockedFormatDate
      .mockReturnValueOnce("9 May 2026")
      .mockReturnValueOnce("11 May 2026");

    const footer: AppContextJournalEntryFooter = {
      kind: "journalEntryFooter",
      publication: {
        author: "kevin",
        publishedAt: "2026-05-09T08:00:00.000Z",
        updatedAt: ["2026-05-10T08:00:00.000Z", "2026-05-11T08:00:00.000Z"],
      },
      tags: ["coots", "field-notes"],
      equipment: {
        cameras: [],
        lenses: [],
      },
    };

    expect(appRenderContextResolveJournalEntryFooter(footer)).toEqual({
      ...footer,
      publication: {
        author: "kevin",
        publishedAt: "9 May 2026",
        updatedAt: "11 May 2026",
      },
    });

    expect(mockedFormatDate).toHaveBeenNthCalledWith(
      1,
      "2026-05-09T08:00:00.000Z",
    );
    expect(mockedFormatDate).toHaveBeenNthCalledWith(
      2,
      "2026-05-11T08:00:00.000Z",
    );
  });

  it("falls back to publishedAt when there are no updatedAt values", () => {
    mockedFormatDate
      .mockReturnValueOnce("9 May 2026")
      .mockReturnValueOnce("9 May 2026");

    const footer: AppContextJournalEntryFooter = {
      kind: "journalEntryFooter",
      publication: {
        author: "kevin",
        publishedAt: "2026-05-09T08:00:00.000Z",
        updatedAt: [],
      },
      tags: [],
      equipment: {
        cameras: [],
        lenses: [],
      },
    };

    expect(appRenderContextResolveJournalEntryFooter(footer)).toEqual({
      ...footer,
      publication: {
        author: "kevin",
        publishedAt: "9 May 2026",
        updatedAt: "9 May 2026",
      },
    });

    expect(mockedFormatDate).toHaveBeenCalledTimes(2);
    expect(mockedFormatDate).toHaveBeenNthCalledWith(
      1,
      "2026-05-09T08:00:00.000Z",
    );
    expect(mockedFormatDate).toHaveBeenNthCalledWith(
      2,
      "2026-05-09T08:00:00.000Z",
    );
  });
});
