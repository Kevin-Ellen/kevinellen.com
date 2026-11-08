// src/app/life-cycle/app-render-context/resolvers/document/page/body/modules/editorial-feature/editorial-feature.module.body.page.document.content.resolver.app-render-context.ts

import type { EditorialFeatureModuleContentAppResolve } from "../../../../../../../../types/document/page/content/modules/editorial-feature/editorial-feature.module.content.page.document.app-resolve.type";
import type { EditorialFeatureModuleContentAppRenderContext } from "../../../../../../../../types/document/page/content/modules/editorial-feature/editorial-feature.module.content.page.document.app-render-context.type";

import { resolveComponentContentAppRenderContext } from "../../components/component.body.page.document.content.resolver.app-render-context";
import { resolveEditorialPhotoComponentContentAppRenderContext } from "../../components/editorial-photo/editorial-photo.component.body.page.document.content.resolver.app-render-context";

type Input = Readonly<{
  content: EditorialFeatureModuleContentAppResolve;
}>;

export const resolveEditorialFeatureModuleContentAppRenderContext = ({
  content,
}: Input): EditorialFeatureModuleContentAppRenderContext => ({
  ...content,
  components: content.components.map((component) =>
    resolveComponentContentAppRenderContext({
      content: component,
    }),
  ),
  media: resolveEditorialPhotoComponentContentAppRenderContext({
    content: content.media,
  }),
});
