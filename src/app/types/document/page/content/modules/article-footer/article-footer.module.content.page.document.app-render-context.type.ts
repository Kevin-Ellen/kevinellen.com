// src/app/types/document/page/content/modules/article-footer/article-footer.module.content.page.document.app-render-context.type.ts

import type { ArticleFooterModuleContentAppResolve } from "./article-footer.module.content.page.document.app-resolve.type";

type DisplayDate = Readonly<{
  iso: string;
  label: string;
}>;

export type ArticleFooterModuleContentAppRenderContext = Readonly<
  Omit<ArticleFooterModuleContentAppResolve, "publication"> & {
    publication: Readonly<{
      author: string;
      published: DisplayDate;
      lastUpdated: DisplayDate | null;
    }>;
  }
>;
