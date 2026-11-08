// src/shared/types/content/modules/journal-listing.module.content.shared.app-init.type.ts

import type { JournalListingModuleContentAuthored } from "../../../../content-schema/content/modules/journal-listing.module.content.content-schema.type";
import type { TopicId } from "../../../../content-schema/topics/topic-id.topics.content-schema.type";

export type JournalListingModuleAppInit = Readonly<
  Omit<
    JournalListingModuleContentAuthored,
    "eyebrow" | "pagination" | "displayFeatured" | "topicId" | "showViewAllLink"
  > & {
    eyebrow: string;
    pagination: boolean;
    displayFeatured: boolean;
    showViewAllLink: boolean;
    topicId: TopicId | null;
  }
>;
