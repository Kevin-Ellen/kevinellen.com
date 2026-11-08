// src/app/types/document/page/content/modules/article-section/article-section.module.content.page.document.app-resolve.type.ts

import type { ArticleSectionModuleContentAppInit } from "../../../../../../../shared/types/content/modules/article-section.module.content.shared.app-init.type";
import type { OmitAndReplace } from "../../../../../../../shared/types/utilities/omit-replace.utility.shared.type";
import type { ModuleContentAppResolve } from "../module.content.page.document.app-resolve.type";

type ArticleSectionEntryModuleAppResolve = Exclude<
  ModuleContentAppResolve,
  { kind: "articleSection" }
>;

type ArticleSectionEntryAppResolve = OmitAndReplace<
  ArticleSectionModuleContentAppInit["entries"][number],
  Readonly<{
    module: ArticleSectionEntryModuleAppResolve;
  }>
>;

export type ArticleSectionModuleContentAppResolve = OmitAndReplace<
  ArticleSectionModuleContentAppInit,
  Readonly<{
    entries: readonly ArticleSectionEntryAppResolve[];
  }>
>;
