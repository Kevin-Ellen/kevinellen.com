// src/app/life-cycle/app-resolve/resolvers/content/body/footer/footer.body.content.app-resolve.ts

import type { ContentBodyFooterAppInit } from "../../../../../../../shared/types/content/body/footer.content.shared.body.app-init.type";
import type { ContentBodyFooterAppResolve } from "../../../../../../types/document/page/footer/footer.content.app-resolve.type";

import { resolveArticleFooterModuleContentAppResolve } from "../../modules/article-footer/article-footer.module.content.resolver.app-resolve";

type Input = Readonly<{
  content: ContentBodyFooterAppInit;
  publication: Readonly<{
    author: string;
    published: string;
    lastUpdated: string | null;
  }>;
}>;

export const resolveContentBodyFooterAppResolve = async ({
  content,
  publication,
}: Input): Promise<ContentBodyFooterAppResolve> =>
  Promise.all(
    content.map((module) => {
      if (module.kind !== "articleFooter") {
        throw new Error(`Unsupported footer module: ${module.kind}`);
      }

      return resolveArticleFooterModuleContentAppResolve({
        content: module,
        publication,
      });
    }),
  );
