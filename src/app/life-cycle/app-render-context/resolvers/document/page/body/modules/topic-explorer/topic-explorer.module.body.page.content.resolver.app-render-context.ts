// src/app/life-cycle/app-render-context/resolvers/document/page/body/modules/topic-explorer/topic-explorer.module.body.page.content.resolver.app-render-context.ts

import type { TopicExplorerModuleContentAppResolve } from "../../../../../../../../types/document/page/content/modules/topic-explorer/topic-explorer.module.content.page.document.app-resolve.type";
import type { TopicExplorerModuleContentAppRenderContext } from "../../../../../../../../types/document/page/content/modules/topic-explorer/topic-explorer.module.content.page.document.app-render-context.type";

import { resolveEditorialPhotoComponentContentAppRenderContext } from "../../components/editorial-photo/editorial-photo.component.body.page.document.content.resolver.app-render-context";

type Input = Readonly<{
  content: TopicExplorerModuleContentAppResolve;
}>;

export const resolveTopicExplorerModuleAppRenderContext = ({
  content,
}: Input): TopicExplorerModuleContentAppRenderContext => ({
  ...content,
  featured: content.featured.map((item) => ({
    ...item,
    image: resolveEditorialPhotoComponentContentAppRenderContext({
      content: item.image,
    }),
  })),
});
