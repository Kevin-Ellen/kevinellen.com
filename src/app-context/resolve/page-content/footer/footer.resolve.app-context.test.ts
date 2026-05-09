// src/app-context/resolve/page-content/footer/footer.resolve.app-context.test.ts

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";
import type { AppStatePageContentFooter } from "@shared-types/page-content/footer/app-state.page-footer.types";

import { appContextResolveFooter } from "@app-context/resolve/page-content/footer/footer.resolve.app-context";

import { appContextResolveJournalEntryFooter } from "@app-context/resolve/page-content/footer/journal-entry-footer.resolve.app-context";

jest.mock(
  "@app-context/resolve/page-content/footer/journal-entry-footer.resolve.app-context",
  () => ({
    appContextResolveJournalEntryFooter: jest.fn(),
  }),
);

describe("appContextResolveFooter", () => {
  const mockedAppContextResolveJournalEntryFooter = jest.mocked(
    appContextResolveJournalEntryFooter,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves journal entry footer modules", () => {
    const context = {} as AppContextPageContentResolverContext;

    const module = {
      kind: "journalEntryFooter",
      publication: {
        author: "Kevin",
        publishedAt: "2025-05-10",
        updatedAt: [],
      },
      tags: [],
    } as AppStatePageContentFooter;

    const resolved = {
      ...module,
      equipment: {
        cameras: [],
        lenses: [],
      },
    };

    mockedAppContextResolveJournalEntryFooter.mockReturnValue(
      resolved as never,
    );

    const result = appContextResolveFooter(module, context);

    expect(result).toBe(resolved);

    expect(mockedAppContextResolveJournalEntryFooter).toHaveBeenCalledTimes(1);
    expect(mockedAppContextResolveJournalEntryFooter).toHaveBeenCalledWith(
      module,
      context,
    );
  });
});
