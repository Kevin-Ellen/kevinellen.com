// src/app/types/document/page/content/modules/article-footer/article-footer.module.content.page.document.app-resolve.type.ts

import type { ArticleFooterModuleContentAppInit } from "../../../../../../../shared/types/content/modules/article-footer.module.content.shared.app-init.type";
import type { OmitAndReplace } from "../../../../../../../shared/types/utilities/omit-replace.utility.shared.type";

export type ArticleFooterModuleContentAppResolve = OmitAndReplace<
  ArticleFooterModuleContentAppInit,
  Readonly<{
    publication: Readonly<{
      author: string;
      published: string;
      lastUpdated: string | null;
    }>;
  }>
>;
