// src/app/life-cycle/app-resolve/resolvers/content/modules/article-footer/article-footer.module.content.resolver.app-resolve.ts

import type { ArticleFooterModuleContentAppInit } from "../../../../../../../shared/types/content/modules/article-footer.module.content.shared.app-init.type";
import type { ArticleFooterModuleContentAppResolve } from "../../../../../../types/document/page/content/modules/article-footer/article-footer.module.content.page.document.app-resolve.type";

type Input = Readonly<{
  content: ArticleFooterModuleContentAppInit;
  publication: Readonly<{
    author: string;
    published: string;
    lastUpdated: string | null;
  }>;
}>;

export const resolveArticleFooterModuleContentAppResolve = ({
  content,
  publication,
}: Input): ArticleFooterModuleContentAppResolve => ({
  ...content,
  publication,
});
