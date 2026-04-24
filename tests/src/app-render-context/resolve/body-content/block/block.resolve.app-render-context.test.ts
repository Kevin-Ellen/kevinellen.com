// tests/src/app-render-context/resolve/body-content/block/block.resolve.app-render-context.test.ts

import { resolveBlockContentModuleAppRenderContext } from "@app-render-context/resolve/body-content/block/block.resolve.app-render-context";

import { resolveParagraphBlockContentModuleAppRenderContext } from "@app-render-context/resolve/body-content/block/paragraph.resolve.app-render-context";
import { resolveListBlockContentModuleAppRenderContext } from "@app-render-context/resolve/body-content/block/list.resolve.app-render-context";
import { resolveQuoteBlockContentModuleAppRenderContext } from "@app-render-context/resolve/body-content/block/quote.resolve.app-render-context";
import { resolveHeroBlockContentModuleAppRenderContext } from "@app-render-context/resolve/body-content/block/hero.resolve.app-render-context";
import { resolveJournalListingBlockContentModuleAppRenderContext } from "@app-render-context/resolve/body-content/block/journal-listing.resolve.app-render-context";
import { resolvePreBlockContentModuleAppRenderContext } from "@app-render-context/resolve/body-content/block/pre.resolve.app-render-context";
import { resolveContentSectionBlockContentModuleAppRenderContext } from "@app-render-context/resolve/body-content/block/content-section.resolve.app-render-context";

import type { AppContext } from "@app-context/class.app-context";

jest.mock(
  "@app-render-context/resolve/body-content/block/paragraph.resolve.app-render-context",
  () => ({
    resolveParagraphBlockContentModuleAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/body-content/block/list.resolve.app-render-context",
  () => ({
    resolveListBlockContentModuleAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/body-content/block/quote.resolve.app-render-context",
  () => ({
    resolveQuoteBlockContentModuleAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/body-content/block/hero.resolve.app-render-context",
  () => ({
    resolveHeroBlockContentModuleAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/body-content/block/journal-listing.resolve.app-render-context",
  () => ({
    resolveJournalListingBlockContentModuleAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/body-content/block/pre.resolve.app-render-context",
  () => ({
    resolvePreBlockContentModuleAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/body-content/block/content-section.resolve.app-render-context",
  () => ({
    resolveContentSectionBlockContentModuleAppRenderContext: jest.fn(),
  }),
);

describe("resolveBlockContentModuleAppRenderContext", () => {
  const appContext = {} as AppContext;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    ["paragraph", resolveParagraphBlockContentModuleAppRenderContext],
    ["list", resolveListBlockContentModuleAppRenderContext],
    ["quote", resolveQuoteBlockContentModuleAppRenderContext],
    ["hero", resolveHeroBlockContentModuleAppRenderContext],
    ["journalListing", resolveJournalListingBlockContentModuleAppRenderContext],
    ["pre", resolvePreBlockContentModuleAppRenderContext],
    ["contentSection", resolveContentSectionBlockContentModuleAppRenderContext],
  ] as const)(
    "delegates %s modules to the matching resolver",
    (kind, resolver) => {
      const module = {
        kind,
      } as never;

      const resolved = {
        kind,
        resolved: true,
      } as never;

      jest.mocked(resolver).mockReturnValue(resolved);

      const result = resolveBlockContentModuleAppRenderContext(
        appContext,
        module,
      );

      expect(resolver).toHaveBeenCalledWith(appContext, module);
      expect(result).toBe(resolved);
    },
  );
});
