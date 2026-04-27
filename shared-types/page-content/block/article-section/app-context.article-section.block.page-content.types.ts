// shared-types/page-content/block/article-section/app-context.article-section.block.page-content.types.ts

import type {
  AppStateArticleSectionHeadingBlockContentModule,
  AppStateArticleSectionBlockContentModule,
} from "@shared-types/page-content/block/article-section/app-state.article-section.block.page-content.types";
import type { AppContextBlockContentModule } from "@shared-types/page-content/block/app-context.block.page-content.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

export type AppContextArticleSectionHeadingBlockContentModule =
  AppStateArticleSectionHeadingBlockContentModule;

type AppContextArticleSectionBlockContentModuleRuntimeFields = Readonly<{
  heading: AppContextArticleSectionHeadingBlockContentModule;
  modules: readonly AppContextBlockContentModule[];
}>;

export type AppContextArticleSectionBlockContentModule = Replace<
  AppStateArticleSectionBlockContentModule,
  AppContextArticleSectionBlockContentModuleRuntimeFields
>;
