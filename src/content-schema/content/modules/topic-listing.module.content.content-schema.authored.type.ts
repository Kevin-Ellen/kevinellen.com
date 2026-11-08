// src/content-schema/content/modules/topic-listing.module.content.content-schema.authored.type.ts

export type TopicListingModuleContentAuthored = Readonly<{
  kind: "topicListing";
  heading: string;
  pageSize: number;
  pagination: boolean;
}>;
