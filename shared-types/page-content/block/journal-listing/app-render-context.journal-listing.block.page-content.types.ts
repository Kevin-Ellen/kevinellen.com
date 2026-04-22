// shared-types/page-content/block/journal-listing/app-render-context.journal-listing.block.page-content.types.ts

import type { AppContextJournalListingBlockContentModule } from "@shared-types/page-content/block/journal-listing/app-context.journal-listing.block.page-content.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppRenderContextJournalListingItem = Readonly<{
  href: string;
  title: string;
  intro: string | null;
  eyebrow: string | null;
  publishedLabel: string | null;
}>;

type AppRenderContextJournalListingBlockContentModuleRuntimeFields = Readonly<{
  items: readonly AppRenderContextJournalListingItem[];
}>;

export type AppRenderContextJournalListingBlockContentModule = Replace<
  AppContextJournalListingBlockContentModule,
  AppRenderContextJournalListingBlockContentModuleRuntimeFields
>;

export type AppRenderContextJournalListingModuleItem =
  AppRenderContextJournalListingBlockContentModule["items"][number];
