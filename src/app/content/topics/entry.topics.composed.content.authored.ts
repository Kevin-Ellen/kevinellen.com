// src/app/content/topics/entry.topics.composed.content.authored.ts

import type { PublicContentAuthored } from "../../../content-schema/content/public.content.content-schema.authored.type";
import type { TopicId } from "../../../content-schema/topics/topic-id.topics.content-schema.type";
import type { TopicsConfigAuthored } from "../../types/config/topics/topics.config.authored.type";

type Input = Readonly<{
  id: TopicId;
  topic: TopicsConfigAuthored[TopicId];
}>;

export const createTopicEntryContentAuthored = ({
  id,
  topic,
}: Input): PublicContentAuthored => ({
  kind: "public",
  render: "composed",
  pageType: "standard",
  id: `topic-${id}`,
  slug: `/topics/${id}`,
  label: topic.label,
  breadcrumbs: ["home", "topics", `topic-${id}`],

  dates: {
    created: topic.dates.created,
    ...(topic.dates.lastUpdated !== undefined
      ? { lastUpdated: topic.dates.lastUpdated }
      : {}),
  },

  metadata: {
    title: `${topic.label} | Topics`,
    description: topic.description,
    sitemap: true,
  },

  body: {
    modules: [
      {
        kind: "editorialIntro",
        eyebrow: "Explore",
        title: topic.label,
        statement: topic.description,
        description: topic.introduction,
        portrait: {
          ...topic.image,
          priority: true,
        },
      },

      {
        kind: "journalListing",
        heading: {
          id: `topic-${id}-title`,
          level: 2,
          text: "Field notes",
        },
        pageSize: 12,
        pagination: true,
        displayFeatured: false,
        photoLimit: 3,
        topicId: id,
      },
    ],
  },
});
