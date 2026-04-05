// packages/shared-types/src/content/pages/public/journal-listing.public.page.definition.ts

import type {
  BasePublicPageDefinitionCore,
  PublicPageDefinition,
} from "@shared-types/content/pages/public/base.public.page.definition";
import type { JournalListingPageContentAuthored } from "@shared-types/content/pages/public/journal-listing.public.page.content";

export type JournalListingPageDefinitionCore = BasePublicPageDefinitionCore & {
  kind: "journal-listing";
};

export type JournalListingPageDefinition = PublicPageDefinition<
  JournalListingPageDefinitionCore,
  JournalListingPageContentAuthored
>;
