// src/app/life-cycle/app-resolve/resolvers/content/modules/article-section/article-section.module.content.resolver.app-resolve.ts

import type { ArticleSectionModuleContentAppInit } from "../../../../../../../shared/types/content/modules/article-section.module.content.shared.app-init.type";
import type { ArticleSectionModuleContentAppResolve } from "../../../../../../types/document/page/content/modules/article-section/article-section.module.content.page.document.app-resolve.type";
import type { ModuleContentAppInit } from "../../../../../../../shared/types/content/modules/module.content.shared.app-init.type";
import type { ModuleContentAppResolve } from "../../../../../../types/document/page/content/modules/module.content.page.document.app-resolve.type";

type Input = Readonly<{
  content: ArticleSectionModuleContentAppInit;
  resolveModule: <T extends ModuleContentAppInit>(
    content: T,
  ) => Promise<Extract<ModuleContentAppResolve, { kind: T["kind"] }>>;
}>;

export const resolveArticleSectionModuleContentAppResolve = async ({
  content,
  resolveModule,
}: Input): Promise<ArticleSectionModuleContentAppResolve> => ({
  ...content,
  entries: await Promise.all(
    content.entries.map(async (entry, index) => {
      if (!entry.module?.kind) {
        throw new Error(
          `Invalid module in articleSection "${content.heading.id}" at entry ${index}`,
        );
      }

      try {
        const module = await resolveModule(entry.module);

        return {
          ...entry,
          module,
        };
      } catch (error) {
        throw new Error(
          `Failed to resolve module "${entry.module.kind}" in articleSection "${content.heading.id}" at entry ${index}`,
          { cause: error },
        );
      }
    }),
  ),
});
