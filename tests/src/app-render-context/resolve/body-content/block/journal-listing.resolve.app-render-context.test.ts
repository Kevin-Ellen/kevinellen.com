// tests/src/app-render-context/resolve/body-content/block/journal-listing.resolve.app-render-context.test.ts

import { resolveJournalListingBlockContentModuleAppRenderContext } from "@app-render-context/resolve/body-content/block/journal-listing.resolve.app-render-context";

import type { AppContext } from "@app-context/class.app-context";

describe("resolveJournalListingBlockContentModuleAppRenderContext", () => {
  it("throws because the journal listing resolver is not implemented yet", () => {
    const appContext = {} as AppContext;
    const module = {
      kind: "journalListing",
    } as never;

    expect(() =>
      resolveJournalListingBlockContentModuleAppRenderContext(
        appContext,
        module,
      ),
    ).toThrow(
      "AppRenderContext journal listing resolver is not implemented yet.",
    );
  });
});
