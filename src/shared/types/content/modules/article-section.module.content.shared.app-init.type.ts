// src/shared/types/content/modules/article-section.module.content.shared.app-init.type.ts

import type { ArticleSectionModuleContentAuthored } from "../../../../content-schema/content/modules/article-section.module.content.content-schema.authored.type";
import type { OmitAndReplace } from "../../utilities/omit-replace.utility.shared.type";
import type { ModuleContentAppInit } from "./module.content.shared.app-init.type";

type ArticleSectionEntryModuleAppInit = Exclude<
  ModuleContentAppInit,
  { kind: "articleSection" }
>;

type ArticleSectionEntryAppInit = OmitAndReplace<
  ArticleSectionModuleContentAuthored["entries"][number],
  Readonly<{
    module: ArticleSectionEntryModuleAppInit;
  }>
>;

export type ArticleSectionModuleContentAppInit = OmitAndReplace<
  ArticleSectionModuleContentAuthored,
  Readonly<{
    entries: readonly ArticleSectionEntryAppInit[];
  }>
>;
