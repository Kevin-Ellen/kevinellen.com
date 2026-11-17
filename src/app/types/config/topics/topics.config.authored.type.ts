// src/app/types/config/topics/topics.config.authored.type.ts

import type { ContentDatesAuthored } from "../../../../content-schema/content/content.content-schema.authored.type";
import type { EditorialPhotoComponentContentAuthored } from "../../../../content-schema/content/components/editorial-photo.component.content.content-schema.authored.type";
import type { TopicId } from "../../../../content-schema/topics/topic-id.topics.content-schema.type";
import type { OpenGraphAuthored } from "../../../../content-schema/content/open-graph.content.content-schema.authored.type";

export type TopicConfigAuthored = Readonly<{
  label: string;
  description: string;
  introduction: string;
  image: EditorialPhotoComponentContentAuthored;
  dates: ContentDatesAuthored;
  openGraph?: OpenGraphAuthored;
}>;

export type TopicsConfigAuthored = Readonly<
  Record<TopicId, TopicConfigAuthored>
>;
