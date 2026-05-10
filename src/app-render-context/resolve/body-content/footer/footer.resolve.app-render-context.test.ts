// src/app-render-context/resolve/body-content/footer/footer.resolve.app-render-context.test.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextJournalEntryFooter } from "@shared-types/page-content/footer/journal-entry-footer/app-context.journal-entry-footer.types";

import { appRenderContextResolveFooter } from "@app-render-context/resolve/body-content/footer/footer.resolve.app-render-context";
import { appRenderContextResolveJournalEntryFooter } from "@app-render-context/resolve/body-content/footer/journal-entry-footer.resolve.app-render-context";

jest.mock(
  "@app-render-context/resolve/body-content/footer/journal-entry-footer.resolve.app-render-context",
  () => ({
    appRenderContextResolveJournalEntryFooter: jest.fn(),
  }),
);

describe("appRenderContextResolveFooter", () => {
  const mockedAppRenderContextResolveJournalEntryFooter = jest.mocked(
    appRenderContextResolveJournalEntryFooter,
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
});
