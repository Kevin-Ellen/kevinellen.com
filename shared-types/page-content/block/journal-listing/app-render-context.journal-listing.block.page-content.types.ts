// shared-types/page-content/block/journal-listing/app-render-context.journal-listing.block.page-content.types.ts

import type { AppContextJournalListingBlockContentModule } from "@shared-types/page-content/block/journal-listing/app-context.journal-listing.block.page-content.types";

import type { ReplaceAndOmit } from "@shared-types/shared-types-utils/replace.shared.types";

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

export type AppRenderContextJournalListingBlockContentModule = ReplaceAndOmit<
  AppContextJournalListingBlockContentModule,
  AppRenderContextJournalListingBlockContentModuleRuntimeFields,
  "pagination"
>;

export type AppRenderContextJournalListingModuleItem =
  AppRenderContextJournalListingBlockContentModule["items"][number];
