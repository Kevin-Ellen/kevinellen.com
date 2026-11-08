// src/app/life-cycle/app-render-context/resolvers/document/page/body/modules/final-words/final-words.module.body.page.document.content.resolver.app-render-context.ts

import type { FinalWordsModuleContentAppResolve } from "../../../../../../../../types/document/page/content/modules/final-words/final-words.module.content.page.document.app-resolve.type";
import type { FinalWordsModuleContentAppRenderContext } from "../../../../../../../../types/document/page/content/modules/final-words/final-words.module.content.page.document.app-render-context.type";

import { resolveComponentContentAppRenderContext } from "../../components/component.body.page.document.content.resolver.app-render-context";

type Input = Readonly<{
  content: FinalWordsModuleContentAppResolve;
}>;

export const resolveFinalWordsModuleContentAppRenderContext = ({
  content,
}: Input): FinalWordsModuleContentAppRenderContext => ({
  ...content,
  components: content.components.map((component) =>
    resolveComponentContentAppRenderContext({
      content: component,
    }),
  ),
});
