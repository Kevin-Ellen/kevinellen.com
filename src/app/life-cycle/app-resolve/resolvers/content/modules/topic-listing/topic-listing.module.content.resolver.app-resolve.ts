// src/app/life-cycle/app-resolve/resolvers/content/modules/topic-listing/topic-listing.module.content.resolver.app-resolve.ts

import type { TopicListingModuleContentAppInit } from "../../../../../../../shared/types/content/modules/topic-listing.module.content.shared.app-init.type";
import type { TopicListingModuleContentAppResolve } from "../../../../../../types/document/page/content/modules/topic-listing/topic-listing.module.page.document.content.app-resolve.type";

import { paginate } from "../../../../../../../shared/utilities/paginate/paginate.utility.shared";
import { resolveEditorialPhotoComponentContentAppResolve } from "../../components/editorial-photo/editorial-photo.component.content.resolver.app-resolve";

type Input = Readonly<{
  content: TopicListingModuleContentAppInit;
  requestedPage: number;
}>;

export const resolveTopicListingModuleAppResolve = ({
  content,
  requestedPage,
}: Input): TopicListingModuleContentAppResolve => {
  const page = paginate({
    items: content.items,
    requestedPage,
    pageSize: content.pageSize,
  });

  if (!page) {
    throw new Error(`Topic listing page ${requestedPage} is out of range`);
  }

  return {
    kind: content.kind,
    heading: content.heading,
    pageSize: content.pageSize,
    pagination: content.pagination
      ? {
          currentPage: page.currentPage,
          totalPages: page.totalPages,
          totalItems: page.totalItems,
          pageSize: page.pageSize,
        }
      : null,
    items: page.items.map((item) => ({
      ...item,
      image: resolveEditorialPhotoComponentContentAppResolve({
        content: item.image,
      }),
    })),
  };
};
