// src/app/life-cycle/app-render-context/resolvers/document/page/body/modules/editorial-split/editorial-split.module.body.page.document.content.resolver.app-render-context.ts

import type { EditorialSplitModuleContentAppResolve } from "../../../../../../../../types/document/page/content/modules/editorial-split/editorial-split.module.content.page.document.app-resolve.type";
import type { EditorialSplitModuleContentAppRenderContext } from "../../../../../../../../types/document/page/content/modules/editorial-split/editorial-split.module.content.page.document.app-render-context.type";

import { resolveComponentContentAppRenderContext } from "../../components/component.body.page.document.content.resolver.app-render-context";

type Input = Readonly<{
  content: EditorialSplitModuleContentAppResolve;
}>;

export const resolveEditorialSplitModuleContentAppRenderContext = ({
  content,
}: Input): EditorialSplitModuleContentAppRenderContext => ({
  ...content,
  components: content.components.map((component) =>
    resolveComponentContentAppRenderContext({
      content: component,
    }),
  ),
  media: resolveComponentContentAppRenderContext({
    content: content.media,
  }) as EditorialSplitModuleContentAppRenderContext["media"],
});
