// src/app/life-cycle/app-resolve/resolvers/content/modules/topic-explorer/topic-explorer.module.content.resolver.app-resolve.ts

import type { TopicExplorerModuleContentAppInit } from "../../../../../../../shared/types/content/modules/topic-explorer.module.content.shared.app-init.type";
import type {
  TopicExplorerModuleContentAppResolve,
  TopicExplorerFeaturedItemContentAppResolve,
} from "../../../../../../types/document/page/content/modules/topic-explorer/topic-explorer.module.content.page.document.app-resolve.type";
import type { PublishedRegistry } from "../../../../../../../shared/types/content/kv-ledger.content.shared.type";
import type { TopicId } from "../../../../../../../content-schema/topics/topic-id.topics.content-schema.type";

import { resolveEditorialPhotoComponentContentAppResolve } from "../../components/editorial-photo/editorial-photo.component.content.resolver.app-resolve";

type Input = Readonly<{
  content: TopicExplorerModuleContentAppInit;
  journalLedger: PublishedRegistry;
}>;

export const resolveTopicExplorerModuleAppResolve = ({
  content,
  journalLedger,
}: Input): TopicExplorerModuleContentAppResolve => {
  const counts = new Map<TopicId, number>();

  for (const entry of journalLedger.newestFirst) {
    for (const topicId of new Set(entry.topics)) {
      counts.set(topicId, (counts.get(topicId) ?? 0) + 1);
    }
  }

  const ranked = content.unrankedItems
    .map((item) => ({
      item,
      count: counts.get(item.id) ?? 0,
    }))
    .filter(({ count }) => count > 0)
    .sort((a, b) => b.count - a.count || a.item.id.localeCompare(b.item.id));

  const featured: readonly TopicExplorerFeaturedItemContentAppResolve[] = ranked
    .slice(0, content.maxFeatured)
    .map(({ item }) => ({
      ...item,
      image: resolveEditorialPhotoComponentContentAppResolve({
        content: item.image,
      }),
    }));

  const links = ranked.slice(content.maxFeatured).map(({ item }) => ({
    id: item.id,
    label: item.label,
    href: item.href,
  }));

  const { unrankedItems: _unrankedItems, ...configuration } = content;

  return {
    ...configuration,
    featured,
    links,
  };
};
