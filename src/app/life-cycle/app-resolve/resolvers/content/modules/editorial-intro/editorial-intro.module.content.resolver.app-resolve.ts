// src/app/life-cycle/app-resolve/resolvers/content/modules/editorial-intro/editorial-intro.module.content.resolver.app-resolve.ts

import type { EditorialIntroModuleContentAppInit } from "../../../../../../../shared/types/content/modules/editorial-intro.module.content.shared.app-init.type";
import type { EditorialIntroModuleContentAppResolve } from "../../../../../../types/document/page/content/modules/editorial-editorial/editorial-intro.module.content.page.document.app-resolve.type";

type Input = Readonly<{
  content: EditorialIntroModuleContentAppInit;
}>;

export const resolveEditorialIntroModuleContentAppResolve = ({
  content,
}: Input): EditorialIntroModuleContentAppResolve => ({
  ...content,
});
