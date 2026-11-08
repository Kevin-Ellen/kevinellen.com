// src/app/life-cycle/app-resolve/resolvers/content/modules/hero/hero.module.content.resolver.app-resolve.ts

import type { HeroModuleContentSharedAppInit } from "../../../../../../../shared/types/content/modules/hero.module.content.shared.app-init.type";
import type { HeroModuleContentAppResolve } from "../../../../../../types/document/page/content/modules/hero/hero.module.content.page.document.app-resolve.type";

type Input = Readonly<{
  content: HeroModuleContentSharedAppInit;
}>;

export const resolveHeroModuleContentAppResolve = ({
  content,
}: Input): HeroModuleContentAppResolve => content;
