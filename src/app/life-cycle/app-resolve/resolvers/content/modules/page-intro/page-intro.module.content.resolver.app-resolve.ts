// src/app/life-cycle/app-resolve/resolvers/content/modules/page-intro/page-intro.module.content.resolver.app-resolve.ts

import type { PageIntroModuleContentAppInit } from "../../../../../../../shared/types/content/modules/page-intro.module.content.shared.app-init.type";
import type { PageIntroModuleContentAppResolve } from "../../../../../../types/document/page/content/modules/page-intro/page-intro.module.content.page.document.app-resolve.type";

type Input = Readonly<{
  content: PageIntroModuleContentAppInit;
}>;

export const resolvePageIntroModuleContentAppResolve = ({
  content,
}: Input): PageIntroModuleContentAppResolve => ({
  ...content,
});
