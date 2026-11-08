// src/shared/resolvers/content/modules/article-footer/article-footer.module.content.resolver.shared.app-init.ts

import type { ArticleFooterModuleContentAuthored } from "../../../../../content-schema/content/modules/article-footer.module.content.content-schema.authored.type";
import type { ArticleFooterModuleContentAppInit } from "../../../../types/content/modules/article-footer.module.content.shared.app-init.type";

type Input = Readonly<{
  authored: ArticleFooterModuleContentAuthored;
}>;

export const resolveArticleFooterModuleContentAppInit = ({
  authored,
}: Input): ArticleFooterModuleContentAppInit => ({
  ...authored,
});
