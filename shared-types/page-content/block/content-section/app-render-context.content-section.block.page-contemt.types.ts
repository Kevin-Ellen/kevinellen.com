// shared-types/page-content/block/content-section/app-render-context.content-section.block.page-contemt.types.ts

import type {
  AppContextContentSectionHeadingBlockContentModule,
  AppContextContentSectionBlockContentModule,
} from "@shared-types/page-content/block/content-section/app-context.content-section.block.page-content.types";
import type { AppRenderContextBlockContentModule } from "@shared-types/page-content/block/app-render-context.block.page-content.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

export type AppRenderContextContentSectionHeadingBlockContentModule =
  AppContextContentSectionHeadingBlockContentModule;

type AppRenderContextContentSectionBlockContentModuleRuntimeFields = Readonly<{
  heading: AppRenderContextContentSectionHeadingBlockContentModule;
  modules: readonly AppRenderContextBlockContentModule[];
}>;

export type AppRenderContextContentSectionBlockContentModule = Replace<
  AppContextContentSectionBlockContentModule,
  AppRenderContextContentSectionBlockContentModuleRuntimeFields
>;

export type AppRenderContextContentSectionModule =
  AppRenderContextContentSectionBlockContentModule["modules"][number];

export type AppRenderContextContentSectionHeading = NonNullable<
  AppRenderContextContentSectionBlockContentModule["heading"]
>;
