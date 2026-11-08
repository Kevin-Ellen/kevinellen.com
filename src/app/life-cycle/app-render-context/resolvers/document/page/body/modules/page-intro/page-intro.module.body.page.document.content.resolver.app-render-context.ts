// src/app/life-cycle/app-render-context/resolvers/document/page/body/modules/page-intro/page-intro.module.body.page.document.content.resolver.app-render-context.ts

import type { PageIntroModuleContentAppResolve } from "../../../../../../../../types/document/page/content/modules/page-intro/page-intro.module.content.page.document.app-resolve.type";
import type { PageIntroModuleContentAppRenderContext } from "../../../../../../../../types/document/page/content/modules/page-intro/page-intro.module.content.page.document.app-render-context.type";

import { resolveDisplayDateAppRenderContext } from "../../../../../primitives/datetime/datetime.primitive.resolver.app-render-context";

type Input = Readonly<{
  content: PageIntroModuleContentAppResolve;
}>;

export const resolvePageIntroModuleContentAppRenderContext = ({
  content,
}: Input): PageIntroModuleContentAppRenderContext => ({
  ...content,
  date: resolveDisplayDateAppRenderContext({
    iso: content.date,
  }),
});
