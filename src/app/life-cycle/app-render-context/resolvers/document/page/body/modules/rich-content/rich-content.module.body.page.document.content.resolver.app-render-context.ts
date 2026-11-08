// src/app/life-cycle/app-render-context/resolvers/document/page/body/modules/rich-content/rich-content.module.body.page.document.content.resolver.app-render-context.ts

import type { RichContentModuleContentAppResolve } from "../../../../../../../../types/document/page/content/modules/rich-content/rich-content.module.content.page.document.app-resolve.type";
import type { RichContentModuleContentAppRenderContext } from "../../../../../../../../types/document/page/content/modules/rich-content/rich-content.module.content.page.document.app-render-context.type";

import { resolveComponentContentAppRenderContext } from "../../components/component.body.page.document.content.resolver.app-render-context";

type Input = Readonly<{
  content: RichContentModuleContentAppResolve;
}>;

export const resolveRichContentModuleContentAppRenderContext = ({
  content,
}: Input): RichContentModuleContentAppRenderContext => ({
  ...content,
  components: content.components.map((component) =>
    resolveComponentContentAppRenderContext({
      content: component,
    }),
  ),
});
