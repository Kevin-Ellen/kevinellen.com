// tests/src/app-context/resolve/page/content/footer/footer.page-content.resolve.app-context.test.ts

import { appContextResolveFooterContentModule } from "@app-context/resolve/page/content/footer/footer.page-content.resolve.app-context";
import { appContextResolveJournalEntryFooterModule } from "@app-context/resolve/page/content/footer/journal-entry-footer.page-content.resolve.app-context";

jest.mock(
  "@app-context/resolve/page/content/footer/journal-entry-footer.page-content.resolve.app-context",
  () => ({
    appContextResolveJournalEntryFooterModule: jest.fn(),
  }),
);

describe("appContextResolveFooterContentModule", () => {
  const mockedAppContextResolveJournalEntryFooterModule = jest.mocked(
    appContextResolveJournalEntryFooterModule,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves journal entry footer modules through the footer registry", () => {
    const module = {
      kind: "journalEntryFooter",
      publication: {
        author: "Kevin Ellen",
        publishedAt: "2025-05-27T10:30:00.000Z",
        updatedAt: [],
      },
      tags: [],
    } as const;

    const context = {
      photos: [],
    } as never;

    const resolved = {
      ...module,
      equipment: {
        cameras: [],
        lenses: [],
      },
    };

    mockedAppContextResolveJournalEntryFooterModule.mockReturnValue(
      resolved as never,
    );

    expect(appContextResolveFooterContentModule(module as never, context)).toBe(
      resolved,
    );

    expect(
      mockedAppContextResolveJournalEntryFooterModule,
    ).toHaveBeenCalledWith(module, context);
  });

  it("throws when no AppContext footer resolver is registered for the module kind", () => {
    const module = {
      kind: "missingFooterKind",
    } as never;

    expect(() =>
      appContextResolveFooterContentModule(module, {} as never),
    ).toThrow(
      "No AppContext footer content resolver registered for kind: missingFooterKind",
    );
  });
});
