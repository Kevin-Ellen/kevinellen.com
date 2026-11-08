// src/app/life-cycle/app-render-context/resolvers/document/page/body/modules/editorial-intro/editorial-intro.module.body.page.document.content.resolver.app-render-context.ts

import type { EditorialIntroModuleContentAppResolve } from "../../../../../../../../types/document/page/content/modules/editorial-editorial/editorial-intro.module.content.page.document.app-resolve.type";
import type { EditorialIntroModuleContentAppRenderContext } from "../../../../../../../../types/document/page/content/modules/editorial-editorial/editorial-intro.module.content.page.document.app-render-context.type";

type Input = Readonly<{
  content: EditorialIntroModuleContentAppResolve;
}>;

export const resolveEditorialIntroModuleContentAppRenderContext = ({
  content,
}: Input): EditorialIntroModuleContentAppRenderContext => ({
  ...content,
});
