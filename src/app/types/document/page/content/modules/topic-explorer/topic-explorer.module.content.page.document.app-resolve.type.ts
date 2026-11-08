// src/app/types/document/page/content/modules/topic-explorer/topic-explorer.module.content.page.document.app-resolve.type.ts


import type { TopicExplorerModuleContentAppInit } from "../../../../../../../shared/types/content/modules/topic-explorer.module.content.shared.app-init.type";
import type { TopicListingItemContentAppResolve } from "../topic-listing/topic-listing.module.page.document.content.app-resolve.type";
import type { TopicId } from "../../../../../../../content-schema/topics/topic-id.topics.content-schema.type";
import type { OmitAndReplace } from "../../../../../../../shared/types/utilities/omit-replace.utility.shared.type";

export type TopicExplorerFeaturedItemContentAppResolve =
  TopicListingItemContentAppResolve;

export type TopicExplorerLinkItemContentAppResolve = Readonly<{
  id: TopicId;
  label: string;
  href: string;
}>;

export type TopicExplorerModuleContentAppResolve = Readonly<
  OmitAndReplace<
    Omit<TopicExplorerModuleContentAppInit, "unrankedItems">,
    {
      featured: readonly TopicExplorerFeaturedItemContentAppResolve[];
      links: readonly TopicExplorerLinkItemContentAppResolve[];
    }
  >
>;
