// src/shared/types/content/modules/topic-listing.module.content.shared.app-init.type.ts

import type { EditorialPhotoComponentContentAppInit } from "../components/editorial-photo.component.content.shared.app-init.type";
import type { TopicListingModuleContentAuthored } from "../../../../content-schema/content/modules/topic-listing.module.content.content-schema.authored.type";
import type { TopicId } from "../../../../content-schema/topics/topic-id.topics.content-schema.type";

export type TopicListingItemContentAppInit = Readonly<{
  id: TopicId;
  label: string;
  description: string;
  href: string;
  image: EditorialPhotoComponentContentAppInit;
}>;

export type TopicListingModuleContentAppInit = Readonly<
  TopicListingModuleContentAuthored & {
    items: readonly TopicListingItemContentAppInit[];
  }
>;
