// src/content-schema/content/modules/journal-listing.module.content.content-schema.type.ts

import type { TopicId } from "../../topics/topic-id.topics.content-schema.type";

export type JournalListingModuleContentAuthored = Readonly<{
  kind: "journalListing";

  heading: Readonly<{
    id: string;
    level: 2;
    text: string;
  }>;

  eyebrow?: string;
  photoLimit: number;

  pageSize: number;
  pagination?: boolean;
  displayFeatured?: boolean;
  showViewAllLink?: boolean;
  topicId?: TopicId;
}>;
