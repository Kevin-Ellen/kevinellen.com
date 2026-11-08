// src/app/types/document/page/content/modules/article-section/article-section.module.content.page.document.app-render-context.type.ts

import type { ArticleSectionModuleContentAppResolve } from "./article-section.module.content.page.document.app-resolve.type";
import type { OmitAndReplace } from "../../../../../../../shared/types/utilities/omit-replace.utility.shared.type";
import type { ModuleContentAppRenderContext } from "../module.content.page.document.app-render-context.type";

type ArticleSectionEntryModuleAppRenderContext = Exclude<
  ModuleContentAppRenderContext,
  { kind: "articleSection" }
>;

type ArticleSectionEntryAppRenderContext = OmitAndReplace<
  ArticleSectionModuleContentAppResolve["entries"][number],
  Readonly<{
    module: ArticleSectionEntryModuleAppRenderContext;
  }>
>;

export type ArticleSectionModuleContentAppRenderContext = OmitAndReplace<
  ArticleSectionModuleContentAppResolve,
  Readonly<{
    entries: readonly ArticleSectionEntryAppRenderContext[];
  }>
>;
