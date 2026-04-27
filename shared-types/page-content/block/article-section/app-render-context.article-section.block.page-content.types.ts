// shared-types/page-content/block/article-section/app-render-context.article-section.block.page-content.types.ts

import type {
  AppContextArticleSectionHeadingBlockContentModule,
  AppContextArticleSectionBlockContentModule,
} from "@shared-types/page-content/block/article-section/app-context.article-section.block.page-content.types";
import type { AppRenderContextBlockContentModule } from "@shared-types/page-content/block/app-render-context.block.page-content.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

export type AppRenderContextArticleSectionHeadingBlockContentModule =
  AppContextArticleSectionHeadingBlockContentModule;

type AppRenderContextArticleSectionBlockContentModuleRuntimeFields = Readonly<{
  heading: AppRenderContextArticleSectionHeadingBlockContentModule;
  modules: readonly AppRenderContextBlockContentModule[];
}>;

export type AppRenderContextArticleSectionBlockContentModule = Replace<
  AppContextArticleSectionBlockContentModule,
  AppRenderContextArticleSectionBlockContentModuleRuntimeFields
>;

export type AppRenderContextArticleSectionModule =
  AppRenderContextArticleSectionBlockContentModule["modules"][number];

export type AppRenderContextArticleSectionHeading =
  AppRenderContextArticleSectionBlockContentModule["heading"];
