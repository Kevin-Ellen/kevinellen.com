// src/app/life-cycle/app-render-context/resolvers/document/page/body/modules/article-footer/article-footer.module.body.page.document.content.resolver.app-render-context.ts

import type { ArticleFooterModuleContentAppResolve } from "../../../../../../../../types/document/page/content/modules/article-footer/article-footer.module.content.page.document.app-resolve.type";
import type { ArticleFooterModuleContentAppRenderContext } from "../../../../../../../../types/document/page/content/modules/article-footer/article-footer.module.content.page.document.app-render-context.type";

import { resolveDisplayDateAppRenderContext } from "../../../../../primitives/datetime/datetime.primitive.resolver.app-render-context";

type Input = Readonly<{
  content: ArticleFooterModuleContentAppResolve;
}>;

export const resolveArticleFooterModuleContentAppRenderContext = ({
  content,
}: Input): ArticleFooterModuleContentAppRenderContext => ({
  ...content,
  publication: {
    ...content.publication,
    published: resolveDisplayDateAppRenderContext({
      iso: content.publication.published,
    }),
    lastUpdated: content.publication.lastUpdated
      ? resolveDisplayDateAppRenderContext({
          iso: content.publication.lastUpdated,
        })
      : null,
  },
});
