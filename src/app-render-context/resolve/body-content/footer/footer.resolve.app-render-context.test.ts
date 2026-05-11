// src/app-render-context/resolve/body-content/footer/footer.resolve.app-render-context.test.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextJournalEntryFooter } from "@shared-types/page-content/footer/journal-entry-footer/app-context.journal-entry-footer.types";
import type { AppContextNoteEntryFooter } from "@shared-types/page-content/footer/note-entry-footer/app-context.note-entry-footer.types";

import { appRenderContextResolveFooter } from "@app-render-context/resolve/body-content/footer/footer.resolve.app-render-context";
import { appRenderContextResolveJournalEntryFooter } from "@app-render-context/resolve/body-content/footer/journal-entry-footer/journal-entry-footer.resolve.app-render-context";
import { appRenderContextResolveNoteEntryFooter } from "@app-render-context/resolve/body-content/footer/note-entry-footer/note-entry-footer.resolve.app-render-context";

jest.mock(
  "@app-render-context/resolve/body-content/footer/journal-entry-footer/journal-entry-footer.resolve.app-render-context",
  () => ({
    appRenderContextResolveJournalEntryFooter: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/body-content/footer/note-entry-footer/note-entry-footer.resolve.app-render-context",
  () => ({
    appRenderContextResolveNoteEntryFooter: jest.fn(),
  }),
);

describe("appRenderContextResolveFooter", () => {
  const mockedAppRenderContextResolveJournalEntryFooter = jest.mocked(
    appRenderContextResolveJournalEntryFooter,
  );

  const mockedAppRenderContextResolveNoteEntryFooter = jest.mocked(
    appRenderContextResolveNoteEntryFooter,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves a journal entry footer", () => {
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

    const resolvedFooter = {
      ...footer,
      publication: {
        author: "kevin",
        publishedAt: "9 May 2026",
        updatedAt: "2026-05-09T08:00:00.000Z",
      },
    };

    mockedAppRenderContextResolveJournalEntryFooter.mockReturnValue(
      resolvedFooter,
    );

    const appContext = {} as unknown as AppContext;

    expect(appRenderContextResolveFooter(appContext, footer)).toEqual(
      resolvedFooter,
    );

    expect(
      mockedAppRenderContextResolveJournalEntryFooter,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockedAppRenderContextResolveJournalEntryFooter,
    ).toHaveBeenCalledWith(footer);
  });

  it("throws when no footer resolver is registered", () => {
    const footer = {
      kind: "missingFooter",
    } as never;

    expect(() =>
      appRenderContextResolveFooter({} as unknown as AppContext, footer),
    ).toThrow(
      "No AppRenderContext footer resolver registered for kind: missingFooter",
    );
  });

  it("resolves a note entry footer", () => {
    const footer: AppContextNoteEntryFooter = {
      kind: "noteEntryFooter",
      publication: {
        author: "Kevin",
        publishedAt: "2026-05-10T22:14:49+01:00",
        updatedAt: [],
      },
      topic: "Architecture",
      tags: ["typescript"],
    };

    const resolvedFooter = {
      ...footer,
      publication: {
        author: "Kevin",
        publishedAt: "10 May 2026",
        updatedAt: "10 May 2026",
      },
    };

    mockedAppRenderContextResolveNoteEntryFooter.mockReturnValue(
      resolvedFooter as never,
    );

    const appContext = {} as unknown as AppContext;

    expect(appRenderContextResolveFooter(appContext, footer)).toEqual(
      resolvedFooter,
    );

    expect(mockedAppRenderContextResolveNoteEntryFooter).toHaveBeenCalledTimes(
      1,
    );
    expect(mockedAppRenderContextResolveNoteEntryFooter).toHaveBeenCalledWith(
      footer,
    );
  });
});
