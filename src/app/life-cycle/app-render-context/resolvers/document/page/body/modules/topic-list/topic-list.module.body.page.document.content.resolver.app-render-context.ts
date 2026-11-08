// src/app/life-cycle/app-render-context/resolvers/document/page/body/modules/topic-list/topic-list.module.body.page.document.content.resolver.app-render-context.ts

import type { TopicListingModuleContentAppResolve } from "../../../../../../../../types/document/page/content/modules/topic-listing/topic-listing.module.page.document.content.app-resolve.type";
import type { TopicListingModuleContentAppRenderContext } from "../../../../../../../../types/document/page/content/modules/topic-listing/topic-listing.module.page.document.content.app-render-context.type";

import { resolveEditorialPhotoComponentContentAppRenderContext } from "../../components/editorial-photo/editorial-photo.component.body.page.document.content.resolver.app-render-context";
import { resolvePaginationAppRenderContext } from "../../../../../primitives/pagination/pagination.primitive.resolver.app-render-context";

type Input = Readonly<{
  content: TopicListingModuleContentAppResolve;
}>;

export const resolveTopicListingModuleAppRenderContext = ({
  content,
}: Input): TopicListingModuleContentAppRenderContext => ({
  ...content,
  items: content.items.map((item) => ({
    ...item,
    image: resolveEditorialPhotoComponentContentAppRenderContext({
      content: item.image,
    }),
  })),
  pagination: content.pagination
    ? resolvePaginationAppRenderContext({
        pagination: content.pagination,
        basePath: "/topics",
      })
    : null,
});
