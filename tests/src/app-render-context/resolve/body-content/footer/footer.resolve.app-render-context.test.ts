// tests/src/app-render-context/resolve/body-content/footer/footer.resolve.app-render-context.test.ts

import { resolveFooterContentModuleAppRenderContext } from "@app-render-context/resolve/body-content/footer/footer.resolve.app-render-context";
import { resolveJournalEntryFooterAppRenderContext } from "@app-render-context/resolve/body-content/footer/journal-entry-footer.resolve.app-render-context";

jest.mock(
  "@app-render-context/resolve/body-content/footer/journal-entry-footer.resolve.app-render-context",
  () => ({
    resolveJournalEntryFooterAppRenderContext: jest.fn(),
  }),
);

describe("resolveFooterContentModuleAppRenderContext", () => {
  const mockedResolveJournalEntryFooterAppRenderContext = jest.mocked(
    resolveJournalEntryFooterAppRenderContext,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves journal entry footer modules through the footer registry", () => {
    const appContext = {} as never;

    const module = {
      kind: "journalEntryFooter",
      publication: {
        author: "Kevin Ellen",
        publishedAt: "2025-05-27T10:30:00.000Z",
        updatedAt: [],
      },
      tags: [],
      equipment: {
        cameras: [],
        lenses: [],
      },
    } as const;

    const resolved = {
      ...module,
      publication: {
        ...module.publication,
        publishedAt: "27 May 2025",
      },
    };

    mockedResolveJournalEntryFooterAppRenderContext.mockReturnValue(
      resolved as never,
    );

    expect(
      resolveFooterContentModuleAppRenderContext(appContext, module as never),
    ).toBe(resolved);

    expect(
      mockedResolveJournalEntryFooterAppRenderContext,
    ).toHaveBeenCalledWith(appContext, module);
  });

  it("throws when no AppRenderContext footer resolver is registered for the module kind", () => {
    expect(() =>
      resolveFooterContentModuleAppRenderContext(
        {} as never,
        {
          kind: "missingFooterKind",
        } as never,
      ),
    ).toThrow(
      "No AppRenderContext footer content resolver registered for kind: missingFooterKind",
    );
  });
});
