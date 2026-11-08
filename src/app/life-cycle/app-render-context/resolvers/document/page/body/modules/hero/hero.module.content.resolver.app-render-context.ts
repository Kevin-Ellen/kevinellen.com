// src/app/life-cycle/app-render-context/resolvers/document/page/body/modules/hero/hero.module.content.resolver.app-render-context.ts

import type { HeroModuleContentAppResolve } from "../../../../../../../../types/document/page/content/modules/hero/hero.module.content.page.document.app-resolve.type";
import type { HeroModuleContentAppRenderContext } from "../../../../../../../../types/document/page/content/modules/hero/hero.module.content.page.document.app-render-context.type";

type Input = Readonly<{
  content: HeroModuleContentAppResolve;
}>;

export const resolveHeroModuleContentAppRenderContext = ({
  content,
}: Input): HeroModuleContentAppRenderContext => content;
