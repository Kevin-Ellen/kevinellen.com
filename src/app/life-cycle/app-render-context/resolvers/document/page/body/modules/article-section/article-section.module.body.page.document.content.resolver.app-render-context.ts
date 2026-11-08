// src/app/life-cycle/app-render-context/resolvers/document/page/body/modules/article-section/article-section.module.body.page.document.content.resolver.app-render-context.ts

import type { ArticleSectionModuleContentAppResolve } from "../../../../../../../../types/document/page/content/modules/article-section/article-section.module.content.page.document.app-resolve.type";
import type { ArticleSectionModuleContentAppRenderContext } from "../../../../../../../../types/document/page/content/modules/article-section/article-section.module.content.page.document.app-render-context.type";
import type { ModuleContentAppResolve } from "../../../../../../../../types/document/page/content/modules/module.content.page.document.app-resolve.type";
import type { ModuleContentAppRenderContext } from "../../../../../../../../types/document/page/content/modules/module.content.page.document.app-render-context.type";

type Input = Readonly<{
  content: ArticleSectionModuleContentAppResolve;
  resolveModule: <T extends ModuleContentAppResolve>(
    content: T,
  ) => Extract<ModuleContentAppRenderContext, { kind: T["kind"] }>;
}>;

export const resolveArticleSectionModuleContentAppRenderContext = ({
  content,
  resolveModule,
}: Input): ArticleSectionModuleContentAppRenderContext => ({
  ...content,
  entries: content.entries.map((entry) => ({
    ...entry,
    module: resolveModule(entry.module),
  })),
});
