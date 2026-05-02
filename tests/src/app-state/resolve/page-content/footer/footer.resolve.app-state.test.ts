// tests/src/app-state/resolve/page-content/footer/footer.resolve.app-state.test.ts

import { appStateResolveFooterContentModule } from "@app-state/resolve/page-content/footer/footer.resolve.app-state";
import { appStateResolveJournalEntryFooterModule } from "@app-state/resolve/page-content/footer/journal-entry-footer.resolve.app-state";

jest.mock(
  "@app-state/resolve/page-content/footer/journal-entry-footer.resolve.app-state",
  () => ({
    appStateResolveJournalEntryFooterModule: jest.fn(),
  }),
);

describe("appStateResolveFooterContentModule", () => {
  const mockedAppStateResolveJournalEntryFooterModule = jest.mocked(
    appStateResolveJournalEntryFooterModule,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves a journal entry footer module through the footer resolver registry", () => {
    const module = {
      kind: "journalEntryFooter",
      publication: {
        author: "Kevin Ellen",
        publishedAt: "2025-05-27T10:30:00.000Z",
        updatedAt: [],
      },
      tags: [],
    } as const;

    const resolved = {
      ...module,
      tags: ["Mallorca"],
    };

    mockedAppStateResolveJournalEntryFooterModule.mockReturnValue(
      resolved as never,
    );

    expect(appStateResolveFooterContentModule(module)).toBe(resolved);

    expect(mockedAppStateResolveJournalEntryFooterModule).toHaveBeenCalledTimes(
      1,
    );
    expect(mockedAppStateResolveJournalEntryFooterModule).toHaveBeenCalledWith(
      module,
    );
  });

  it("throws when no AppState footer resolver is registered for the module kind", () => {
    const module = {
      kind: "missingFooterKind",
    };

    expect(() => appStateResolveFooterContentModule(module as never)).toThrow(
      "No AppState footer content resolver registered for kind: missingFooterKind",
    );
  });
});
