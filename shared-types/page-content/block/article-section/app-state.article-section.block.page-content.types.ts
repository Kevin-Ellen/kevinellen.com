// shared-types/page-content/block/article-section/app-state.article-section.block.page-content.types.ts

import type {
  AuthoredArticleSectionHeadingBlockContentModule,
  AuthoredArticleSectionBlockContentModule,
} from "@shared-types/page-content/block/article-section/authored.article-section.block.page-content.types";
import type { AppStateBlockContentModule } from "@shared-types/page-content/block/app-state.block.page-content.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppStateArticleSectionHeadingBlockContentModuleDeterministicFields =
  Readonly<{
    visuallyHidden: boolean;
  }>;

export type AppStateArticleSectionHeadingBlockContentModule = Replace<
  AuthoredArticleSectionHeadingBlockContentModule,
  AppStateArticleSectionHeadingBlockContentModuleDeterministicFields
>;

type AppStateArticleSectionBlockContentModuleDeterministicFields = Readonly<{
  heading: AppStateArticleSectionHeadingBlockContentModule;
  modules: readonly AppStateBlockContentModule[];
}>;

export type AppStateArticleSectionBlockContentModule = Replace<
  AuthoredArticleSectionBlockContentModule,
  AppStateArticleSectionBlockContentModuleDeterministicFields
>;
