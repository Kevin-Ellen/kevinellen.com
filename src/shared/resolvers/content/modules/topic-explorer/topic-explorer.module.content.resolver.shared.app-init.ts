// src/shared/resolvers/content/modules/topic-explorer/topic-explorer.module.content.resolver.shared.app-init.ts

import type { TopicExplorerModuleContentAuthored } from "../../../../../content-schema/content/modules/topic-explorer.module.content.content-schema.authored.type";
import type { TopicListingItemContentAppInit } from "../../../../types/content/modules/topic-listing.module.content.shared.app-init.type";
import type { TopicExplorerModuleContentAppInit } from "../../../../types/content/modules/topic-explorer.module.content.shared.app-init.type";
import type { TopicsConfigAppInit } from "../../../../../app/types/config/topics/topics.config.app-init.type";
import type { TopicId } from "../../../../../content-schema/topics/topic-id.topics.content-schema.type";

type Input = Readonly<{
  authored: TopicExplorerModuleContentAuthored;
  topics: TopicsConfigAppInit;
}>;

export const resolveTopicExplorerModuleAppInit = ({
  authored,
  topics,
}: Input): TopicExplorerModuleContentAppInit => ({
  ...authored,
  unrankedItems: (Object.keys(topics) as TopicId[]).map(
    (id): TopicListingItemContentAppInit => {
      const topic = topics[id];

      return {
        id,
        label: topic.label,
        description: topic.description,
        href: `/topics/${id}`,
        image: topic.image,
      };
    },
  ),
});
