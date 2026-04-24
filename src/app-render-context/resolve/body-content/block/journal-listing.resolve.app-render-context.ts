// src/app-render-context/resolve/body-content/block/journal-listing.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextJournalListingBlockContentModule } from "@shared-types/page-content/block/journal-listing/app-context.journal-listing.block.page-content.types";
import type { AppRenderContextJournalListingBlockContentModule } from "@shared-types/page-content/block/journal-listing/app-render-context.journal-listing.block.page-content.types";

export const resolveJournalListingBlockContentModuleAppRenderContext = (
  _appContext: AppContext,
  _module: AppContextJournalListingBlockContentModule,
): AppRenderContextJournalListingBlockContentModule => {
  throw new Error(
    "AppRenderContext journal listing resolver is not implemented yet.",
  );
};
