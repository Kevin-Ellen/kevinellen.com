// packages/shared-types/src/content/pages/public/journal-entry/journal-entry.public.page.definition.ts

import type {
  BasePublicPageDefinitionCore,
  PublicPageDefinition,
} from "@shared-types/content/pages/public/base.public.page.definition";
import type { JournalEntryPageContentAuthored } from "@shared-types/content/pages/public/journal-entry/journal-entry.public.page.content";
import type { FeaturedSettings } from "@shared-types/content/pages/public/featured.public.page.types";

export type JournalEntryPageDefinitionCore = BasePublicPageDefinitionCore & {
  kind: "journal-entry";
  featuredIn?: readonly FeaturedSettings[];
};

export type JournalEntryPageDefinition = PublicPageDefinition<
  JournalEntryPageDefinitionCore,
  JournalEntryPageContentAuthored
>;
