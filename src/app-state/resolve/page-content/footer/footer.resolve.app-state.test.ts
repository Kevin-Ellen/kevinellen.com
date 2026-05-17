// src/app-state/resolve/page-content/footer/footer.resolve.app-state.test.ts

import { appStateResolveFooter } from "@app-state/resolve/page-content/footer/footer.resolve.app-state";

import { appStateResolveJournalEntryFooter } from "@app-state/resolve/page-content/footer/journal-entry-footer/journal-entry-footer.resolve.app-state";

jest.mock(
  "@app-state/resolve/page-content/footer/journal-entry-footer/journal-entry-footer.resolve.app-state",
  () => ({
    appStateResolveJournalEntryFooter: jest.fn(),
  }),
);

describe("appStateResolveFooter", () => {
  const mockedAppStateResolveJournalEntryFooter = jest.mocked(
    appStateResolveJournalEntryFooter,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("delegates journal entry footers to the matching resolver", () => {
    const footer = {
      kind: "journalEntryFooter",
      publication: {
        author: "Kevin Ellen",
        publishedAt: "2026-05-06",
        updatedAt: [],
      },
      tags: ["wildlife"],
    };

    const resolvedFooter = {
      ...footer,
      resolved: true,
    };

    mockedAppStateResolveJournalEntryFooter.mockReturnValue(
      resolvedFooter as never,
    );

    expect(appStateResolveFooter(footer as never)).toBe(resolvedFooter);
    expect(mockedAppStateResolveJournalEntryFooter).toHaveBeenCalledWith(
      footer,
    );
  });

  it("throws when no footer resolver is registered for the footer kind", () => {
    expect(() =>
      appStateResolveFooter({
        kind: "missingFooter",
      } as never),
    ).toThrow(
      "No AppState footer content resolver registered for kind: missingFooter",
    );
  });
});
