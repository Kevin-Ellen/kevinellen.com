// shared-types/page-content/block/content-section/app-context.content-section.block.page-content.types.ts

import type {
  AppStateContentSectionHeadingBlockContentModule,
  AppStateContentSectionBlockContentModule,
} from "@shared-types/page-content/block/content-section/app-state.content-section.block.page-content.types";
import type { AppContextBlockContentModule } from "@shared-types/page-content/block/app-context.block.page-content.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

export type AppContextContentSectionHeadingBlockContentModule =
  AppStateContentSectionHeadingBlockContentModule;

type AppContextContentSectionBlockContentModuleRuntimeFields = Readonly<{
  heading: AppContextContentSectionHeadingBlockContentModule | null;
  modules: readonly AppContextBlockContentModule[];
}>;

export type AppContextContentSectionBlockContentModule = Replace<
  AppStateContentSectionBlockContentModule,
  AppContextContentSectionBlockContentModuleRuntimeFields
>;
