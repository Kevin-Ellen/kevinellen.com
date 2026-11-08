// src/shared/resolvers/content/modules/topic-listing/topic-listing.module.content.resolver.shared.app-init.ts

import type { TopicListingModuleContentAuthored } from "../../../../../content-schema/content/modules/topic-listing.module.content.content-schema.authored.type";
import type {
  TopicListingItemContentAppInit,
  TopicListingModuleContentAppInit,
} from "../../../../types/content/modules/topic-listing.module.content.shared.app-init.type";
import type { TopicsConfigAppInit } from "../../../../../app/types/config/topics/topics.config.app-init.type";
import type { TopicId } from "../../../../../content-schema/topics/topic-id.topics.content-schema.type";

type Input = Readonly<{
  authored: TopicListingModuleContentAuthored;
  topics: TopicsConfigAppInit;
}>;

export const resolveTopicListingModuleAppInit = ({
  authored,
  topics,
}: Input): TopicListingModuleContentAppInit => ({
  ...authored,
  items: (Object.keys(topics) as TopicId[])
    .sort((a, b) => a.localeCompare(b))
    .map((id): TopicListingItemContentAppInit => {
      const topic = topics[id];

      return {
        id,
        label: topic.label,
        description: topic.description,
        href: `/topics/${id}`,
        image: topic.image,
      };
    }),
});
